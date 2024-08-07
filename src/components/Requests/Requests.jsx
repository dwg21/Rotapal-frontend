import React, { useEffect, useState } from "react";
import ServerApi from "../../serverApi/axios";
import { useRota } from "../../RotaContext";

const ShiftSwapRequests = () => {
  const { selectedvenueID } = useRota();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(selectedvenueID);
    // Fetch pending shift swap requests for the specified venue
    const fetchRequests = async () => {
      try {
        const response = await ServerApi.get(
          `/api/v1/swap/pendingShiftSwapRequests?venueId=${selectedvenueID}`
        );

        setRequests(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [selectedvenueID]);

  const handleApprove = async (requestId) => {
    try {
      await ServerApi.put(`/api/v1/swap/approveShiftSwap/${requestId}`);
      // Remove the approved request from the list
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error approving shift swap:", error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await ServerApi.put(`/api/v1/swap/declineShiftSwap/${requestId}`);
      // Remove the declined request from the list
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error declining shift swap:", error);
    }
  };

  if (loading) {
    return <p>Loading shift swap requests...</p>;
  }

  if (error) {
    return <p>Error loading shift swap requests: {error.message}</p>;
  }

  return (
    <div className="p-4">
      <h1 className=" font-semibold">Pending Shift Swap Requests </h1>
      <ul className="flex flex-col gap-8 mt-4">
        {requests &&
          requests.map((request) => (
            <li
              className=" py-2 px-1 flex items-center border rounded-md"
              key={request._id}
            >
              <p className="">{request.message}</p>
              <button
                className="border py-2 px-1 rounded-md bg-green-400"
                onClick={() => handleApprove(request._id)}
              >
                Approve
              </button>
              <button
                className="border py-2 px-1 rounded-md bg-red-400"
                onClick={() => handleDecline(request._id)}
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
