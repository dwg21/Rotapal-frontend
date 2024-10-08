import React, { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const FilterButton = ({ showCost, setShowCost, showHours, setShowHours }) => {
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleCheckboxChange = (setter) => {
    setter((prev) => !prev);
    console.log(showHours);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropDownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropDownVisible(!dropDownVisible)}
        className="border py-1 px-8 bg-blue-500 text-white rounded-sm"
      >
        <div className="flex justify-center items-center">
          <p>Filter</p>
          <MdOutlineKeyboardArrowDown className="text-xl ml-2" />
        </div>
      </button>
      {dropDownVisible && (
        <div className="absolute mt-2 flex flex-col bg-white border rounded shadow-md">
          <label className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={showCost}
              onChange={() => handleCheckboxChange(setShowCost)}
              className="mr-2"
            />
            Staff Costs
          </label>
          <label className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={showHours}
              onChange={() => handleCheckboxChange(setShowHours)}
              className="mr-2"
            />
            Staff Hours
          </label>
          <button className="py-2 px-4 hover:bg-gray-100">Something</button>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
