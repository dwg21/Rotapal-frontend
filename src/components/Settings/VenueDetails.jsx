import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServerApi from "../../serverApi/axios";
import { useForm } from "react-hook-form";

import { Building2, Clock, Building, Phone, MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

// VenueDetails Component
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
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (selectedVenueId) {
      const fetchVenue = async () => {
        try {
          const response = await ServerApi.get(
            `/api/v1/venue/venues/${selectedVenueId}`
          );
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

  const onSubmit = async (data) => {
    try {
      await ServerApi.put(`/api/v1/venue/venues/${selectedVenueId}`, data);
      navigate("/venues");
    } catch (error) {
      setError("Error updating venue");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Edit Venue Details
        </CardTitle>
        <CardDescription>
          Update your venue's information and opening hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Venue Name
              </Label>
              <Input
                id="name"
                defaultValue={venue.name}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                defaultValue={venue.address}
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                defaultValue={venue.phone}
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Opening Hours
              </Label>
              <div className="grid gap-4">
                {Object.keys(venue.openingHours).map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="w-24 font-medium">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        defaultValue={venue.openingHours[day].open}
                        {...register(`openingHours.${day}.open`, {
                          required: true,
                        })}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        defaultValue={venue.openingHours[day].close}
                        {...register(`openingHours.${day}.close`, {
                          required: true,
                        })}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VenueDetails;
