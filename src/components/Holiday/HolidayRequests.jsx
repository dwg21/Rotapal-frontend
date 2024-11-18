import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import ServerApi from "@/serverApi/axios";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const HolidayRequests = () => {
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [holidayRequests, setHolidayRequests] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      console.log(formattedDate);
      await ServerApi.post("/api/v1/holidays/book-holiday", {
        date: formattedDate,
      });
      setSuccess(true);
      setDate(null);
      setIsCalendarOpen(false);
    } catch (error) {
      setError(
        error.response ? error.response.data.error : "Error booking holiday"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingHolidays = useCallback(async () => {
    try {
      const { data } = await ServerApi.get(`/api/v1/holidays/getUserHolidays`, {
        withCredentials: true,
      });
      console.log(data.holidays);
      setHolidayRequests(data.holidays);
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchPendingHolidays();
  }, [fetchPendingHolidays]);

  // const sortedHolidays = [...holidayRequests].sort(
  //   (a, b) => new Date(a.date) - new Date(b.date)
  // );

  return (
    <div className="flex flex-col p-6 w-full min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold my-6">Holidays</h2>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-blue-500" />
            <CardTitle>Request Holiday</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Holiday request submitted successfully
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="flex space-x-2">
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : "Pick a date"}
                        <CalendarDays className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center">
                  <div className="flex-grow h-px bg-gray-200" />
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-grow h-px bg-gray-200" />
                </div>

                <Input
                  type="date"
                  value={date ? format(date, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const newDate = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setDate(newDate);
                  }}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!date || isLoading}
            className="w-full"
          >
            {isLoading ? "Submitting..." : "Request Holiday"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Clock className="text-muted-foreground" />
          <CardTitle className="text-lg">Pending Holiday Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {holidayRequests.length === 0 ? (
            <div className="text-muted-foreground text-center py-4">
              No pending holiday requests
            </div>
          ) : (
            <ul className="space-y-2">
              {holidayRequests.map((holiday) => (
                <li
                  key={holiday.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                >
                  <span className="font-medium">
                    {format(parseISO(holiday.date), "MMMM d, yyyy")}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-yellow-600 border-yellow-600"
                  >
                    {holiday.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayRequests;
