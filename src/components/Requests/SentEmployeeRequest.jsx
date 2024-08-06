import React from "react";

const SentEmployeeRequest = ({ requests }) => {
  console.log(requests);
  return (
    <div className="p-4">
      <h1 className=" font-semibold">Sent Shift Swap Requests</h1>
      <ul className="flex flex-col gap-8 mt-4">
        {requests?.map((request) => (
          <li
            className=" py-2 px-1 flex items-center border rounded-md"
            key={request._id}
          >
            <p className="">{request.message}</p>
            <p className="">{request.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentEmployeeRequest;
