import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import { useRota } from "../../RotaContext";
import { useForm } from "react-hook-form";

const VenueDetails = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const navigate = useNavigate();
  const [venue, setVenue] = useState({
    name: "",
    address: "",
    phone: "",
    openingHours: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch venue details when the component mounts
  useEffect(() => {
    console.log("Venue ID:", selectedVenueId); // Log the venue ID
    if (selectedVenueId) {
      const fetchVenue = async () => {
        try {
          const response = await ServerApi.get(
            `/api/v1/venue/venues/${selectedVenueId}`
          );
          console.log(response);
          setVenue(response.data.venue);
          setLoading(false);
        } catch (err) {
          setError("Error fetching venue details");
          setLoading(false);
        }
      };

      fetchVenue();
    } else {
      setError("Invalid venue ID");
      setLoading(false);
    }
  }, [selectedVenueId]);

  // Handle form submission to update venue details
  const onSubmit = async (data) => {
    try {
      const response = await ServerApi.put(
        `/api/v1/venue/venues/${selectedVenueId}`,
        data
      );
      console.log("Venue updated successfully:", response.data);
      navigate("/venues"); // Navigate back to the venues list
    } catch (error) {
      setError("Error updating venue");
      console.error("Error updating venue:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Venue Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name:</label>
          <input
            type="text"
            name="name"
            defaultValue={venue.name}
            {...register("name", { required: true })}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Address:
          </label>
          <input
            type="text"
            name="address"
            defaultValue={venue.address}
            {...register("address", { required: true })}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">Address is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Phone:</label>
          <input
            type="text"
            name="phone"
            defaultValue={venue.phone}
            {...register("phone", { required: true })}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Phone number is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Opening Hours:
          </label>
          <ul>
            {Object.keys(venue.openingHours).map((day) => (
              <li key={day} className="mb-2">
                <span className="font-semibold">
                  {day.charAt(0).toUpperCase() + day.slice(1)}:
                </span>{" "}
                <input
                  type="text"
                  name={`openingHours.${day}.open`}
                  defaultValue={venue.openingHours[day].open}
                  {...register(`openingHours.${day}.open`, { required: true })}
                  placeholder="Open"
                  className="border border-gray-300 w-16 p-1 rounded-md mr-2"
                />
                -
                <input
                  type="text"
                  name={`openingHours.${day}.close`}
                  defaultValue={venue.openingHours[day].close}
                  {...register(`openingHours.${day}.close`, { required: true })}
                  placeholder="Close"
                  className="border border-gray-300 p-1 w-16 rounded-md ml-2"
                />
              </li>
            ))}
          </ul>
          {errors.openingHours && (
            <p className="text-red-500 text-sm">
              All opening hours are required.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default VenueDetails;
