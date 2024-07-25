import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ShiftModal = ({
  shift,
  setShift,
  isOpen,
  onRequestClose,
  onSave,
  editShift,
  position,
}) => {
  // Effect to initialize shift when editShift is provided
  useEffect(() => {
    if (editShift) {
      setShift(editShift);
    }
  }, [editShift, setShift]);

  // Handle changes to shiftData properties
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShift((prev) => ({
      ...prev,
      shiftData: {
        ...prev.shiftData,
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    onSave(shift);
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, 0)", // Adjust as needed
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-4 border rounded shadow-lg relative"
      >
        <div className="absolute -top-2 -right-2 w-0 h-0 border-t-8 border-t-white border-r-8 border-r-transparent border-b-8 border-b-transparent border-l-8 border-l-transparent"></div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-center text-lg font-bold">EDIT SHIFT</h2>
          <label className="text-center mt-4 mb-1">
            Start Time:
            <input
              type="time"
              name="startTime"
              value={shift.shiftData?.startTime || ""}
              onChange={handleChange}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <br />
          <label className="text-center">
            End Time:
            <input
              type="time"
              name="endTime"
              value={shift.shiftData?.endTime || ""}
              onChange={handleChange}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <br />
          <label className="text-center">
            Label:
            <input
              type="text"
              name="label"
              value={shift.shiftData?.label || ""}
              onChange={handleChange}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <br />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded w-[200px] my-3"
          >
            Save
          </button>
          <button
            onClick={onRequestClose}
            className="bg-red-500 text-white p-2 rounded w-[200px]"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShiftModal;
