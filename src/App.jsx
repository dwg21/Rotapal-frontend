import { useState, useEffect } from "react";
import Rota from "./components/Rota/Rota";
import Staff from "./components/Staff/Staff";
import { Route, Routes } from "react-router-dom";
import Login from "./components/User/Login";
import Forecast from "./components/Forecast/Forecast";
import CreateVenue from "./components/Venue/CreateVenue";
import Venues from "./components/Venue/Venues";
import Navbar from "./components/Navbar/Navbar";

import EmployeeRota from "./components/Rota/EmployeeRota";

import NavbarContent from "./components/Navbar/NavbarContent";
import Notifications from "./components/Notifcation/Notifcations";

function App() {
  return (
    <>
      <div className="flex bg-Zinc-50 ">
        <Navbar>
          <NavbarContent />
        </Navbar>
        <Routes>
          <Route path="/rota/:venueId" element={<Rota />} />
          <Route path="/rota" element={<Rota />} />
          <Route path="/employeerota/:date" element={<EmployeeRota />} />
          <Route path="/employeerota" element={<EmployeeRota />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/" element={<Login />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/createvenue" element={<CreateVenue />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/notifcations" element={<Notifications />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
