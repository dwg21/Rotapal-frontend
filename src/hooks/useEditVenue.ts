import { useState, useEffect, useCallback } from "react";
import ServerApi from "../serverApi/axios";
import { Employee } from "../types/employee";
import { Venue } from "../types/venue";

interface AlertInfo {
  type: "success" | "error" | "warning";
  message: string;
}

export const useEditVenue = (venueId: string | undefined) => {
  console.log(venueId);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null);

  // Fetch venue details
  const fetchVenueDetails = useCallback(async () => {
    try {
      const response = await ServerApi.get(`api/v1/venue/venues/${venueId}`);
      setVenue(response.data.venue);
    } catch (err) {
      console.error("Failed to fetch venue details", err);
      setAlertInfo({ type: "error", message: "Failed to fetch venue details" });
    }
  }, [venueId]);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(`api/v1/business/getEmployees`, {
        withCredentials: true,
      });
      console.log(data);
      setEmployees(data.employees);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setAlertInfo({ type: "error", message: "Failed to fetch employees" });
    }
  }, []);

  // Update venue details
  const handleSave = async (updatedVenue: Venue) => {
    try {
      await ServerApi.put(`api/v1/venue/venues/${venueId}`, updatedVenue);
      setAlertInfo({ type: "success", message: "Venue updated successfully" });
      fetchVenueDetails();
    } catch (err) {
      console.error("Failed to save venue", err);
      setAlertInfo({ type: "error", message: "Failed to save venue" });
    }
  };

  // Add staff to venue
  const handleAddStaff = async (employeeId: string) => {
    console.log(employeeId, venueId);
    try {
      await ServerApi.post(`api/v1/venue/venues/${venueId}/addStaff`, {
        employeeId,
      });
      setAlertInfo({ type: "success", message: "Staff added successfully" });
      fetchVenueDetails();
    } catch (err) {
      console.error("Failed to add staff", err);
      setAlertInfo({ type: "error", message: "Failed to add staff" });
    }
  };

  // Remove staff from venue
  const handleRemoveStaff = async (employeeId: string) => {
    try {
      await ServerApi.post(`api/v1/venue/venues/${venueId}/removeStaff`, {
        employeeId,
      });
      setAlertInfo({ type: "success", message: "Staff removed successfully" });
      fetchVenueDetails();
    } catch (err) {
      console.error("Failed to remove staff", err);
      setAlertInfo({ type: "error", message: "Failed to remove staff" });
    }
  };

  // Promote staff to admin
  const handleMakeAdmin = async (employeeId: string) => {
    console.log("id ", employeeId);
    try {
      await ServerApi.post(`api/v1/venue/venues/${venueId}/makeAdmin`, {
        employeeId,
      });
      setAlertInfo({ type: "success", message: "Staff promoted to Admin" });
      fetchVenueDetails();
    } catch (err) {
      console.error("Failed to promote staff", err);
      setAlertInfo({ type: "error", message: "Failed to promote staff" });
    }
  };

  useEffect(() => {
    if (venueId) {
      fetchVenueDetails();
      fetchEmployees();
    }
  }, [venueId, fetchVenueDetails, fetchEmployees]);

  return {
    venue,
    setVenue,
    employees,
    alertInfo,
    setAlertInfo,
    handleSave,
    handleAddStaff,
    handleRemoveStaff,
    handleMakeAdmin,
  };
};
