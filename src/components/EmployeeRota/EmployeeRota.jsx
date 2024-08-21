import React, { useState, useEffect } from "react";
import { useRota } from "../../RotaContext";
import { addWeeks, startOfWeek, differenceInDays, format } from "date-fns";
import { useParams } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import ShiftSwap from "./ShiftSwap";
import StaticRotaTable from "../RotaMisc/StaticRotaTable";
import StaticResponsiveRotaTable from "../RotaMisc/StaticResponsiveRotaTable";
import EmployeeToolbar from "../RotaMisc/EmployeeToolbar.jsx";

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
  const startOfWeekDate = calculateWeekStarting();

  useEffect(() => {
    const fetchRota = async () => {
      const startOfWeek = calculateWeekStarting(); // Renamed variable

      try {
        const response = await ServerApi.get(
          `http://localhost:5000/api/v1/rotas/rota/employee/${startOfWeek}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setRota(response.data.rota);
        setError(null);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch venues");
        setRota([]);
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
      <EmployeeToolbar
        venueName={rota?.name?.split("-")[0]}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        startOfWeek={startOfWeekDate} // Pass renamed variable as a prop
        rota={rota}
        setRota={setRota}
      />
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
            {!rota.archived && (
              <ShiftSwap
                rota={rota}
                weeks={weeks}
                selectedWeek={selectedWeek}
              />
            )}
          </div>
        </>
      ) : (
        <div>
          <p className="text-center font-semibold text-md">
            No Rota has been published for this week yet.
          </p>
          <p className="text-center italic">
            Contact your rota admin for any questions
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeRota;
