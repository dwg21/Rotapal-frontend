import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const ShiftModal = ({
  shift,
  setShift,
  isOpen,
  onRequestClose,
  onSave,
  editShift,
}) => {
  useEffect(() => {
    if (editShift) {
      setShift(editShift);
    }
  }, [editShift]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShift((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(shift);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-center text-lg font-bold">EDIT SHIFT</h2>
        <label className="text-center mt-4 mb-1">
          Start Time:
          <input
            type="time"
            name="startTime"
            value={shift.startTime}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className="text-center">
          End Time:
          <input
            type="time"
            name="endTime"
            value={shift.endTime}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className="text-center">
          Label:
          <input
            type="text"
            name="label"
            value={shift.label}
            onChange={handleChange}
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
          onClick={() => onRequestClose()}
          className="bg-red-500 text-white p-2 rounded w-[200px]"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ShiftModal;
