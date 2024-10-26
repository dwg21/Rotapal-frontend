import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const RotaTableResponsive = ({
  rota,
  setRota,
  dates = [],
  updateRota,
  selectedWeek,
  setSelectedWeek,
  archived,
}) => {
  const [showCost, setShowCost] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);

  const calculateStaffCost = (person) => {
    const totalHours = person.schedule.reduce((sum, shift) => {
      if (
        shift.shiftData &&
        shift.shiftData.startTime &&
        shift.shiftData.endTime
      ) {
        const start = new Date(`1970-01-01T${shift.shiftData.startTime}`);
        const end = new Date(`1970-01-01T${shift.shiftData.endTime}`);
        const hoursWorked = (end - start) / (1000 * 60 * 60);
        return sum + hoursWorked;
      }
      return sum;
    }, 0);
    return totalHours * person.hourlyWage;
  };

  const calculateTotalCost = () => {
    return rota.reduce((sum, person) => sum + calculateStaffCost(person), 0);
  };

  const handleChangeWeek = (direction) => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek((prev) => prev - 1);
    }
  };

  const handleDaySelect = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const selectedDate =
    Array.isArray(dates) && dates.length > 0 ? dates[selectedDay] : null;
  const formattedDate = selectedDate
    ? formatSelectedDate(selectedDate)
    : "No date available";

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Rota Schedule</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-cost">Show Costs</Label>
            <Switch
              id="show-cost"
              checked={showCost}
              onCheckedChange={setShowCost}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center font-medium text-lg text-primary">
            {formattedDate}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChangeWeek("left")}
              disabled={selectedWeek === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {daysOfWeek.map((day, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant={
                          selectedDay === index + currentWeek * 7
                            ? "default"
                            : "outline"
                        }
                        className="w-12 h-12 rounded-full"
                        onClick={() => handleDaySelect(index + currentWeek * 7)}
                      >
                        {day.charAt(0)}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{day}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChangeWeek("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {rota?.map((person, personIndex) => (
                <Card key={person.employee} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                          {person.employeeName}
                        </h3>
                        {person.schedule[selectedDay]?.shiftData
                          ?.holidayBooked ? (
                          <Badge variant="secondary">Holiday Booked</Badge>
                        ) : person.schedule[selectedDay]?.shiftData?.label ===
                          "Day Off" ? (
                          <Badge variant="secondary">Day Off</Badge>
                        ) : (
                          <div className="space-y-1">
                            {showCost && (
                              <p className="text-sm text-muted-foreground">
                                Cost: £{calculateStaffCost(person).toFixed(2)}
                              </p>
                            )}
                            {person.schedule[selectedDay]?.shiftData
                              ?.startTime && (
                              <p className="text-sm">
                                {
                                  person.schedule[selectedDay].shiftData
                                    .startTime
                                }{" "}
                                -{" "}
                                {person.schedule[selectedDay].shiftData.endTime}
                              </p>
                            )}
                            {person.schedule[selectedDay]?.shiftData?.label && (
                              <Badge>
                                {person.schedule[selectedDay].shiftData.label}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {!archived && (
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Edit Shift
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {showCost && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Weekly Cost</span>
                <span className="text-lg font-bold">
                  £{rota && calculateTotalCost().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RotaTableResponsive;
