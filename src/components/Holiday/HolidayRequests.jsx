import React from "react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarDays, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
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
      // Simulated API call - replace with your actual API
      // await ServerApi.post("/api/v1/holidays/book-holiday", { date: formattedDate });
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
    </div>
  );
};

export default HolidayRequests;
