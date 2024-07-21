import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { IoMdAdd, IoIosArrowDown } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import ServerApi from "../../serverApi/axios";

const DraggableTemplate = ({ shift }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: shift.id,
    data: {
      droppableContainer: { id: "commonShifts" },
      shift,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-2 border cursor-pointer mb-2 mr-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex gap-4">
        {shift.desc}
        <button onClick={() => shift.handleDeleteTemplate(shift.id)}>
          <IoTrashBin />
        </button>
      </div>
    </div>
  );
};

const ShiftTemplates = ({ selectedvenueID, commonShifts, setCommonShifts }) => {
  // State to handle new custom template
  const [newTemplateLabel, setNewTemplateLabel] = useState("");
  const [newTemplateStartTime, setNewTemplateStartTime] = useState("");
  const [newTemplateEndTime, setNewTemplateEndTime] = useState("");
  const [addTemplateVisible, setAddTemplateVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Function to handle adding a new custom template to database
  const handleAddNewTemplate = async (e) => {
    e.preventDefault();
    if (
      newTemplateLabel.trim() === "" ||
      newTemplateStartTime.trim() === "" ||
      newTemplateEndTime.trim() === ""
    ) {
      return;
    }
    const newTemplate = {
      id: `${newTemplateLabel}-${Date.now()}`,
      desc: newTemplateLabel,
      startTime: newTemplateStartTime,
      endTime: newTemplateEndTime,
    };

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-shifts`,
        { shift: newTemplate },
        { withCredentials: true }
      );
      setCommonShifts(response.data.commonShifts);
      setAddTemplateVisible(false);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      const response = await ServerApi.delete(
        `api/v1/venue/${selectedvenueID}/common-shifts/${id}`,
        { withCredentials: true }
      );
      setCommonShifts(response.data.commonShifts);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 m-1 border">
      <div className="flex items-center justify-between">
        <p className="font-bold text-xl">Shift Templates</p>
        <IoIosArrowDown
          className="cursor-pointer text-xl"
          onClick={() => setDetailsVisible(!detailsVisible)}
        />
      </div>

      {detailsVisible && (
        <div>
          <p>Drag and drop these shifts onto the rota.</p>
          <div className="mb-4 flex space-x-4 my-4">
            {commonShifts.map((shift) => (
              <DraggableTemplate
                key={shift.id}
                shift={{ ...shift, handleDeleteTemplate }}
              />
            ))}
            <button onClick={() => setAddTemplateVisible(!addTemplateVisible)}>
              <IoMdAdd />
            </button>
          </div>
          {/* Form to add a new custom shift template */}
          {addTemplateVisible && (
            <form onSubmit={handleAddNewTemplate} className="mb-4">
              <h3 className="mb-2">Add Custom Shift Template</h3>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTemplateLabel}
                  onChange={(e) => setNewTemplateLabel(e.target.value)}
                  placeholder="Shift Label"
                  className="border px-2 py-1"
                />
                <input
                  type="time"
                  value={newTemplateStartTime}
                  onChange={(e) => setNewTemplateStartTime(e.target.value)}
                  className="border px-2 py-1"
                />
                <input
                  type="time"
                  value={newTemplateEndTime}
                  onChange={(e) => setNewTemplateEndTime(e.target.value)}
                  className="border px-2 py-1"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 border rounded bg-blue-500 text-white"
              >
                Add Template
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ShiftTemplates;
