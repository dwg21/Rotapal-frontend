import React, { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../Context/UserContext";
import ServerApi from "../../serverApi/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Trash2, Clock, Users } from "lucide-react";

const CreateVenue = () => {
  const [employees, setEmployees] = useState([]);
  const { register, handleSubmit, reset, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });
  const navigate = useNavigate();
  const { state } = userContext();

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(`api/v1/business/getEmployees`, {
        withCredentials: true,
      });
      setEmployees(data.employees);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onSubmit = async (data) => {
    try {
      const response = await ServerApi.post("/api/v1/venue/venues", data);
      console.log("Venue created successfully:", response.data);
      reset();
      navigate("/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
    }
  };

  const handleAddExistingEmployee = (employee) => {
    append({
      name: employee.name,
      email: employee.email,
      hourlyWage: employee.hourlyWage,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Venue</h1>
      {state.loggedIn && (
        <Alert className="mb-6">
          <AlertDescription>Welcome, {state.userData.name}!</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Venue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic-info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="opening-hours">Opening Hours</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>
              <TabsContent value="basic-info" className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    placeholder="Venue Name"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Venue Address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Venue Phone"
                  />
                </div>
              </TabsContent>
              <TabsContent value="opening-hours">
                <div className="space-y-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Label className="w-24">{day}</Label>
                      <Controller
                        name={`openingHours.${day.toLowerCase()}.open`}
                        control={control}
                        render={({ field }) => <Input type="time" {...field} />}
                      />
                      <Controller
                        name={`openingHours.${day.toLowerCase()}.close`}
                        control={control}
                        render={({ field }) => <Input type="time" {...field} />}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="staff">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Existing Staff</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                      <Card key={employee._id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.name}`}
                              />
                              <AvatarFallback>
                                {employee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{employee.name}</p>
                              <p className="text-sm text-gray-500">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddExistingEmployee(employee)}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mt-6">Added Staff</h3>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <Input
                              {...register(`employees.${index}.name`, {
                                required: true,
                              })}
                              placeholder="Employee Name"
                              className="mb-2"
                            />
                            <Input
                              {...register(`employees.${index}.email`, {
                                required: true,
                              })}
                              placeholder="Employee Email"
                              className="mb-2"
                            />
                            <Input
                              {...register(`employees.${index}.hourlyWage`, {
                                required: true,
                              })}
                              type="number"
                              placeholder="Hourly Wage"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <Button type="submit" className="w-full">
              Create Venue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVenue;
