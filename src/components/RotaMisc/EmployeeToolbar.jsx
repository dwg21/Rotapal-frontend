import React from "react";
import ServerApi from "../../serverApi/axios";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { TiTick } from "react-icons/ti";

import { getDayLabel } from "../../Utils/utils";
import exportToPDF from "../../Utils/exportToPdf";
import exportToPng from "../../Utils/exportToPng";
import CustButton from "./Button";
import FilterButton from "./FilterButton";

const EmployeeToolbar = ({
  venueName,
  setSelectedWeek,
  startOfWeek, // Receive startOfWeek as a prop
  showCost,
  setShowCost,
  showHours,
  setShowHours,
}) => {
  const handleChangeWeek = (direction) => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
    } else if (direction === "left") {
      setSelectedWeek((prev) => prev - 1);
    }
  };

  const startOfweek = getDayLabel(new Date(startOfWeek));
  const endOfWeek = getDayLabel(
    new Date(new Date(startOfWeek).getTime() + 6 * 24 * 60 * 60 * 1000) // Calculate the end of the current week
  );

  return (
    <div>
      <p className="text-md text-center font-semibold mr-4 md:text-base md:hidden ">
        {venueName && venueName}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 py-2 my-1 border-b w-full md:gap-6 md:flex-nowrap">
        <p className="text-sm font-semibold mr-4 md:text-base hidden md:block">
          {venueName && venueName}
        </p>

        <div className="justify-center items-center w-full md:w-[300px] gap-1 p-2 hidden  md:flex">
          <IoMdArrowDropleft
            className="text-xl cursor-pointer md:text-2xl"
            onClick={() => handleChangeWeek("left")}
          />
          <p className="text-sm md:text-base">
            {startOfweek} - {endOfWeek}
          </p>
          <IoMdArrowDropright
            className="text-xl cursor-pointer md:text-2xl"
            onClick={() => handleChangeWeek("right")}
          />
        </div>
        <CustButton
          handleSubmit1={exportToPDF}
          handleSubmit2={exportToPng}
          className="text-xs md:text-sm"
        />
        <FilterButton
          showCost={showCost}
          setShowCost={setShowCost}
          showHours={showHours}
          setShowHours={setShowHours}
        />
      </div>
    </div>
  );
};

export default EmployeeToolbar;
