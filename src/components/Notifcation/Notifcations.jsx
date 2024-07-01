import React, { useState, useEffect } from "react";
import axios from "axios";
import ServerApi from "../../serverApi/axios";

const NotificationCard = ({ notification }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <p className="text-gray-700 mb-2">{notification.message}</p>
      {notification.link && (
        <a href={notification.link} className="text-blue-500 hover:underline">
          View Details
        </a>
      )}
      <div className="text-gray-500 text-sm mt-2">
        {new Date(notification.created).toLocaleString()}
      </div>
      {notification.isRead ? (
        <span className="text-green-500">Read</span>
      ) : (
        <span className="text-red-500">Unread</span>
      )}
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await ServerApi.get(
          "http://localhost:5000/api/v1/notifcations/getNotfications",
          { withCredentials: true }
        );
        setNotifications(response.data.notifications);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
          />
        ))
      )}
    </div>
  );
};

export default Notifications;
