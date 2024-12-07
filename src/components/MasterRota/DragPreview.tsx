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
  schedule: {
    shiftData?: ShiftData,
  }[];
}

interface Rota {
  data?: {
    rotaData?: RotaPerson[],
  };
}

interface DragPreviewProps {
  id: string;
  rota: Rota;
}

const DragPreview: React.FC<DragPreviewProps> = ({ id, rota }) => {
  const [personIndex, dayIndex] = id.split("-").map(Number);
  const employeeData = rota?.data?.rotaData?.[personIndex];
  const daySchedule = employeeData?.schedule?.[dayIndex] || {};
  const shift = daySchedule.shiftData;

  return (
    <div className="bg-lightBlue text-white p-1 rounded-md w-[120px] h-[80px] flex items-center justify-center">
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
