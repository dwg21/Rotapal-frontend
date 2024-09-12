import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { useNotifications } from "../../Context/NotificationContext";
import CustButton from "../misc/CustButton";

const NotificationCard = ({ notification, onApprove, onDecline }) => {
  const renderShiftSwapRequest = () => (
    <div>
      <p className="text-gray-700 mb-2">
        {notification.message || "You have a new shift swap request."}
      </p>
      <div className="flex space-x-4 mt-2">
        <CustButton
          title="Approve"
          color="#4DEF89"
          onClick={onApprove}
          notificationId={notification._id}
        />
        <CustButton
          title="Decline"
          color="#EF4D62"
          onClick={onDecline}
          notificationId={notification._id}
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
        <CustButton title="Approve" color="#4DEF89" onClick={onApprove} />
        <CustButton title="Decline" color="#EF4D62" onClick={onDecline} />
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
        className={`text-sm ${
          notification.isRead ? "text-green-500" : "text-red-500"
        }`}
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
  const { notifications, loading, error, setNotifications } =
    useNotifications();

  console.log(notifications);

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
    <div className="max-w-2xl mx-auto mt-8 flex p-4">
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
