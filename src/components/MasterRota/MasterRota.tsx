import React from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import ShiftTemplates from "./ShiftTemplates";
import RotaTemplates from "./RotaTemplates";
import { ClipLoader } from "react-spinners";
import Toolbar from "../RotaMisc/Toolbar";
import RotaTable from "./RotaTable";
import RotaTableMobile from "./RotaTableMobile";
import useMasterRota from "../../hooks/useMasterRota";
import { useRotaContext } from "../../Context/RotaContext";
import DragPreview from "./DragPreview";

// Type definitions for the component
interface ShiftData {
  date?: string;
  // Add other relevant shift properties
  [key: string]: any;
}

interface RotaPerson {
  employee: string;
  schedule: {
    date?: string;
    shiftData?: ShiftData;
  }[];
}

interface Rota {
  _id?: string;
  name?: string;
  rotaData?: RotaPerson[];
  archived?: boolean;
  futureDate?: boolean;
}

interface CommonShift {
  id: string;
  shiftData: ShiftData;
}

interface CommonRota {
  id: string;
  rotaData: RotaPerson[];
}

const MasterRota: React.FC = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID") || "default";

  const { filters, setFilters, selectedWeek, setSelectedWeek } =
    useRotaContext();

  const {
    rota,
    commonShifts,
    commonRotas,
    status,
    error,
    activeId,
    calculateWeekStarting,
    updateRota,
    generateRota,
    onDragStart,
    onDragEnd,
    isShiftPressed,
  } = useMasterRota(selectedVenueId, selectedWeek);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const dates = Array.from(
    new Set(
      rota?.data?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      ) || []
    )
  ).sort();

  return (
    <div className="container mx-auto p-4">
      <Toolbar
        venueName={rota?.data?.name?.split("-")[0]}
        weekStarting={calculateWeekStarting()}
        rota={rota.data}
      />
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="my-2">
          <div id="rota-content" className="overflow-x-auto">
            <div className="hidden lg:block">
              <RotaTable
                rota={rota?.data?.rotaData}
                dates={dates}
                isShiftPressed={isShiftPressed}
                updateRota={updateRota}
                archived={rota?.data?.archived}
              />
            </div>

            <div className="block lg:hidden">
              <RotaTableMobile
                rota={rota?.data?.rotaData}
                dates={dates}
                updateRota={updateRota}
                archived={rota?.data?.archived}
              />
            </div>
          </div>
        </div>

        {rota.data?._id ? (
          <div className="w-full bg-white">
            <div className="hidden lg:block">
              <ShiftTemplates
                selectedvenueID={selectedVenueId}
                className="w-full"
                commonShifts={commonShifts.data}
              />
              <RotaTemplates
                rota={rota.data}
                commonRotas={commonRotas.data}
                selectedvenueID={selectedVenueId}
              />
            </div>
          </div>
        ) : (
          <div>
            {rota.data?.futureDate ? (
              <>
                <p>
                  There is no rota for this week yet. Would you like to generate
                  one?
                </p>
                <button
                  onClick={generateRota}
                  className="p-2 border bg-slate-600 text-white rounded-md"
                >
                  Generate Rota
                </button>
              </>
            ) : (
              <p className="text-center font-medium text-xl">
                No Rota Found for this week
              </p>
            )}
          </div>
        )}

        <DragOverlay>
          {activeId && <DragPreview id={activeId} rota={rota} />}
        </DragOverlay>
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
