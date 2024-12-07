import React, { createContext, useState, useContext, useMemo } from "react";

// Define the shape of the filter state
interface RotaFilters {
  showCost: boolean;
  showHours: boolean;
}

// Create Rota Context
const RotaContext = createContext<{
  filters: RotaFilters;
  setFilters: React.Dispatch<React.SetStateAction<RotaFilters>>;
  selectedWeek: number;
  setSelectedWeek: React.Dispatch<React.SetStateAction<number>>;
  selectedVenueId: string;
  setSelectedVenueId: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

// Rota Provider Component
export const RotaProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<RotaFilters>({
    showCost: false,
    showHours: false,
  });

  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedVenueId, setSelectedVenueId] = useState(
    localStorage.getItem("selectedVenueID") || "default"
  );

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      filters,
      setFilters,
      selectedWeek,
      setSelectedWeek,
      selectedVenueId,
      setSelectedVenueId,
    }),
    [filters, selectedWeek, selectedVenueId]
  );

  return (
    <RotaContext.Provider value={contextValue}>{children}</RotaContext.Provider>
  );
};

// Custom hook to use Rota Context
export const useRotaContext = () => {
  const context = useContext(RotaContext);
  if (!context) {
    throw new Error("useRotaContext must be used within a RotaProvider");
  }
  return context;
};
