import React from "react";
import { darken } from "polished"; // You can use the `polished` library to darken colors

const CustButton = ({ title, ButtonFunction, color, notificationId }) => {
  const darkenedColor = darken(0.2, color); // Darken the color by 20%

  // Determine if the function should be called with a parameter or not
  const handleClick = () => {
    if (notificationId) {
      ButtonFunction(notificationId);
    } else {
      ButtonFunction();
    }
  };

  return (
    <button
      onClick={handleClick} // Use the handleClick function to manage conditional execution
      style={{
        backgroundColor: color,
        transition: "background-color 0.5s",
      }}
      className="py-2.5 px-6 text-sm text-black rounded-md cursor-pointer font-semibold text-center shadow-xs"
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = darkenedColor)
      }
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = color)}
    >
      {title}
    </button>
  );
};

export default CustButton;
