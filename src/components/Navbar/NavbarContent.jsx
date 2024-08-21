import React from "react";
import { userContext } from "../../UserContext";
import { Link } from "react-router-dom";
import {
  BookText,
  Home,
  SquarePen,
  UserCircle,
  UsersRound,
} from "lucide-react";

const SidebarItem = ({ icon, text, linkDestination, onLinkClick }) => {
  return (
    <li className="flex items-center hover:bg-slate-200 h-full px-4 py-2">
      <Link
        to={linkDestination}
        className="text-black flex items-center gap-2"
        onClick={onLinkClick}
      >
        {text}
      </Link>
    </li>
  );
};

const NavbarContent = ({ onLinkClick }) => {
  const { state } = userContext();

  if (!state?.loggedIn) {
    return (
      <SidebarItem
        icon={<UserCircle size={20} />}
        text="Login / Register"
        linkDestination="/"
        onLinkClick={onLinkClick}
      />
    );
  }

  const adminItems = (
    <>
      <SidebarItem
        icon={<BookText size={20} />}
        text="View Rota"
        linkDestination="/rota"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<BookText size={20} />}
        text="Archived Rotas"
        linkDestination="/archivedrotas"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<BookText size={20} />}
        text="Requests"
        linkDestination="/requests"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<UsersRound size={20} />}
        text="Staff"
        linkDestination="/staff"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<SquarePen size={20} />}
        text="Create Venue"
        linkDestination="/createvenue"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<Home size={20} />}
        text="Venues"
        linkDestination="/venues"
        onLinkClick={onLinkClick}
      />
    </>
  );

  const userItems = (
    <>
      <SidebarItem
        icon={<BookText size={20} />}
        text="View Employee Rota"
        linkDestination="/employeerota"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<Home size={20} />}
        text="View Notifications"
        linkDestination="/notifications"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<BookText size={20} />}
        text="Request Holiday"
        linkDestination="/holidayrequests"
        onLinkClick={onLinkClick}
      />
      <SidebarItem
        icon={<BookText size={20} />}
        text="View Requests"
        linkDestination="/employeerequests"
        onLinkClick={onLinkClick}
      />
    </>
  );

  return (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
      {state.userData.role === "admin" || state.userData.role === "AccountOwner"
        ? adminItems
        : userItems}
    </ul>
  );
};

export default NavbarContent;
