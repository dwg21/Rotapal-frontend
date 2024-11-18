import { useState, useEffect, useCallback } from "react";
import ServerApi from "../serverApi/axios";

const useArchivedRotas = (venueId, options = {}) => {
  // Default values are handled within the hook itself
  const { sortBy = "weekStarting", sortOrder = "asc" } = options;

  const [rotasData, setRotasData] = useState({
    archivedRotas: [],
    error: null,
    loading: true,
  });

  const fetchArchivedRotas = useCallback(async () => {
    if (!venueId) {
      setRotasData({
        archivedRotas: [],
        error: "Venue ID is required",
        loading: false,
      });
      return;
    }

    setRotasData((prevState) => ({ ...prevState, loading: true }));
    try {
      const response = await ServerApi.get(
        `http://localhost:5000/api/v1/rotas/archivedRoas/${venueId}`,
        { withCredentials: true }
      );

      console.log("The response is ", response);

      let fetchedRotas = response.data.rotas;

      // Sort the rotas by the specified key
      if (sortBy) {
        fetchedRotas = fetchedRotas.sort((a, b) => {
          const dateA = new Date(a[sortBy]);
          const dateB = new Date(b[sortBy]);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      setRotasData({
        archivedRotas: fetchedRotas,
        error: null,
        loading: false,
      });
    } catch (err) {
      console.log(" el error es : ", err);
      setRotasData({
        archivedRotas: [],
        error: err.response?.data?.message || "An error occurred hola",
        loading: false,
      });
    }
  }, [venueId, sortBy, sortOrder]);

  useEffect(() => {
    fetchArchivedRotas();
  }, [fetchArchivedRotas]);

  return { ...rotasData, refetch: fetchArchivedRotas };
};

export default useArchivedRotas;
