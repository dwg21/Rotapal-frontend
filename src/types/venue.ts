import { WeeklySchedule } from "./rota";

export interface OpeningHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface CommonRota {
  id: string;
  label: string;
  rotaData: WeeklySchedule[];
}

export interface Venue {
  openingHours: OpeningHours;
  _id: string;
  name: string;
  address: string;
  phone: string;
  employees: string[]; // Employee IDs
  rota: string[]; // Rota IDs
  commonRotas: CommonRota[];
}
