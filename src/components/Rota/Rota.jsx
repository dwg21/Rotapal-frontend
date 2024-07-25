import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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

import ShiftModal from "./ShiftModal";
import { generateWeeks } from "../../Utils/utils";
import Toolbar from "./Toolbar";
import RotaTable from "./RotaTable";

import DroppableArea from "./DndComponents/DropppableArea";
import DraggableItem from "./DndComponents/DraggableItem";

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

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const handleEditShift = (personIndex, dayIndex, event) => {
    console.log("Editing Shift");
    const shiftData = rota[personIndex].schedule[dayIndex]?.shiftData || {};

    // Get position of the clicked element
    const rect = event.currentTarget.getBoundingClientRect();

    // Calculate position for the modal
    const position = {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    };

    setShift({
      personIndex,
      dayIndex,
      ...shiftData, // Spread shiftData directly
    });
    setModalPosition(position);
    setModalIsOpen(true);
  };

  const handleSaveShift = async (updatedShift) => {
    const { personIndex, dayIndex, shiftData } = updatedShift;
    console.log(shiftData);

    const updatedRota = rota.map((person, pIndex) => {
      if (pIndex === personIndex) {
        console.log("hh");
        return {
          ...person,
          schedule: person.schedule.map((shift, dIndex) => {
            if (dIndex === dayIndex) {
              console.log("nssj");
              return {
                ...shift,
                shiftData: {
                  ...shiftData,
                },
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

    if (!over || !active) {
      console.log("Invalid active or over data");
      return;
    }

    const sourceId = active.id.split("-");
    const destId = over.id.split("-");

    if (active.id === over.id) return;

    const sourcePersonIndex =
      sourceId.length > 1 ? parseInt(sourceId[0], 10) : null;
    const sourceDayIndex =
      sourceId.length > 1 ? parseInt(sourceId[1], 10) : null;
    const destPersonIndex = parseInt(destId[0], 10);
    const destDayIndex = parseInt(destId[1], 10);

    let updatedRota = [...rota];

    if (active.data.current?.droppableContainer?.id === "commonShifts") {
      const shift = commonShifts.find((shift) => shift.id === active.id);
      if (!shift) {
        console.log("Shift not found");
        return;
      }

      console.log("shit", shift);

      if (isNaN(destPersonIndex) || isNaN(destDayIndex)) {
        console.log("Invalid destination indices");
        return;
      }

      const destEmployee = updatedRota[destPersonIndex];
      const destSchedule = destEmployee?.schedule;
      if (!destSchedule) {
        console.log("Destination schedule not found");
        return;
      }

      const destShift = destSchedule[destDayIndex];
      if (destShift?.holidayBooked) {
        console.log("Destination shift has holiday booked");
        return;
      }

      // Directly update the shiftData
      updatedRota[destPersonIndex].schedule[destDayIndex] = {
        ...destShift,
        shiftData: {
          ...shift.shiftData,
        },
      };
    } else if (active.data.current?.droppableContainer?.id === "commonRotas") {
      const rotaTemplate = commonRotas.find((r) => r.id === active.id);
      if (!rotaTemplate) return;

      const updatedRota = rota.map((person) => {
        const templatePerson = rotaTemplate.rotaData.find(
          (p) => p.employee.toString() === person.employeeId.toString()
        );

        if (!templatePerson) return person;

        const updatedSchedule = person.schedule.map((shift) => {
          const templateShift = templatePerson.schedule.find(
            (tShift) => tShift.date === shift.date
          );

          if (templateShift) {
            return {
              ...shift,
              shiftData: {
                ...templateShift.shiftData,
              },
            };
          }
          return shift;
        });

        return {
          ...person,
          schedule: updatedSchedule,
        };
      });

      setRota(updatedRota);
      updateRota(updatedRota);
    } else {
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

      const sourceEmployee = updatedRota[sourcePersonIndex];
      const destEmployee = updatedRota[destPersonIndex];
      const sourceSchedule = sourceEmployee?.schedule;
      const destSchedule = destEmployee?.schedule;

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
        updatedRota[destPersonIndex].schedule[destDayIndex] = {
          ...destShift,
          shiftData: {
            ...sourceShift.shiftData, // Copy shift data
          },
        };
      } else {
        updatedRota[sourcePersonIndex].schedule[sourceDayIndex] = {
          ...sourceShift,
          shiftData: {
            ...destShift.shiftData, // Preserve destination shift data
          },
        };
        updatedRota[destPersonIndex].schedule[destDayIndex] = {
          ...destShift,
          shiftData: {
            ...sourceShift.shiftData, // Preserve source shift data
          },
        };
      }
    }

    setRota(updatedRota);
    updateRota(updatedRota);
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

  // Extract dates from rotaData and sort them
  const dates = Array.from(
    new Set(
      rota.flatMap((person) => person.schedule.map((shift) => shift.date))
    )
  ).sort();

  return (
    <div className="container mx-auto p-4">
      <Toolbar
        venueName={venueName}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weeks={weeks}
        dates={dates}
        rotaPublished={rotaPublished}
        setRotaPublished={setRotaPublished}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="my-2">
          <div id="rota-content" className="overflow-x-auto">
            <RotaTable
              rota={rota}
              dates={dates}
              DroppableArea={DroppableArea}
              DraggableItem={DraggableItem}
              isSpacePressed={isSpacePressed}
              handleEditShift={handleEditShift}
            />
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
            <button
              onClick={handleGenerateRota}
              className="p-2 border bg-slate-600 text-white rounded-md"
            >
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
        position={modalPosition}
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
