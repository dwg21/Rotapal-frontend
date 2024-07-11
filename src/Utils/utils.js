import { addWeeks, startOfWeek, addDays, format } from "date-fns";

export const generateWeeks = (limit) => {
  const weeks = [];
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  for (let i = 0; i < limit; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(format(addDays(addWeeks(startDate, i), j), "yyyy-MM-dd"));
    }
    weeks.push(week);
  }
  console.log(weeks);

  return weeks;
};

export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = new Date(`01/01/2022 ${startTime}`);
  const end = new Date(`01/01/2022 ${endTime}`);
  return (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
};

export const getDayLabel = (date) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayNames[date.getDay()]} ${day}/${
    month < 10 ? "0" + month : month
  }`;
};
