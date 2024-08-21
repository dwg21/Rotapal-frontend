import { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../UserContext";
import { Button } from "@mui/material";

const NotificationUserCenter = () => {
  const { state, dispatch } = userContext();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Refs to detect clicks outside of the dropdowns
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Dummy static data for notifications and unread count
  const notifications = [
    { id: 1, title: "New Comment on your Post", date: "August 20, 2024" },
    { id: 2, title: "Update Available", date: "August 19, 2024" },
    { id: 3, title: "Password Changed", date: "August 18, 2024" },
    { id: 4, title: "Aimee has requested Holiday", date: "August 17, 2024" },
    { id: 5, title: "Weekly Report Ready", date: "August 16, 2024" },
  ];
  const unreadCount = 3; // Dummy unread count

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
      ServerApi.get("api/v1/auth/logout");
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err);
    }
    setIsUserDropdownOpen(false);
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div className="relative flex items-center h-full  justify-center space-x-4">
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
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                >
                  <div className="font-semibold text-gray-700">
                    {notification.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {notification.date}
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-2 text-center text-sm text-blue-600 hover:underline cursor-pointer">
              View all notifications
            </div>
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
