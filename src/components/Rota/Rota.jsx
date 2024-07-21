import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useRota } from "../../RotaContext";
import ShiftTemplates from "./ShiftTemplates";
import RotaTemplates from "./RotaTemplates";
import { ClipLoader } from "react-spinners";
import { addWeeks, startOfWeek, format } from "date-fns";
import { useParams } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import { motion, AnimatePresence } from "framer-motion";

import ShiftModal from "./ShiftModal";
import {
  generateWeeks,
  calculateDuration,
  getDayLabel,
} from "../../Utils/utils";
import Toolbar from "./Toolbar";

const DroppableArea = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ scale: 1 }}
      animate={{ scale: isOver ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-full transition-colors duration-300 ${
        isOver ? "bg-blue-100" : "bg-white"
      }`}
    >
      {children}
    </motion.div>
  );
};

const DraggableItem = ({ id, children, isSpacePressed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      initial={{ scale: 1 }}
      animate={{
        scale: isDragging && !isSpacePressed ? 1.1 : 1,
        rotate: isDragging && !isSpacePressed ? 5 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`cursor-pointer flex items-center justify-center w-full h-full ${
        isDragging && !isSpacePressed ? "opacity-50" : ""
      }`}
    >
      {children}
    </motion.div>
  );
};

const Rota = () => {
  const { selectedvenueID, setSelectedvenueID, selectedVenue } = useRota();
  const { venueId } = useParams();
  const [rota, setRota] = useState([]);
  const [rotaId, setRotaId] = useState(null);
  const [error, setError] = useState("");
  const [editShift, setEditShift] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const weeks = useMemo(() => generateWeeks(4 + selectedWeek), [selectedWeek]);
  const [rotaPublished, setRotaPublished] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [venueName, setVenueName] = useState(null);
  const [commonShifts, setCommonShifts] = useState([]);
  const [generateRotaVisible, setGenerateRotaVisible] = useState(false);
  const [activeId, setActiveId] = useState(null); // State for active draggable item
  const [isSpacePressed, setIsSpacePressed] = useState(false); // State to track if space key is pressed

  const calculateWeekStarting = useCallback(() => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    return format(addWeeks(startOfCurrentWeek, selectedWeek), "yyyy-MM-dd");
  }, [selectedWeek]);

  const handleGenerateRota = async () => {
    const requestObject = {
      venueId: selectedvenueID,
      weekStarting: calculateWeekStarting(),
    };

    try {
      const response = await ServerApi.post(
        `http://localhost:5000/api/v1/rotas/rota/generateRota`,
        requestObject,
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRota = useCallback(async () => {
    const requestObject = {
      venueId: selectedvenueID,
      weekStarting: calculateWeekStarting(),
    };

    try {
      const response = await ServerApi.post(
        `http://localhost:5000/api/v1/rotas/rota`,
        requestObject,
        { withCredentials: true }
      );
      setVenueName(response.data.rota.name.split("-")[0]);
      setRota(response.data.rota.rotaData);
      console.log(response.data.rota);
      setRotaPublished(response.data.rota.published);
      setRotaId(response.data.rota._id);
      setGenerateRotaVisible(true);
    } catch (err) {
      console.log(err.response.data.message);
      setError("Failed to fetch venues");
      if (err.response.data.message === "Rota not found") {
        setRota([]);
        setGenerateRotaVisible(false);
        setRotaPublished(false);
      }
    }
  }, [selectedvenueID, calculateWeekStarting]);

  useEffect(() => {
    fetchRota();
  }, [fetchRota, selectedWeek, selectedvenueID]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await ServerApi.get(
        `api/v1/venue/${selectedvenueID}/common-shifts`,
        { withCredentials: true }
      );
      setCommonShifts(response.data.commonShifts);

      console.log(response.data.commonShifts);
    } catch (err) {
      console.log(err);
    }
  }, [selectedvenueID]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleEditShift = (personIndex, dayIndex) => {
    const startTime = rota[personIndex].schedule[dayIndex]?.startTime || "";
    const endTime = rota[personIndex].schedule[dayIndex]?.endTime || "";
    const label = rota[personIndex].schedule[dayIndex]?.label || "";
    setShift({
      personIndex,
      dayIndex,
      startTime,
      endTime,
      label,
    });
    setModalIsOpen(true);
  };

  const handleSaveShift = async (updatedShift) => {
    const { personIndex, dayIndex, startTime, endTime, label } = updatedShift;

    const updatedRota = rota.map((person, pIndex) => {
      if (pIndex === personIndex) {
        return {
          ...person,
          schedule: person.schedule.map((shift, dIndex) => {
            if (dIndex === dayIndex) {
              return {
                ...shift,
                startTime,
                endTime,
                label,
                duration: calculateDuration(startTime, endTime),
              };
            }
            return shift;
          }),
        };
      }
      return person;
    });

    setRota(updatedRota);
    await updateRota(updatedRota);
    setModalIsOpen(false);
    setEditShift(null);
  };

  const updateRota = async (updatedRota) => {
    console.log("updateRota called with:", updatedRota);
    setLoading(true);
    setSuccess(false);
    try {
      await ServerApi.post(
        `/api/v1/rotas/${rotaId}`,
        { newRota: updatedRota },
        { withCredentials: true }
      );
      setSuccess(true);
      console.log("Rota successfully updated on server.");
    } catch (error) {
      console.error("Failed to update rota on server:", error);
      setError("Failed to update rota");
    } finally {
      setLoading(false);
    }
  };

  const [commonRotas, setCommonRotas] = useState([]);

  const fetchCommonRotas = useCallback(async () => {
    try {
      const response = await ServerApi.get(
        `api/v1/venue/${selectedvenueID}/common-rotas`,
        { withCredentials: true }
      );
      setCommonRotas(response.data.commonRotas);
    } catch (err) {
      console.log(err);
    }
  }, [selectedvenueID]);

  useEffect(() => {
    fetchCommonRotas();
  }, [fetchCommonRotas]);

  const [shift, setShift] = useState({
    personIndex: null,
    dayIndex: null,
    startTime: "",
    endTime: "",
    label: "",
  });

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const onDragStart = (event) => {
    const { active } = event;
    setActiveId(active?.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    console.log("Drag End Triggered");
    console.log("Active:", active);
    console.log("Over:", over);

    if (!over || !active) {
      console.log("Invalid active or over data");
      return;
    }

    // Extract IDs
    const sourceId = active.id.split("-");
    const destId = over.id.split("-");

    console.log("Source ID Split:", sourceId);
    console.log("Destination ID Split:", destId);

    // Parse indices
    const sourcePersonIndex =
      sourceId.length > 1 ? parseInt(sourceId[0], 10) : null;
    const sourceDayIndex =
      sourceId.length > 1 ? parseInt(sourceId[1], 10) : null;
    const destPersonIndex = parseInt(destId[0], 10);
    const destDayIndex = parseInt(destId[1], 10);

    console.log("Parsed Indices - Source:", sourcePersonIndex, sourceDayIndex);
    console.log("Parsed Indices - Destination:", destPersonIndex, destDayIndex);

    // Initialize updatedRota
    let updatedRota = [...rota];

    if (active.data.current?.droppableContainer?.id === "commonShifts") {
      console.log("Dragging from commonShifts");
      const shift = commonShifts.find((shift) => shift.id === active.id);
      if (!shift) {
        console.log("Shift not found");
        return;
      }

      if (isNaN(destPersonIndex) || isNaN(destDayIndex)) {
        console.log("Invalid destination indices");
        return;
      }

      const destSchedule = updatedRota[destPersonIndex]?.schedule;
      if (!destSchedule) {
        console.log("Destination schedule not found");
        return;
      }

      const destShift = destSchedule[destDayIndex];
      if (destShift?.holidayBooked) {
        console.log("Destination shift has holiday booked");
        return;
      }

      updatedRota[destPersonIndex].schedule[destDayIndex] = {
        ...shift,
        duration: calculateDuration(shift.startTime, shift.endTime),
      };
    } else if (active.data.current?.droppableContainer?.id === "commonRotas") {
      console.log("Dragging from commonRotas");
      const rotaTemplate = commonRotas.find((r) => r.id === active.id);
      if (!rotaTemplate) {
        console.log("Rota template not found");
        return;
      }

      updatedRota = rotaTemplate.rota;
      setRota(rotaTemplate.rota);
      updateRota(rotaTemplate.rota);
    } else {
      console.log("Dragging within rota");

      if (
        sourcePersonIndex === null ||
        sourceDayIndex === null ||
        isNaN(sourcePersonIndex) ||
        isNaN(sourceDayIndex) ||
        isNaN(destPersonIndex) ||
        isNaN(destDayIndex)
      ) {
        console.log("Invalid indices");
        return;
      }

      // Ensure schedules are defined
      const sourceSchedule = updatedRota[sourcePersonIndex]?.schedule;
      const destSchedule = updatedRota[destPersonIndex]?.schedule;

      if (!sourceSchedule || !destSchedule) {
        console.log("Source or destination schedule not found");
        return;
      }

      const sourceShift = sourceSchedule[sourceDayIndex];
      const destShift = destSchedule[destDayIndex];

      if (sourceShift?.holidayBooked || destShift?.holidayBooked) {
        console.log("Source or destination shift has holiday booked");
        return;
      }

      if (isSpacePressed) {
        console.log("Space key pressed - copying shift");
        updatedRota[destPersonIndex].schedule[destDayIndex] = {
          ...sourceShift,
          duration: calculateDuration(
            sourceShift.startTime,
            sourceShift.endTime
          ),
        };
      } else {
        console.log("Swapping shifts");
        updatedRota[sourcePersonIndex].schedule[sourceDayIndex] = destShift;
        updatedRota[destPersonIndex].schedule[destDayIndex] = sourceShift;
      }
    }

    setRota(updatedRota);
    updateRota(updatedRota);

    console.log("Drag end completed");
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === " ") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Toolbar
        venueName={venueName}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weeks={weeks}
        rotaPublished={rotaPublished}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="my-2">
          <div id="rota-content" className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border bg-gray-100 select-none">
                    Staff
                  </th>
                  {weeks[selectedWeek].map((day, dayIndex) => (
                    <th key={day} className="px-4 py-2 border bg-gray-100">
                      <div className="flex justify-center items-center select-none">
                        {getDayLabel(new Date(day))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rota.map((person, personIndex) => (
                  <tr key={person.id}>
                    <td className="border px-4 py-2 select-none">
                      {person.employeeName}
                    </td>
                    {weeks[selectedWeek].map((day, dayIndex) => (
                      <td
                        key={day}
                        className="border px-4 py-2"
                        onDoubleClick={() =>
                          handleEditShift(personIndex, dayIndex)
                        }
                      >
                        <DroppableArea id={`${personIndex}-${dayIndex}`}>
                          {person.schedule[dayIndex] && (
                            <DraggableItem
                              id={`${personIndex}-${dayIndex}`}
                              isSpacePressed={isSpacePressed}
                            >
                              <div
                                className={`flex text-center items-center justify-center p-1 rounded-md w-[120px] h-[80px] ${
                                  person.schedule[dayIndex].startTime
                                    ? `bg-lightBlue`
                                    : `bg-darkBlue`
                                } text-white ${
                                  person.schedule[dayIndex].holidayBooked &&
                                  `bg-orange-400`
                                }`}
                              >
                                {person.schedule[dayIndex].startTime ? (
                                  <div className="flex flex-col gap-2">
                                    <p>{`${person.schedule[dayIndex].startTime} - ${person.schedule[dayIndex].endTime}`}</p>
                                    <p className="font-bold">
                                      {`${
                                        person.schedule[dayIndex].label
                                          ? person.schedule[dayIndex].label
                                          : ""
                                      }`}
                                    </p>
                                  </div>
                                ) : (
                                  <p>
                                    {person.schedule[dayIndex].holidayBooked
                                      ? "Holiday Booked"
                                      : "Day Off"}
                                  </p>
                                )}
                              </div>
                            </DraggableItem>
                          )}
                        </DroppableArea>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {generateRotaVisible ? (
          <div className=" w-full bg-white">
            <ShiftTemplates
              selectedvenueID={selectedvenueID}
              className="w-full "
              commonShifts={commonShifts}
              setCommonShifts={setCommonShifts}
            />

            <RotaTemplates
              rota={rota}
              commonRotas={commonRotas}
              setCommonRotas={setCommonRotas}
              selectedvenueID={selectedvenueID}
            />
          </div>
        ) : (
          <div>
            <p>
              There is no rota for this week yet. Would you like to generate
              one?
            </p>
            <button className="p-2 border bg-slate-600 text-white rounded-md">
              Generate Rota
            </button>
          </div>
        )}

        <DragOverlay>
          {activeId && (
            <div className="bg-lightBlue text-white p-1 rounded-md w-[120px] h-[80px] flex items-center justify-center">
              {rota[parseInt(activeId.split("-")[0])]?.schedule[
                parseInt(activeId.split("-")[1])
              ]?.startTime ? (
                <div className="flex flex-col gap-2">
                  <p>{`${
                    rota[parseInt(activeId.split("-")[0])]?.schedule[
                      parseInt(activeId.split("-")[1])
                    ]?.startTime
                  } - ${
                    rota[parseInt(activeId.split("-")[0])]?.schedule[
                      parseInt(activeId.split("-")[1])
                    ]?.endTime
                  }`}</p>
                  <p className="font-bold">
                    {`${
                      rota[parseInt(activeId.split("-")[0])]?.schedule[
                        parseInt(activeId.split("-")[1])
                      ]?.label || ""
                    }`}
                  </p>
                </div>
              ) : (
                <p>
                  {rota[parseInt(activeId.split("-")[0])]?.schedule[
                    parseInt(activeId.split("-")[1])
                  ]?.holidayBooked
                    ? "Holiday Booked"
                    : "Day Off"}
                </p>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ShiftModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onSave={handleSaveShift}
        editShift={editShift}
        shift={shift}
        setShift={setShift}
      />

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <ClipLoader loading={loading} size={50} />
        </div>
      )}
      {success && (
        <p className="text-green-500 text-center mt-4">
          Rota updated successfully!
        </p>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Rota;
