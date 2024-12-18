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
  published: boolean;
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

      // Log drag event for debugging
      console.log("Drag event:", event);
      console.log("Active data:", active.data.current);
      console.log("Over data:", over?.data?.current);

      // Guard clauses for invalid drag actions
      if (!over || !active) return;
      if (rota.data?.archived) return; // Prevent actions on archived rota

      // Clone current rota data to avoid direct mutation
      let updatedRotaData = [...rota.data.rotaData];

      // Helper functions for different drag scenarios
      const handleCommonShiftDrag = () => {
        const [destPersonIndex, destDayIndex] = over.id.split("-").map(Number);
        const shift = commonShifts.data.find((s) => s.id === active.id);
        if (!shift) return;

        updatedRotaData[destPersonIndex].schedule[destDayIndex] = {
          ...updatedRotaData[destPersonIndex].schedule[destDayIndex],
          shiftData: { ...shift.shiftData },
        };
      };

      const handleCommonRotaDrag = () => {
        const rotaTemplate = commonRotas.data.find((r) => r.id === active.id);
        if (!rotaTemplate) return;

        updatedRotaData = updatedRotaData.map((person) => {
          const templatePerson = rotaTemplate.rotaData.find(
            (p) => p.employee.toString() === person.employee.toString()
          );
          if (!templatePerson) return person;

          const updatedSchedule = person.schedule.map((shift, index) => ({
            ...shift,
            shiftData: { ...templatePerson.schedule[index].shiftData },
          }));

          return { ...person, schedule: updatedSchedule };
        });
      };

      const handleEmployeeDrag = () => {
        const sourcePersonIndex = Number(active.id.split("-")[1]);
        const destPersonIndex = Number(over.id.split("-")[0]);

        if (sourcePersonIndex === destPersonIndex) return;

        if (isShiftPressed) {
          // Copy schedule from source to destination
          updatedRotaData = updatedRotaData.map((person, index) => {
            if (index === destPersonIndex) {
              return {
                ...person,
                schedule: person.schedule.map((shift, dayIndex) => ({
                  ...shift,
                  shiftData: rota.data.rotaData[sourcePersonIndex].schedule[
                    dayIndex
                  ]?.shiftData || {
                    startTime: "",
                    endTime: "",
                    label: "Day Off",
                  },
                })),
              };
            }
            return person;
          });
        } else {
          // Swap schedules
          const tempSchedule = updatedRotaData[sourcePersonIndex].schedule;
          updatedRotaData[sourcePersonIndex].schedule =
            updatedRotaData[destPersonIndex].schedule;
          updatedRotaData[destPersonIndex].schedule = tempSchedule;
        }
      };

      const handleWeekdayDrag = () => {
        const sourceDayIndex = active.data.current.dayIndex;
        const destDayIndex = Number(over.id.split("-")[1]);

        if (sourceDayIndex === destDayIndex) return;

        if (isShiftPressed) {
          // Copy entire day's shifts
          updatedRotaData = updatedRotaData.map((person) => ({
            ...person,
            schedule: person.schedule.map((shift, index) => {
              if (index === destDayIndex) {
                return {
                  ...shift,
                  shiftData:
                    person.schedule[sourceDayIndex].shiftData || undefined,
                };
              }
              return shift;
            }),
          }));
        } else {
          // Swap day's shifts
          updatedRotaData = updatedRotaData.map((person) => {
            const tempShift = person.schedule[sourceDayIndex].shiftData;
            person.schedule[sourceDayIndex].shiftData =
              person.schedule[destDayIndex].shiftData;
            person.schedule[destDayIndex].shiftData = tempShift;
            return { ...person };
          });
        }
      };

      const handleIndividualShiftDrag = () => {
        const [sourcePersonIndex, sourceDayIndex] = active.id
          .split("-")
          .map(Number);
        const [destPersonIndex, destDayIndex] = over.id.split("-").map(Number);

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
      };

      // Determine drag scenario
      const containerId = active.data.current?.droppableContainer?.id;
      if (containerId === "commonShifts") handleCommonShiftDrag();
      else if (containerId === "commonRotas") handleCommonRotaDrag();
      else if (active.data.current?.type === "employee") handleEmployeeDrag();
      else if (active.data.current?.type === "weekday") handleWeekdayDrag();
      else handleIndividualShiftDrag();

      // Update rota data and trigger server update
      const updatedRota = { ...rota.data, rotaData: updatedRotaData };
      setRota((prev) => ({ ...prev, data: updatedRota }));

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

  const PublishRota = async (RotaId: string) => {
    try {
      const { data } = await ServerApi.post(
        `/api/v1/rotas/${RotaId}/publish`,
        { isPublished: true },
        { withCredentials: true }
      );
      console.log(rota);
      setRota({
        ...rota,
        data: {
          ...rota.data,
          published: true,
        },
      });
    } catch (error) {
      console.error(error);
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
    PublishRota,
  };
};

export default useMasterRota;
