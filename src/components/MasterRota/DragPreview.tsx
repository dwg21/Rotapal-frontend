import React from "react";

// Type definitions for the component
interface ShiftData {
  startTime?: string;
  endTime?: string;
  label?: string;
  holidayBooked?: boolean;
  [key: string]: any;
}

interface RotaPerson {
  employeeName?: string;
  schedule: {
    shiftData?: ShiftData;
  }[];
}

interface Rota {
  data?: {
    rotaData?: RotaPerson[];
  };
}

interface DragPreviewProps {
  id: string;
  rota: Rota;
}

const DragPreview: React.FC<DragPreviewProps> = ({ id, rota }) => {
  // Check if the drag is for an employee or a weekday
  const isEmployeeDrag = id.startsWith("employee-");
  const isWeekdayDrag = id.startsWith("weekday-");
  const isShiftDrag = id.includes("-") && !isEmployeeDrag && !isWeekdayDrag;

  // Extract index for employee or weekday drag
  const dragIndex = isEmployeeDrag
    ? Number(id.split("-")[1])
    : isWeekdayDrag
    ? Number(id.split("-")[1])
    : null;

  // Render preview for employee drag (horizontal)
  if (isEmployeeDrag && rota?.data?.rotaData) {
    const person = rota.data.rotaData[dragIndex];
    return (
      <div className="flex gap-6  w-full">
        {person.schedule.map(
          (shift, index) =>
            shift.shiftData && (
              <div
                key={index}
                className={`
                flex gap-2 text-center items-center select-none justify-center 
                  p-1 rounded-md min-w-[120px] min-h-[80px] text-white
                overflow-hidden
                  ${
                    shift.shiftData.holidayBooked
                      ? "bg-orange-400"
                      : shift.shiftData.startTime
                      ? "bg-lightBlue"
                      : "bg-darkBlue"
                  }
                `}
              >
                {shift.shiftData.holidayBooked ? (
                  <p>Holiday Booked</p>
                ) : shift.shiftData.label === "Day Off" ? (
                  <p>Day Off</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>
                      {shift.shiftData.startTime &&
                        `${shift.shiftData.startTime} - ${shift.shiftData.endTime}`}
                    </p>
                    <p className="font-bold">{shift.shiftData.label || ""}</p>
                  </div>
                )}
              </div>
            )
        )}
      </div>
    );
  }

  // Render preview for weekday drag (vertical)
  if (isWeekdayDrag && rota?.data?.rotaData) {
    return (
      <div className="flex flex-col gap-6 p-2">
        {rota.data.rotaData.map((person) => {
          const shift = person.schedule[dragIndex];
          return (
            shift.shiftData && (
              <div
                key={person.employeeName}
                className={`
                flex gap-2 text-center items-center select-none justify-center 
                p-1 rounded-md min-w-[120px] min-h-[80px] text-white
                overflow-hidden
                ${
                  shift.shiftData.holidayBooked
                    ? "bg-orange-400"
                    : shift.shiftData.startTime
                    ? "bg-lightBlue"
                    : "bg-darkBlue"
                }
              `}
              >
                <div className="flex flex-col gap-2">
                  {shift.shiftData.holidayBooked ? (
                    <p>Holiday Booked</p>
                  ) : shift.shiftData.label === "Day Off" ? (
                    <p>Day Off</p>
                  ) : (
                    <div>
                      <p>
                        {shift.shiftData.startTime &&
                          `${shift.shiftData.startTime} - ${shift.shiftData.endTime}`}
                      </p>
                      <p className="font-bold">{shift.shiftData.label || ""}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          );
        })}
      </div>
    );
  }

  // Original single shift drag preview
  const [personIndex, dayIndex] = id.split("-").map(Number);
  const employeeData = rota?.data?.rotaData?.[personIndex];
  const daySchedule = employeeData?.schedule?.[dayIndex] || {};
  const shift = daySchedule.shiftData;

  return (
    <div
      className={`
        my-2 mx-4 flex text-center items-center select-none justify-center 
        p-1 rounded-md w-[120px] h-[80px] text-white
        ${
          shift?.holidayBooked
            ? "bg-orange-400"
            : shift?.startTime
            ? "bg-lightBlue"
            : "bg-darkBlue"
        }
      `}
    >
      {!shift?.holidayBooked ? (
        <div className="flex flex-col gap-2">
          <p>{shift ? `${shift?.startTime} - ${shift?.endTime}` : id}</p>
          <p className="font-bold">{shift?.label}</p>
        </div>
      ) : (
        <p>{shift?.holidayBooked ? "Holiday Booked" : shift?.label}</p>
      )}
    </div>
  );
};

export default DragPreview;
