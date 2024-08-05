import React, { useState, useContext } from "react";
import { userContext } from "../../UserContext";
import ServerApi from "../../serverApi/axios";

import { getDayLabel } from "../../Utils/utils";

const ShiftSwap = ({ rota, weeks, selectedWeek, rotaDetails }) => {
  const { state } = userContext();

  // Consolidated state into a single object
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
    setSwapDetails((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "selectedColleague" && {
        colleagueShift: "",
        colleagueShiftId: "",
      }),
      ...(name === "colleagueShift" && {
        colleagueShiftId:
          rota[value.split("-")[0]].schedule[value.split("-")[1]]._id,
      }),
      ...(name === "myShift" && {
        myShiftId:
          filteredShifts[value.split("-")[0]].schedule[value.split("-")[1]]._id,
      }),
    }));
  };

  const handleSubmitSwapRequest = async () => {
    const { colleagueShiftId, myShiftId } = swapDetails;
    const swapRequest = {
      fromShiftId: myShiftId,
      toShiftId: colleagueShiftId,
      rotaId: rotaDetails._id,
      venueId: rotaDetails.venue,
    };

    console.log(swapRequest);

    try {
      const { data } = await ServerApi.post(
        `/api/v1/rotas/rota/swapshifts`,
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
            <option key={person.id} value={index}>
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
          >
            <option value="">Select a shift</option>
            {rota[swapDetails.selectedColleague].schedule.map(
              (shift, dayIndex) => (
                <option
                  key={`${swapDetails.selectedColleague}-${dayIndex}`}
                  value={`${swapDetails.selectedColleague}-${dayIndex}`}
                >
                  {getDayLabel(new Date(weeks[selectedWeek][dayIndex]))} -{" "}
                  {shift.startTime
                    ? `${shift.startTime} - ${shift.endTime}`
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
        >
          <option value="">Select a shift</option>
          {filteredShifts?.length > 0 &&
            filteredShifts[0]?.schedule.map((shift, dayIndex) => (
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
