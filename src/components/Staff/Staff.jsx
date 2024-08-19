import React, { useState, useEffect, useCallback } from "react";
import { useRota } from "../../RotaContext";
import ServerApi from "../../serverApi/axios";

const Staff = () => {
  const { selectedvenueID } = useRota();
  const [employees, setEmployees] = useState([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({
    name: "",
    email: "",
    hourlyWage: "",
  });

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(
        `api/v1/venue/${selectedvenueID}/employees`,
        { withCredentials: true }
      );
      setEmployees(data.employees.employees);
      console.log(data.employees.employees);
    } catch (err) {
      console.log(err);
    }
  }, [selectedvenueID]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (employeeId) => {
    try {
      await ServerApi.delete(`api/v1/employee/${employeeId}`, {
        withCredentials: true,
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployeeId(employee._id);
    setEditedEmployee({
      name: employee.name,
      email: employee.email,
      hourlyWage: employee.hourlyWage,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await ServerApi.put(
        `api/v1/employee/${editingEmployeeId}`,
        editedEmployee,
        { withCredentials: true }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === editingEmployeeId
            ? { ...employee, ...editedEmployee }
            : employee
        )
      );
      setEditingEmployeeId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="p-2 text-xl font-bold">View/Edit Employees</h1>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="border rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                    >
                      Wage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Account Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees &&
                    employees.map((employee) => (
                      <tr key={employee._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {editingEmployeeId === employee._id ? (
                            <input
                              type="text"
                              name="name"
                              value={editedEmployee.name}
                              onChange={handleEditChange}
                              className="border px-2 py-1 rounded"
                            />
                          ) : (
                            employee.name
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {editingEmployeeId === employee._id ? (
                            <input
                              type="email"
                              name="email"
                              value={editedEmployee.email}
                              onChange={handleEditChange}
                              className="border px-2 py-1 rounded"
                            />
                          ) : (
                            employee.email
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {editingEmployeeId === employee._id ? (
                            <input
                              type="number"
                              name="hourlyWage"
                              value={editedEmployee.hourlyWage}
                              onChange={handleEditChange}
                              className="border px-2 py-1 rounded"
                            />
                          ) : (
                            employee.hourlyWage
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          {editingEmployeeId === employee._id ? (
                            <button
                              type="button"
                              onClick={handleEditSubmit}
                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-green-600 hover:text-green-800 focus:outline-none focus:text-green-800"
                            >
                              Submit
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleEdit(employee)}
                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-green-600 hover:text-green-800 focus:outline-none focus:text-green-800"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleDelete(employee._id)}
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800"
                          >
                            Delete
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          Account Created
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
