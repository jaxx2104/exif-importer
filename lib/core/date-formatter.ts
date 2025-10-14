import { formatISO } from "date-fns";

export function formatDate(inputDateStr: string | undefined): string | null {
  if (!inputDateStr) {
    return null;
  }

  try {
    const [datePart, timePart] = inputDateStr.split(" ");
    if (!datePart || !timePart) {
      return null;
    }

    const [year, month, day] = datePart.split(":").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    if ([year, month, day, hour, minute, second].some(isNaN)) {
      return null;
    }

    const date = new Date(year, month - 1, day, hour, minute, second);
    return formatISO(date);
  } catch {
    return null;
  }
}
