import { useState, useEffect, useCallback } from "react";
import ServerApi from "../serverApi/axios";
import { Venue } from "../types";

interface VenuesState {
  venuesData: Venue[];
  loading: boolean;
  error: string | null;
}

const useVenues = () => {
  const [venuesState, setVenuesState] = useState<VenuesState>({
    venuesData: [],
    loading: true,
    error: null,
  });

  const fetchVenues = useCallback(async () => {
    setVenuesState((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
    }));

    try {
      const response = await ServerApi.get("api/v1/venue/venues", {
        withCredentials: true,
      });

      setVenuesState({
        venuesData: response.data.venues,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Failed to fetch venue data:", error);

      setVenuesState({
        venuesData: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return venuesState;
};

export default useVenues;
