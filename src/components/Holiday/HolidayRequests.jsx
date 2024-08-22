import React, { useState } from "react";

import ServerApi from "../../serverApi/axios";

const HolidayRequests = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  console.log(selectedVenueId);
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ServerApi.post("/api/v1/holidays/book-holiday", {
        date,
        venueId: selectedVenueId,
      });
      console.log("Holiday booked successfully:", response.data);
      // Optionally, reset form fields or show a success message
    } catch (error) {
      console.error(
        "Error booking holiday:",
        error.response ? error.response.data.error : error.message
      );
      setError(
        error.response ? error.response.data.error : "Error booking holiday"
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className=" font-semibold mb-4 text-xl">Request Holiday</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={handleDateChange} />
        </div>
        <button
          className="my-2 border p-2 rounded-md bg-slate-300"
          type="submit"
        >
          Request Holiday
        </button>
      </form>
    </div>
  );
};

export default HolidayRequests;
