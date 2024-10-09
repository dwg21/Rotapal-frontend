import React, { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const RotaDropdown = ({ rotaNames, setSelectedRota, selectedRota }) => {
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="relative w-28" ref={dropdownRef}>
      <button
        onClick={() => setDropDownVisible(!dropDownVisible)}
        className="flex justify-between items-center w-full py-1 px-4 border rounded"
      >
        <span>{rotaNames[selectedRota]}</span>
        <MdOutlineKeyboardArrowDown className="text-xl" />
      </button>

      {dropDownVisible && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow z-10">
          <ul className="py-2">
            {rotaNames.map((name, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedRota(index);
                  setDropDownVisible(false);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RotaDropdown;
