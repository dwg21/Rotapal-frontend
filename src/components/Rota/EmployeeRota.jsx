import React, { useState } from "react";
import { useRota } from "../../RotaContext";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

const EmployeeRota = () => {
  const { rota, weeks, selectedVenue } = useRota();
  const [selectedWeek, setSelectedWeek] = useState(0);

  const getDayLabel = (date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayNames[date.getDay()]} ${day}/${
      month < 10 ? "0" + month : month
    }`;
  };

  const totalHours = rota.reduce((acc, person) => {
    return (
      acc +
      person.shifts[selectedWeek].reduce(
        (weekAcc, shift) => weekAcc + shift.duration,
        0
      )
    );
  }, 0);

  const totalStaffCost = rota
    .reduce((acc, person) => {
      return (
        acc +
        person.hourlyWage *
          person.shifts[selectedWeek].reduce(
            (weekAcc, shift) => weekAcc + shift.duration,
            0
          )
      );
    }, 0)
    .toFixed(2);

  const handleChangeWeek = (direction) => {
    console.log(selectedWeek);

    if (direction === "right" && selectedWeek < 3) {
      setSelectedWeek(selectedWeek + 1);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek(selectedWeek - 1);
    }
    console.log(selectedWeek);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-2 py-2 border">Staff</th>
            {weeks[selectedWeek].map((day, dayIndex) => (
              <th key={day} className="px-4 py-2 border">
                <div className="flex justify-center items-center">
                  {dayIndex === 0 && (
                    <FaArrowCircleLeft
                      className="mx-2 text-2xl cursor-pointer"
                      onClick={() => handleChangeWeek("left")}
                    />
                  )}
                  {getDayLabel(new Date(day))}
                  {dayIndex === 6 && (
                    <FaArrowCircleRight
                      className="mx-2 text-2xl cursor-pointer"
                      onClick={() => handleChangeWeek("right")}
                    />
                  )}
                </div>
              </th>
            ))}
            <th className="px-4 py-2 border">Total Hours</th>
            <th className="px-4 py-2 border">Staff Cost</th>
          </tr>
        </thead>
        <tbody>
          {rota.map((person, personIndex) => (
            <tr key={person.name} className="text-center">
              <td className="px-8 py-1 border font-semibold">{person.name}</td>
              {weeks[selectedWeek].map((_, dayIndex) => (
                <td
                  key={`${personIndex}-${selectedWeek}-${dayIndex}`}
                  className="px-4 py-2 border"
                >
                  <div className="flex items-center justify-center p-1 rounded-md h-[80%] w-[80%] bg-lightBlue text-white">
                    {person.shifts[selectedWeek][dayIndex].startTime
                      ? `${person.shifts[selectedWeek][dayIndex].startTime} - ${person.shifts[selectedWeek][dayIndex].endTime}`
                      : "Day Off"}
                  </div>
                </td>
              ))}
              <td className="px-4 py-2 border">
                {person.shifts[selectedWeek].reduce(
                  (acc, shift) => acc + shift.duration,
                  0
                )}
              </td>
              <td className="px-4 py-2 border">
                {(
                  person.hourlyWage *
                  person.shifts[selectedWeek].reduce(
                    (acc, shift) => acc + shift.duration,
                    0
                  )
                ).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="text-center font-bold">
            <td className="px-4 py-2 border">Total</td>
            {weeks[selectedWeek].map((_, dayIndex) => (
              <td key={dayIndex} className="px-4 py-2 border"></td>
            ))}
            <td className="px-4 py-2 border">{totalHours}</td>
            <td className="px-4 py-2 border">{totalStaffCost}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeRota;
