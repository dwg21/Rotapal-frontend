import React from "react";
import VenueStatistics from "./VenueStatistics";
import useArchivedRotas from "../../hooks/useArchivedRotas";

const ArchivedRotas = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  // No need to destructure `sortBy` and `sortOrder` here, they are now handled inside the hook
  const { archivedRotas, error, loading } = useArchivedRotas(selectedVenueId, {
    sortBy: "weekStarting", // Optional override here
    sortOrder: "asc", // Optional override here
  });

  if (loading) {
    return <div>Loading archived rotas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 w-full flex flex-col justify-center items-center">
      <h1 className="text-lg font-bold">Archived Data and Statistics</h1>
      <div className="w-full">
        <VenueStatistics />
      </div>
    </div>
  );
};

export default ArchivedRotas;
