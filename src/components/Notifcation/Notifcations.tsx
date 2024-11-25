import React from "react";
import { useNotifications } from "../../Context/NotificationContext";
import ServerApi from "../../serverApi/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import NotificationCard from "./NotificationCard";

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

  const handleApprove = async (requestId: string) => {
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

  const handleDecline = async (requestId: string) => {
    try {
      await ServerApi.put(`/api/v1/swap/declineShiftSwap/${requestId}`);
      setNotifications(
        notifications.filter((n: { _id: string }) => n._id !== requestId)
      );
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

  const handleMarkAsRead = (notificationId: string) => {
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
