import React, { useEffect, useState } from "react";
import ServerApi from "../../serverApi/axios";

const ShiftSwapRequests = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetch pending shift swap requests for the specified venue
        const shiftSwapResponse = await ServerApi.get(
          `/api/v1/swap/pendingShiftSwapRequests?venueId=${selectedVenueId}`
        );

        // Fetch holiday requests for the specified venue
        const holidayResponse = await ServerApi.get(
          `/api/v1/holidays/getVenueHolidays/${selectedVenueId}`
        );

        // Combine the shift swap and holiday requests
        const combinedRequests = [
          ...shiftSwapResponse.data.map((request) => ({
            ...request,
            type: "shiftSwap",
          })),
          ...holidayResponse.data.holidays.map((request) => ({
            ...request,
            type: "holiday",
          })),
        ];
        console.log(combinedRequests);

        // Sort the combined requests by the createdAt field (most recent first)
        // combinedRequests.sort(
        //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        // );

        setRequests(combinedRequests);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [selectedVenueId]);

  const handleApprove = async (requestId, type) => {
    try {
      if (type === "shiftSwap") {
        await ServerApi.put(`/api/v1/swap/approveShiftSwap/${requestId}`);
      } else if (type === "holiday") {
        await ServerApi.put(`/api/v1/holidays/approveHoliday/${requestId}`);
      }
      // Remove the approved request from the list
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleDecline = async (requestId, type) => {
    try {
      if (type === "shiftSwap") {
        await ServerApi.put(`/api/v1/swap/declineShiftSwap/${requestId}`);
      } else if (type === "holiday") {
        // Implement decline logic for holiday requests if needed
      }
      // Remove the declined request from the list
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>Error loading requests: {error.message}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="font-semibold">Pending Requests</h1>
      <ul className="flex flex-col gap-8 mt-4">
        {requests.map((request) => (
          <li
            className="py-2 px-1 flex items-center border rounded-md"
            key={request._id}
          >
            <p className="">
              {request.type === "shiftSwap"
                ? request.message
                : `${request.user.name} has requested annual leave on ${request.date}`}
            </p>
            <button
              className="border py-2 px-1 rounded-md bg-green-400"
              onClick={() => handleApprove(request._id, request.type)}
            >
              Approve
            </button>
            <button
              className="border py-2 px-1 rounded-md bg-red-400"
              onClick={() => handleDecline(request._id, request.type)}
            >
              Decline
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftSwapRequests;
