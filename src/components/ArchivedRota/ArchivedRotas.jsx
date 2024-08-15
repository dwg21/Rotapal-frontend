import React, { useCallback, useState, useEffect } from "react";
import Calendar from "react-calendar";
import ServerApi from "../../serverApi/axios";
import { useRota } from "../../RotaContext";
import "react-calendar/dist/Calendar.css"; // import calendar CSS
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import StaticRotaTable from "../RotaMisc/StaticRotaTable";

const getDayLabel = (date) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayNames[date.getDay()]} ${day}/${
    month < 10 ? "0" + month : month
  }`;
};

const ArchivedRotas = () => {
  const { selectedvenueID } = useRota();
  const [archivedRotas, setArchivedRotas] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [selectedRota, setSelectedRota] = useState(0);
  const [error, setError] = useState(null);
  const { weeks } = useRota();

  const fetchRota = useCallback(async () => {
    const requestObject = {
      venueId: selectedvenueID,
    };
    try {
      const response = await ServerApi.post(
        `http://localhost:5000/api/v1/rotas/archivedRoas`,
        requestObject,
        { withCredentials: true }
      );
      console.log(response.data.rotas);
      setArchivedRotas(response.data.rotas);

      // Determine the earliest date from the rotas
      if (response.data.rotas.length > 0) {
        const earliestDate = response.data.rotas.reduce((earliest, rota) => {
          const rotaStart = new Date(rota.weekStarting);
          return rotaStart < earliest ? rotaStart : earliest;
        }, new Date(response.data.rotas[0].weekStarting));
        setMinDate(earliestDate);
      }
    } catch (err) {
      console.log(err.response);
    }
  }, [selectedvenueID]);

  useEffect(() => {
    fetchRota();
  }, [fetchRota]);

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const startOfWeek = normalizeDate(new Date(date));
      startOfWeek.setDate(
        date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
      ); // Adjust to Monday

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const hasRota = archivedRotas.some((rota) => {
        const rotaStart = normalizeDate(new Date(rota.weekStarting));
        return startOfWeek <= rotaStart && rotaStart <= endOfWeek;
      });

      return (
        <div className="relative">
          <div
            className={`absolute top-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 rounded-full ${
              hasRota ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
        </div>
      );
    }
  };

  const handleDateClick = (date) => {
    const startOfWeek = normalizeDate(new Date(date));
    startOfWeek.setDate(
      date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
    ); // Adjust to Monday

    console.log("Clicked date:", date);
    console.log("Start of week:", startOfWeek);

    const index = archivedRotas.findIndex((rota) => {
      const rotaStart = normalizeDate(new Date(rota.weekStarting));
      console.log("Comparing with rota start:", rotaStart);
      return startOfWeek.getTime() === rotaStart.getTime();
    });

    console.log("Selected rota index:", index);
    setSelectedRota(index);
  };

  const dates = Array.from(
    new Set(
      archivedRotas[selectedRota]?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      )
    )
  ).sort();

  return (
    <div className="p-4">
      {minDate && (
        <Calendar
          className="react-calendar"
          tileContent={tileContent}
          showNeighboringMonth={false}
          minDate={minDate}
          defaultView="month"
          activeStartDate={minDate}
          onClickDay={handleDateClick}
        />
      )}
      <p>Selected Rota Index: {selectedRota}</p>
      <style>{`
        .react-calendar__tile {
          position: relative;
        }
      `}</style>

      <StaticRotaTable rota={archivedRotas[selectedRota]} dates={dates} />
    </div>
  );
};

export default ArchivedRotas;
