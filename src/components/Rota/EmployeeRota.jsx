import React, { useState, useEffect, useContext } from "react";
import { useRota } from "../../RotaContext";
import { addWeeks, startOfWeek, differenceInDays, format } from "date-fns";
import { useParams } from "react-router-dom";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import ServerApi from "../../serverApi/axios";
import { userContext } from "../../UserContext";

const EmployeeRota = () => {
  const { state } = userContext(); // Use useContext to access UserContext
  const { weeks } = useRota();
  const { date } = useParams();
  const initialSelectedWeek = date
    ? Math.ceil(differenceInDays(new Date(date), new Date()) / 7)
    : 0;

  const [rota, setRota] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(initialSelectedWeek);
  const [error, setError] = useState(null);
  const [selectedColleague, setSelectedColleague] = useState("");
  const [colleagueShift, setColleagueShift] = useState("");
  const [myShift, setMyShift] = useState("");
  const [colleagueShiftId, setColleagueShiftId] = useState("");
  const [myShiftId, setMyShiftId] = useState("");

  const calculateWeekStarting = () => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dynamicWeekStart = addWeeks(startOfCurrentWeek, selectedWeek);
    return format(dynamicWeekStart, "yyyy-MM-dd");
  };

  const requestObject = {
    weekStarting: calculateWeekStarting(),
  };

  useEffect(() => {
    const fetchRota = async () => {
      try {
        const response = await ServerApi.post(
          `http://localhost:5000/api/v1/rotas/rota/employee`,
          requestObject,
          {
            withCredentials: true,
          }
        );
        setRota(response.data.rota.rotaData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch venues");
      }
    };

    fetchRota();
  }, [selectedWeek]);

  const getDayLabel = (date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayNames[date.getDay()]} ${day}/${
      month < 10 ? "0" + month : month
    }`;
  };

  const handleChangeWeek = (direction) => {
    if (direction === "right" && selectedWeek < 3) {
      setSelectedWeek(selectedWeek + 1);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek(selectedWeek - 1);
    }
  };

  const handleSubmitSwapRequest = async () => {
    const swapRequest = {
      fromShiftId: myShiftId,
      toShiftId: colleagueShiftId,
      rotaId: rota.id,
    };

    console.log(swapRequest);

    // try {
    //   await ServerApi.post(`/api/v1/rotas/request-swap`, swapRequest, {
    //     withCredentials: true,
    //   });
    //   alert("Swap request sent for approval.");
    //   setSelectedColleague("");
    //   setColleagueShift("");
    //   setMyShift("");
    //   setColleagueShiftId("");
    //   setMyShiftId("");
    // } catch (error) {
    //   console.error("Failed to request swap:", error);
    // }
  };

  let startOfweek = getDayLabel(new Date(weeks[selectedWeek][0]));
  let endOfWeek = getDayLabel(
    new Date(weeks[selectedWeek][weeks[selectedWeek].length - 1])
  );

  // Filter shifts based on logged-in user's name
  const filteredShifts = rota.filter(
    (person) => person.employeeName === state.userData.name
  );

  return (
    <div className="overflow-x-auto p-4">
      {rota && (
        <div className="my-2">
          <div className="overflow-x-auto">
            <div className=" w-[300px] flex justify-center gap-1 p-2 ">
              <IoMdArrowDropleft
                className="mx-2 text-2xl cursor-pointer"
                onClick={() => handleChangeWeek("left")}
              />
              <p>
                {startOfweek} - {endOfWeek}
              </p>
              <IoMdArrowDropright
                className="mx-2 text-2xl cursor-pointer"
                onClick={() => handleChangeWeek("right")}
              />
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border bg-gray-100">Staff</th>
                  {rota &&
                    weeks[selectedWeek].map((day, dayIndex) => (
                      <th key={day} className="px-4 py-2 border bg-gray-100">
                        <div className="flex justify-center items-center">
                          {getDayLabel(new Date(day))}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              {!error ? (
                <tbody>
                  {rota.map((person, personIndex) => (
                    <tr key={person.id}>
                      <td className="border px-4 py-2">
                        {person.employeeName}
                      </td>
                      {weeks[selectedWeek].map((day, dayIndex) => (
                        <td key={day} className="border px-4 py-2">
                          <div className="min-h-[4rem]">
                            <div className="cursor-pointer flex items-center justify-center w-full h-full">
                              <div className="flex  text-center items-center justify-center p-1 rounded-md h-[80%] w-[80%]  bg-lightBlue text-white ">
                                {person.schedule[dayIndex].startTime
                                  ? `${person.schedule[dayIndex].startTime} - ${person.schedule[dayIndex].endTime}`
                                  : "Day Off"}
                              </div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ) : (
                <></>
              )}
            </table>
            {error && (
              <>
                <p className="p-2 text-l ">
                  This week's Rota is not yet published
                </p>
                <p>Please contact your venue admin for any questions</p>
              </>
            )}
          </div>
        </div>
      )}
      <div className="my-4 p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-bold">Request Shift Swap</h3>
        <div className="my-2">
          <label className="block mb-2">Select Colleague:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedColleague}
            onChange={(e) => setSelectedColleague(e.target.value)}
          >
            <option value="">Select a colleague</option>
            {rota.map((person, index) => (
              <option key={person.id} value={index}>
                {person.employeeName}
              </option>
            ))}
          </select>
        </div>
        {selectedColleague !== "" && (
          <div className="my-2">
            <label className="block mb-2">Select Colleague's Shift:</label>
            <select
              className="w-full p-2 border rounded"
              value={colleagueShift}
              onChange={(e) => {
                const [personIndex, dayIndex] = e.target.value.split("-");
                setColleagueShift(e.target.value);
                setColleagueShiftId(rota[personIndex].schedule[dayIndex]);
              }}
            >
              <option value="">Select a shift</option>
              {rota[selectedColleague].schedule.map((shift, dayIndex) => (
                <option
                  key={`${selectedColleague}-${dayIndex}`}
                  value={`${selectedColleague}-${dayIndex}`}
                >
                  {getDayLabel(new Date(weeks[selectedWeek][dayIndex]))} -{" "}
                  {shift.startTime
                    ? `${shift.startTime} - ${shift.endTime}`
                    : "Day Off"}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="my-2">
          <label className="block mb-2">Select Your Shift:</label>
          <select
            className="w-full p-2 border rounded"
            value={myShift}
            onChange={(e) => {
              const [personIndex, dayIndex] = e.target.value.split("-");
              setMyShift(e.target.value);
              setMyShiftId(filteredShifts[personIndex].schedule[dayIndex]);
            }}
          >
            <option value="">Select a shift</option>
            {filteredShifts.length > 0 &&
              filteredShifts[0].schedule.map((shift, dayIndex) => (
                <option
                  key={`${state.userData.name}-${dayIndex}`}
                  value={`${0}-${dayIndex}`}
                >
                  {getDayLabel(new Date(weeks[selectedWeek][dayIndex]))} -{" "}
                  {shift.startTime
                    ? `${shift.startTime} - ${shift.endTime}`
                    : "Day Off"}
                </option>
              ))}
          </select>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white p-2 rounded"
          onClick={handleSubmitSwapRequest}
          disabled={!selectedColleague || !colleagueShift || !myShift}
        >
          Submit Swap Request
        </button>
      </div>
    </div>
  );
};

export default EmployeeRota;
