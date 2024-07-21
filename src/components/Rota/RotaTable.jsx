import React from "react";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";

const RotaTable = ({ rota, weeks, selectedWeek, onEditShift, onDragEnd }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <table>
      <thead>
        <tr>
          <th></th>
          {weeks[selectedWeek].map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rota.map((person, personIndex) => (
          <tr key={personIndex}>
            <td>{person.name}</td>
            {person.schedule.map((shift, dayIndex) => (
              <td
                key={dayIndex}
                onDoubleClick={() => onEditShift(personIndex, dayIndex)}
              >
                <Droppable droppableId={`${personIndex}-${dayIndex}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="rota-shift"
                    >
                      {shift.label && (
                        <Draggable
                          draggableId={`${personIndex}-${dayIndex}`}
                          index={0}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="shift"
                            >
                              {shift.label}
                            </div>
                          )}
                        </Draggable>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </DragDropContext>
);

export default RotaTable;
