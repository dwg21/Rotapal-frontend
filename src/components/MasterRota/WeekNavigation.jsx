import React from "react";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";

const WeekNavigation = ({ startOfweek, endOfWeek, handleChangeWeek }) => (
  <div className="week-navigation">
    <button onClick={() => handleChangeWeek("left")}>
      <IoMdArrowDropleft />
    </button>
    <h4>
      {startOfweek} - {endOfWeek}
    </h4>
    <button onClick={() => handleChangeWeek("right")}>
      <IoMdArrowDropright />
    </button>
  </div>
);

export default WeekNavigation;
