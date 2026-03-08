const MONTH_SHORT = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

export const formatPrice = (v: number) =>
  v.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₽";

export const formatMonth = (iso: string) => {
  const [year, month] = iso.split("-");
  return `${MONTH_SHORT[Number(month) - 1]} ${year}`;
};

export const getDefaultPeriod = () => {
  const now = new Date();
  const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const fromStr = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`;
  return { from: fromStr, to };
};
