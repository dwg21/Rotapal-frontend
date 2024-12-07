import React, { useState, MouseEvent } from "react";
import { getDayLabel } from "../../Utils/utils";
import { IoAddSharp } from "react-icons/io5";
import ShiftModal from "./ShiftModal";
import DroppableArea from "./DndComponents/DropppableArea";
import DraggableItem from "./DndComponents/DraggableItem";
import { useRotaContext } from "@/Context/RotaContext";

// Keep existing interfaces
interface ShiftData {
  startTime: string;
  endTime: string;
  label: string;
  message: string;
  break_duration: number;
  break_startTime: string;
  holidayBooked?: boolean;
}

interface Schedule {
  shiftData?: ShiftData;
}

interface Person {
  employee: string;
  employeeName: string;
  schedule: Schedule[];
  hourlyWage: number;
}

interface Rota {
  [x: string]: any;
  rotaData: Person[];
}

interface RotaTableProps {
  rota: Rota;
  setRota: React.Dispatch<React.SetStateAction<Rota>>;
  dates: string[];
  isSpacePressed: boolean;
  updateRota: (updatedRota: Rota) => Promise<void>;
  archived: boolean;
}

interface Shift {
  personIndex: number | null;
  dayIndex: number | null;
  shiftData: ShiftData;
}

interface ModalPosition {
  top: number;
  left: number;
}

const RotaTable = ({
  rota,
  setRota,
  dates,
  isSpacePressed,
  updateRota,
  archived,
}: RotaTableProps) => {
  // Use the context
  const { filters, setFilters } = useRotaContext();
  console.log(rota);

  const [shift, setShift] = useState<Shift>({
    personIndex: null,
    dayIndex: null,
    shiftData: {
      startTime: "",
      endTime: "",
      label: "",
      message: "",
      break_duration: 0,
      break_startTime: "",
    },
  });
  const [modalPosition, setModalPosition] = useState<ModalPosition>({
    top: 0,
    left: 0,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editShift, setEditShift] = useState<Shift | null>(null);

  // Rest of the component remains the same as in the original implementation
  const handleSaveShift = async (updatedShift: Shift) => {
    const { personIndex, dayIndex, shiftData } = updatedShift;
    if (personIndex === null || dayIndex === null) return;

    const updatedRotaData = rota.rotaData.map((person, pIndex) => {
      if (pIndex === personIndex) {
        return {
          ...person,
          schedule: person.schedule.map((shift, dIndex) => {
            if (dIndex === dayIndex) {
              return {
                ...shift,
                shiftData: { ...shiftData },
              };
            }
            return shift;
          }),
        };
      }
      return person;
    });

    const updatedRota = { ...rota, rotaData: updatedRotaData };
    setRota(updatedRota);

    await updateRota(updatedRota);
    setModalIsOpen(false);
    setEditShift(null);
  };

  const handleEditShift = (
    personIndex: number,
    dayIndex: number,
    event: MouseEvent<HTMLTableCellElement>
  ) => {
    const shiftData =
      rota.rotaData[personIndex].schedule[dayIndex]?.shiftData || {};
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    };

    setShift({
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
    });
    setModalPosition(position);
    setModalIsOpen(true);
  };

  const calculateHoursWorked = (person: Person) => {
    return person.schedule.reduce((total, shift) => {
      if (shift.shiftData?.startTime && shift.shiftData?.endTime) {
        const start = new Date(`1970-01-01T${shift.shiftData.startTime}`);
        const end = new Date(`1970-01-01T${shift.shiftData.endTime}`);
        const hoursWorked =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hoursWorked;
      }
      return total;
    }, 0);
  };

  const calculateStaffCost = (person: Person) => {
    console.log(person);
    return calculateHoursWorked(person) * person.hourlyWage;
  };

  const calculateTotalCost = () => {
    return rota.reduce(
      (sum: number, person: Person) => sum + calculateStaffCost(person),
      0
    );
  };

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {rota && rota[0]?.employeeName && (
              <th className="px-4 py-2 border bg-gray-100 select-none">
                Staff
              </th>
            )}
            {dates.map((day, dayIndex) => (
              <th key={day} className="px-4 py-2 border bg-gray-100">
                <div className="flex justify-center items-center select-none">
                  {getDayLabel(new Date(day))}
                </div>
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
          {rota &&
            rota?.map((person, personIndex) => (
              <tr key={person.employee}>
                <td className="border px-4 py-2 select-none">
                  {person?.employeeName}
                </td>
                {dates.map((day, dayIndex) => (
                  <td
                    key={day}
                    className="border h-full"
                    onDoubleClick={(event) =>
                      handleEditShift(personIndex, dayIndex, event)
                    }
                  >
                    <DroppableArea id={`${personIndex}-${dayIndex}`}>
                      {person.schedule[dayIndex]?.shiftData?.startTime ||
                      person.schedule[dayIndex]?.shiftData?.holidayBooked ||
                      person.schedule[dayIndex]?.shiftData?.label ? (
                        <DraggableItem
                          id={`${personIndex}-${dayIndex}`}
                          isSpacePressed={isSpacePressed}
                          onDoubleClick={(event) =>
                            handleEditShift(personIndex, dayIndex, event)
                          }
                          isDraggable={archived}
                        >
                          <div
                            className={`my-2 mx-4 flex text-center items-center select-none justify-center p-1 rounded-md w-[120px] h-[80px] text-white ${
                              person.schedule[dayIndex]?.holidayBooked
                                ? "bg-orange-400"
                                : person.schedule[dayIndex].shiftData?.startTime
                                ? "bg-lightBlue"
                                : "bg-darkBlue"
                            }`}
                          >
                            {person.schedule[dayIndex]?.shiftData
                              ?.holidayBooked ? (
                              <p>Holiday Booked</p>
                            ) : person.schedule[dayIndex]?.shiftData?.label ===
                              "Day Off" ? (
                              <p>Day Off</p>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <p>
                                  {person.schedule[dayIndex]?.shiftData
                                    ?.startTime &&
                                    `${person.schedule[dayIndex].shiftData.startTime} - ${person.schedule[dayIndex].shiftData.endTime}`}
                                </p>
                                <p className="font-bold">
                                  {person.schedule[dayIndex]?.shiftData
                                    ?.label || ""}
                                </p>
                              </div>
                            )}
                          </div>
                        </DraggableItem>
                      ) : (
                        <div className="w-[140px] h-[90px] flex justify-center items-center hover:cursor-pointer">
                          <IoAddSharp className="text-3xl hover:block text-center" />
                        </div>
                      )}
                    </DroppableArea>
                  </td>
                ))}
                {filters.showHours && (
                  <td className="border px-4 py-2 select-none text-center ">
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
                Total Weekly Cost: £{rota && calculateTotalCost().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      <ShiftModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onSave={handleSaveShift}
        editShift={editShift}
        shift={shift}
        setShift={setShift}
        position={modalPosition}
      />
    </div>
  );
};

export default RotaTable;
