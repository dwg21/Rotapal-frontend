import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { useNotifications } from "../../Context/NotificationContext";

const NotificationCard = ({ notification, onApprove, onDecline }) => {
  const isShiftSwapRequest = notification.type === "shiftSwapRequest";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <p className="text-gray-700 mb-2">{notification.message}</p>
      {notification.link && !isShiftSwapRequest && (
        <a href={notification.link} className="text-blue-500 hover:underline">
          View Details
        </a>
      )}
      {isShiftSwapRequest && (
        <div className="flex space-x-4 mt-2">
          <button
            className="border py-2 px-1 rounded-md bg-green-400 hover:bg-green-500 transition-colors"
            onClick={() => onApprove(notification._id)}
          >
            Approve
          </button>
          <button
            className="border py-2 px-1 rounded-md bg-red-400 hover:bg-red-500 transition-colors"
            onClick={() => onDecline(notification._id)}
          >
            Decline
          </button>
        </div>
      )}
      <div className="text-gray-500 text-sm mt-2">
        {!isShiftSwapRequest && new Date(notification.created).toLocaleString()}
      </div>
      {!isShiftSwapRequest && (
        <span
          className={`text-sm ${
            notification.isRead ? "text-green-500" : "text-red-500"
          }`}
        >
          {notification.isRead ? "Read" : "Unread"}
        </span>
      )}
    </div>
  );
};

const Notifications = () => {
  const { notifications, loading, error, setNotifications } =
    useNotifications();

  const handleApprove = async (requestId) => {
    try {
      await ServerApi.put(`/api/v1/swap/employeeAproveShiftSwap/${requestId}`);
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

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 flex">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications found.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
