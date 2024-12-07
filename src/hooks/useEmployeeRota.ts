import { useState, useEffect, useMemo } from "react";
import { addWeeks, startOfWeek, differenceInDays, format } from "date-fns";
import { useParams } from "react-router-dom";
import ServerApi from "../serverApi/axios";
import { generateWeeks } from "@/Utils/utils";

// Define types for the rota data
interface Shift {
  date: string;
  startTime: string;
  endTime: string;
  role: string;
}

interface RotaData {
  name?: string;
  rotaData?: Array<{
    name: string;
    schedule: Shift[];
  }>;
  archived?: boolean;
}

export const useEmployeeRota = () => {
  const { date } = useParams<{ date?: string }>();
  const initialSelectedWeek = date
    ? Math.ceil(differenceInDays(new Date(date), new Date()) / 7)
    : 0;

  const [rotas, setRotas] = useState<RotaData[]>([]);
  const [selectedRota, setSelectedRota] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(initialSelectedWeek);
  const [error, setError] = useState<string | null>(null);

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
        setRotas(response.data.rota || []);
        setError(null);
      } catch (err) {
        console.error(err);
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

  return {
    rotas,
    selectedRota,
    setSelectedRota,
    selectedWeek,
    setSelectedWeek,
    startOfWeekDate,
    dates,
    rotaNames,
    weeks,
    error,
  };
};
