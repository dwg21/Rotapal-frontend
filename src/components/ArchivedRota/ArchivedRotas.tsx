import React from "react";
import VenueStatistics from "./VenueStatistics";

const ArchivedRotas = () => {
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
