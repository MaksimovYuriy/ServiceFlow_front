export interface DateOption {
  value: string; // YYYY-MM-DD
  label: string; // DD.MM.YYYY
}

export const generateNextDates = (days = 14): DateOption[] => {
  const result: DateOption[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const value = date.toISOString().split("T")[0];

    const label = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    result.push({ value, label });
  }

  return result;
};
