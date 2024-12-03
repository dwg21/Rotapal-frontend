import React, { useState, useEffect, useCallback } from "react";
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
import { CalendarDays, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HolidayRequest {
  id: string;
  date: string;
  status: string;
}

type StatusType = "error" | "success" | "loading" | "";

interface Status {
  message: string;
  type: StatusType;
}

const HolidayRequests = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<Status>({ message: "", type: "" });
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [holidayRequests, setHolidayRequests] = useState<HolidayRequest[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setStatus({ message: "Please select a date", type: "error" });
      return;
    }

    setStatus({ message: "Submitting...", type: "loading" });

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      await ServerApi.post("/api/v1/holidays/book-holiday", {
        date: formattedDate,
      });
      setStatus({
        message: "Holiday request submitted successfully",
        type: "success",
      });
      setDate(null);
      setIsCalendarOpen(false);
    } catch (error: any) {
      setStatus({
        message: error.response
          ? error.response.data.error
          : "Error booking holiday",
        type: "error",
      });
    }
  };

  const fetchPendingHolidays = useCallback(async () => {
    try {
      const { data } = await ServerApi.get("/api/v1/holidays/getUserHolidays", {
        withCredentials: true,
      });
      setHolidayRequests(data.holidays);
    } catch (err) {
      setStatus({
        message: "Failed to fetch holidays. Please try again.",
        type: "error",
      });
    }
  }, []);

  useEffect(() => {
    fetchPendingHolidays();
  }, [fetchPendingHolidays]);

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
          {status.type === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {status.type === "success" && (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {status.type === "loading" && (
            <Alert className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
              <Clock className="h-4 w-4" />
              <AlertTitle>Loading</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
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
                        selected={date ?? undefined} // Pass `undefined` if `date` is null
                        onSelect={(date) => {
                          if (date) {
                            setDate(date); // Only set `date` if it's not `undefined`
                          } else {
                            setDate(null); // Set to null if date is `undefined`
                          }
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
            disabled={!date || status.type === "loading"}
            className="w-full"
          >
            {status.type === "loading" ? "Submitting..." : "Request Holiday"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HolidayRequests;
