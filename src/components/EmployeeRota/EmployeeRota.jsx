import React, { useState, useEffect, useContext } from "react";
import { useRota } from "../../RotaContext";
import { addWeeks, startOfWeek, differenceInDays, format } from "date-fns";
import { useParams } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import ShiftSwap from "./ShiftSwap";
import StaticRotaTable from "../RotaMisc/StaticRotaTable";
import StaticResponsiveRotaTable from "../RotaMisc/StaticResponsiveRotaTable";
import ShiftDetailsModal from "../RotaMisc/ShiftDetailsModal.jsx";
const EmployeeRota = () => {
  const { weeks } = useRota();
  const { date } = useParams();
  const initialSelectedWeek = date
    ? Math.ceil(differenceInDays(new Date(date), new Date()) / 7)
    : 0;

  const [rota, setRota] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(initialSelectedWeek);
  const [error, setError] = useState(null);

  const calculateWeekStarting = () => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dynamicWeekStart = addWeeks(startOfCurrentWeek, selectedWeek);
    return format(dynamicWeekStart, "yyyy-MM-dd");
  };

  const requestObject = {
    weekStarting: calculateWeekStarting(),
  };

  useEffect(() => {
    console.log(requestObject);
    const fetchRota = async () => {
      try {
        const response = await ServerApi.post(
          `http://localhost:5000/api/v1/rotas/rota/employee`,
          requestObject,
          {
            withCredentials: true,
          }
        );
        setRota(response.data.rota);
        setError(null);
      } catch (err) {
        setError("Failed to fetch venues");
      }
    };

    fetchRota();
  }, [selectedWeek]);

  const dates = Array.from(
    new Set(
      rota?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      )
    )
  ).sort();

  return (
    <div className="overflow-x-auto p-4 w-full">
      <div className="hidden lg:block">
        <StaticRotaTable rota={rota} dates={dates} />
      </div>
      <div className="block lg:hidden">
        <StaticResponsiveRotaTable
          rota={rota?.rotaData}
          dates={dates}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
      </div>

      {rota?.rotaData ? (
        <>
          <div className="">
            <ShiftSwap rota={rota} weeks={weeks} selectedWeek={selectedWeek} />
          </div>
        </>
      ) : (
        <div>
          <p className=" text-center font-semibold text-md">
            No Rota has been publisheed for this week yet.
          </p>
          <p className=" text-center italic">
            Contact your rota admin for any questions
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeRota;
