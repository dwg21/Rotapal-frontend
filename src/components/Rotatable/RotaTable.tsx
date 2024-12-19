import React, { useState, useCallback, useMemo } from "react";
import { getDayLabel } from "../../Utils/utils";
import { IoAddSharp } from "react-icons/io5";
import ShiftModal from "./ShiftModal";
import DroppableArea from "./DndComponents/DropppableArea";
import DraggableItem from "./DndComponents/DraggableItem";
import { useDraggable } from "@dnd-kit/core";
import { useRotaContext } from "@/Context/RotaContext";

import { Person, ShiftEntry, Rota } from "@/types";

interface RotaTableProps {
  rota: Rota;
  setRota: React.Dispatch<React.SetStateAction<Rota>>;
  dates: string[];
  isSpacePressed: boolean;
  updateRota: (updatedRota: Rota) => Promise<void>;
  archived: boolean;
}

// Separate components for better organization
const EmployeeDraggable: React.FC<{
  personIndex: number;
  employeeName: string;
}> = ({ personIndex, employeeName }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `employee-${personIndex}`,
    data: { type: "employee", personIndex },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: "grab",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="cursor-grab select-none"
    >
      {employeeName}
    </div>
  );
};

const WeekDayDraggable: React.FC<{
  dayIndex: number;
  dayLabel: string;
}> = ({ dayIndex, dayLabel }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `weekday-${dayIndex}`,
    data: { type: "weekday", dayIndex },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: "grab",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex justify-center items-center select-none cursor-grab"
    >
      {dayLabel}
    </div>
  );
};

const ShiftCell: React.FC<{
  shift: ShiftEntry;
  onDoubleClick: (event: React.MouseEvent) => void;
  isSpacePressed: boolean;
  archived: boolean;
}> = ({ shift, onDoubleClick, isSpacePressed, archived }) => {
  if (
    !shift.shiftData?.startTime &&
    !shift.shiftData?.holidayBooked &&
    !shift.shiftData?.label
  ) {
    return (
      <div className="w-[140px] h-[90px] flex justify-center items-center hover:cursor-pointer">
        <IoAddSharp className="text-3xl hover:block text-center" />
      </div>
    );
  }

  const getBackgroundColor = () => {
    if (shift.shiftData?.holidayBooked) return "bg-orange-400";
    if (shift.shiftData?.startTime) return "bg-lightBlue";
    return "bg-darkBlue";
  };

  return (
    <div
      className={`my-2 mx-4 flex text-center items-center select-none justify-center p-1 rounded-md w-[120px] h-[80px] text-white ${getBackgroundColor()}`}
    >
      {shift.shiftData?.holidayBooked ? (
        <p>Holiday Booked</p>
      ) : shift.shiftData?.label === "Day Off" ? (
        <p>Day Off</p>
      ) : (
        <div className="flex flex-col gap-2">
          <p>
            {shift.shiftData?.startTime &&
              `${shift.shiftData.startTime} - ${shift.shiftData.endTime}`}
          </p>
          <p className="font-bold">{shift.shiftData?.label || ""}</p>
        </div>
      )}
    </div>
  );
};

export const RotaTable: React.FC<RotaTableProps> = ({
  rota,
  setRota,
  dates,
  isSpacePressed,
  updateRota,
  archived,
}) => {
  const { filters } = useRotaContext();
  const [modalState, setModalState] = useState({
    isOpen: false,
    position: { top: 0, left: 0 },
    shift: {
      personIndex: null as number | null,
      dayIndex: null as number | null,
      shiftData: {
        startTime: "",
        endTime: "",
        label: "",
        message: "",
        break_duration: 0,
        break_startTime: "",
      },
    },
  });

  // Memoized calculations
  const calculateHoursWorked = useCallback((person: Person) => {
    return person.schedule.reduce((total, shift) => {
      if (!shift.shiftData?.startTime || !shift.shiftData?.endTime)
        return total;

      const start = new Date(`1970-01-01T${shift.shiftData.startTime}`);
      const end = new Date(`1970-01-01T${shift.shiftData.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  }, []);

  const calculateStaffCost = useCallback(
    (person: Person) => {
      return calculateHoursWorked(person) * person.hourlyWage;
    },
    [calculateHoursWorked]
  );

  const totalCost = useMemo(
    () =>
      rota.data.rotaData.reduce(
        (sum, person) => sum + calculateStaffCost(person),
        0
      ),
    [rota.data.rotaData, calculateStaffCost]
  );

  const handleEditShift = useCallback(
    (
      personIndex: number,
      dayIndex: number,
      event: React.MouseEvent<HTMLTableCellElement>
    ) => {
      const shiftData =
        rota.data.rotaData[personIndex].schedule[dayIndex]?.shiftData || {};
      const rect = event.currentTarget.getBoundingClientRect();

      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        position: {
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX,
        },
        shift: {
          personIndex,
          dayIndex,
          shiftData: {
            startTime: shiftData.startTime || "",
            endTime: shiftData.endTime || "",
            label: shiftData.label || "",
            message: shiftData.message || "",
            break_duration: shiftData.break_duration || 0,
            break_startTime: shiftData.break_startTime || "",
          },
        },
      }));
    },
    [rota.data.rotaData]
  );

  const handleSaveShift = async (updatedShift: typeof modalState.shift) => {
    const { personIndex, dayIndex, shiftData } = updatedShift;
    if (personIndex === null || dayIndex === null) return;

    const updatedRotaData = [...rota.data.rotaData];
    const person = updatedRotaData[personIndex];

    if (person) {
      const updatedSchedule = [...person.schedule];
      updatedSchedule[dayIndex] = {
        ...updatedSchedule[dayIndex],
        shiftData: { ...shiftData },
      };

      updatedRotaData[personIndex] = {
        ...person,
        schedule: updatedSchedule,
      };

      const updatedRota = {
        ...rota,
        data: { ...rota.data, rotaData: updatedRotaData },
      };

      await updateRota(updatedRota);
      setRota(updatedRota);
    }

    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {rota.data.rotaData[0]?.employeeName && (
              <th className="px-4 py-2 border bg-gray-100 select-none">
                Staff
              </th>
            )}
            {dates.map((day, dayIndex) => (
              <th key={dayIndex} className="px-4 py-2 border bg-gray-100">
                <WeekDayDraggable
                  dayIndex={dayIndex}
                  dayLabel={getDayLabel(new Date(day))}
                />
              </th>
            ))}
            {filters.showHours && (
              <th className="px-4 py-2 border bg-gray-100 select-none">
                Hours Worked
              </th>
            )}
            {filters.showCost && (
              <th className="px-4 py-2 border bg-gray-100 select-none">
                Staff Costs
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rota.data.rotaData.map((person, personIndex) => (
            <tr key={person.employee}>
              <td className="border px-4 py-2 select-none">
                <EmployeeDraggable
                  personIndex={personIndex}
                  employeeName={person.employeeName}
                />
              </td>
              {dates.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className="border h-full"
                  onDoubleClick={(event) =>
                    handleEditShift(personIndex, dayIndex, event)
                  }
                >
                  <DroppableArea id={`${personIndex}-${dayIndex}`}>
                    <DraggableItem
                      id={`${personIndex}-${dayIndex}`}
                      isSpacePressed={isSpacePressed}
                      onDoubleClick={(event) =>
                        handleEditShift(personIndex, dayIndex, event)
                      }
                      isDraggable={archived}
                    >
                      <ShiftCell
                        shift={person.schedule[dayIndex]}
                        onDoubleClick={(event) =>
                          handleEditShift(personIndex, dayIndex, event)
                        }
                        isSpacePressed={isSpacePressed}
                        archived={archived}
                      />
                    </DraggableItem>
                  </DroppableArea>
                </td>
              ))}
              {filters.showHours && (
                <td className="border px-4 py-2 select-none text-center">
                  {calculateHoursWorked(person).toFixed(0)}
                </td>
              )}
              {filters.showCost && (
                <td className="border px-4 py-2 select-none text-center">
                  £{calculateStaffCost(person).toFixed(2)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {filters.showCost && (
          <tfoot>
            <tr>
              <td
                colSpan={dates.length + (filters.showHours ? 2 : 1)}
                className="px-4 py-2 border bg-gray-100 text-right font-bold"
              >
                Total Weekly Cost: £{totalCost.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      <ShiftModal
        isOpen={modalState.isOpen}
        onRequestClose={() =>
          setModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSave={handleSaveShift}
        shift={modalState.shift}
        setShift={(shift) => setModalState((prev) => ({ ...prev, shift }))}
        position={modalState.position}
      />
    </div>
  );
};

export default RotaTable;
