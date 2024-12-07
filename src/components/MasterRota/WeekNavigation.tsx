import React from "react";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";

// Define the types for the props
interface WeekNavigationProps {
  startOfWeek: string; // The start date of the week, should be a string (e.g., 'Monday, 1st January')
  endOfWeek: string; // The end date of the week, should be a string (e.g., 'Sunday, 7th January')
  handleChangeWeek: (direction: "left" | "right") => void; // Function to handle week change, accepting 'left' or 'right' as direction
}

const WeekNavigation = ({
  startOfWeek,
  endOfWeek,
  handleChangeWeek,
}: WeekNavigationProps) => (
  <div className="week-navigation">
    <button onClick={() => handleChangeWeek("left")}>
      <IoMdArrowDropleft />
    </button>
    <h4>
      {startOfWeek} - {endOfWeek}
    </h4>
    <button onClick={() => handleChangeWeek("right")}>
      <IoMdArrowDropright />
    </button>
  </div>
);

export default WeekNavigation;
