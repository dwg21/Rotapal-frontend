import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import ServerApi from "../../serverApi/axios";

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

export default NotificationCard;