import React, { useState, useEffect, useCallback } from "react";
import ServerApi from "../../serverApi/axios";

const Staff = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [employees, setEmployees] = useState([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({
    name: "",
    hourlyWage: "",
  });

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(`api/v1/business/getEmployees`, {
        withCredentials: true,
      });
      setEmployees(data.employees);
    } catch (err) {
      console.log(err.stack);
    }
  }, [selectedVenueId]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Delete employee
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

  // Edit employee
  const handleEdit = (employee) => {
    setEditingEmployeeId(employee._id);
    setEditedEmployee({
      name: employee.name,
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

  // For adding a new employee
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    wage: 0,
    email: "",
  });

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitNewEmployee = async () => {
    try {
      const { data } = await ServerApi.post(
        `api/v1/business/addEmployee`,
        {
          name: newEmployee.name,
          email: newEmployee.email,
          hourlyWage: newEmployee.wage,
        },
        { withCredentials: true }
      );
      setEmployees((prev) => [...prev, data.employee]);
      setNewEmployee({ name: "", wage: 0, email: "" });
    } catch (err) {
      console.error("Error adding new employee:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="p-2 text-2xl font-bold text-gray-900">
        View/Edit Employees
      </h1>
      <p className="p-2 mb-4 text-gray-700">
        Manage your staff information. Only Admins can add, edit, or delete
        staff.
      </p>

      <div className="flex flex-col">
        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-full align-middle">
            <div className="border rounded-lg shadow overflow-hidden w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                      Wage
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                      Edit
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                      Delete
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                      Account Status
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
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
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
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
                      <td className="px-6 py-4 text-end text-sm font-medium">
                        {editingEmployeeId === employee._id ? (
                          <button
                            type="button"
                            onClick={handleEditSubmit}
                            className="text-green-600 hover:text-green-800"
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEdit(employee)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleDelete(employee._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="px-6 py-4 text-end text-sm font-medium">
                        Account Created
                      </td>
                      <td className="px-6 py-4 text-end text-sm font-medium">
                        {employee.role ? employee.role : "Employee"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add New Employee Section */}
        <h2 className="mt-8 text-xl font-bold text-gray-900">
          Add New Employee
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitNewEmployee();
          }}
          className="mt-4 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newEmployee.name}
              onChange={handleNewEmployeeChange}
              className="border px-4 py-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={handleNewEmployeeChange}
              className="border px-4 py-2 rounded w-full"
              required
            />
            <input
              type="number"
              name="wage"
              placeholder="Hourly Wage"
              value={newEmployee.wage}
              onChange={handleNewEmployeeChange}
              className="border px-4 py-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default Staff;
