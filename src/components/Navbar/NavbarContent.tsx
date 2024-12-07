import React from "react";
import { Link } from "react-router-dom";
import { userContext } from "../../Context/UserContext";

// Define the types for the props of NavbarItem
interface NavbarItemProps {
  text: string;
  linkDestination: string;
  onLinkClick: () => void;
}

// Define the types for the props of NavbarContent
interface NavbarContentProps {
  onLinkClick: () => void;
}

const NavbarItem = ({
  text,
  linkDestination,
  onLinkClick,
}: NavbarItemProps) => {
  return (
    <li className="flex items-center hover:bg-slate-200 h-full px-4 py-2">
      <Link
        to={linkDestination}
        className="text-black flex items-center"
        onClick={onLinkClick}
      >
        {text}
      </Link>
    </li>
  );
};

const NavbarContent = ({ onLinkClick }: NavbarContentProps) => {
  // Use the context and type it properly
  const { state } = userContext();

  // If the user is not logged in, show the login/register link
  if (!state?.loggedIn) {
    return (
      <NavbarItem
        text="Login / Register"
        linkDestination="/"
        onLinkClick={onLinkClick}
      />
    );
  }

  // Items for admin roles
  const adminItems = (
    <>
      <NavbarItem
        text="Master Rota"
        linkDestination="/rota"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="Statistics"
        linkDestination="/archivedrotas"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="Staff"
        linkDestination="/staff"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="Create Venue"
        linkDestination="/createvenue"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="Rotas"
        linkDestination="/venues"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="View Notifications"
        linkDestination="/notifcations"
        onLinkClick={onLinkClick}
      />
    </>
  );

  // Items for user roles
  const userItems = (
    <>
      <NavbarItem
        text="Employee Rota"
        linkDestination="/employeerota"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="View Notifications"
        linkDestination="/notifcations"
        onLinkClick={onLinkClick}
      />
      <NavbarItem
        text="Request Holiday"
        linkDestination="/holidayrequests"
        onLinkClick={onLinkClick}
      />
    </>
  );

  return (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
      {state?.userData?.role === "admin" ||
      state?.userData?.role === "AccountOwner"
        ? adminItems
        : userItems}
    </ul>
  );
};

export default NavbarContent;
