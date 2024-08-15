import React, { useState } from "react";
import { IoChevronBack, IoChevronForward, IoAddSharp } from "react-icons/io5";

const StaticResponsiveRotaTable = ({
  rota,
  dates,
  updateRota,
  selectedWeek,
  setSelectedWeek,
}) => {
  const handleChangeWeek = (direction) => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
      console.log(selectedWeek);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek((prev) => prev - 1);
    }
  };
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showCost, setShowCost] = useState(false);

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  // Format the date as "Monday, 12th August"
  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    console.log(date);

    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("en-GB", options).replace(",", ""); // Format date and remove the comma
  };

  // Get selected date and formatted day of the week
  const selectedDate = dates[selectedDay];
  const formattedDate = selectedDate ? formatSelectedDate(selectedDate) : "";

  const handleDaySelect = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

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
                  <p className=" font-semibold">{person.employeeName}</p>
                  {person.schedule[selectedDay]?.shiftData?.holidayBooked ? (
                    <p>Holiday Booked</p>
                  ) : person.schedule[selectedDay]?.shiftData?.label ===
                    "Day Off" ? (
                    <p>Day Off</p>
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
              </div>
            ) : (
              <div className="w-full h-[90px] flex justify-center items-center hover:cursor-pointer">
                <IoAddSharp className="text-3xl hover:block text-center" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticResponsiveRotaTable;
