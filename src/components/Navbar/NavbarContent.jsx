import React from "react";
import { userContext } from "../../UserContext";
import {
  BookText,
  Home,
  SquarePen,
  UserCircle,
  UsersRound,
} from "lucide-react";

import { SidebarItem } from "./Navbar";

const NavbarContent = () => {
  const { state } = userContext();

  if (!state.loggedIn) {
    return (
      <SidebarItem
        icon={<UserCircle size={20} />}
        text="Login / Register"
        linkDestination="/"
      />
    );
  }

  const adminItems = (
    <>
      <SidebarItem
        icon={<BookText size={20} />}
        text="View Rota"
        linkDestination="/rota"
      />
      <SidebarItem
        icon={<BookText size={20} />}
        text="View Employee Rota"
        linkDestination="/employeerota"
      />
      <SidebarItem
        icon={<UsersRound size={20} />}
        text="Staff"
        linkDestination="/staff"
      />
      <SidebarItem
        icon={<UserCircle size={20} />}
        text="Forecast"
        linkDestination="/forecast"
      />
      <SidebarItem
        icon={<SquarePen size={20} />}
        text="Create Venue"
        linkDestination="/createvenue"
      />
      <SidebarItem
        icon={<Home size={20} />}
        text="View Venues"
        linkDestination="/venues"
      />
    </>
  );

  const userItems = (
    <SidebarItem
      icon={<BookText size={20} />}
      text="View Employee Rota"
      linkDestination="/employeerota"
    />
  );

  return state.userData.role === "admin" ? adminItems : userItems;
};

export default NavbarContent;
