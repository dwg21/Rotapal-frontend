import React, { createContext, useContext, useState, useEffect } from "react";
import ServerApi from "../serverApi/axios";
import { userContext } from "../Context/UserContext";

// Create a context for notifications
const NotificationsContext = createContext();

// Create a provider component
export const NotificationsProvider = ({ children }) => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [notifications, setNotifications] = useState([]);
  const { state: userState } = userContext(); // Corrected to use useContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [includeRead, setIncludeRead] = useState(false);

  console.log(userState);

  const fetchNotificationsAndRequests = async () => {
    try {
      const [notificationsResponse, requestsResponse] = await Promise.all([
        ServerApi.get(
          "http://localhost:5000/api/v1/notifcations/getNotfications",
          { params: { includeRead }, withCredentials: true }
        ),
        ServerApi.get(`/api/v1/swap/getEmployeeRequests`),
      ]);

      const combinedNotifications = [
        ...requestsResponse.data.incomingRequests.map((request) => ({
          ...request,
          type: "shiftSwapRequest",
          created: new Date(request.created),
        })),
        ...notificationsResponse.data.notifications,
      ];

      combinedNotifications.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );

      setNotifications(combinedNotifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const shiftSwapResponse = await ServerApi.get(
        `/api/v1/swap/pendingShiftSwapRequests?venueId=${selectedVenueId}`
      );

      const holidayResponse = await ServerApi.get(
        `/api/v1/holidays/getVenueHolidays/${selectedVenueId}`
      );

      const combinedRequests = [
        ...shiftSwapResponse.data.map((request) => ({
          ...request,
          type: "shiftSwapRequest",
        })),
        ...holidayResponse.data.holidays.map((request) => ({
          ...request,
          type: "holiday",
        })),
      ];

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...combinedRequests,
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    await fetchNotificationsAndRequests();
    if (
      userState.userData.role === "AccountOwner" ||
      userState.userData.role === "Admin"
    ) {
      await fetchRequests();
    }
  };

  useEffect(() => {
    if (userState.loggedIn) {
      fetchAllData(); // Fetch on mount
      const interval = setInterval(fetchAllData, 30000); // Poll every 30 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [userState.loggedIn, includeRead]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        setNotifications,
        includeRead,
        setIncludeRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the Notifications context
export const useNotifications = () => useContext(NotificationsContext);
