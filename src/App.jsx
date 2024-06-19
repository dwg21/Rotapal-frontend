import { useState } from "react";
import Rota from "./components/Rota/Rota";
import Staff from "./components/Staff/Staff";
import { Route, Routes } from "react-router-dom";
import Login from "./components/User/Login";
import Forecast from "./components/Forecast/Forecast";
import CreateVenue from "./components/Venue/CreateVenue";
import Venues from "./components/Venue/Venues";
import Navbar, { SidebarItem } from "./components/Navbar/Navbar";
import {
  BookText,
  Home,
  SquarePen,
  UserCircle,
  UsersRound,
} from "lucide-react";
import EmployeeRota from "./components/Rota/EmployeeRota";

function App() {
  return (
    <>
      <div className="flex bg-Zinc-50 ">
        <Navbar>
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="users"
            linkDestination="/user"
          />
          <SidebarItem
            icon={<BookText size={20} />}
            text="View Rota"
            linkDestination="/"
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
        </Navbar>
        <Routes>
          <Route path="/" element={<Rota />} />
          <Route path="/employeerota" element={<EmployeeRota />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/user" element={<Login />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/createvenue" element={<CreateVenue />} />
          <Route path="/venues" element={<Venues />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
