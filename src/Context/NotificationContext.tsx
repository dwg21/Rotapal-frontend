import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ServerApi from "../serverApi/axios";
import { userContext } from "./UserContext";

// Types for Notifications and Requests
interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface ShiftSwapRequest {
  _id: string;
  fromShiftId: string;
  toShiftId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  rotaId: string;
  businessId: string;
  venueId: string;
  status: string;
  message: string;
  createdAt: string;
}

interface Holiday {
  _id: string;
  user: string;
  businessId: string;
  date: string;
  status: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  swapRequests: ShiftSwapRequest[];
  holidays: Holiday[];
}

// Context Types
interface NotificationsContextProps {
  notifications: (Notification | ShiftSwapRequest | Holiday)[];
  loading: boolean;
  error: string | null;
  setNotifications: React.Dispatch<
    React.SetStateAction<(Notification | ShiftSwapRequest | Holiday)[]>
  >;
  includeRead: boolean;
  setIncludeRead: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context
const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

// Provider Component
export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [notifications, setNotifications] = useState<
    (Notification | ShiftSwapRequest | Holiday)[]
  >([]);

  const { state: userState } = userContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeRead, setIncludeRead] = useState(false);

  const fetchNotificationsAndRequests = async () => {
    try {
      const response = await ServerApi.get<NotificationsResponse>(
        "api/v1/business/getNotifications"
      );
      const { swapRequests, holidays } = response.data;

      const combinedRequests = [
        ...swapRequests.map((request) => ({
          ...request,
          id: request._id,
          type: "shiftSwapRequest",
        })),
        ...holidays.map((holiday) => ({
          ...holiday,
          id: holiday._id,
          type: "holiday",
        })),
      ];

      setNotifications((prevNotifications) => {
        const existingIds = new Set(
          prevNotifications
            .map((item) => (item as Notification).id) // Cast to `Notification`
            .filter((id) => id) // Filter out invalid IDs
        );

        return [
          ...prevNotifications,
          ...combinedRequests.filter(
            (item) => "id" in item && !existingIds.has(item.id)
          ),
        ];
      });
    } catch (err) {
      setError("Failed to fetch venue notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const [employeeNotificationsResponse, employeeRequestsResponse] =
        await Promise.all([
          ServerApi.get<{ notifications: Notification[] }>(
            "api/v1/notifications/getNotifications",
            {
              params: { includeRead },
              withCredentials: true,
            }
          ),
          ServerApi.get<{ sentRequests: Notification[] }>(
            "/api/v1/swap/getEmployeeRequests"
          ),
        ]);

      const combinedEmployeeData = [
        ...employeeNotificationsResponse.data.notifications.map(
          (notification) => ({
            ...notification,
            id: notification.id,
            type: "notification",
          })
        ),
        ...employeeRequestsResponse.data.sentRequests.map((request) => ({
          ...request,
          id: request.id,
          type: "employeeRequest",
        })),
      ];

      setNotifications((prevNotifications) => {
        const existingIds = new Set(
          prevNotifications
            .filter((item) => "id" in item && typeof item.id === "string") // Check for `id`
            .map((item) => (item as { id: string }).id) // Narrow type
        );
        return [
          ...prevNotifications,
          ...combinedEmployeeData.filter((item) => !existingIds.has(item.id)),
        ];
      });
    } catch (error) {
      setError("Failed to fetch employee data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    if (
      userState?.userData?.role === "AccountOwner" ||
      userState?.userData?.role === "Admin"
    ) {
      await fetchNotificationsAndRequests();
    } else {
      await fetchEmployeeData();
    }
  };

  useEffect(() => {
    if (userState.loggedIn) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
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
export const useNotifications = (): NotificationsContextProps => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
