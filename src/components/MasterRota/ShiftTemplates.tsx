import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Plus, ChevronDown, Trash2, GripVertical } from "lucide-react";
import ServerApi from "../../serverApi/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define types for props
interface DraggableTemplateProps {
  shift: {
    id: string;
    desc: string;
    handleDeleteTemplate: (id: string) => void;
  };
}

interface ShiftTemplatesProps {
  selectedvenueID: string;
  commonShifts: Array<{
    id: string;
    desc: string;
  }>;
  setCommonShifts: (shifts: any[]) => void;
}

// DraggableTemplate Component
const DraggableTemplate = ({ shift }: DraggableTemplateProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: shift.id,
      data: {
        droppableContainer: { id: "commonShifts" },
        shift,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center w-[200px] justify-between p-2 mb-2 border rounded-md bg-white shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center">
        <GripVertical className="mr-2 h-4 w-4 cursor-move" {...listeners} />
        <span>{shift.desc}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => shift.handleDeleteTemplate(shift.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// ShiftTemplates Component
const ShiftTemplates = ({
  selectedvenueID,
  commonShifts,
  setCommonShifts,
}: ShiftTemplatesProps) => {
  const [newTemplateLabel, setNewTemplateLabel] = useState<string>("");
  const [newTemplateStartTime, setNewTemplateStartTime] = useState<string>("");
  const [newTemplateEndTime, setNewTemplateEndTime] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAddNewTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newTemplateStartTime.trim() === "" ||
      newTemplateEndTime.trim() === ""
    ) {
      return;
    }
    const newTemplate = {
      id: `${newTemplateLabel}-${Date.now()}`,
      shiftData: {
        startTime: newTemplateStartTime,
        endTime: newTemplateEndTime,
      },
      desc: newTemplateLabel,
    };

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-shifts`,
        { shift: newTemplate },
        { withCredentials: true }
      );
      setCommonShifts(response.data.commonShifts);
      setIsDialogOpen(false);
      setNewTemplateLabel("");
      setNewTemplateStartTime("");
      setNewTemplateEndTime("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const response = await ServerApi.delete(
        `api/v1/venue/${selectedvenueID}/common-shifts/${id}`,
        { withCredentials: true }
      );
      setCommonShifts(response.data.commonShifts);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Shift Templates</span>
            <CollapsibleTrigger>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
          </CardTitle>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <p className="mb-4">Drag and drop these shifts onto the rota.</p>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4  ">
              <div className="space-y-2">
                {commonShifts.map((shift) => (
                  <DraggableTemplate
                    key={shift.id}
                    shift={{ ...shift, handleDeleteTemplate }}
                  />
                ))}
              </div>
            </ScrollArea>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Custom Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Shift Template</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNewTemplate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-label">Shift Label</Label>
                    <Input
                      id="template-label"
                      value={newTemplateLabel}
                      onChange={(e) => setNewTemplateLabel(e.target.value)}
                      placeholder="Enter shift label"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newTemplateStartTime}
                        onChange={(e) =>
                          setNewTemplateStartTime(e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newTemplateEndTime}
                        onChange={(e) => setNewTemplateEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit">Add Template</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ShiftTemplates;
