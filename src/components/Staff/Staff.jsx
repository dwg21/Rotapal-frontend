import React, { useState } from "react";
import { useRota } from "../../RotaContext";

const currentStaff = ["Daniel", "Nat", "Molley", "Andrew"];

const Staff = () => {
  const { rota, addNewStaff } = useRota();
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffWage, setNewStaffWage] = useState(null);

  const handleAddNewStaff = (e) => {
    e.preventDefault();
    addNewStaff(newStaffName);
    setNewStaffName("");
  };

  return (
    <div className="p-4">
      <p className="font-bold text-2xl">Staff List</p>
      {rota.map((staff) => (
        <p>{staff.name}</p>
      ))}

      <form onSubmit={handleAddNewStaff} className="mt-4">
        <input
          type="text"
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
          placeholder="New staff name"
          className="border px-2 py-1"
        />
        <input
          type="number"
          value={newStaffWage}
          onChange={(e) => setNewStaffWage(e.target.value)}
          placeholder="New staff hourly salary"
          className="border px-2 py-1 mx-3"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-1 border rounded bg-blue-500 text-white"
        >
          Add Staff
        </button>
      </form>
    </div>
  );
};

export default Staff;
