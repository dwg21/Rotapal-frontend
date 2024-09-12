import React, { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const CustDropdownButton = ({ title, options }) => {
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
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setDropDownVisible(!dropDownVisible)}
        className="border py-1 px-8 bg-blue-500 rounded-md text-white flex justify-center items-center"
      >
        <p>{title}</p>
        <MdOutlineKeyboardArrowDown className="text-xl ml-2" />
      </button>

      {dropDownVisible && (
        <div className="absolute mt-2 flex flex-col bg-white border rounded shadow-md z-30">
          <ul className="w-48">
            {options.map(({ label, icon, onClick }) => (
              <li
                key={label}
                className="px-4 py-2 select-none hover:bg-gray-100 flex items-center"
                onClick={() => {
                  setDropDownVisible(false);
                  if (onClick) onClick();
                }}
              >
                {icon} {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustDropdownButton;
