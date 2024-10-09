import { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../Context/UserContext";
import { useNotifications } from "../../Context/NotificationContext";
import { Button } from "@mui/material";
import ServerApi from "../../serverApi/axios";

const NotificationUserCenter = () => {
  const { state, dispatch } = userContext();
  const { setNotifications } = useNotifications(); // Access NotificationsContext
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { notifications, loading, error } = useNotifications();

  // Refs to detect clicks outside of the dropdowns
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Calculate unread count based on your logic
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle opening dropdowns
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserDropdownOpen(false); // Close user dropdown if open
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNotificationOpen(false); // Close notification dropdown if open
  };

  const handleLogout = async () => {
    try {
      await ServerApi.post("api/v1/auth/logout");
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err);
    }
    setIsUserDropdownOpen(false);
    dispatch({ type: "LOGOUT" });
    setNotifications([]);
    navigate("/");
  };

  return (
    <div className="relative flex items-center h-full justify-center space-x-4">
      {/* Notifications Bell */}
      <div className="relative mr-3" ref={notificationRef}>
        <button
          onClick={toggleNotificationDropdown}
          className="focus:outline-none relative"
        >
          <FaBell className="text-gray-600 hover:text-gray-800" size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {isNotificationOpen && (
          <div className="absolute right-0 mt-4 w-72 bg-white shadow-lg rounded-lg border-2 z-50">
            <div className="p-4 border-b border-gray-200 font-bold text-gray-700">
              Notifications
            </div>
            <ul>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4">No notifications found.</div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification._id}
                    className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                  >
                    <div className="font-semibold text-gray-700">
                      {notification?.message?.substring(0, 55) || "No Title"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {notification.date ||
                        new Date(notification.created).toLocaleDateString()}
                    </div>
                  </li>
                ))
              )}
            </ul>
            <Link to="./notifcations">
              <div className="p-2 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                View all notifications
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* User Icon */}
      <div className="relative" ref={userDropdownRef}>
        <button onClick={toggleUserDropdown} className="focus:outline-none">
          <FaUserCircle
            className="text-gray-600 hover:text-gray-800"
            size={24}
          />
        </button>
        {isUserDropdownOpen && (
          <div className="absolute right-0 mt-4 border-2 w-56 bg-white shadow-lg rounded-lg z-50">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
                <div className="font-semibold text-gray-700">Help</div>
                <ul className="pl-4 mt-2">
                  <li className="text-sm text-gray-600 hover:underline cursor-pointer">
                    Find Help
                  </li>
                  <li className="text-sm text-gray-600 hover:underline cursor-pointer">
                    Go to Forum
                  </li>
                </ul>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
                <div className="font-semibold text-gray-700">Settings</div>
                <ul className="pl-4 mt-2">
                  <li className="text-sm text-gray-600 hover:underline cursor-pointer">
                    Payment Details
                  </li>
                  <li className="text-sm text-gray-600 hover:underline cursor-pointer">
                    Account Settings
                  </li>
                </ul>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <div className="font-semibold text-gray-700">User</div>
                <ul className="pl-4 mt-2">
                  <li className="text-sm text-red-600 hover:underline cursor-pointer">
                    {state.loggedIn ? (
                      <button onClick={handleLogout}>Logout</button>
                    ) : (
                      <Link to="/">Login/Register</Link>
                    )}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationUserCenter;
