import React, { useState } from "react";
import { useDraggable, useDroppable, DndContext } from "@dnd-kit/core";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import ServerApi from "../../serverApi/axios";

const DraggableRotaTemplate = ({ rota, index, handleDeleteTemplate }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: rota.id,
    data: {
      droppableContainer: { id: "commonRotas" },
      rota,
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
        {rota.label}
        <button onClick={() => handleDeleteTemplate(rota.id)}>
          <IoTrashBin />
        </button>
      </div>
    </div>
  );
};

const DroppableRotaContainer = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "commonRotas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`mb-4 flex space-x-4 my-4 ${isOver ? "bg-blue-100" : ""}`}
    >
      {children}
    </div>
  );
};

const RotaTemplates = ({
  rota,
  commonRotas,
  setCommonRotas,
  selectedvenueID,
}) => {
  const [newRotaLabel, setNewRotaLabel] = useState("");
  const [addTemplateVisible, setAddTemplateVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleAddNewTemplate = async (e) => {
    e.preventDefault();
    if (newRotaLabel.trim() === "") {
      return;
    }
    const newTemplate = {
      id: `${newRotaLabel}-${Date.now()}`, // Optional: Change as needed
      label: newRotaLabel,
      rotaData: rota.map((person) => ({
        employee: person.employee, // Use person.employee
        schedule: person.schedule.map((shift) => ({
          date: shift.date,
          shiftData: shift.shiftData,
        })),
      })),
    };

    console.log(newTemplate);

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-rotas`,
        { rota: newTemplate },
        { withCredentials: true }
      );
      setCommonRotas(response.data.commonRotas);
      setAddTemplateVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      const response = await ServerApi.delete(
        `api/v1/venue/${selectedvenueID}/common-rotas/${id}`,
        { withCredentials: true }
      );
      setCommonRotas(response.data.commonRotas);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 m-1 border">
      <div className="flex items-center justify-between">
        <p className="font-bold text-xl">Rota Templates</p>
        <IoIosArrowDown
          className="cursor-pointer text-xl"
          onClick={() => setDetailsVisible(!detailsVisible)}
        />
      </div>

      {detailsVisible && (
        <div>
          <p>Drag and drop these rotas onto the current rota.</p>
          <DroppableRotaContainer>
            {commonRotas &&
              commonRotas.map((rota, index) => (
                <DraggableRotaTemplate
                  key={rota.id}
                  rota={rota}
                  index={index}
                  handleDeleteTemplate={handleDeleteTemplate}
                />
              ))}
            <button
              onClick={() => setAddTemplateVisible(!addTemplateVisible)}
              className=""
            >
              <IoMdAdd />
            </button>
          </DroppableRotaContainer>
          {addTemplateVisible && (
            <form onSubmit={handleAddNewTemplate} className="mb-4">
              <h3 className="mb-2">Add Custom Rota Template</h3>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newRotaLabel}
                  onChange={(e) => setNewRotaLabel(e.target.value)}
                  placeholder="Rota Label"
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

export default RotaTemplates;
