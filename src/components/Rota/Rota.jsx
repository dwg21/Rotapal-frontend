import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRota } from "../../RotaContext";
import ShiftTemplates from "./ShiftTemplates";
import { ClipLoader } from "react-spinners";

import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

import ServerApi from "../../serverApi/axios";

// for model
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const Rota = () => {
  const { weeks, selectedVenue } = useRota();

  const [rota, setRota] = useState([]);
  const [error, setError] = useState("");

  const [editShift, setEditShift] = useState(null);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);

  const [rotaPublished, setRotaPublished] = useState(null);

  useEffect(() => {
    const fetchRota = async () => {
      try {
        const response = await ServerApi.get(
          `http://localhost:5000/api/v1/rotas/${selectedVenue.rota[selectedWeek]}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.rota);
        setRota(response.data.rota.rotaData);
        setRotaPublished(response.data.rota.published);

        console.log(response.data.rota);
      } catch (err) {
        setError("Failed to fetch venues");
      }
    };

    fetchRota();
  }, [selectedVenue, selectedWeek]);

  // for use in spinner
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // State to handle common shifts
  const [commonShifts, setCommonShifts] = useState([
    { id: "day-off", label: "Day Off", startTime: "", endTime: "" },
    { id: "9-to-5", label: "9 to 5", startTime: "09:00", endTime: "17:00" },
    { id: "9-to-3", label: "9 to 3", startTime: "09:00", endTime: "15:00" },
    { id: "5-to-10", label: "5 to 10", startTime: "17:00", endTime: "22:00" },
  ]);

  const handleEditShift = (personIndex, weekIndex, dayIndex) => {
    const startTime =
      rota[personIndex].schedule[weekIndex][dayIndex].startTime || "";
    const endTime =
      rota[personIndex].schedule[weekIndex][dayIndex].endTime || "";
    setEditShift({ personIndex, weekIndex, dayIndex });
    setEditStartTime(startTime);
    setEditEndTime(endTime);
    setModalIsOpen(true);
  };

  const handleSaveShift = () => {
    const updatedRota = rota.map((person, personIndex) => {
      if (personIndex === editShift.personIndex) {
        return {
          ...person,
          schedule: person.schedule.map((week, weekIndex) => {
            if (weekIndex === editShift.weekIndex) {
              return week.map((shift, dayIndex) => {
                if (dayIndex === editShift.dayIndex) {
                  return {
                    startTime: editStartTime || "",
                    endTime: editEndTime || "",
                    duration: calculateDuration(editStartTime, editEndTime),
                  };
                }
                return shift;
              });
            }
            return week;
          }),
        };
      }
      return person;
    });

    setRota(updatedRota);
    setModalIsOpen(false);
    setEditShift(null);
    setEditStartTime("");
    setEditEndTime("");
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const start = new Date(`01/01/2022 ${startTime}`);
    const end = new Date(`01/01/2022 ${endTime}`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
    return duration;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === "commonShifts") {
      const shift = commonShifts[source.index];
      const [destPersonIndex, destWeekIndex, destDayIndex] =
        destination.droppableId.split("-").map(Number);

      const updatedRota = [...rota];
      updatedRota[destPersonIndex].schedule[destWeekIndex][destDayIndex] = {
        startTime: shift.startTime,
        endTime: shift.endTime,
        duration: calculateDuration(shift.startTime, shift.endTime),
      };

      setRota(updatedRota);
      updateRota();
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedRota = [...rota];
    const sourcePersonIndex = parseInt(source.droppableId.split("-")[0], 10);
    const sourceWeekIndex = parseInt(source.droppableId.split("-")[1], 10);
    const sourceDayIndex = parseInt(source.droppableId.split("-")[2], 10);
    const destPersonIndex = parseInt(destination.droppableId.split("-")[0], 10);
    const destWeekIndex = parseInt(destination.droppableId.split("-")[1], 10);
    const destDayIndex = parseInt(destination.droppableId.split("-")[2], 10);

    const sourceShift =
      updatedRota[sourcePersonIndex].schedule[sourceWeekIndex][sourceDayIndex];
    updatedRota[sourcePersonIndex].schedule[sourceWeekIndex][sourceDayIndex] =
      updatedRota[destPersonIndex].schedule[destWeekIndex][destDayIndex];
    updatedRota[destPersonIndex].schedule[destWeekIndex][destDayIndex] =
      sourceShift;
    setRota(updatedRota);
    updateRota();
  };

  const getDayLabel = (date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayNames[date.getDay()]} ${day}/${
      month < 10 ? "0" + month : month
    }`;
  };

  const totalHours = rota.reduce((acc, person) => {
    return (
      acc +
      person.schedule[selectedWeek].reduce(
        (weekAcc, shift) => weekAcc + shift.duration,
        0
      )
    );
  }, 0);

  const totalStaffCost = rota
    .reduce((acc, person) => {
      return (
        acc +
        person.hourlyWage *
          person.schedule[selectedWeek].reduce(
            (weekAcc, shift) => weekAcc + shift.duration,
            0
          )
      );
    }, 0)
    .toFixed(2);

  const handleChangeWeek = (direction) => {
    if (direction === "right" && selectedWeek < 3) {
      setSelectedWeek(selectedWeek + 1);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek(selectedWeek - 1);
    }
  };

  const updateRota = async () => {
    //console.log(4);
    setLoading(true);
    setSuccess(false);
    try {
      await ServerApi.post(
        `/api/v1/rotas/${selectedVenue.rota[selectedWeek]}`,
        { newRota: rota },
        { withCredentials: true }
      );
      setSuccess(true);
      console.log("Rota updated successfully");
    } catch (error) {
      setError("Failed to update rota");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickPublishRota = async () => {
    //setRotaPublished(true);
    try {
      setRotaPublished(true);
      await ServerApi.post(
        `/api/v1/rotas/${selectedVenue.rota[selectedWeek]}/publish`,
        { isPublished: true },
        { withCredentials: true }
      );
      console.log("Rota publihsed successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {selectedVenue && selectedVenue.name && (
        <p className="text-xl font-bold">{selectedVenue.name}</p>
      )}
      {rotaPublished ? (
        <button className="border p-2 my-2 rounded-md bg-green-400">
          <div className="flex gap-2">
            <p>Rota is published</p>
            <TiTick className=" text-2xl" />
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="my-2">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border bg-gray-100">Staff</th>
                  {rota &&
                    weeks[selectedWeek].map((day, dayIndex) => (
                      <th key={day} className="px-4 py-2 border bg-gray-100">
                        <div className="flex justify-center items-center">
                          {dayIndex === 0 && (
                            <FaArrowCircleLeft
                              className="mx-2 text-2xl cursor-pointer"
                              onClick={() => handleChangeWeek("left")}
                            />
                          )}
                          {getDayLabel(new Date(day))}
                          {dayIndex === weeks[selectedWeek].length - 1 &&
                            selectedWeek < weeks.length - 1 && (
                              <FaArrowCircleRight
                                className="mx-2 text-2xl cursor-pointer"
                                onClick={() => handleChangeWeek("right")}
                              />
                            )}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rota.map((person, personIndex) => (
                  <tr key={person.id}>
                    <td className="border px-4 py-2">{person.employeeName}</td>
                    {weeks[selectedWeek].map((day, dayIndex) => (
                      <td
                        key={day}
                        className="border px-4 py-2"
                        onDoubleClick={() =>
                          handleEditShift(personIndex, selectedWeek, dayIndex)
                        }
                      >
                        <Droppable
                          droppableId={`${personIndex}-${selectedWeek}-${dayIndex}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="min-h-[4rem]"
                            >
                              <Draggable
                                draggableId={`${personIndex}-${selectedWeek}-${dayIndex}`}
                                index={dayIndex}
                                key={`${personIndex}-${selectedWeek}-${dayIndex}`}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="cursor-pointer flex items-center justify-center w-full h-full"
                                  >
                                    <div className="flex  text-center items-center justify-center p-1 rounded-md h-[80%] w-[80%]  bg-lightBlue text-white ">
                                      {person.schedule[selectedWeek][dayIndex]
                                        .startTime
                                        ? `${person.schedule[selectedWeek][dayIndex].startTime} - ${person.schedule[selectedWeek][dayIndex].endTime}`
                                        : "Day Off"}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
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

          <ShiftTemplates
            commonShifts={commonShifts}
            setCommonShifts={setCommonShifts}
          />
        </div>
      </DragDropContext>

      {loading && (
        <div className="flex justify-center items-center">
          <ClipLoader color="#000" loading={loading} />
        </div>
      )}
      {success && (
        <div className="flex justify-center items-center">
          <p className="text-green-500">Rota updated successfully!</p>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        style={customStyles}
      >
        <div className="flex flex-col">
          <h2 className="text-center">Edit Shift</h2>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditStartTime("");
              setEditEndTime("");
              handleSaveShift();
            }}
            className="p-1 m-2 border rounded-md bg-red-500 text-white"
          >
            Mark as Day Off
          </button>
          <button
            className="p-1 m-2 border rounded-md bg-blue-500 text-white"
            onClick={handleSaveShift}
          >
            Save changes
          </button>
        </div>
      </Modal>

      <div className="mt-4">
        <h3>Total Hours: {totalHours.toFixed(2)}</h3>
        <h3>Total Staff Cost: £{totalStaffCost}</h3>
      </div>
    </div>
  );
};

export default Rota;
