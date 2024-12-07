import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";
import MasterRota from "./components/MasterRota/MasterRota";
import Staff from "./components/Staff/Staff";
import { Route, Routes } from "react-router-dom";
import Login from "./components/User/Login";
import CreateVenue from "./components/Venue/CreateVenue";
import Venues from "./components/Venue/Venues";
// import Navbar from "./components/Navbar/Navbar";
import Settings from "./components/Settings/Settings";
import { RotaProvider } from "./Context/RotaContext";
import EmployeeRota from "./components/EmployeeRota/EmployeeRota";

import Notifications from "./components/Notifcation/Notifcations";
import ProtectedRoute from "./components/misc/ProtectedRoutes";

import NotFound from "./components/misc/NotFound";

import Navbar from "./components/Navbar/Navbar";

import { userContext } from "./Context/UserContext";
import HolidayRequests from "./components/Holiday/HolidayRequests";
import ArchivedRotas from "./components/ArchivedRota/ArchivedRotas";
import Register from "./components/User/Register";
import EditVenue from "./components/Venue/EditVenue";

function App() {
  const { state } = userContext();
  console.log(state.userData);

  const handleReset = () => {
    // Optional: Add logic to reset your app state or perform cleanups
    window.location.reload();
  };
  return (
    <>
      <Navbar />
      <div className="flex bg-Zinc-50 ">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employeerota/:date" element={<EmployeeRota />} />
            <Route path="/employeerota" element={<EmployeeRota />} />
            <Route path="/archivedrotas" element={<ArchivedRotas />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/createvenue" element={<CreateVenue />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/notifcations" element={<Notifications />} />
            <Route path="/holidayrequests" element={<HolidayRequests />} />
            <Route path="/editVenue/:venueId" element={<EditVenue />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/rota/:venueId"
              element={
                <ProtectedRoute
                  element={
                    <RotaProvider>
                      <MasterRota />
                    </RotaProvider>
                  }
                  user={state.userData}
                  acceptedRoles={["admin", "AccountOwner"]}
                />
              }
            />
            <Route
              path="/rota"
              element={
                <ProtectedRoute
                  element={
                    <RotaProvider>
                      <MasterRota />
                    </RotaProvider>
                  }
                  user={state.userData}
                  acceptedRoles={["admin", "AccountOwner"]}
                />
              }
            />

            <Route
              path="/rota"
              element={
                <ProtectedRoute
                  element={
                    <RotaProvider>
                      <MasterRota />
                    </RotaProvider>
                  }
                  user={state.userData}
                  acceptedRoles={["admin", "AccountOwner"]}
                />
              }
            />
            {/* Catch-all route for 404 - Page Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
