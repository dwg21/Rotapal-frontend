import React, { useState } from "react";

const Forecast = () => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const hoursOfDay = Array.from({ length: 16 }, (_, i) => i + 9); // Array of hours from 9 (9 AM) to 24 (midnight)

  const [forecastData, setForecastData] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = Array(24).fill(0); // Initialize each day with 24 hours, each with 0 staff needed
      return acc;
    }, {})
  );

  const [selectedCells, setSelectedCells] = useState([]);
  const [staffCount, setStaffCount] = useState("");

  const handleCellClick = (day, hour) => {
    const cell = `${day}-${hour}`;
    setSelectedCells((prevSelectedCells) =>
      prevSelectedCells.includes(cell)
        ? prevSelectedCells.filter((c) => c !== cell)
        : [...prevSelectedCells, cell]
    );
  };

  const handleInputChange = (e) => {
    setStaffCount(e.target.value);
  };

  const applyStaffCount = () => {
    const newForecastData = { ...forecastData };
    selectedCells.forEach((cell) => {
      const [day, hour] = cell.split("-");
      newForecastData[day][parseInt(hour, 10)] = parseInt(staffCount, 10);
    });
    setForecastData(newForecastData);
    setSelectedCells([]);
    setStaffCount("");
  };

  return (
    <div className="forecast">
      <h2>Forecast</h2>
      <table className="forecast-table">
        <thead>
          <tr>
            <th>Hour/Day</th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hoursOfDay.map((hour) => (
            <tr key={hour}>
              <td>{`${hour}:00`}</td>
              {daysOfWeek.map((day) => (
                <td
                  key={`${day}-${hour}`}
                  className={
                    selectedCells.includes(`${day}-${hour}`)
                      ? "selected border text-center"
                      : "border text-center"
                  }
                  onClick={() => handleCellClick(day, hour)}
                >
                  {forecastData[day][hour]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="input-section">
        <input
          type="number"
          value={staffCount}
          onChange={handleInputChange}
          placeholder="Staff Count"
          className="border px-2 py-1"
        />
        <button
          onClick={applyStaffCount}
          className="px-4 py-2 border rounded bg-blue-500 text-white"
        >
          Apply to Selected
        </button>
      </div>
    </div>
  );
};

export default Forecast;
