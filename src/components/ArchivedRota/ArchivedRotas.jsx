import React, { useCallback, useState, useEffect } from "react";
import Calendar from "react-calendar";
import ServerApi from "../../serverApi/axios";
import { useRota } from "../../RotaContext";
import "react-calendar/dist/Calendar.css"; // import calendar CSS
import StaticRotaTable from "../RotaMisc/StaticRotaTable";
import VenueStatistics from "./VenueStatistics";
import StaticResponsiveRotaTable from "../RotaMisc/StaticResponsiveRotaTable";

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const ArchivedRotas = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [archivedRotas, setArchivedRotas] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [selectedRota, setSelectedRota] = useState(0);
  const [error, setError] = useState(null);

  const fetchRota = useCallback(async () => {
    try {
      const response = await ServerApi.get(
        `http://localhost:5000/api/v1/rotas/archivedRoas/${selectedVenueId}`,
        { withCredentials: true }
      );
      console.log(response);
      let rotas = response.data.rotas;

      // Sort the rotas by weekStarting in ascending order
      rotas = rotas.sort(
        (a, b) => new Date(a.weekStarting) - new Date(b.weekStarting)
      );

      setArchivedRotas(rotas);
      console.log(rotas);

      // Determine the earliest date from the rotas
      if (rotas.length > 0) {
        const earliestDate = rotas.reduce((earliest, rota) => {
          const rotaStart = new Date(rota.weekStarting);
          return rotaStart < earliest ? rotaStart : earliest;
        }, new Date(rotas[0].weekStarting));
        setMinDate(earliestDate);
      }
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "An error occurred");
    }
  }, [selectedVenueId]);

  useEffect(() => {
    fetchRota();
  }, [fetchRota]);

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
        <div className="relative h-1.5">
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

    const index = archivedRotas.findIndex((rota) => {
      const rotaStart = normalizeDate(new Date(rota.weekStarting));
      return startOfWeek.getTime() === rotaStart.getTime();
    });

    setSelectedRota(index);
    console.log(archivedRotas[selectedRota]);
  };

  const dates = Array.from(
    new Set(
      archivedRotas[selectedRota]?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      )
    )
  ).sort();

  return (
    <div className="p-4 w-full flex flex-col justify-center items-center ">
      <h1 className=" text-lg font-bold ">Archived Data and Statistics</h1>{" "}
      <div className=" ">
        <VenueStatistics />
      </div>
      {minDate && (
        <Calendar
          className="react-calendar"
          tileContent={tileContent}
          showNeighboringMonth={false}
          minDate={minDate}
          onClickDay={handleDateClick}
        />
      )}
      <p>Selected Rota Index: {selectedRota}</p>
      <div className="hidden md:block">
        <StaticRotaTable rota={archivedRotas[selectedRota]} dates={dates} />
      </div>
      <div className=" w-full md:hidden">
        <StaticResponsiveRotaTable
          rota={archivedRotas[selectedRota]?.rotaData}
          dates={dates}
          selectedWeek={selectedRota}
          setSelectedWeek={setSelectedRota}
        />
      </div>
    </div>
  );
};

export default ArchivedRotas;
