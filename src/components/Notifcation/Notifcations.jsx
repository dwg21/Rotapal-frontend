import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { useNotifications } from "../../Context/NotificationContext";
import CustButton from "../misc/CustButton";

const NotificationCard = ({
  notification,
  onApprove,
  onDecline,
  onMarkAsRead,
}) => {
  const handleStatusClick = async () => {
    try {
      const test = await ServerApi.put(
        `http://localhost:5000/api/v1/notifcations/read/${notification._id}`
      );
      console.log(test);
      onMarkAsRead(notification._id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const renderShiftSwapRequest = () => (
    <div>
      <p className="text-gray-700 mb-2">
        {notification.message || "You have a new shift swap request."}
      </p>
      <div className="flex space-x-4 mt-2">
        <CustButton
          title="Approve"
          color="#4DEF89"
          ButtonFunction={() => onApprove(notification._id)}
        />
        <CustButton
          title="Decline"
          color="#EF4D62"
          ButtonFunction={() => onDecline(notification._id)}
        />
      </div>
    </div>
  );

  const renderHolidayRequest = () => (
    <div>
      <p className="text-gray-700 mb-2">
        {`${
          notification?.user?.name || "A user"
        } has requested annual leave on ${notification?.date || "a date"}.`}
      </p>
      <div className="flex space-x-4 mt-2">
        <CustButton
          title="Approve"
          color="#4DEF89"
          onClick={() => onApprove(notification._id)}
        />
        <CustButton
          title="Decline"
          color="#EF4D62"
          onClick={() => onDecline(notification._id)}
        />
      </div>
    </div>
  );

  const renderDefaultNotification = () => (
    <div>
      <p className="text-gray-700 mb-2">
        {notification.message || "You have a new notification."}
      </p>
      <p className="text-gray-500 text-sm mb-2">
        {notification.created || "No date provided"}
      </p>
      <span
        className={`text-sm cursor-pointer ${
          notification.isRead ? "text-green-500" : "text-red-500"
        }`}
        onClick={handleStatusClick}
      >
        {notification.isRead ? "Read" : "Unread"}
      </span>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {notification.type === "shiftSwapRequest"
        ? renderShiftSwapRequest()
        : notification.type === "holiday"
        ? renderHolidayRequest()
        : renderDefaultNotification()}
    </div>
  );
};
const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    setNotifications,
    includeRead,
    setIncludeRead,
  } = useNotifications();

  const handleApprove = async (requestId) => {
    try {
      await ServerApi.put(`/api/v1/swap/employeeApproveShiftSwap/${requestId}`);
      setNotifications(notifications.filter((n) => n._id !== requestId));
    } catch (error) {
      console.error("Error approving shift swap:", error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await ServerApi.put(`/api/v1/swap/declineShiftSwap/${requestId}`);
      setNotifications(notifications.filter((n) => n._id !== requestId));
    } catch (error) {
      console.error("Error declining shift swap:", error);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: !n.isRead } : n
      )
    );
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 flex flex-col p-4">
      <div className="items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={includeRead}
            onChange={() => setIncludeRead(!includeRead)}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium">Include Read</span>
        </label>
      </div>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onMarkAsRead={handleMarkAsRead}
          />
        ))
      )}
    </div>
  );
};

export default Notifications;
