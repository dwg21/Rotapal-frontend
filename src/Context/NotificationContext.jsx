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
      const response = await ServerApi.get(`api/v1/business/getNotifications`);
      setLoading(false);
      console.log(response.data);
      const combinedRequests = [
        ...response.data.swapRequests.map((request) => ({
          ...request,
          type: "shiftSwapRequest",
        })),
        ...response.data.holidays.map((request) => ({
          ...request,
          type: "holiday",
        })),
      ];

      setNotifications((prevNotifications) => {
        const existingIds = new Set(prevNotifications.map((item) => item.id));
        const newNotifications = combinedRequests.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevNotifications, ...newNotifications];
      });
      console.log(notifications);
    } catch (err) {
      console.error("Failed to fetch venue notifications", err);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const employeeNotificationsResponse = await ServerApi.get(
        "http://localhost:5000/api/v1/notifications/getNotifications",
        {
          params: { includeRead },
          withCredentials: true,
        }
      );

      const employeeRequestsResponse = await ServerApi.get(
        "/api/v1/swap/getEmployeeRequests"
      );

      setLoading(false);

      // Log to check structure
      console.log(
        "Employee Notifications:",
        employeeNotificationsResponse.data
      );
      console.log("Employee Requests:", employeeRequestsResponse.data);

      // Combine responses with types for easier identification
      const combinedEmployeeData = [
        ...employeeNotificationsResponse.data.notifications.map(
          (notification) => ({
            ...notification,
            type: "notification",
          })
        ),
        ...employeeRequestsResponse.data.sentRequests.map((request) => ({
          ...request,
          type: "employeeRequest",
        })),
      ];

      console.log(combinedEmployeeData),
        // Update state by filtering out existing notifications
        setNotifications((prevNotifications) => {
          const existingIds = new Set(prevNotifications.map((item) => item.id));
          const newNotifications = combinedEmployeeData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevNotifications, ...newNotifications];
        });
    } catch (error) {
      console.error("Failed to fetch employee data", error);
    }
  };

  const fetchAllData = async () => {
    if (
      userState.userData.role === "AccountOwner" ||
      userState.userData.role === "Admin"
    ) {
      await fetchNotificationsAndRequests();
    } else {
      await fetchEmployeeData();
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
