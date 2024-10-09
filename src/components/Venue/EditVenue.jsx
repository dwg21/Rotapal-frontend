// import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import ServerApi from "../../serverApi/axios";

// const EditVenue = () => {
//   const { venueId } = useParams();
//   const [venue, setVenue] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [editingField, setEditingField] = useState(null); // Track the field being edited
//   const [searchTerm, setSearchTerm] = useState(""); // For searching employees by name
//   const [selectedEmployee, setSelectedEmployee] = useState(null); // To store the selected employee

//   useEffect(() => {
//     const fetchVenueDetails = async () => {
//       try {
//         const response = await ServerApi.get(`api/v1/venue/venues/${venueId}`);
//         setVenue(response.data.venue);
//       } catch (err) {
//         console.error("Failed to fetch venue details", err);
//       }
//     };

//     fetchVenueDetails();
//   }, [venueId]);

//   const fetchEmployees = useCallback(async () => {
//     try {
//       const { data } = await ServerApi.get(`api/v1/business/getEmployees`, {
//         withCredentials: true,
//       });
//       setEmployees(data.employees);
//       console.log(data.employees);
//     } catch (err) {
//       console.log(err.stack);
//     }
//   }, [venueId]);

//   useEffect(() => {
//     fetchEmployees();
//   }, [fetchEmployees]);

//   // Filter employees based on search term
//   const filteredEmployees = employees.filter((employee) =>
//     employee.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddStaff = async () => {
//     if (!selectedEmployee) {
//       alert("Please select an employee to add.");
//       return;
//     }

//     try {
//       await ServerApi.post(`api/v1/venue/venues/${venueId}/addStaff`, {
//         employeeId: selectedEmployee._id,
//       });
//       alert("Staff added successfully");
//       // Fetch updated venue details to include the new staff member
//       const updatedVenue = await ServerApi.get(
//         `api/v1/venue/venues/${venueId}`
//       );
//       setVenue(updatedVenue.data.venue);
//       setSelectedEmployee(null); // Reset selection after adding
//       setSearchTerm(""); // Reset search input
//     } catch (err) {
//       console.error("Failed to add staff", err);
//     }
//   };

//   const handleFieldChange = (field, value) => {
//     setVenue((prevVenue) => ({
//       ...prevVenue,
//       [field]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       await ServerApi.put(`api/v1/venue/venues/${venueId}`, venue);
//       alert("Venue updated successfully");
//       setEditingField(null); // Reset after save
//     } catch (err) {
//       console.error("Failed to save venue", err);
//     }
//   };

//   const handleRemoveStaff = async (staffId) => {
//     try {
//       await ServerApi.post(`api/v1/venue/venues/${venueId}/removeStaff`, {
//         staffId,
//       });
//       alert("Staff removed successfully");
//       const updatedVenue = await ServerApi.get(
//         `api/v1/venue/venues/${venueId}`
//       );
//       setVenue(updatedVenue.data.venue);
//     } catch (err) {
//       console.error("Failed to remove staff", err);
//     }
//   };

//   const handleMakeAdmin = async (staffId) => {
//     try {
//       await ServerApi.post(`api/v1/venue/venues/${venueId}/makeAdmin`, {
//         staffId,
//       });
//       alert("Staff promoted to Admin");
//       const updatedVenue = await ServerApi.get(
//         `api/v1/venue/venues/${venueId}`
//       );
//       setVenue(updatedVenue.data.venue);
//     } catch (err) {
//       console.error("Failed to promote staff", err);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       {venue ? (
//         <>
//           <h2 className="text-2xl font-bold mb-6">Edit Venue: {venue.name}</h2>

//           {/* Editable Venue Fields */}
//           <div className="mb-4">
//             <label className="block font-semibold">Venue Name</label>
//             <input
//               type="text"
//               value={venue.name}
//               onChange={(e) => handleFieldChange("name", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded mt-1"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-semibold">Address</label>
//             <input
//               type="text"
//               value={venue.address}
//               onChange={(e) => handleFieldChange("address", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded mt-1"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-semibold">Phone</label>
//             <input
//               type="text"
//               value={venue.phone}
//               onChange={(e) => handleFieldChange("phone", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded mt-1"
//             />
//           </div>

//           {/* Save Button */}
//           <div className="mb-6">
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//           </div>

//           {/* Employees Section */}
//           <h3 className="text-xl font-bold mt-8 mb-4">Employees</h3>
//           {venue.employees.length > 0 ? (
//             <ul className="space-y-4">
//               {venue.employees.map((employee) => (
//                 <li key={employee._id} className="border-b pb-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p>
//                         <strong>Name:</strong> {employee.name}
//                       </p>
//                       <p>
//                         <strong>Email:</strong> {employee.email}
//                       </p>
//                       <p>
//                         <strong>Hourly Wage:</strong> ${employee.hourlyWage}
//                       </p>
//                       <p>
//                         <strong>Account type:</strong> {employee.role}
//                       </p>
//                     </div>
//                     <div className="flex space-x-4">
//                       <button
//                         onClick={() => handleMakeAdmin(employee._id)}
//                         className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                       >
//                         Make Admin
//                       </button>
//                       <button
//                         onClick={() => handleRemoveStaff(employee._id)}
//                         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No employees assigned to this venue.</p>
//           )}

//           {/* Add New Employee */}
//           {/* Add New Employee Section with Search */}
//           <h4 className="text-lg font-bold mt-6 mb-2">Add New Employee</h4>
//           <div className="relative mb-6">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search employee by name"
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             {/* Dropdown showing filtered employees */}
//             {filteredEmployees.length > 0 && searchTerm && (
//               <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto z-10">
//                 {filteredEmployees.map((employee) => (
//                   <li
//                     key={employee._id}
//                     onClick={() => {
//                       setSelectedEmployee(employee);
//                       setSearchTerm(employee.name); // Set search term to selected employee's name
//                       setSearchTerm("");
//                     }}
//                     className="p-2 cursor-pointer hover:bg-gray-100"
//                   >
//                     {employee.name} - {employee.email}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Display selected employee */}
//           {selectedEmployee && (
//             <div className="mb-4">
//               <p>
//                 <strong>Selected Employee:</strong> {selectedEmployee.name} -{" "}
//                 {selectedEmployee.email}
//               </p>
//             </div>
//           )}

//           <button
//             onClick={handleAddStaff}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Add Staff
//           </button>
//         </>
//       ) : (
//         <p>Loading venue details...</p>
//       )}
//     </div>
//   );
// };

// export default EditVenue;
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, UserMinus, ShieldCheck, Save } from "lucide-react";

const EditVenue = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await ServerApi.get(`api/v1/venue/venues/${venueId}`);
        setVenue(response.data.venue);
      } catch (err) {
        console.error("Failed to fetch venue details", err);
        setAlertInfo({
          type: "error",
          message: "Failed to fetch venue details",
        });
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(`api/v1/business/getEmployees`, {
        withCredentials: true,
      });
      setEmployees(data.employees);
    } catch (err) {
      console.log(err.stack);
      setAlertInfo({ type: "error", message: "Failed to fetch employees" });
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = async () => {
    if (!selectedEmployee) {
      setAlertInfo({
        type: "warning",
        message: "Please select an employee to add.",
      });
      return;
    }

    try {
      await ServerApi.post(`api/v1/venue/venues/${venueId}/addStaff`, {
        employeeId: selectedEmployee._id,
      });
      setAlertInfo({ type: "success", message: "Staff added successfully" });
      const updatedVenue = await ServerApi.get(
        `api/v1/venue/venues/${venueId}`
      );
      setVenue(updatedVenue.data.venue);
      setSelectedEmployee(null);
      setSearchTerm("");
    } catch (err) {
      console.error("Failed to add staff", err);
      setAlertInfo({ type: "error", message: "Failed to add staff" });
    }
  };

  const handleFieldChange = (field, value) => {
    setVenue((prevVenue) => ({
      ...prevVenue,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await ServerApi.put(`api/v1/venue/venues/${venueId}`, venue);
      setAlertInfo({ type: "success", message: "Venue updated successfully" });
    } catch (err) {
      console.error("Failed to save venue", err);
      setAlertInfo({ type: "error", message: "Failed to save venue" });
    }
  };

  const handleRemoveStaff = async (staffId) => {
    try {
      await ServerApi.post(`api/v1/venue/venues/${venueId}/removeStaff`, {
        staffId,
      });
      setAlertInfo({ type: "success", message: "Staff removed successfully" });
      const updatedVenue = await ServerApi.get(
        `api/v1/venue/venues/${venueId}`
      );
      setVenue(updatedVenue.data.venue);
    } catch (err) {
      console.error("Failed to remove staff", err);
      setAlertInfo({ type: "error", message: "Failed to remove staff" });
    }
  };

  const handleMakeAdmin = async (staffId) => {
    try {
      await ServerApi.post(`api/v1/venue/venues/${venueId}/makeAdmin`, {
        staffId,
      });
      setAlertInfo({ type: "success", message: "Staff promoted to Admin" });
      const updatedVenue = await ServerApi.get(
        `api/v1/venue/venues/${venueId}`
      );
      setVenue(updatedVenue.data.venue);
    } catch (err) {
      console.error("Failed to promote staff", err);
      setAlertInfo({ type: "error", message: "Failed to promote staff" });
    }
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
                <Button onClick={handleSave} className="w-full">
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
                    {venue.employees.map((employee) => (
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
                              onClick={() => handleMakeAdmin(employee._id)}
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
                    <Button onClick={handleAddStaff}>
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
