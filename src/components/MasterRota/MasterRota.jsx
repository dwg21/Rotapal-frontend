import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useRota } from "../../RotaContext";
import ShiftTemplates from "./ShiftTemplates";
import RotaTemplates from "./RotaTemplates";
import { ClipLoader } from "react-spinners";
import { addWeeks, startOfWeek, format } from "date-fns";
import ServerApi from "../../serverApi/axios";
import { generateWeeks } from "../../Utils/utils";
import Toolbar from "../RotaMisc/Toolbar";
import RotaTable from "./RotaTable";
import DroppableArea from "./DndComponents/DropppableArea";
import DraggableItem from "./DndComponents/DraggableItem";
import RotaTableResponsive from "./RotaTableResponsive";

const MasterRota = () => {
  const { selectedvenueID } = useRota();

  const [rota, setRota] = useState([]);
  const [error, setError] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(0);

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  const [commonShifts, setCommonShifts] = useState([]);

  const [activeId, setActiveId] = useState(null);
  const [isShiftPressed, setisShiftPressed] = useState(false);

  const [commonRotas, setCommonRotas] = useState([]);

  const weeks = useMemo(() => generateWeeks(4 + selectedWeek), [selectedWeek]);

  const calculateWeekStarting = useCallback(() => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    return format(addWeeks(startOfCurrentWeek, selectedWeek), "yyyy-MM-dd");
  }, [selectedWeek]);

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
      setRota(response.data.rota);
    } catch (err) {
      console.log(err.response.data.message);
      setError("Failed to fetch venues");
      if (err.response.data.message === "Rota not found") {
        setRota(false);
      }
    }
  }, [selectedvenueID, calculateWeekStarting]);

  useEffect(() => {
    fetchRota();
    console.log(rota);
  }, [fetchRota, selectedWeek, selectedvenueID]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await ServerApi.get(
        `api/v1/venue/${selectedvenueID}/common-shifts`,
        { withCredentials: true }
      );
      setCommonShifts(response.data.commonShifts);
    } catch (err) {
      console.log(err);
    }
  }, [selectedvenueID]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

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

  const updateRota = async (updatedRota) => {
    setStatus((prev) => ({ ...prev, loading: true, success: false }));
    try {
      await ServerApi.post(
        `/api/v1/rotas/${rota._id}`,
        { newRota: updatedRota.rotaData },
        { withCredentials: true }
      );
      setStatus((prev) => ({ ...prev, loading: false, success: true }));
    } catch (error) {
      console.error("Failed to update rota on server:", error);
      setError("Failed to update rota");
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleGenerateRota = async () => {
    const requestObject = {
      venueId: selectedvenueID,
      weekStarting: calculateWeekStarting(),
    };

    try {
      await ServerApi.post(
        `http://localhost:5000/api/v1/rotas/rota/generateRota`,
        requestObject,
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const onDragStart = (event) => {
    setActiveId(event.active?.id);
  };

  const onDragEnd = (event) => {
    console.log("Drag end event:", event);

    const { active, over } = event;
    if (!over || !active) {
      console.log("No active or over elements");
      return;
    }

    const [sourcePersonIndex, sourceDayIndex] = active.id
      .split("-")
      .map(Number);
    const [destPersonIndex, destDayIndex] = over.id.split("-").map(Number);

    console.log("Source:", { sourcePersonIndex, sourceDayIndex });
    console.log("Destination:", { destPersonIndex, destDayIndex });

    let updatedRotaData = [...rota.rotaData];

    if (active.data.current?.droppableContainer?.id === "commonShifts") {
      console.log("Handling commonShifts");

      const shift = commonShifts.find((shift) => shift.id === active.id);
      if (!shift) {
        console.log("No shift found for ID:", active.id);
        return;
      }

      if (isNaN(destPersonIndex) || isNaN(destDayIndex)) {
        console.log("Invalid destination indices");
        return;
      }

      const destEmployee = updatedRotaData[destPersonIndex];
      const destSchedule = destEmployee?.schedule;
      if (!destSchedule) {
        console.log("No destination schedule found");
        return;
      }

      const destShift = destSchedule[destDayIndex];
      if (destShift?.holidayBooked) {
        console.log("Destination shift has holiday booked");
        return;
      }

      updatedRotaData[destPersonIndex].schedule[destDayIndex] = {
        ...destShift,
        shiftData: { ...shift.shiftData },
      };
      console.log("Updated rota with common shift:", updatedRotaData);
    } else if (active.data.current?.droppableContainer?.id === "commonRotas") {
      console.log("Handling commonRotas");

      const rotaTemplate = commonRotas.find((r) => r.id === active.id);
      if (!rotaTemplate) {
        console.log("No rota template found for ID:", active.id);
        return;
      }

      console.log("Rota template found:", rotaTemplate);

      updatedRotaData = rota.rotaData.map((person) => {
        const templatePerson = rotaTemplate.rotaData.find(
          (p) => p.employee.toString() === person.employee.toString()
        );

        if (!templatePerson) {
          console.log(
            "No template person found for employee ID:",
            person.employee
          );
          return person;
        }

        console.log("Template person found:", templatePerson);

        const updatedSchedule = person.schedule.map((shift, index) => {
          const templateShift = templatePerson.schedule[index];

          if (!templateShift) {
            console.log(
              `No template shift found for index ${index} in person schedule`
            );
            return shift;
          }

          console.log(`Replacing shift at index ${index}`, {
            oldShiftData: shift.shiftData,
            newShiftData: templateShift.shiftData,
          });

          return {
            ...shift,
            shiftData: { ...templateShift.shiftData },
          };
        });

        return {
          ...person,
          schedule: updatedSchedule,
        };
      });

      console.log("Updated rota:", updatedRotaData);

      setRota({ ...rota, rotaData: updatedRotaData });
      updateRota({ ...rota, rotaData: updatedRotaData });
    } else {
      console.log("Handling regular shift swap");

      if (
        isNaN(sourcePersonIndex) ||
        isNaN(sourceDayIndex) ||
        isNaN(destPersonIndex) ||
        isNaN(destDayIndex)
      ) {
        console.log("Invalid indices for source or destination");
        return;
      }

      const sourceEmployee = updatedRotaData[sourcePersonIndex];
      const destEmployee = updatedRotaData[destPersonIndex];
      const sourceSchedule = sourceEmployee?.schedule;
      const destSchedule = destEmployee?.schedule;

      if (!sourceSchedule || !destSchedule) {
        console.log("No schedule found for source or destination");
        return;
      }

      const sourceShift = sourceSchedule[sourceDayIndex];
      const destShift = destSchedule[destDayIndex];

      if (sourceShift?.holidayBooked || destShift?.holidayBooked) {
        console.log("Source or destination shift has holiday booked");
        return;
      }

      if (isShiftPressed) {
        console.log("Space is pressed, copying shift data to destination");
        updatedRotaData[destPersonIndex].schedule[destDayIndex] = {
          ...destShift,
          shiftData: { ...sourceShift.shiftData },
        };
      } else {
        console.log("Swapping shift data between source and destination");
        updatedRotaData[sourcePersonIndex].schedule[sourceDayIndex] = {
          ...sourceShift,
          shiftData: { ...destShift.shiftData },
        };
        updatedRotaData[destPersonIndex].schedule[destDayIndex] = {
          ...destShift,
          shiftData: { ...sourceShift.shiftData },
        };
      }

      console.log("Updated rota after shift swap:", updatedRotaData);
    }

    setRota({ ...rota, rotaData: updatedRotaData });
    updateRota({ ...rota, rotaData: updatedRotaData });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") setisShiftPressed(true);
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") setisShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getDragPreview = (id) => {
    const [personIndex, dayIndex] = id.split("-").map(Number);
    const employeeData = rota?.rotaData?.[personIndex];
    const daySchedule = employeeData?.schedule?.[dayIndex] || {};
    const shift = daySchedule.shiftData;

    return (
      <div className="bg-lightBlue text-white p-1 rounded-md w-[120px] h-[80px] flex items-center justify-center">
        {shift?.startTime ? (
          <div className="flex flex-col gap-2">
            <p>{`${shift?.startTime} - ${shift?.endTime}`}</p>
            <p className="font-bold">{shift.label}</p>
          </div>
        ) : (
          <p>{shift?.holidayBooked ? "Holiday Booked" : shift?.label}</p>
        )}
      </div>
    );
  };

  const dates = Array.from(
    new Set(
      rota?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      )
    )
  ).sort();

  return (
    <div className="container mx-auto p-4">
      <Toolbar
        venueName={rota?.name?.split("-")[0]}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weeks={weeks}
        dates={dates}
        rota={rota}
        setRota={setRota}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="my-2">
          <div id="rota-content" className="overflow-x-auto">
            {/* Render RotaTable on large screens and above */}
            <div className="hidden lg:block">
              <RotaTable
                rota={rota?.rotaData}
                setRota={setRota}
                dates={dates}
                DroppableArea={DroppableArea}
                DraggableItem={DraggableItem}
                isShiftPressed={isShiftPressed}
                updateRota={updateRota}
              />
            </div>

            {/* Render RotaTableResponsive on small and medium screens */}
            <div className="block lg:hidden">
              <RotaTableResponsive
                rota={rota?.rotaData}
                setRota={setRota}
                dates={dates}
                updateRota={updateRota}
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
              />
            </div>
          </div>
        </div>

        {rota ? (
          <div className="w-full bg-white">
            <div className="hidden lg:block">
              <ShiftTemplates
                selectedvenueID={selectedvenueID}
                className="w-full"
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

        <DragOverlay>{activeId && getDragPreview(activeId)}</DragOverlay>
      </DndContext>

      {status.loading && (
        <div className="flex justify-center items-center mt-4">
          <ClipLoader loading={status.loading} size={50} />
        </div>
      )}
      {status.success && (
        <p className="text-green-500 text-center mt-4">
          Rota updated successfully!
        </p>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default MasterRota;
