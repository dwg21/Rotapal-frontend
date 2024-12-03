import React from "react";

import { ShiftData } from "@/types";
interface Position {
  top: number;
  left: number;
}

interface SelectedShift {
  shiftData?: ShiftData;
}

interface ShiftDetailsModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  showHours: boolean;
  position: Position;
  selectedShift: SelectedShift;
}

const ShiftDetailsModal = ({
  modalVisible,
  setModalVisible,
  position,
  selectedShift,
}: ShiftDetailsModalProps) => {
  if (!modalVisible) return null;

  return (
    <div
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translate(-5%, -10%)", // Adjust as needed
      }}
      className="absolute z-50"
    >
      <div className="speech-bubble bg-white p-4 border rounded shadow-lg">
        <div className="absolute -top-2 -right-2 w-0 h-0 border-t-8 border-t-white border-r-8 border-r-transparent border-b-8 border-b-transparent border-l-8 border-l-transparent"></div>
        <div className="flex flex-col justify-center items-center gap-2">
          <h2 className="text-center text-lg font-bold">View Details</h2>

          <p> Start Time: {selectedShift?.shiftData?.startTime}</p>
          <p> End Time: {selectedShift?.shiftData?.endTime}</p>
          <p> Label: {selectedShift?.shiftData?.label}</p>
          <p>
            Break: {selectedShift?.shiftData?.break_duration} break starting at
            {selectedShift?.shiftData?.break_startTime}
          </p>
          <p>Message: {selectedShift?.shiftData?.message}</p>
          <button
            onClick={() => setModalVisible(false)}
            className="bg-red-500 text-white p-2 rounded w-[200px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftDetailsModal;
