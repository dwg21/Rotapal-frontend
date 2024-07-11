import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRota } from "../../RotaContext";
import ShiftTemplates from "./ShiftTemplates";
import RotaTemplates from "./RotaTemplates";
import { ClipLoader } from "react-spinners";
import { addWeeks, startOfWeek, addDays, format } from "date-fns";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useParams } from "react-router-dom";
import ServerApi from "../../serverApi/axios";

import {
  generateWeeks,
  calculateDuration,
  getDayLabel,
} from "../../Utils/utils";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const Rota = () => {
  const { selectedvenueID, setSelectedvenueID, selectedVenue } = useRota();
  console.log(selectedvenueID);
  const { venueId } = useParams();

  useEffect(() => {
    if (venueId) {
      setSelectedvenueID(venueId);
    }
  }, [venueId, setSelectedvenueID]);

  const [rota, setRota] = useState([]);
  const [rotaId, setRotaId] = useState(null);
  const [error, setError] = useState("");
  const [editShift, setEditShift] = useState(null);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const weeks = useMemo(() => generateWeeks(4 + selectedWeek), [selectedWeek]);

  const [rotaPublished, setRotaPublished] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [venueName, setVenueName] = useState(null);

  const [commonShifts, setCommonShifts] = useState([]);

  const [editLabel, setEditLabel] = useState("");

  const [generateRotaVisible, setGenerateRotaVisible] = useState(false);

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
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleEditShift = (personIndex, dayIndex) => {
    const startTime = rota[personIndex].schedule[dayIndex]?.startTime || "";
    const endTime = rota[personIndex].schedule[dayIndex]?.endTime || "";
    const label = rota[personIndex].schedule[dayIndex]?.label || "";
    setEditShift({ personIndex, dayIndex });
    setEditStartTime(startTime);
    setEditEndTime(endTime);
    setEditLabel(label);
    setModalIsOpen(true);
  };

  const handleSaveShift = async () => {
    const updatedRota = rota.map((person, personIndex) => {
      if (personIndex === editShift.personIndex) {
        return {
          ...person,
          schedule: person.schedule.map((shift, dayIndex) => {
            if (dayIndex === editShift.dayIndex) {
              return {
                ...shift,
                startTime: editStartTime,
                endTime: editEndTime,
                label: editLabel,
                duration: calculateDuration(editStartTime, editEndTime),
              };
            }
            return shift;
          }),
        };
      }
      return person;
    });

    setRota(updatedRota);
    console.log(updatedRota);
    await updateRota(updatedRota);
    setModalIsOpen(false);
    setEditShift(null);
    setEditStartTime("");
    setEditEndTime("");
    setEditLabel("");
  };

  const handleChangeWeek = (direction) => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
      console.log(selectedWeek);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek((prev) => prev - 1);
    }
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

  const handleClickPublishRota = async () => {
    try {
      await ServerApi.post(
        `/api/v1/rotas/${rotaId}/publish`,
        { isPublished: true },
        { withCredentials: true }
      );
      setRotaPublished(true);
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId.split("-");
    console.log(source.droppableId);
    const destId = destination.droppableId.split("-");

    const updatedRota = [...rota];

    if (source.droppableId === "commonShifts") {
      const shift = commonShifts[source.index];
      const destPersonIndex = parseInt(destId[0], 10);
      const destDayIndex = parseInt(destId[1], 10);

      const destShift = updatedRota[destPersonIndex].schedule[destDayIndex];
      if (destShift.holidayBooked) return;
      updatedRota[destPersonIndex].schedule[destDayIndex] = {
        ...shift,
        duration: calculateDuration(shift.startTime, shift.endTime),
      };
      updateRota(updatedRota);
    } else if (source.droppableId === "commonRotas") {
      //toDo add logic
      const rota = commonRotas[source.index];
      setRota(rota.rota);
      updateRota(rota.rota);
    }
    {
      const sourcePersonIndex = parseInt(sourceId[0], 10);
      const sourceDayIndex = parseInt(sourceId[1], 10);
      const destPersonIndex = parseInt(destId[0], 10);
      const destDayIndex = parseInt(destId[1], 10);

      const sourceShift =
        updatedRota[sourcePersonIndex].schedule[sourceDayIndex];
      const destShift = updatedRota[destPersonIndex].schedule[destDayIndex];

      //ensures you cant swap shifts with booked holidays
      if (sourceShift.holidayBooked || destShift.holidayBooked) {
        return;
      }

      updatedRota[sourcePersonIndex].schedule[sourceDayIndex] = destShift;
      updatedRota[destPersonIndex].schedule[destDayIndex] = sourceShift;
    }

    setRota(updatedRota);
    updateRota(updatedRota);
  };

  let startOfweek = getDayLabel(new Date(weeks[selectedWeek][0]));
  let endOfWeek = getDayLabel(
    new Date(weeks[selectedWeek][weeks[selectedWeek].length - 1])
  );

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
  }, []);

  useEffect(() => {
    fetchCommonRotas();
  }, [fetchCommonRotas]);

  return (
    <div className="container mx-auto p-4">
      {/* {selectedVenue && selectedVenue.name && (
        <p className="text-xl font-bold">{selectedVenue.employeeName}</p>
      )} */}
      <div className="flex items-center gap-6">
        <p className="mr-4 font-semibold">{venueName && venueName}</p>
        {rotaPublished ? (
          <button className="border p-2 my-2 rounded-md bg-green-400">
            <div className="flex gap-2">
              <p>Rota is published</p>
              <TiTick className="text-2xl" />
            </div>
          </button>
        ) : (
          <button
            className="border p-2 my-2 rounded-md bg-orange-400"
            onClick={handleClickPublishRota}
          >
            Publish Rota
          </button>
        )}
        <div className=" w-[300px] flex justify-center gap-1 p-2 ">
          <IoMdArrowDropleft
            className="mx-2 text-2xl cursor-pointer"
            onClick={() => handleChangeWeek("left")}
          />
          <p>
            {startOfweek} - {endOfWeek}
          </p>{" "}
          <IoMdArrowDropright
            className="mx-2 text-2xl cursor-pointer"
            onClick={() => handleChangeWeek("right")}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="my-2">
          <div className="overflow-x-auto">
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
                        <Droppable
                          droppableId={`${personIndex}-${dayIndex}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="min-h-[4rem]"
                            >
                              {person.schedule[dayIndex] && (
                                <Draggable
                                  draggableId={`${personIndex}-${dayIndex}`}
                                  index={dayIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="cursor-pointer flex items-center justify-center w-full h-full"
                                    >
                                      <div
                                        className={`flex  text-center items-center justify-center p-1 rounded-md  w-[120px] h-[80px] ${
                                          person.schedule[dayIndex].startTime
                                            ? `bg-lightBlue`
                                            : `bg-darkBlue `
                                        }  text-white ${
                                          person.schedule[dayIndex]
                                            .holidayBooked && `bg-orange-400`
                                        }`}
                                      >
                                        {person.schedule[dayIndex].startTime ? (
                                          <div className="flex flex-col gap-2">
                                            <p>
                                              {`${person.schedule[dayIndex].startTime} - ${person.schedule[dayIndex].endTime}`}
                                            </p>
                                            <p className="  font-bold">
                                              {`${
                                                person.schedule[dayIndex].label
                                                  ? person.schedule[dayIndex]
                                                      .label
                                                  : ""
                                              }`}
                                            </p>
                                          </div>
                                        ) : (
                                          <p>
                                            {person.schedule[dayIndex]
                                              .holidayBooked
                                              ? "Holiday Booked"
                                              : "Day Off"}
                                          </p>
                                        )}
                                      </div>
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
        </div>
      </DragDropContext>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-center text-lg font-bold">EDIT SHIFT</h2>
          <label className="text-center mt-4 mb-1">
            Start Time:
            <input
              type="time"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
            />
          </label>
          <br />
          <label className="text-center">
            End Time:
            <input
              type="time"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
            />
          </label>
          <br />
          <label className="text-center">
            Label:
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
            />
          </label>
          <br />
          <button
            onClick={handleSaveShift}
            className="bg-blue-500 text-white p-2 rounded w-[200px] my-3"
          >
            Save
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-red-500 text-white p-2 rounded w-[200px]"
          >
            Cancel
          </button>
        </div>
      </Modal>

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
