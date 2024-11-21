import { useState, useEffect, useCallback } from "react";
import ServerApi from "../serverApi/axios";

const useStatistics = () => {
  const [statisticsState, setStatisticsState] = useState({
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

      console.log("Hola", response.data.statistics);

      console.log(statisticsState.businessData);
    } catch (err) {
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
