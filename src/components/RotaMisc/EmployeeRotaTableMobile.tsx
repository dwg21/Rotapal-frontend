import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  AlertCircle,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ShiftData, Schedule } from "@/types";

interface Person {
  employee: string;
  employeeName: string;
  hourlyWage?: number;
  schedule: Schedule[];
}

interface EmployeeRotaTableMobileProps {
  rota: Person[];
  dates: string[];
  updateRota?: (employeeId: string, selectedDay: number) => void;
  selectedWeek: number;
  setSelectedWeek: React.Dispatch<React.SetStateAction<number>>;
}

const EmployeeRotaTableMobile = ({
  rota = [],
  dates = [],
  updateRota,
  selectedWeek = 0,
  setSelectedWeek,
}: EmployeeRotaTableMobileProps) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [showCost, setShowCost] = useState<boolean>(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const calculateStaffCost = (person: Person): number => {
    const totalHours = person.schedule.reduce((sum, shift) => {
      if (
        shift.shiftData &&
        shift.shiftData.startTime &&
        shift.shiftData.endTime
      ) {
        const start = new Date(`1970-01-01T${shift.shiftData.startTime}`);
        const end = new Date(`1970-01-01T${shift.shiftData.endTime}`);
        const hoursWorked =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return sum + hoursWorked;
      }
      return sum;
    }, 0);
    return totalHours * (person.hourlyWage || 0);
  };

  const calculateTotalCost = (): number => {
    return rota.reduce((sum, person) => sum + calculateStaffCost(person), 0);
  };

  const handleChangeWeek = (direction: "left" | "right") => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek((prev) => prev - 1);
    }
  };

  const formatSelectedDate = (dateString: string): string => {
    if (!dateString) return "No date available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const selectedDate = dates[selectedDay];
  const formattedDate = formatSelectedDate(selectedDate);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Rota Schedule</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-cost">Show Costs</Label>
            <Switch
              id="show-cost"
              checked={showCost}
              onCheckedChange={setShowCost}
            />
          </div>
        </div>
        <div className="text-center font-medium text-lg text-primary">
          {formattedDate}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
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
                        variant={selectedDay === index ? "default" : "outline"}
                        className="w-12 h-12 rounded-full"
                        onClick={() => setSelectedDay(index)}
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
              {rota?.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No schedule data available for this period.
                  </AlertDescription>
                </Alert>
              )}

              {rota?.map((person) => (
                <Card key={person.employee} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                          {person.employeeName}
                        </h3>
                        {person.schedule[selectedDay]?.holidayBooked ? (
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-secondary"
                        onClick={() =>
                          updateRota?.(person.employee, selectedDay)
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Edit Shift
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {showCost && rota?.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Weekly Cost</span>
                <span className="text-lg font-bold">
                  £{calculateTotalCost().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeRotaTableMobile;
