import React, { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import ServerApi from "../../serverApi/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Employee {
  _id: string;
  name: string;
  email: string;
  hourlyWage: string;
  role?: string;
}

interface newEmployee {
  name: string;
  email: string;
  wage: string;
}

const Staff = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    wage: "",
    email: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(`api/v1/business/getEmployees`, {
        withCredentials: true,
      });
      setEmployees(data.employees);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
    }
  }, [selectedVenueId]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (employeeId: string) => {
    try {
      await ServerApi.delete(`api/v1/employee/${employeeId}`, {
        withCredentials: true,
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await ServerApi.put(
        `api/v1/employee/${editingEmployee?._id}`,
        editingEmployee,
        { withCredentials: true }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === editingEmployee?._id
            ? { ...employee, ...editingEmployee }
            : employee
        )
      );
      setIsEditDialogOpen(false);
    } catch (err) {
      setError("Failed to update employee. Please try again.");
    }
  };

  const handleNewEmployeeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
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
      setNewEmployee({ name: "", wage: "", email: "" });
      setIsAddDialogOpen(false);
    } catch (err) {
      setError("Failed to add new employee. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Staff Management
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Wage</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>${employee.hourlyWage}/hr</TableCell>
                  <TableCell>{employee.role || "Employee"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(employee._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitNewEmployee();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleNewEmployeeChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={handleNewEmployeeChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="wage">Hourly Wage</Label>
                <Input
                  id="wage"
                  name="wage"
                  type="number"
                  value={newEmployee.wage}
                  onChange={handleNewEmployeeChange}
                  required
                />
              </div>
              <Button type="submit">Add Employee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingEmployee.name}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-wage">Hourly Wage</Label>
                <Input
                  id="edit-wage"
                  type="number"
                  value={editingEmployee.hourlyWage}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      hourlyWage: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button type="submit">Update Employee</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
