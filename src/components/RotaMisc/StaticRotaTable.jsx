import React from "react";

import { getDayLabel } from "../../Utils/utils";

const StaticRotaTable = ({ dates, rota }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-4 py-2 border bg-gray-100 select-none">Staff</th>
          {dates.map((day, dayIndex) => (
            <th key={day} className="px-4 py-2 border bg-gray-100">
              <div className="flex justify-center items-center select-none">
                {getDayLabel(new Date(day))}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rota?.rotaData?.map((person, personIndex) => (
          <tr key={person.employee}>
            <td className="border px-4 py-2 select-none">
              {person.employeeName}
            </td>
            {dates.map((day, dayIndex) => (
              <td
                key={day}
                className="border h-full select-none"
                onDoubleClick={(event) =>
                  handleEditShift(personIndex, dayIndex, event)
                }
              >
                {person.schedule[dayIndex]?.shiftData?.startTime ||
                person.schedule[dayIndex]?.shiftData?.holidayBooked ||
                person.schedule[dayIndex]?.shiftData?.label ? (
                  <div
                    className={`my-2 mx-4 flex text-center items-center justify-center p-1 rounded-md w-[120px] h-[80px] ${
                      person.schedule[dayIndex].shiftData?.startTime
                        ? `bg-lightBlue`
                        : `bg-darkBlue`
                    } text-white ${
                      person.schedule[dayIndex]?.shiftData?.holidayBooked &&
                      `bg-orange-400`
                    }`}
                  >
                    {person.schedule[dayIndex]?.shiftData?.holidayBooked ? (
                      <p>Holiday Booked</p>
                    ) : person.schedule[dayIndex]?.shiftData?.label ===
                      "Day Off" ? (
                      <p>Day Off</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p>
                          {person.schedule[dayIndex]?.shiftData?.startTime &&
                            `${person.schedule[dayIndex].shiftData.startTime} - ${person.schedule[dayIndex].shiftData.endTime}`}
                        </p>
                        <p className="font-bold">
                          {person.schedule[dayIndex]?.shiftData?.label || ""}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[140px] h-[90px] flex justify-center items-center hover:bg-slate-300 hover:cursor-pointer ">
                    <IoAddSharp className="text-3xl  hover:block text-center" />
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaticRotaTable;
