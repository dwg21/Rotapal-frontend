import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, UserMinus, ShieldCheck, Save } from "lucide-react";
import { Employee } from "../types/employee";

import { useEditVenue } from "@/hooks/useEditVenue";

//Todo add lovcl vtemp venu var

export const EditVenue = () => {
  const { venueId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const {
    venue,
    setVenue,
    employees,
    alertInfo,
    setAlertInfo,
    handleSave,
    handleAddStaff,
    handleRemoveStaff,
    handleMakeAdmin,
  } = useEditVenue(venueId);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleFieldChange = (field: string, value: string) => {
    setVenue((prevVenue) => {
      if (prevVenue === null) return null; // Return null if prevVenue is null
      return {
        ...prevVenue,
        [field]: value,
      };
    });
  };

  if (!venue) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Venue: {venue.name}</h1>

      {alertInfo && (
        <Alert variant={alertInfo.type} className="mb-6">
          <AlertTitle>
            {alertInfo.type === "error" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alertInfo.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Venue Details</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Venue Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Venue Name</Label>
                    <Input
                      id="name"
                      value={venue.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={venue.address}
                      onChange={(e) =>
                        handleFieldChange("address", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={venue.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSave(venue)} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {venue.employees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.employees.map((employee: Employee) => (
                      <Card key={employee._id}>
                        <CardContent className="flex items-center space-x-4 p-4">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.name}`}
                            />
                            <AvatarFallback>
                              {employee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold">
                              {employee.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {employee.email}
                            </p>
                            <p className="text-sm">
                              Hourly Wage: ${employee.hourlyWage}
                            </p>
                            <p className="text-sm">Role: {employee.role}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMakeAdmin(employee?._id)}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" /> Admin
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveStaff(employee._id)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" /> Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No employees assigned to this venue.</p>
                )}

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Add New Employee
                  </h3>
                  <div className="flex space-x-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search employee by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                      {filteredEmployees.length > 0 && searchTerm && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg">
                          {filteredEmployees.map((employee) => (
                            <li
                              key={employee._id}
                              onClick={() => {
                                setSelectedEmployee(employee);
                                console.log(selectedEmployee);
                                setSearchTerm(employee.name);
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {employee.name} - {employee.email}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAddStaff(selectedEmployee?._id)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Add Staff
                    </Button>
                  </div>
                  {selectedEmployee && (
                    <p className="mt-2">
                      <strong>Selected:</strong> {selectedEmployee.name} -{" "}
                      {selectedEmployee.email}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditVenue;
