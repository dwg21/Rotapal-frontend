import { addWeeks, startOfWeek, addDays, format } from "date-fns";

/**
 * Generates an array of weeks with each week containing dates in the format "yyyy-MM-dd".
 * @param limit Number of weeks to generate.
 * @returns Array of weeks, where each week is an array of date strings.
 */
export const generateWeeks = (limit: number): string[][] => {
  const weeks: string[][] = [];
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday as the start of the week
  for (let i = 0; i < limit; i++) {
    const week: string[] = [];
    for (let j = 0; j < 7; j++) {
      week.push(format(addDays(addWeeks(startDate, i), j), "yyyy-MM-dd"));
    }
    weeks.push(week);
  }
  console.log(weeks);

  return weeks;
};

/**
 * Calculates the duration in hours between two times.
 * @param startTime Start time as a string in "HH:mm" format.
 * @param endTime End time as a string in "HH:mm" format.
 * @returns The duration in hours as a number.
 */
export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  if (!startTime || !endTime) return 0;
  const start = new Date(`01/01/2022 ${startTime}`);
  const end = new Date(`01/01/2022 ${endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
};

/**
 * Gets the day label for a given date in the format "Day DD/MM".
 * @param date A Date object.
 * @returns A formatted string representing the day label.
 */
export const getDayLabel = (date: Date): string => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayNames[date.getDay()]} ${day}/${
    month < 10 ? "0" + month : month
  }`;
};
