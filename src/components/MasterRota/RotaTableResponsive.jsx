import React, { useState } from "react";
import { IoChevronBack, IoChevronForward, IoAddSharp } from "react-icons/io5";
import EditShiftResponsive from "../RotaMisc/EditShiftResponsive";
const RotaTableResponsive = ({
  rota,
  setRota,
  dates,
  updateRota,
  selectedWeek,
  setSelectedWeek,
}) => {
  const [editShift, setEditShift] = useState(null);

  const [showCost, setShowCost] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);

  const calculateStaffCost = (person) => {
    const totalHours = person.schedule.reduce((sum, shift) => {
      if (
        shift.shiftData &&
        shift.shiftData.startTime &&
        shift.shiftData.endTime
      ) {
        const start = new Date(`1970-01-01T${shift.shiftData.startTime}`);
        const end = new Date(`1970-01-01T${shift.shiftData.endTime}`);
        const hoursWorked = (end - start) / (1000 * 60 * 60);
        return sum + hoursWorked;
      }
      return sum;
    }, 0);
    return totalHours * person.hourlyWage;
  };

  const calculateTotalCost = () => {
    return rota.reduce((sum, person) => {
      return sum + calculateStaffCost(person);
    }, 0);
  };

  const handleChangeWeek = (direction) => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
      console.log(selectedWeek);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek((prev) => prev - 1);
    }
  };

  const handleDaySelect = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  // Format the date as "Monday, 12th August"
  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("en-GB", options).replace(",", ""); // Format date and remove the comma
  };

  // Get selected date and formatted day of the week
  const selectedDate = dates[selectedDay];
  const formattedDate = selectedDate ? formatSelectedDate(selectedDate) : "";

  return (
    <div className="w-full p-4">
      {/* Display selected date and day of the week */}
      <div className="text-center my-3 font-semibold text-lg">
        {formattedDate}
      </div>

      <div className="flex justify-between items-center mb-4">
        <IoChevronBack
          onClick={() => handleChangeWeek("left")}
          className="text-3xl cursor-pointer"
        />
        <div className="flex gap-2">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
                selectedDay === index + currentWeek * 7
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleDaySelect(index + currentWeek * 7)}
            >
              {day}
            </div>
          ))}
        </div>
        <IoChevronForward
          onClick={() => handleChangeWeek("right")}
          className="text-3xl cursor-pointer"
        />
      </div>

      <div>
        {rota?.map((person, personIndex) => (
          <div key={person.employee} className="my-3 p-1 border-b-2">
            {person.schedule[selectedDay]?.shiftData?.startTime ||
            person.schedule[selectedDay]?.shiftData?.holidayBooked ||
            person.schedule[selectedDay]?.shiftData?.label ? (
              <div className="my-2 mx-auto text-left items-center p-1 rounded-md w-full text-black">
                <div className="flex flex-col items-left gap-4">
                  <p className=" font-bold">{person.employeeName}</p>
                  {person.schedule[selectedDay]?.shiftData?.holidayBooked ? (
                    <p>Holiday Booked</p>
                  ) : person.schedule[selectedDay]?.shiftData?.label ===
                    "Day Off" ? (
                    <>
                      <p>Day Off</p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p>
                        <div className="flex justify-between items-center mb-2">
                          {showCost && (
                            <span className="font-semibold">
                              £{calculateStaffCost(person).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {person.schedule[selectedDay]?.shiftData?.startTime &&
                          `${person.schedule[selectedDay].shiftData.startTime} - ${person.schedule[selectedDay].shiftData.endTime}`}
                      </p>
                      <p className="font-bold">
                        {person.schedule[selectedDay]?.shiftData?.label || ""}
                      </p>
                    </div>
                  )}
                </div>

                <EditShiftResponsive
                  personIndex={personIndex}
                  dayIndex={selectedDay}
                  rota={rota}
                  updateRota={updateRota}
                  setRota={setRota}
                />
              </div>
            ) : (
              <div className="w-full h-[90px] flex justify-center items-center hover:cursor-pointer">
                <IoAddSharp className="text-3xl hover:block text-center" />
              </div>
            )}
          </div>
        ))}
      </div>

      {showCost && (
        <div className="mt-4 text-right font-bold">
          Total Weekly Cost: £{rota && calculateTotalCost().toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default RotaTableResponsive;
