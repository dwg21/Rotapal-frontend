import React, { useState, MouseEvent } from "react";
import { getDayLabel } from "../../Utils/utils";
import ShiftDetailsModal from "./ShiftDetailsModal";
import { IoAddSharp } from "react-icons/io5";
import { ShiftData, WeeklySchedule, Schedule } from "../../types"; // Assuming the types file is located in 'types'

type EmployeeRotaTableProps = {
  dates: string[];
  rota: {
    rotaData: WeeklySchedule[];
  };
};

type SelectedShift = {
  personIndex: number | null;
  dayIndex: number | null;
  shiftData: ShiftData;
};

const EmployeeRotaTable = ({ dates, rota }: EmployeeRotaTableProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });
  const [selectedShift, setSelectedShift] = useState<SelectedShift>({
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

  const handleClickShift = (
    event: MouseEvent<HTMLDivElement>,
    personIndex: number,
    dayIndex: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    };

    const shiftData =
      rota?.rotaData[personIndex]?.schedule[dayIndex]?.shiftData;

    setSelectedShift({
      personIndex,
      dayIndex,
      shiftData: shiftData || {
        startTime: "",
        endTime: "",
        label: "",
        message: "",
        break_duration: 0,
        break_startTime: "",
      },
    });

    setModalPosition(position);
    setModalVisible(true);
  };

  return (
    <>
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
                {person.employee}
              </td>
              {dates.map((day, dayIndex) => (
                <td key={day} className="border h-full select-none">
                  {person.schedule[dayIndex]?.shiftData?.startTime ||
                  person.schedule[dayIndex]?.holidayBooked ||
                  person.schedule[dayIndex]?.shiftData?.label ? (
                    <div
                      onClick={(event) =>
                        handleClickShift(event, personIndex, dayIndex)
                      }
                      className={`my-2 mx-4 flex text-center items-center justify-center p-1 rounded-md w-[120px] h-[80px] text-white ${
                        person.schedule[dayIndex]?.holidayBooked
                          ? "bg-orange-400"
                          : person.schedule[dayIndex].shiftData?.startTime
                          ? "bg-lightBlue"
                          : "bg-darkBlue"
                      }`}
                    >
                      {person.schedule[dayIndex]?.holidayBooked ? (
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
                      <IoAddSharp className="text-3xl hover:block text-center" />
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ShiftDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        position={modalPosition}
        selectedShift={selectedShift}
        showHours={false}
      />
    </>
  );
};

export default EmployeeRotaTable;