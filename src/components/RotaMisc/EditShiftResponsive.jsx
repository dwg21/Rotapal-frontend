import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";

const EditShiftResponsive = ({
  personIndex,
  dayIndex,
  rota,
  setRota,
  updateRota,
  emptyShift,
}) => {
  const [shift, setShift] = useState({
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

  const [editSectionVisible, setEditSectionVisible] = useState(false);

  const handleEditShift = () => {
    const shiftData = rota[personIndex].schedule[dayIndex]?.shiftData || {};

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
  };

  const handleSaveShift = async (updatedShift) => {
    const { personIndex, dayIndex, shiftData } = updatedShift;
    const updatedRotaData = rota.map((person, pIndex) => {
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

    // Set the updated rota state
    setRota({
      ...rota,
      rotaData: updatedRotaData,
    });

    await updateRota({
      ...rota,
      rotaData: updatedRotaData,
    });
  };

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

  const handleOpenShift = () => {
    setEditSectionVisible(true);
    handleEditShift();
  };

  const handleSave = () => {
    console.log(shift);
    handleSaveShift(shift);
    setEditSectionVisible(false);
  };

  return (
    <div className="p-2">
      {!emptyShift ? (
        <button
          onClick={() => handleOpenShift()}
          className="flex justify-center items-center gap-2"
        >
          Edit <MdEdit />
        </button>
      ) : (
        <div className="w-full h-[90px] flex justify-center items-center hover:cursor-pointer">
          <button onClick={() => setEditSectionVisible(true)}>
            <IoAddSharp className="text-3xl hover:block text-center" />
          </button>
        </div>
      )}
      {editSectionVisible && (
        <div>
          <div className="flex flex-col justify-center items-center gap-2">
            <h2 className="text-center text-lg font-bold">
              {emptyShift ? `ADD SHIFT` : `EDIT SHIFT`}
            </h2>
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

            <label className="text-center">
              Break
              <select
                name="break_duration"
                value={shift.shiftData?.break_duration}
                onChange={handleChange}
                className="ml-2 p-1 border border-gray-300 rounded"
              >
                <option value="none">None</option>
                <option value="30">30 Mins</option>
                <option value="60">1 hour</option>
              </select>
            </label>

            <label className="text-center mt-4 mb-1">
              Break Starting:
              <input
                type="time"
                name="break_startTime"
                value={shift.shiftData?.break_startTime || ""}
                onChange={handleChange}
                className="ml-2 p-1 border border-gray-300 rounded"
              />
            </label>

            <label className="text-center flex">
              Message:
              <textarea
                type="multitext"
                name="message"
                value={shift.shiftData?.message || ""}
                onChange={handleChange}
                className="ml-2 p-1 border border-gray-300 rounded"
              />
            </label>

            <br />
            <button
              onClick={() => handleSave()}
              className="bg-blue-500 text-white p-2 rounded w-[200px] my-3"
            >
              Save
            </button>
            <button
              onClick={() => setEditSectionVisible(false)}
              className="bg-red-500 text-white p-2 rounded w-[200px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditShiftResponsive;
