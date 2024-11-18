import React from "react";
import { useNotifications } from "../../Context/NotificationContext";
import ServerApi from "../../serverApi/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationCard = ({
  notification,
  onApprove,
  onDecline,
  onMarkAsRead,
  setNotifications,
}) => {
  const { toast } = useToast();

  const handleStatusClick = async () => {
    try {
      await ServerApi.put(
        `http://localhost:5000/api/v1/notifcations/read/${notification._id}`
      );
      onMarkAsRead(notification._id);
      toast({
        title: "Notification status updated",
        description: `Marked as ${notification.isRead ? "unread" : "read"}.`,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification status.",
      });
    }
  };

  const approveHoliday = async (holidayId) => {
    try {
      const { data } = await ServerApi.put(
        `/api/v1/holidays/approveHoliday/${holidayId}`
      );
      // Use setNotifications from props to remove the holiday notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n._id !== notification._id)
      );
      toast({
        title: "Holiday Approved",
        description: "The holiday request has been approved .",
      });
    } catch (error) {
      console.error("Error approving holiday:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve the holiday request.",
      });
    }
  };

  const renderShiftSwapRequest = () => (
    <>
      <CardContent>
        <p className="text-gray-700 mb-4">
          {notification.message || "You have a new shift swap request."}
        </p>
      </CardContent>
      <div className="flex justify-end space-x-4 px-6 pb-4">
        <Button variant="outline" onClick={() => onDecline(notification._id)}>
          <XCircle className="mr-2 h-4 w-4" /> Decline
        </Button>
        <Button onClick={() => onApprove(notification._id)}>
          <CheckCircle className="mr-2 h-4 w-4" /> Approve
        </Button>
      </div>
    </>
  );

  const renderHolidayRequest = () => (
    <>
      <CardContent>
        <p className="text-gray-700 mb-4">
          {`${
            notification?.user?.name || "A user"
          } has requested annual leave on ${notification?.date || "a date"}.`}
        </p>
      </CardContent>
      <div className="flex justify-end space-x-4 px-6 pb-4">
        <Button variant="outline" onClick={() => onDecline(notification._id)}>
          <XCircle className="mr-2 h-4 w-4" /> Decline
        </Button>
        <Button onClick={() => approveHoliday(notification._id)}>
          <CheckCircle className="mr-2 h-4 w-4" /> Approve
        </Button>
      </div>
    </>
  );

  const renderDefaultNotification = () => (
    <CardContent>
      <p className="text-gray-700 mb-2">
        {notification.message || "You have a new notification."}
      </p>
      <p className="text-gray-500 text-sm mb-2">
        {notification.created || "No date provided"}
      </p>
      <Badge
        variant={notification.isRead ? "outline" : "secondary"}
        className="cursor-pointer"
        onClick={handleStatusClick}
      >
        {notification.isRead ? "Read" : "Unread"}
      </Badge>
    </CardContent>
  );

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {notification.type === "shiftSwapRequest" && "Shift Swap Request"}
          {notification.type === "holiday" && "Holiday Request"}
          {!["shiftSwapRequest", "holiday"].includes(notification.type) &&
            "Notification"}
        </CardTitle>
      </CardHeader>
      {notification.type === "shiftSwapRequest"
        ? renderShiftSwapRequest()
        : notification.type === "holiday"
        ? renderHolidayRequest()
        : renderDefaultNotification()}
    </Card>
  );
};

const Notifications = () => {
  const { toast } = useToast();

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
      toast({
        title: "Request Approved",
        description: "The request has been successfully approved.",
      });
    } catch (error) {
      console.error("Error approving shift swap:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve the request.",
      });
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await ServerApi.put(`/api/v1/swap/declineShiftSwap/${requestId}`);
      setNotifications(notifications.filter((n) => n._id !== requestId));
      toast({
        title: "Request Declined",
        description: "The request has been declined.",
      });
    } catch (error) {
      console.error("Error declining shift swap:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decline the request.",
      });
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: !n.isRead } : n
      )
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-8 text-red-500">
        <p>Error loading notifications</p>
        <p className="text-sm">{error}</p>
      </div>
    );

  console.log(loading);
  console.log(notifications);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Notifications and Requests</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="include-read"
            checked={includeRead}
            onCheckedChange={setIncludeRead}
          />
          <label
            htmlFor="include-read"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Read
          </label>
        </div>
      </div>
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No notifications found.</p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onMarkAsRead={handleMarkAsRead}
            setNotifications={setNotifications}
          />
        ))
      )}
    </div>
  );
};

export default Notifications;
