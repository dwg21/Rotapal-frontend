// NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import ServerApi from "../serverApi/axios";
import { userContext } from "../Context/UserContext";

// Create a context for notifications
const NotificationsContext = createContext();

// Create a provider component
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { state: userState } = userContext(); // Access the login state from UserContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotificationsAndRequests = async () => {
    try {
      const [notificationsResponse, requestsResponse] = await Promise.all([
        ServerApi.get(
          "http://localhost:5000/api/v1/notifcations/getNotfications",
          { withCredentials: true }
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

  useEffect(() => {
    if (userState.loggedIn) {
      // Check if the user is logged in
      fetchNotificationsAndRequests(); // Fetch on mount
      const interval = setInterval(fetchNotificationsAndRequests, 30000); // Poll every 30 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [userState.loggedIn]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, error, setNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the Notifications context
export const useNotifications = () => useContext(NotificationsContext);
