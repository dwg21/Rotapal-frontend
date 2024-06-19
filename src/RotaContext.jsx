import React, { createContext, useContext, useState } from "react";
import { addWeeks, startOfWeek, addDays, format } from "date-fns";

// Generate weeks for the next 4 weeks starting from the Monday of the current week
const generateWeeks = () => {
  const weeks = [];
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  for (let i = 0; i < 4; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(format(addDays(addWeeks(startDate, i), j), "yyyy-MM-dd"));
    }
    weeks.push(week);
  }
  return weeks;
};

// Initial example data
// const initialRota = [
//   {
//     name: "Alice",
//     shifts: generateWeeks().map(() => [
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "", endTime: "", duration: 0 },
//       { startTime: "", endTime: "", duration: 0 },
//     ]),
//     hourlyWage: 12,
//   },
//   {
//     name: "Bob",
//     shifts: generateWeeks().map(() => [
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "", endTime: "", duration: 0 },
//       { startTime: "", endTime: "", duration: 0 },
//     ]),
//     hourlyWage: 12,
//   },
//   {
//     name: "Charlie",
//     shifts: generateWeeks().map(() => [
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "09:00", endTime: "17:00", duration: 8 },
//       { startTime: "", endTime: "", duration: 0 },
//       { startTime: "", endTime: "", duration: 0 },
//     ]),
//     hourlyWage: 14,
//   },
// ];

// Create a context
const RotaContext = createContext();

export const RotaProvider = ({ children }) => {
  const [rota, setRota] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [weeks] = useState(generateWeeks());

  //   const addNewStaff = (name, hourlyWage) => {
  //     const newStaff = {
  //       name,
  //       shifts: weeks.map(() => [
  //         { startTime: "09:00", endTime: "17:00", duration: 8 },
  //         { startTime: "09:00", endTime: "17:00", duration: 8 },
  //         { startTime: "09:00", endTime: "17:00", duration: 8 },
  //         { startTime: "09:00", endTime: "17:00", duration: 8 },
  //         { startTime: "09:00", endTime: "17:00", duration: 8 },
  //         { startTime: "", endTime: "", duration: 0 },
  //         { startTime: "", endTime: "", duration: 0 },
  //       ]),
  //       hourlyWage,
  //     };
  //     setRota([...rota, newStaff]);
  //   };

  //   const updateShift = (personIndex, weekIndex, dayIndex, shift) => {
  //     const updatedRota = rota.map((person, pIndex) => {
  //       if (pIndex === personIndex) {
  //         return {
  //           ...person,
  //           shifts: person.shifts.map((week, wIndex) => {
  //             if (wIndex === weekIndex) {
  //               return week.map((currentShift, dIndex) => {
  //                 if (dIndex === dayIndex) {
  //                   return shift;
  //                 }
  //                 return currentShift;
  //               });
  //             }
  //             return week;
  //           }),
  //         };
  //       }
  //       return person;
  //     });
  //     setRota(updatedRota);
  //   };

  return (
    <RotaContext.Provider
      value={{ rota, setRota, weeks, selectedVenue, setSelectedVenue }}
    >
      {children}
    </RotaContext.Provider>
  );
};

export const useRota = () => useContext(RotaContext);
