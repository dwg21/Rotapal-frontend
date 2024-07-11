import React, { useState, useEffect, useCallback } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { IoAirplane, IoTrashBin } from "react-icons/io5";
import ServerApi from "../../serverApi/axios";

const RotaTemplates = ({
  rota,
  commonRotas,
  setCommonRotas,
  selectedvenueID,
}) => {
  const [newRotaLabel, setNewRotaLabel] = useState("");
  const [addTemplateVisible, setAddTemplateVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Function to handle adding a new rota template
  const handleAddNewTemplate = async (e) => {
    e.preventDefault();
    if (newRotaLabel.trim() === "") {
      return;
    }
    const newTemplate = {
      id: `${newRotaLabel}-${Date.now()}`,
      label: newRotaLabel,
      rota: rota, // Save the current rota here
    };

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-rotas`,
        { rota: newTemplate },
        { withCredentials: true }
      );
      setCommonRotas(response.data.commonRotas);

      setAddTemplateVisible(false);

      console.log(response);
    } catch (err) {
      console.log(err);
    }

    setCommonRotas((prev) => [...prev, newTemplate]);
    setAddTemplateVisible(false);
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
    <div className=" p-4 m-1 border">
      <div className="flex items-center justify-between">
        <p className=" font-bold  text-xl">Rota Templates</p>
        <IoIosArrowDown
          className=" cursor-pointer  text-xl"
          onClick={() => setDetailsVisible(!detailsVisible)}
        />
      </div>

      {detailsVisible && (
        <div>
          <p>Drag and drop these rotas onto the current rota.</p>
          <Droppable droppableId="commonRotas" direction="horizontal">
            {(provided) => (
              <div
                className="mb-4 flex space-x-4 my-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {commonRotas &&
                  commonRotas.map((rota, index) => (
                    <Draggable
                      key={rota.id}
                      draggableId={rota.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 border cursor-pointer mb-2 mr-2"
                        >
                          <div className="flex gap-4">
                            {rota.label}
                            <button
                              onClick={() => handleDeleteTemplate(rota.id)}
                            >
                              <IoTrashBin />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                <button
                  onClick={() => setAddTemplateVisible(!addTemplateVisible)}
                  className=""
                >
                  <IoMdAdd />
                </button>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
