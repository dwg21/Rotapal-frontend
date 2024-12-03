import React, { useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define types for props

import { ShiftData } from "@/types";

interface Schedule {
  shiftData?: ShiftData;
}

interface Person {
  schedule: Schedule[];
}

interface EditShiftResponsiveProps {
  personIndex: number;
  dayIndex: number;
  rota: Person[];
  setRota: React.Dispatch<React.SetStateAction<Person[]>>;
  updateRota: (updatedRota: Person[]) => Promise<void>;
  emptyShift: boolean;
}

// Component implementation
const EditShiftResponsive = ({
  personIndex,
  dayIndex,
  rota,
  setRota,
  updateRota,
  emptyShift,
}: EditShiftResponsiveProps) => {
  const [shift, setShift] = useState<{
    personIndex: number | null;
    dayIndex: number | null;
    shiftData: ShiftData;
  }>({
    personIndex: null,
    dayIndex: null,
    shiftData: {
      startTime: "",
      endTime: "",
      label: "",
      message: "",
      break_duration: 0,
      break_startTime: "",
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleEditShift = () => {
    const shiftData = rota[personIndex]?.schedule[dayIndex]?.shiftData || {
      startTime: "",
      endTime: "",
      label: "",
      message: "",
      break_duration: 0,
      break_startTime: "",
    };

    setShift({
      personIndex,
      dayIndex,
      shiftData,
    });
    setOpen(true);
  };

  const handleSaveShift = async (updatedShift: typeof shift) => {
    const { personIndex, dayIndex, shiftData } = updatedShift;
    if (personIndex === null || dayIndex === null) return;

    const updatedRotaData = rota.map((person, pIndex) => {
      if (pIndex === personIndex) {
        return {
          ...person,
          schedule: person.schedule.map((shift, dIndex) => {
            if (dIndex === dayIndex) {
              return { ...shift, shiftData: { ...shiftData } };
            }
            return shift;
          }),
        };
      }
      return person;
    });

    setRota(updatedRotaData);
    await updateRota(updatedRotaData);
  };

  const handleChange = (name: keyof ShiftData, value: string | number) => {
    setShift((prev) => ({
      ...prev,
      shiftData: {
        ...prev.shiftData,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    handleSaveShift(shift);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full" onClick={handleEditShift}>
          {emptyShift ? (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Shift
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Edit Shift
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{emptyShift ? "Add Shift" : "Edit Shift"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={shift.shiftData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              value={shift.shiftData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={shift.shiftData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break_duration" className="text-right">
              Break
            </Label>
            <Select
              value={shift?.shiftData?.break_duration?.toString()}
              onValueChange={(value) =>
                handleChange("break_duration", parseInt(value, 10))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select break duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="30">30 Mins</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break_startTime" className="text-right">
              Break Start
            </Label>
            <Input
              id="break_startTime"
              type="time"
              value={shift.shiftData.break_startTime}
              onChange={(e) => handleChange("break_startTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={shift.shiftData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditShiftResponsive;
