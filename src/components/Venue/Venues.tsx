import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon, Eye, Edit, BarChart2, Clock } from "lucide-react";
import useVenues from "../../hooks/useVenues"; // Adjust the path if needed

const Venues = () => {
  const navigate = useNavigate();
  const { venuesData: venues, loading, error } = useVenues();

  const handleViewRota = (venueId: string) => {
    localStorage.setItem("selectedVenueID", venueId);
    navigate(`/rota/${venueId}`);
  };

  const handleEditRota = (venueId: string) => {
    navigate(`/editvenue/${venueId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Rotas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Rotas</h1>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          You can create a new Rota for a new Venue or for a separate section or
          team of one venue.
        </AlertDescription>
      </Alert>
      {venues.length === 0 ? (
        <Alert>
          <AlertTitle>No venues found</AlertTitle>
          <AlertDescription>
            You haven't added any venues yet. Start by creating a new venue to
            manage your rotas.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue._id}>
              <CardHeader>
                <CardTitle>{venue.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Address:</strong> {venue.address}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Phone:</strong> {venue.phone}
                </p>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> Opening Hours
                  </h3>
                  <ul className="text-sm space-y-1">
                    {Object.entries(venue.openingHours || {}).map(
                      ([day, hours]) => (
                        <li key={day} className="flex justify-between">
                          <span>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </span>
                          <span>
                            {hours.open
                              ? `${hours.open} - ${hours.close}`
                              : "Hours not available"}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-around gap-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewRota(venue._id)}
                >
                  <Eye className="mr-2 h-4 w-4" /> View Rota
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRota(venue._id)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Details
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" /> Statistics
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Venues;
