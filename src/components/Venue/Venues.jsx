import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { useNavigate } from "react-router";
import { FaInfoCircle } from "react-icons/fa";

const VenueUrl = "api/v1/venue/venues";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await ServerApi.get(VenueUrl, {
          withCredentials: true,
        });
        console.log(response.data.venues);
        setVenues(response.data.venues);
      } catch (err) {
        setError("Failed to fetch venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handleViewRota = (index) => {
    const selectedVenueId = venues[index]._id;
    localStorage.setItem("selectedVenueID", selectedVenueId); // Save to local storage
    navigate(`/rota/${selectedVenueId}`);
  };

  const handleEditRota = (index) => {
    const selectedVenueId = venues[index]._id;
    navigate(`/editvenue/${selectedVenueId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 font-MainFont">My Rotas</h1>
      <span>
        <FaInfoCircle />
        <p>
          You can create a new Rota for a new Venue or for a sepearte section or
          team of one venue.
        </p>
      </span>
      {venues.length === 0 ? (
        <div className="text-center">No venues found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue, venueIndex) => (
            <div key={venue._id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold">{venue.name}</h2>
              <p>
                <strong>Address:</strong> {venue.address}
              </p>
              <p>
                <strong>Phone:</strong> {venue.phone}
              </p>
              <div>
                <strong>Opening Hours:</strong>
                <ul>
                  {Object.keys(venue.openingHours).map((day) => (
                    <li key={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                      {venue.openingHours[day].open} -{" "}
                      {venue.openingHours[day].close}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <button
                  className="my-2 border rounded-md "
                  onClick={() => handleViewRota(venueIndex)}
                >
                  <p className="p-2">View Rota</p>
                </button>
                <button
                  onClick={() => handleEditRota(venueIndex)}
                  className="my-2 border rounded-md flex"
                >
                  <p className="p-2">Edit Rota Details</p>
                </button>
                <button className="my-2 border rounded-md flex">
                  <p className="p-2">View Statistics</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Venues;
