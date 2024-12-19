import React, { useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ClipLoader } from "react-spinners";
import Toolbar from "../RotaMisc/Toolbar";
import RotaTable from "../Rotatable/RotaTable";
import RotaTableMobile from "../Rotatable/RotaTableMobile";
import useMasterRota from "../../hooks/useMasterRota";
import { useRotaContext } from "../../Context/RotaContext";
import DragPreview from "./DragPreview";
import Sidebar from "./Sidebar";

const MasterRota: React.FC = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID") || "default";

  const { selectedWeek, isSidebarOpen, setIsSidebarOpen } = useRotaContext();

  const {
    rota,
    setRota,
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
    PublishRota,
  } = useMasterRota(selectedVenueId, selectedWeek);

  console.log(rota);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const dates = Array.from(
    new Set(
      rota?.data?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      ) || []
    )
  ).sort();

  return (
    <div className="flex w-full min-h-screen p-4 md:p-6 bg-gray-50">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className=" px-4 py-2 h-full w-full flex flex-col items-center">
          <Toolbar
            venueName={rota?.data?.name?.split("-")[0]}
            weekStarting={calculateWeekStarting()}
            rota={rota.data}
            PublishRota={PublishRota}
          />

          <div className="flex justify-center">
            {rota.data?._id ? (
              <>
                <div className="hidden lg:flex w-full justify-center">
                  <RotaTable
                    rota={rota}
                    setRota={setRota}
                    dates={dates}
                    isShiftPressed={isShiftPressed}
                    updateRota={updateRota}
                    archived={rota?.data?.archived}
                  />
                  <Sidebar
                    isOpen={isSidebarOpen}
                    rota={rota.data}
                    selectedVenueId={selectedVenueId}
                    commonShifts={commonShifts.data || []}
                    commonRotas={commonRotas.data || []}
                  />
                </div>
                <div className="block lg:hidden w-full">
                  <RotaTableMobile
                    rota={rota?.data?.rotaData}
                    dates={dates}
                    updateRota={updateRota}
                    archived={rota?.data?.archived}
                  />
                </div>
              </>
            ) : (
              <div className="text-center w-full p-6 bg-white rounded-lg shadow-md">
                <p className="text-xl font-medium text-gray-500">
                  No Rota Found for this week
                </p>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeId && <DragPreview id={activeId} rota={rota} />}
          </DragOverlay>

          {status.loading && (
            <div className="flex justify-center items-center mt-4">
              <ClipLoader loading={status.loading} size={50} color="#3B82F6" />
            </div>
          )}

          {status.success && (
            <div className="text-center mt-4">
              <p className="text-green-600 font-medium">
                Rota updated successfully!
              </p>
            </div>
          )}

          {error && (
            <div className="text-center mt-4">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default MasterRota;
