import React, { useCallback, useState, useEffect } from "react";
import Calendar from "react-calendar";
import ServerApi from "../../serverApi/axios";
import "react-calendar/dist/Calendar.css"; // import calendar CSS
import StaticRotaTable from "../RotaMisc/StaticRotaTable";
import VenueStatistics from "./VenueStatistics";
import StaticResponsiveRotaTable from "../RotaMisc/StaticResponsiveRotaTable";

const ArchivedRotas = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [archivedRotas, setArchivedRotas] = useState([]);
  const [minDate, setMinDate] = useState(null);
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

  return (
    <div className="p-4 w-full flex flex-col justify-center items-center ">
      <h1 className=" text-lg font-bold ">Archived Data and Statistics</h1>{" "}
      <div className="  w-full">
        <VenueStatistics />
      </div>
    </div>
  );
};

export default ArchivedRotas;
