export interface ShiftData {
  startTime: string;
  endTime: string;
  label: string;
  message: string;
  break_duration: number;
  break_startTime: string;
  holidayBooked?: boolean;
}

export interface WeeklySchedule {
  employee: string; // Employee ID
  schedule: Schedule[];
}

export interface Schedule {
  shiftData: ShiftData | null;
  _id: string;
  date: string;
  holidayBooked: boolean;
}

export interface ShiftEntry {
  shiftData?: ShiftData;
}

export interface Person {
  employee: string;
  employeeName: string;
  schedule: ShiftEntry[];
  hourlyWage: number;
}

export interface Rota {
  data: {
    rotaData: Person[];
  };
}
