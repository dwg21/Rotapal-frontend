import { useState, useEffect } from "react";

import MasterRota from "./components/MasterRota/MasterRota";
import Staff from "./components/Staff/Staff";
import { Route, Routes } from "react-router-dom";
import Login from "./components/User/Login";
import Forecast from "./components/Forecast/Forecast";
import CreateVenue from "./components/Venue/CreateVenue";
import Venues from "./components/Venue/Venues";
import Navbar from "./components/Navbar/Navbar";
import Requests from "./components/Requests/Requests";

import EmployeeRota from "./components/EmployeeRota/EmployeeRota";

import NavbarContent from "./components/Navbar/NavbarContent";
import Notifications from "./components/Notifcation/Notifcations";
import ProtectedRoute from "./components/misc/ProtectedRoutes";

import NotFound from "./components/misc/NotFound";

import { userContext } from "./UserContext";
import HolidayRequests from "./components/Holiday/HolidayRequests";
import ArchivedRotas from "./components/ArchivedRota/ArchivedRotas";
import EmployeeRequests from "./components/Requests/EmployeeRequests";
function App() {
  const { state } = userContext();
  console.log(state.userData);
  return (
    <>
      <div className="flex bg-Zinc-50 ">
        <Navbar>
          <NavbarContent />
        </Navbar>
        <Routes>
          <Route path="/employeerota/:date" element={<EmployeeRota />} />
          <Route path="/employeerota" element={<EmployeeRota />} />
          <Route path="/employeerequests" element={<EmployeeRequests />} />
          <Route path="/archivedrotas" element={<ArchivedRotas />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/" element={<Login />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/createvenue" element={<CreateVenue />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/notifcations" element={<Notifications />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/holidayrequests" element={<HolidayRequests />} />

          <Route
            path="/rota/:venueId"
            element={
              <ProtectedRoute
                element={MasterRota}
                user={state.userData}
                role="admin"
              />
            }
          />
          <Route
            path="/rota"
            element={
              <ProtectedRoute
                element={MasterRota}
                user={state.userData}
                role="admin"
              />
            }
          />

          {/* Catch-all route for 404 - Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
