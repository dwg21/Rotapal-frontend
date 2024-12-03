import { useState, useEffect, useCallback } from "react";
import ServerApi from "../serverApi/axios";

// Define the types for your statistics data
interface Statistic {
  weekStarting: string;
  totalStaffHours: number;
  totalStaffCost: number;
  totalHolidayDays: number;
  totalHolidayCost: number;
}

interface VenueStatistics {
  venueName: string;
  statistics: Statistic[];
}

interface StatisticsState {
  businessData: Record<string, VenueStatistics>; // Using Record<string, VenueStatistics> for key-value mapping
  loading: boolean;
  error: any; // You can refine this to a more specific error type if needed
}

const useStatistics = () => {
  const [statisticsState, setStatisticsState] = useState<StatisticsState>({
    businessData: {},
    loading: true,
    error: null,
  });

  const fetchStatistics = useCallback(async () => {
    setStatisticsState((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
    }));
    try {
      const response = await ServerApi.get(`api/v1/business/getStatistics/`);
      setStatisticsState({
        businessData: response.data.statistics,
        loading: false,
        error: null,
      });

      console.log(statisticsState.businessData);
    } catch (err: any) {
      console.error("Failed to fetch venue statistics", err);
      setStatisticsState({
        businessData: {},
        loading: false,
        error: err,
      });
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, []);

  return statisticsState;
};

export default useStatistics;
