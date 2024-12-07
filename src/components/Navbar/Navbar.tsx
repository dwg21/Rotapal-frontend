import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"; // HiOutlineX for the close icon
import NavbarContent from "./NavbarContent";
import NotificationUserCenter from "./NotificationUserCenter";

const Navbar = () => {
  const [dropDownVisible, setDropDownVisible] = useState(false);

  const handleToggleMenu = () => {
    setDropDownVisible(!dropDownVisible);
  };

  const handleCloseMenu = () => {
    setDropDownVisible(false);
  };

  return (
    <nav className="bg-white border-b-2 text-black">
      <div className="h-16 z-[3333] justify-between flex items-center px-2">
        <div className="flex items-center h-full">
          <h1 className="font-bold text-2xl text-darkBlue ml-2 mr-4">
            Rotapal
          </h1>

          {/* Navbar content hidden on medium and small screens */}
          <div className="hidden md:flex h-full">
            <NavbarContent />
          </div>
        </div>

        <div className="flex items-center">
          {/* Toggle icon changes between menu and close icon based on dropdown state */}
          <div className="md:hidden">
            {dropDownVisible ? (
              <HiOutlineX
                size={28}
                className="cursor-pointer"
                onClick={handleToggleMenu}
              />
            ) : (
              <HiOutlineMenu
                size={28}
                className="cursor-pointer"
                onClick={handleToggleMenu}
              />
            )}
          </div>
          <div className="hidden md:flex">
            <NotificationUserCenter />
          </div>
        </div>
      </div>

      {/* Dropdown menu for medium and small screens */}
      {dropDownVisible && (
        <div className="w-full bg-white shadow-md z-[3334] md:hidden">
          <NavbarContent onLinkClick={handleCloseMenu} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
