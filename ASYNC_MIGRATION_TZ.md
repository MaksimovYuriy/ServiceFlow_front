# ТЗ: Перевод страниц прогнозирования на асинхронный API

## Контекст

В бэкенде **ServiceFlow_back** контракт для `price_analysis` и `material_forecast` полностью переписан на асинхронную модель. Раньше `POST` блокировал HTTP-запрос на всё время обучения (10–30 сек), результаты лежали в `tmp/*.json`. Теперь:

- `POST` ставит фоновую задачу через Sidekiq и возвращает `201` сразу.
- Состояние каждого запуска (запись `PricePrediction` / `MaterialPrediction`) живёт в БД: `status`, `started_at`, `finished_at`, `error_message`, `predictions` (JSONB), `metrics` (JSONB), для materials ещё `summary`.
- Готовые результаты получаются отдельным `GET`.
- Состояние выполнения отслеживается через polling `GET …/runs/latest`.
- Опциональная история — `GET …/runs` (последние 5 запусков).
- Защита от двойного запуска: повторный `POST` пока есть active run → `409 Conflict`.

Цель: пользователь нажимает «Запустить анализ» → может уйти на любую вкладку → вернувшись, видит актуальный статус (выполняется / готово / ошибка) и результат.

## Бэкенд: контракт API (источник истины)

База: тот же `axios` instance, тот же origin, cookies-auth уже работают.

### Price analysis

#### POST `/api/price_analysis`
Запускает анализ.

**201 Created** — джоба поставлена:
```json
{
  "id": 9,
  "status": "queued",
  "started_at": null,
  "finished_at": null,
  "duration_sec": null,
  "error_message": null,
  "created_at": "2026-05-09T11:31:05.123Z"
}
```

**409 Conflict** — уже выполняется:
```json
{
  "error": "analysis_in_progress",
  "run": {
    "id": 9,
    "status": "running",
    "started_at": "2026-05-09T11:31:05.234Z",
    "finished_at": null,
    "duration_sec": 7,
    "error_message": null,
    "created_at": "2026-05-09T11:31:05.123Z"
  }
}
```

#### GET `/api/price_analysis`
Последний `completed` запуск с результатами.

**200 OK:**
```json
{
  "run": { "id": 9, "status": "completed", "started_at": "...", "finished_at": "...", "duration_sec": 18, "error_message": null, "created_at": "..." },
  "predictions": [
    {
      "service_id": 1,
      "service_title": "Стрижка женская",
      "current_price": 1500.0,
      "suggested_price": 1560.65,
      "difference": 60.65,
      "difference_pct": 4.0,
      "is_active": 1
    }
  ],
  "metrics": {
    "test_mae": 0.0013,
    "test_mse": 0.000003,
    "test_wmape": 0.13,
    "baseline_mae": 0.0198,
    "baseline_mse": 0.00057,
    "baseline_wmape": 1.95,
    "mae_improvement_pct": 93.3,
    "train_rows": 350,
    "val_rows": 75,
    "test_rows": 75,
    "best_val_loss": 0.000002
  }
}
```

**404 Not Found** — анализ ни разу не завершался успешно:
```json
{ "error": "no_completed_run" }
```

#### GET `/api/price_analysis/runs/latest`
Последний запуск любого статуса — для polling.

**200 OK** (есть хоть один run):
```json
{
  "id": 9,
  "status": "running",
  "started_at": "2026-05-09T11:31:05.234Z",
  "finished_at": null,
  "duration_sec": 7,
  "error_message": null,
  "created_at": "2026-05-09T11:31:05.123Z"
}
```

**200 OK** (нет ни одного run): `null`

#### GET `/api/price_analysis/runs`
Последние 5 запусков (для истории). Без `predictions`/`metrics` — только метаданные.

**200 OK:**
```json
{
  "runs": [
    { "id": 9, "status": "completed", "started_at": "...", "finished_at": "...", "duration_sec": 18, "error_message": null, "created_at": "..." },
    { "id": 4, "status": "failed", "started_at": "...", "finished_at": "...", "duration_sec": 3, "error_message": "RuntimeError: train_price.py failed: ...", "created_at": "..." }
  ]
}
```

### Material forecast

Полностью симметрично price, с теми же URL-паттернами:
- `POST   /api/material_forecast`
- `GET    /api/material_forecast`
- `GET    /api/material_forecast/runs/latest`
- `GET    /api/material_forecast/runs`

**Отличия в payload:**

`POST` 409 ошибка использует `"error": "forecast_in_progress"` (не `analysis_in_progress`).

`GET /api/material_forecast` 200:
```json
{
  "run": { ... },
  "predictions": [
    {
      "material_id": 1,
      "title": "Шампунь профессиональный",
      "current_quantity": 111,
      "minimal_quantity": 5,
      "unit_price": 450.0,
      "months": [
        { "month": 6, "year": 2026, "predicted_usage": 178 },
        { "month": 7, "year": 2026, "predicted_usage": 207 },
        { "month": 8, "year": 2026, "predicted_usage": 261 }
      ],
      "total_predicted_usage": 646,
      "purchase_qty": 540,
      "purchase_cost": 243000.0
    }
  ],
  "summary": {
    "total_materials": 20,
    "need_purchase": 20,
    "total_cost": 1043870.0,
    "forecast_months": 3
  },
  "metrics": {
    "test_mae": 0.45,
    "test_mse": 0.43,
    "test_wmape": 56.0,
    "baseline_lag1_mae": 0.52,
    "baseline_lag1_wmape": 64.3,
    "baseline_avg3_mae": 0.50,
    "baseline_avg3_wmape": 62.2,
    "mae_improvement_pct": 10.0,
    "train_rows": 400,
    "val_rows": 75,
    "test_rows": 75,
    "best_val_loss": 0.0199
  }
}
```

Структура `Run` идентична price.

## Что менять во фронте

### Файлы под изменение

| Файл | Что делаем |
|---|---|
| `src/api/price_analysis.ts` | Полностью переписать API-функции под новый контракт. `applyServicePrice` оставить как есть. |
| `src/api/material_forecast.ts` | Полностью переписать. |
| `src/api/hooks/price_analysis/useStartAnalysis.ts` | Изменить под новый POST (теперь возвращает run, обработать 409). |
| `src/api/hooks/price_analysis/usePredictions.ts` | **Удалить** — заменяется `usePriceResults` + `useLatestPriceRun`. |
| `src/api/hooks/material_forecast/useStartMaterialForecast.ts` | Изменить аналогично. |
| `src/api/hooks/material_forecast/useMaterialForecast.ts` | **Удалить** — заменяется `useMaterialResults` + `useLatestMaterialRun`. |
| `src/pages/Crm/PriceAnalysisPage.tsx` | Перепилить на полную работу с run-ами. |
| `src/pages/Crm/MaterialForecastPage.tsx` | Перепилить аналогично. |

### Новые хуки (создать)

В `src/api/hooks/price_analysis/`:
- `useLatestPriceRun.ts` — `GET /api/price_analysis/runs/latest`. Polling `refetchInterval: status === "queued" || status === "running" ? 3000 : false`. `refetchOnWindowFocus: true`.
- `usePriceResults.ts` — `GET /api/price_analysis`. Активен только когда есть `completed` run; иначе `enabled: false`. Инвалидируется при смене `latestRun.id` на новый completed.
- `usePriceRunsHistory.ts` — `GET /api/price_analysis/runs`. Простой запрос, инвалидация при смене статуса latest run.

В `src/api/hooks/material_forecast/`:
- `useLatestMaterialRun.ts`
- `useMaterialResults.ts`
- `useMaterialRunsHistory.ts`

### TypeScript-типы

В `src/api/price_analysis.ts` добавить:

```ts
export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface RunMeta {
  id: number;
  status: RunStatus;
  started_at: string | null;
  finished_at: string | null;
  duration_sec: number | null;
  error_message: string | null;
  created_at: string;
}

export interface PricePrediction {
  service_id: number;
  service_title: string;
  current_price: number;
  suggested_price: number;
  difference: number;
  difference_pct: number;
  is_active: number;
}

export interface PriceMetrics {
  test_mae: number;
  test_mse: number;
  test_wmape: number;
  baseline_mae: number;
  baseline_mse: number;
  baseline_wmape: number;
  mae_improvement_pct: number;
  train_rows: number;
  val_rows: number;
  test_rows: number;
  best_val_loss: number;
}

export interface PriceResults {
  run: RunMeta;
  predictions: PricePrediction[];
  metrics: PriceMetrics;
}

export interface RunsHistory {
  runs: RunMeta[];
}

export interface AnalysisInProgressError {
  error: "analysis_in_progress";
  run: RunMeta;
}
```

В `src/api/material_forecast.ts` аналогичные типы (`MaterialPrediction`, `MaterialSummary`, `MaterialMetrics`, `MaterialResults`). У materials в `error.error` будет строка `"forecast_in_progress"`.

### Поведение страниц (UX)

Обе страницы (`PriceAnalysisPage`, `MaterialForecastPage`) следуют одной механике. Описание для price; для materials то же самое с поправкой на доменные термины.

#### Источники данных при маунте
1. `useLatestPriceRun()` — определяет, что сейчас происходит.
2. `usePriceResults()` — последний завершённый результат для отображения данных.
3. `usePriceRunsHistory()` — список последних запусков для раздела истории.

Все три запускаются в параллель при маунте.

#### Состояния UI

**1. `latestRun === null`** (системно никогда не запускалось):
- Кнопка «Запустить анализ» enabled.
- Текст: «Анализ ещё не проводился. Нажмите кнопку, чтобы получить первые рекомендации.»
- Раздел метрик и истории не показывается.

**2. `latestRun.status === "queued" || latestRun.status === "running"`** (идёт сейчас):
- Кнопка «Запустить анализ» **disabled**.
- Под кнопкой индикатор: `<CircularProgress />` + текст «Анализ выполняется… (N сек)» где N = `duration_sec ?? 0` (для queued можно показать «Поставлено в очередь»).
- Если в БД есть предыдущий `completed` run — **показывать его данные** (таблица + метрики), с пометкой «Идёт перерасчёт. Показаны результаты предыдущего запуска от {created_at}».
- Если предыдущего нет — показать только индикатор + «Первый анализ может занять до минуты».

**3. `latestRun.status === "completed"`**:
- Кнопка «Запустить анализ» enabled.
- Показывается таблица результатов (как сейчас), плюс **раздел метрик** (см. ниже), плюс раздел **«История запусков»**.

**4. `latestRun.status === "failed"`**:
- Кнопка «Запустить анализ» enabled.
- Алерт `<Alert severity="error">` с текстом «Последний запуск завершился ошибкой: {error_message}. Можно запустить повторно.»
- Если есть более ранний completed run — данные из него тоже показать (с пометкой «Показан результат от {created_at}, последний запуск завершился ошибкой»).

#### Раздел «Метрики качества модели» (новый блок, на странице ниже таблицы)

Заголовок: «Качество прогноза»

Карточки в ряд (`Grid`/`Box` flex):

**Для price:**
- «Средняя ошибка модели (MAE)» — `metrics.test_mae.toFixed(4)`
- «MAE базового метода» — `metrics.baseline_mae.toFixed(4)`, подзаголовок «(цена не меняется)»
- «Улучшение по MAE» — `+{metrics.mae_improvement_pct.toFixed(1)}%` зелёным
- «Размер тестовой выборки» — `metrics.test_rows` строк

Под карточками — мелким текстом справочно: «MAE — средняя абсолютная ошибка прогноза коэффициента цены; чем меньше, тем точнее. Базовый метод — гипотеза «цена не меняется». Улучшение показывает, насколько модель точнее тривиального предположения.»

**Для materials:**
- «MAE модели» — `metrics.test_mae.toFixed(3)`
- «MAE наивного метода (lag-1)» — `metrics.baseline_lag1_mae.toFixed(3)`, подзаголовок «(прогноз = прошлый месяц)»
- «MAE среднего за 3 мес» — `metrics.baseline_avg3_mae.toFixed(3)`
- «Улучшение по MAE» — `+{metrics.mae_improvement_pct.toFixed(1)}%`
- «wMAPE модели» — `{metrics.test_wmape.toFixed(1)}%` (взвешенная относительная ошибка)

#### Раздел «История запусков» (новый блок, в самом низу страницы, под катом)

Заголовок: «История запусков (последние 5)»

Таблица или список (на твоё усмотрение, но компактно — `<List>` с `<ListItem>`):
```
[completed]  09.05.2026, 14:32  • 18 сек
[failed]     09.05.2026, 13:10  • 3 сек  • Сбой обучения модели
[completed]  08.05.2026, 09:15  • 22 сек
```

Цвет статуса через `<Chip>` (success/error/info/warning).

### Polling: важные нюансы

В `useLatestPriceRun`:
```ts
useQuery({
  queryKey: ["price_analysis", "latest_run"],
  queryFn: fetchLatestPriceRun,
  refetchInterval: (query) => {
    const data = query.state.data as RunMeta | null;
    if (!data) return false;
    return data.status === "queued" || data.status === "running" ? 3000 : false;
  },
  refetchOnWindowFocus: true,
});
```

Когда status становится `completed` или `failed`:
- Инвалидировать `usePriceResults` (чтобы подтянуть свежие данные).
- Инвалидировать `usePriceRunsHistory`.
- Можно показать `useSnackbar` с сообщением «Анализ завершён» (для completed) или «Анализ упал» (для failed).

Реализуй это через `useEffect` в page-компоненте, который реагирует на смену `latestRun?.status`.

### Обработка 409 в `useStartAnalysis`

```ts
import axios from "axios";

export function useStartPriceAnalysis() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startPriceAnalysis,
    onSuccess: (run) => {
      queryClient.setQueryData(["price_analysis", "latest_run"], run);
      queryClient.invalidateQueries({ queryKey: ["price_analysis", "history"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const data = error.response.data as AnalysisInProgressError;
        queryClient.setQueryData(["price_analysis", "latest_run"], data.run);
        showSnackbar("Анализ уже выполняется", "info");
      } else {
        showSnackbar("Не удалось запустить анализ", "error");
      }
    },
  });
}
```

### Удаление мёртвого кода

В `PriceAnalysisPage.tsx` сейчас есть `polling`/`pollingTimer`/`setTimeout` логика — её **полностью удалить**, заменив на `useLatestPriceRun`. То же в `MaterialForecastPage.tsx`.

Старые хуки `usePredictions` и `useMaterialForecast` после миграции должны быть удалены (не оставлять файлы пустыми). Проверить, что ничего больше на них не ссылается.

## Технологии и стиль

- React Query 5 (как в проекте).
- Axios через существующий `src/api/middlewares/axios.ts` (cookies-auth уже встроен).
- MUI 7 для UI (как сейчас).
- TypeScript strict — все ответы API должны быть типизированы, без `any`.
- Сохранить визуальную стилистику существующих страниц (`AdminLayout`, `DataGrid`, `Card`/`Paper`, `Chip` для статусов).
- Локализация — все строки на русском, как сейчас.

## Чек-лист готовности

- [ ] `POST /api/price_analysis` вызывает джобу, страница не блокируется ожиданием HTTP.
- [ ] Можно перейти на другую страницу и вернуться — статус восстановится из `useLatestPriceRun`.
- [ ] При завершении джобы UI автоматически обновляется (без F5).
- [ ] Кнопка «Запустить анализ» disabled пока active run.
- [ ] При попытке двойного запуска (`409`) показывается snackbar и UI остаётся в running-state.
- [ ] При `failed` показывается алерт с текстом ошибки.
- [ ] Раздел метрик отображается под таблицей результатов.
- [ ] Раздел истории отображается внизу страницы.
- [ ] Аналогично всё работает на `MaterialForecastPage`.
- [ ] `npm run build` проходит без TS-ошибок.
- [ ] `npm run dev`, ручная проверка на обеих страницах.

## Важно

В корне проекта **бэкенд должен быть запущен** (`bin/rails server`) **и Sidekiq должен бежать** (`bundle exec sidekiq` в отдельном терминале) — иначе джобы не будут обрабатываться. Это ответственность пользователя при тестировании.

После завершения работы — отчитайся, что готово, что изменено, и как протестировано.
