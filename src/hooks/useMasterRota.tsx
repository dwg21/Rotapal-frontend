import { useState, useEffect, useCallback, useRef } from "react";
import ServerApi from "../serverApi/axios";
import { addWeeks, startOfWeek, format, subWeeks } from "date-fns";

// Interfaces for type definitions
interface ShiftData {
  // Add specific properties based on your shift data structure
  [key: string]: any;
}

interface Employee {
  // Add specific properties of an employee
  _id: string;
  [key: string]: any;
}

interface ScheduleItem {
  shiftData: ShiftData | null;
  // Add other potential properties
}

interface RotaPerson {
  employee: string;
  schedule: ScheduleItem[];
}

interface Rota {
  _id: string;
  rotaData: RotaPerson[];
  archived?: boolean;
}

interface CommonShift {
  id: string;
  shiftData: ShiftData;
}

interface CommonRota {
  id: string;
  rotaData: RotaPerson[];
}

interface DataState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface Status {
  loading: boolean;
  success: boolean;
}

interface DragEvent {
  active: {
    id: string;
    data: {
      current?: {
        droppableContainer?: {
          id: string;
        };
      };
    };
  };
  over?: {
    id: string;
  };
}

const useMasterRota = (selectedVenueId: string, selectedWeek: number) => {
  const [rota, setRota] = useState<DataState<Rota>>({
    data: {} as Rota,
    loading: true,
    error: null,
  });

  const [commonShifts, setCommonShifts] = useState<DataState<CommonShift[]>>({
    data: [],
    loading: true,
    error: null,
  });

  const [commonRotas, setCommonRotas] = useState<DataState<CommonRota[]>>({
    data: [],
    loading: true,
    error: null,
  });

  const [status, setStatus] = useState<Status>({
    loading: false,
    success: false,
  });
  const [error, setError] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false);

  // Use ref to store updateRota to avoid circular dependency
  const updateRotaRef = useRef<((updatedRota: Rota) => Promise<void>) | null>(
    null
  );

  const calculateWeekStarting = useCallback((): string => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStartingDate =
      selectedWeek >= 0
        ? addWeeks(startOfCurrentWeek, selectedWeek)
        : subWeeks(startOfCurrentWeek, Math.abs(selectedWeek));
    return format(weekStartingDate, "yyyy-MM-dd");
  }, [selectedWeek]);

  const onDragStart = useCallback(
    (event: DragEvent) => {
      if (rota.data?.archived) {
        return; // Prevent dragging if rota is archived
      }
      setActiveId(event.active?.id || null);
    },
    [rota.data]
  );

  const onDragEnd = useCallback(
    (event: DragEvent) => {
      const { active, over } = event;
      if (!over || !active) {
        return;
      }

      const [sourcePersonIndex, sourceDayIndex] = active.id
        .split("-")
        .map(Number);
      const [destPersonIndex, destDayIndex] = over.id.split("-").map(Number);

      let updatedRotaData = [...rota.data.rotaData];

      // Existing drag and drop logic from previous implementation
      if (active.data.current?.droppableContainer?.id === "commonShifts") {
        const shift = commonShifts.data.find((shift) => shift.id === active.id);
        if (!shift) return;

        updatedRotaData[destPersonIndex].schedule[destDayIndex] = {
          ...updatedRotaData[destPersonIndex].schedule[destDayIndex],
          shiftData: { ...shift.shiftData },
        };
      } else if (
        active.data.current?.droppableContainer?.id === "commonRotas"
      ) {
        const rotaTemplate = commonRotas.data.find((r) => r.id === active.id);
        if (!rotaTemplate) return;

        updatedRotaData = rota.data.rotaData.map((person) => {
          const templatePerson = rotaTemplate.rotaData.find(
            (p) => p.employee.toString() === person.employee.toString()
          );

          if (!templatePerson) return person;

          const updatedSchedule = person.schedule.map((shift, index) => ({
            ...shift,
            shiftData: { ...templatePerson.schedule[index].shiftData },
          }));

          return {
            ...person,
            schedule: updatedSchedule,
          };
        });
      } else {
        if (isShiftPressed) {
          // Copy shift
          updatedRotaData[destPersonIndex].schedule[destDayIndex] = {
            ...updatedRotaData[destPersonIndex].schedule[destDayIndex],
            shiftData: {
              ...updatedRotaData[sourcePersonIndex].schedule[sourceDayIndex]
                .shiftData,
            },
          };
        } else {
          // Swap shifts
          const tempShift =
            updatedRotaData[sourcePersonIndex].schedule[sourceDayIndex]
              .shiftData;
          updatedRotaData[sourcePersonIndex].schedule[
            sourceDayIndex
          ].shiftData =
            updatedRotaData[destPersonIndex].schedule[destDayIndex].shiftData;
          updatedRotaData[destPersonIndex].schedule[destDayIndex].shiftData =
            tempShift;
        }
      }

      // Update rota and send to server
      const updatedRota = { ...rota.data, rotaData: updatedRotaData };
      setRota((prev) => ({ ...prev, data: updatedRota }));

      // Use ref to call updateRota safely
      if (updateRotaRef.current) {
        updateRotaRef.current(updatedRota);
      }
    },
    [rota.data, commonShifts.data, commonRotas.data, isShiftPressed]
  );

  const updateRota = useCallback(
    async (updatedRota: Rota) => {
      setStatus({ loading: true, success: false });
      try {
        await ServerApi.post(
          `/api/v1/rotas/${rota.data._id}`,
          { newRota: updatedRota.rotaData },
          { withCredentials: true }
        );
        setStatus({ loading: false, success: true });
      } catch (err) {
        console.error("Failed to update rota:", err);
        setError("Failed to update rota");
        setStatus({ loading: false, success: false });
      }
    },
    [rota.data]
  );

  // Store updateRota in ref after creation
  useEffect(() => {
    updateRotaRef.current = updateRota;
  }, [updateRota]);

  const fetchRota = useCallback(async () => {
    const weekStarting = calculateWeekStarting();
    setRota((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await ServerApi.get(
        `http://localhost:5000/api/v1/rotas/rota/${selectedVenueId}/${weekStarting}`,
        { withCredentials: true }
      );
      setRota({
        data: response.data.success ? response.data.rota : response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to fetch rota:", err);
      setRota({
        data: {} as Rota,
        loading: false,
        error: "Failed to fetch rota.",
      });
    }
  }, [selectedVenueId, calculateWeekStarting]);

  const fetchTemplates = useCallback(async () => {
    setCommonShifts((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await ServerApi.get(
        `api/v1/venue/${selectedVenueId}/common-shifts`,
        { withCredentials: true }
      );
      setCommonShifts({
        data: response.data.commonShifts,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      setCommonShifts({
        data: [],
        loading: false,
        error: "Failed to fetch templates.",
      });
    }
  }, [selectedVenueId]);

  const fetchCommonRotas = useCallback(async () => {
    setCommonRotas((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await ServerApi.get(
        `api/v1/venue/${selectedVenueId}/common-rotas`,
        { withCredentials: true }
      );
      setCommonRotas({
        data: response.data.commonRotas,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to fetch common rotas:", err);
      setCommonRotas({
        data: [],
        loading: false,
        error: "Failed to fetch common rotas.",
      });
    }
  }, [selectedVenueId]);

  const generateRota = async () => {
    const weekStarting = calculateWeekStarting();
    setRota((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await ServerApi.put(
        `http://localhost:5000/api/v1/rotas/rota/generateRota/${selectedVenueId}/${weekStarting}`,
        { withCredentials: true }
      );
      setRota({
        data: response.data.newRota,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to generate rota:", err);
      setRota({
        data: {} as Rota,
        loading: false,
        error: "Failed to generate rota.",
      });
    }
  };

  useEffect(() => {
    fetchRota();
  }, [fetchRota]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    fetchCommonRotas();
  }, [fetchCommonRotas]);

  // Key event listeners for shift key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") setIsShiftPressed(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return {
    rota,
    commonShifts,
    commonRotas,
    status,
    error,
    activeId,
    calculateWeekStarting,
    updateRota,
    generateRota,
    onDragStart,
    onDragEnd,
    isShiftPressed,
  };
};

export default useMasterRota;
