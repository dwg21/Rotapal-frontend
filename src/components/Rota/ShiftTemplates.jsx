import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

const ShiftTemplates = ({ commonShifts, setCommonShifts }) => {
  // State to handle new custom template
  const [newTemplateLabel, setNewTemplateLabel] = useState("");
  const [newTemplateStartTime, setNewTemplateStartTime] = useState("");
  const [newTemplateEndTime, setNewTemplateEndTime] = useState("");

  // Function to handle adding a new custom template
  const handleAddNewTemplate = (e) => {
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
      label: newTemplateLabel,
      startTime: newTemplateStartTime,
      endTime: newTemplateEndTime,
    };

    setCommonShifts([...commonShifts, newTemplate]);
    console.log(commonShifts);
    setNewTemplateLabel("");
    setNewTemplateStartTime("");
    setNewTemplateEndTime("");
  };

  return (
    <div className=" p-4 m-1 border">
      <p className=" font-bold  text-xl">Shift Templates</p>
      <p>Drag and drop these shifts onto the rota.</p>
      <Droppable droppableId="commonShifts" direction="horizontal">
        {(provided) => (
          <div
            className="mb-4 flex space-x-4 my-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {commonShifts.map((shift, index) => (
              <Draggable key={shift.id} draggableId={shift.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 border cursor-pointer mb-2 mr-2"
                  >
                    {shift.label}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* Form to add a new custom shift template */}
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
    </div>
  );
};

export default ShiftTemplates;
