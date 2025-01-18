import { formatISO } from 'date-fns';

export function formatDate(inputDateStr) {
  if (!inputDateStr) return null;

  try {
    const [datePart, timePart] = inputDateStr.split(' ');
    const [year, month, day] = datePart.split(':');
    const [hour, minute, second] = timePart.split(':');

    const date = new Date(year, month - 1, day, hour, minute, second);
    return formatISO(date);
  } catch (error) {
    console.error(`日付のフォーマットに失敗しました: ${error}`);
    return null;
  }
}
