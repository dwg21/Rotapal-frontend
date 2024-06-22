import React, { useState, useEffect } from "react";
import { useRota } from "../../RotaContext";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

import ServerApi from "../../serverApi/axios";

const EmployeeRota = () => {
  const { weeks } = useRota();
  const [rota, setRota] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeRota = async () => {
      try {
        const response = await ServerApi.get(
          `http://localhost:5000/api/v1/rotas/employeee/rota/${selectedWeek}`,
          {
            withCredentials: true,
          }
        );
        console.log("hh");
        console.log(response);
        if (response.data.rota) {
          setRota(response.data.rota.rotaData);
          setError(null);
        } else {
          console.log("fhf");
          setError("this rota is not published yet");
        }

        console.log(response.data.rota);
      } catch (err) {
        console.log(err.message);
        //setError("Rota is unavailable for this weej");
      }
    };

    fetchEmployeeRota();
  }, [selectedWeek]);

  const getDayLabel = (date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayNames[date.getDay()]} ${day}/${
      month < 10 ? "0" + month : month
    }`;
  };

  // const totalHours = rota.reduce((acc, person) => {
  //   return (
  //     acc +
  //     person.shifts[selectedWeek].reduce(
  //       (weekAcc, shift) => weekAcc + shift.duration,
  //       0
  //     )
  //   );
  // }, 0);

  // const totalStaffCost = rota
  //   .reduce((acc, person) => {
  //     return (
  //       acc +
  //       person.hourlyWage *
  //         person.shifts[selectedWeek].reduce(
  //           (weekAcc, shift) => weekAcc + shift.duration,
  //           0
  //         )
  //     );
  //   }, 0)
  //   .toFixed(2);

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
    <div className="overflow-x-auto p-4">
      {rota && (
        <div className="my-2">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border bg-gray-100">Staff</th>
                  {rota &&
                    weeks[selectedWeek].map((day, dayIndex) => (
                      <th key={day} className="px-4 py-2 border bg-gray-100">
                        <div className="flex justify-center items-center">
                          {dayIndex === 0 && (
                            <FaArrowCircleLeft
                              className="mx-2 text-2xl cursor-pointer"
                              onClick={() => handleChangeWeek("left")}
                            />
                          )}
                          {getDayLabel(new Date(day))}
                          {dayIndex === weeks[selectedWeek].length - 1 &&
                            selectedWeek < weeks.length - 1 && (
                              <FaArrowCircleRight
                                className="mx-2 text-2xl cursor-pointer"
                                onClick={() => handleChangeWeek("right")}
                              />
                            )}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              {!error ? (
                <tbody>
                  {rota.map((person, personIndex) => (
                    <tr key={person.id}>
                      <td className="border px-4 py-2">
                        {person.employeeName}
                      </td>
                      {weeks[selectedWeek].map((day, dayIndex) => (
                        <td key={day} className="border px-4 py-2">
                          <div className="min-h-[4rem]">
                            <div className="cursor-pointer flex items-center justify-center w-full h-full">
                              <div className="flex  text-center items-center justify-center p-1 rounded-md h-[80%] w-[80%]  bg-lightBlue text-white ">
                                {person.schedule[selectedWeek][dayIndex]
                                  .startTime
                                  ? `${person.schedule[selectedWeek][dayIndex].startTime} - ${person.schedule[selectedWeek][dayIndex].endTime}`
                                  : "Day Off"}
                              </div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p>{error}</p>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRota;
