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
import { useRotaContext } from "@/Context/RotaContext";

// Utility Types
interface ShiftTemplate {
  id: string;
  desc: string;
  shiftData: {
    startTime: string;
    endTime: string;
  };
}

interface ShiftTemplatesProps {
  selectedvenueID: string;
  commonShifts: ShiftTemplate[];
  setCommonShifts: (shifts: ShiftTemplate[]) => void;
}

// Draggable Shift Template Component
const DraggableTemplate: React.FC<{
  shift: ShiftTemplate & {
    onDelete: (id: string) => void;
  };
}> = ({ shift }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: shift.id,
      data: {
        droppableContainer: { id: "commonShifts" },
        shift,
      },
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        flex items-center justify-between 
        p-2 mb-1 border rounded-md bg-white shadow-sm 
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div className="flex items-center flex-grow">
        <GripVertical
          className="mr-2 h-4 w-4 cursor-move text-muted-foreground"
          {...listeners}
        />
        <span className="text-sm truncate flex-grow">{shift.desc}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => shift.onDelete(shift.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Main Shift Templates Component
const ShiftTemplates: React.FC<ShiftTemplatesProps> = ({
  selectedvenueID,
  commonShifts,
  setCommonShifts,
}) => {
  const [newTemplate, setNewTemplate] = useState({
    label: "",
    startTime: "",
    endTime: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toolbarSections, setToolbarSections } = useRotaContext();

  const resetTemplateForm = () => {
    setNewTemplate({ label: "", startTime: "", endTime: "" });
    setIsDialogOpen(false);
  };

  const handleAddNewTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const { label, startTime, endTime } = newTemplate;
    if (!label.trim() || !startTime || !endTime) {
      return;
    }

    const newTemplateData = {
      id: `${label}-${Date.now()}`,
      shiftData: {
        startTime,
        endTime,
      },
      desc: label,
    };

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-shifts`,
        { shift: newTemplateData },
        { withCredentials: true }
      );

      setCommonShifts(response.data.commonShifts);
      resetTemplateForm();
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

  const toggleShiftTemplates = () =>
    setToolbarSections({
      ...toolbarSections,
      shiftTemplates: !toolbarSections.shiftTemplates,
    });

  return (
    <Card>
      <Collapsible
        open={toolbarSections.shiftTemplates}
        onOpenChange={toggleShiftTemplates}
      >
        <CardHeader className="p-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Shift Templates</span>
            <CollapsibleTrigger>
              <ChevronDown
                className={`
                  h-4 w-4 transition-transform 
                  ${
                    toolbarSections.shiftTemplates ? "transform rotate-180" : ""
                  }
                `}
              />
            </CollapsibleTrigger>
          </CardTitle>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              Drag and drop these shifts onto the rota
            </p>
            <ScrollArea className="h-[180px] w-full rounded-md border p-2">
              <div className="space-y-1">
                {commonShifts.map((shift) => (
                  <DraggableTemplate
                    key={shift.id}
                    shift={{ ...shift, onDelete: handleDeleteTemplate }}
                  />
                ))}
              </div>
            </ScrollArea>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Shift Template</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNewTemplate} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="template-label">Shift Label</Label>
                    <Input
                      id="template-label"
                      value={newTemplate.label}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      placeholder="Enter shift label"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newTemplate.startTime}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newTemplate.endTime}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Template
                  </Button>
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
