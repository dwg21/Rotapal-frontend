import React, { useState, useContext } from "react";
import { userContext } from "../../Context/UserContext";
import ServerApi from "../../serverApi/axios";
import { getDayLabel } from "../../Utils/utils";

const ShiftSwap = ({ rota, weeks = [], selectedWeek, rotaDetails }) => {
  const { state } = userContext();
  const [swapDetails, setSwapDetails] = useState({
    selectedColleague: "",
    colleagueShift: "",
    myShift: "",
    colleagueShiftId: "",
    myShiftId: "",
  });

  const filteredShifts = rota?.rotaData?.filter(
    (person) => person.employeeName === state.userData.name
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSwapDetails((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };

      if (name === "selectedColleague") {
        newState.colleagueShift = "";
        newState.colleagueShiftId = "";
      } else if (name === "colleagueShift") {
        const [colleagueIndex, shiftIndex] = value.split("-");
        newState.colleagueShiftId =
          rota?.rotaData[colleagueIndex]?.schedule[shiftIndex]?._id;
      } else if (name === "myShift") {
        const [myIndex, myShiftIndex] = value.split("-");
        newState.myShiftId =
          filteredShifts[myIndex]?.schedule[myShiftIndex]?._id;
      }

      return newState;
    });
  };

  const handleSubmitSwapRequest = async () => {
    const { colleagueShiftId, myShiftId } = swapDetails;
    const swapRequest = {
      fromShiftId: myShiftId,
      toShiftId: colleagueShiftId,
      rotaId: rota._id,
      venueId: rota.venue,
    };

    console.log(swapRequest);

    try {
      const { data } = await ServerApi.post(
        `/api/v1/swap/swapShiftRequest`,
        swapRequest,
        { withCredentials: true }
      );
      alert("Swap request sent for approval.");
      resetForm();
      console.log(data);
    } catch (error) {
      console.error("Failed to request swap:", error);
    }
  };

  const resetForm = () => {
    setSwapDetails({
      selectedColleague: "",
      colleagueShift: "",
      myShift: "",
      colleagueShiftId: "",
      myShiftId: "",
    });
  };

  return (
    <div className="my-4 p-4 border rounded bg-gray-100">
      <h3 className="text-lg font-bold">Request Shift Swap</h3>
      <div className="my-2">
        <label className="block mb-2">Select Colleague:</label>
        <select
          className="w-full p-2 border rounded"
          name="selectedColleague"
          value={swapDetails.selectedColleague}
          onChange={handleChange}
        >
          <option value="">Select a colleague</option>
          {rota?.rotaData?.map((person, index) => (
            <option key={person._id} value={index}>
              {person.employeeName}
            </option>
          ))}
        </select>
      </div>
      {swapDetails.selectedColleague && (
        <div className="my-2">
          <label className="block mb-2">Select Colleague's Shift:</label>
          <select
            className="w-full p-2 border rounded"
            name="colleagueShift"
            value={swapDetails.colleagueShift}
            onChange={handleChange}
            disabled={!weeks[selectedWeek]} // Disable if weeks[selectedWeek] is undefined
          >
            <option value="">Select a shift</option>
            {weeks[selectedWeek] &&
              rota?.rotaData[swapDetails.selectedColleague]?.schedule?.map(
                (shift, dayIndex) => (
                  <option
                    key={`${swapDetails.selectedColleague}-${dayIndex}`}
                    value={`${swapDetails.selectedColleague}-${dayIndex}`}
                  >
                    {getDayLabel(new Date(weeks[selectedWeek][dayIndex]))} -{" "}
                    {shift.shiftData.startTime
                      ? `${shift.shiftData.startTime} - ${shift.shiftData.endTime}`
                      : "Day Off"}
                  </option>
                )
              )}
          </select>
        </div>
      )}
      <div className="my-2">
        <label className="block mb-2">Select Your Shift:</label>
        <select
          className="w-full p-2 border rounded"
          name="myShift"
          value={swapDetails.myShift}
          onChange={handleChange}
          disabled={!weeks[selectedWeek]} // Disable if weeks[selectedWeek] is undefined
        >
          <option value="">Select a shift</option>
          {weeks[selectedWeek] &&
            filteredShifts?.length > 0 &&
            filteredShifts[0]?.schedule.map((shift, dayIndex) => (
              <option
                key={`${state.userData.name}-${dayIndex}`}
                value={`${0}-${dayIndex}`}
              >
                {getDayLabel(new Date(weeks[selectedWeek][dayIndex]))} -{" "}
                {shift.shiftData.startTime
                  ? `${shift.shiftData.startTime} - ${shift.shiftData.endTime}`
                  : "Day Off"}
              </option>
            ))}
        </select>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white p-2 rounded"
        onClick={handleSubmitSwapRequest}
        disabled={
          !swapDetails.selectedColleague ||
          !swapDetails.colleagueShift ||
          !swapDetails.myShift
        }
      >
        Submit Swap Request
      </button>
    </div>
  );
};

export default ShiftSwap;
