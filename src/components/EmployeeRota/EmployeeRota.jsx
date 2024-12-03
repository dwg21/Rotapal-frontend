import React, { useState, useEffect, useMemo } from "react";
import { addWeeks, startOfWeek, differenceInDays, format } from "date-fns";
import { useParams } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import ShiftSwap from "./ShiftSwap";
import StaticRotaTable from "../RotaMisc/StaticRotaTable";
import StaticResponsiveRotaTable from "../RotaMisc/StaticResponsiveRotaTable";
import EmployeeToolbar from "../RotaMisc/EmployeeToolbar";
import { generateWeeks } from "../../Utils/utils";

const EmployeeRota = () => {
  const { date } = useParams();
  const initialSelectedWeek = date
    ? Math.ceil(differenceInDays(new Date(date), new Date()) / 7)
    : 0;

  const [rotas, setRotas] = useState([]); // Ensure this is initialized as an empty array
  const [selectedRota, setSelectedRota] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(initialSelectedWeek);
  const [error, setError] = useState(null);

  const weeks = useMemo(() => generateWeeks(4 + selectedWeek), [selectedWeek]);

  const calculateWeekStarting = () => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dynamicWeekStart = addWeeks(startOfCurrentWeek, selectedWeek);
    return format(dynamicWeekStart, "yyyy-MM-dd");
  };
  const startOfWeekDate = calculateWeekStarting();

  useEffect(() => {
    const fetchRota = async () => {
      const startOfWeek = calculateWeekStarting();

      try {
        const response = await ServerApi.get(
          `http://localhost:5000/api/v1/rotas/rota/employee/${startOfWeek}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setRotas(response.data.rota || []); // Ensure rotas is always an array
        setError(null);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch venues");
        setRotas([]);
      }
    };

    fetchRota();
  }, [selectedWeek]);

  const dates = Array.from(
    new Set(
      rotas[selectedRota]?.rotaData?.flatMap((person) =>
        person.schedule.map((shift) => shift.date)
      )
    )
  ).sort();

  const rotaNames = rotas.map((rota) => rota.name?.split("-")[0]);

  return (
    <div className="overflow-x-auto p-4 w-full">
      <>
        <EmployeeToolbar
          venueName={rotas[selectedRota]?.name?.split("-")[0]}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          startOfWeek={startOfWeekDate}
          setSelectedRota={setSelectedRota}
          selectedRota={selectedRota}
          rotaNames={rotaNames}
        />
        <div className="hidden lg:block">
          <StaticRotaTable rota={rotas[selectedRota]} dates={dates} />
        </div>
        <div className="block lg:hidden">
          <StaticResponsiveRotaTable
            rota={rotas[selectedRota]?.rotaData}
            dates={dates}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        </div>
        {rotas[selectedRota]?.rotaData ? (
          <div>
            {!rotas[selectedRota].archived && (
              <ShiftSwap
                rota={rotas[selectedRota]}
                weeks={weeks}
                selectedWeek={selectedWeek}
              />
            )}
          </div>
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
      </>
    </div>
  );
};

export default EmployeeRota;
