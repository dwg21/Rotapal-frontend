import React, { useState, FormEvent } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRotaContext } from "@/Context/RotaContext";

// Comprehensive Type Definitions
interface ShiftData {
  startTime?: string;
  endTime?: string;
  // Add other potential shift properties
}

interface ScheduleEntry {
  date: string;
  shiftData: ShiftData;
}

interface RotaEmployee {
  employee: string;
  schedule: ScheduleEntry[];
}

interface Rota {
  id: string;
  label: string;
  rotaData: RotaEmployee[];
}

interface RotaTemplatesProps {
  rota: { rotaData: RotaEmployee[] } | null;
  commonRotas: Rota[];
  setCommonRotas: React.Dispatch<React.SetStateAction<Rota[]>>;
  selectedvenueID: string;
}

// Draggable Rota Template Component
const DraggableRotaTemplate: React.FC<{
  rota: Rota;
  onDelete: (id: string) => void;
}> = ({ rota, onDelete }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: rota.id,
    data: {
      droppableContainer: { id: "commonRotas" },
      rota,
    },
  });

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab ${isDragging ? "opacity-50" : ""}`}
    >
      <CardContent className="p-2 flex justify-between items-center">
        <span className="text-sm truncate flex-grow">{rota.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onDelete(rota.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Droppable Rota Container Component
const DroppableRotaContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "commonRotas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        grid grid-cols-1 gap-2 my-2 p-2 rounded-md transition-colors 
        ${isOver ? "bg-blue-100" : "bg-slate-100"}
      `}
    >
      {children}
    </div>
  );
};

// Main Rota Templates Component
const RotaTemplates: React.FC<RotaTemplatesProps> = ({
  rota,
  commonRotas,
  setCommonRotas,
  selectedvenueID,
}) => {
  const [newRotaLabel, setNewRotaLabel] = useState("");
  const [addTemplateVisible, setAddTemplateVisible] = useState(false);

  // Use RotaContext for toolbar sections
  const { toolbarSections, setToolbarSections } = useRotaContext();

  // Toggle function for rota templates section
  const toggleRotaTemplates = () =>
    setToolbarSections({
      ...toolbarSections,
      rotaTemplates: !toolbarSections.rotaTemplates,
    });

  // Add New Template Handler
  const handleAddNewTemplate = async (e: FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!newRotaLabel.trim()) return;

    // Create new template
    const newTemplate = {
      id: `${newRotaLabel}-${Date.now()}`,
      label: newRotaLabel,
      rotaData:
        rota?.rotaData.map((person) => ({
          employee: person.employee,
          schedule: person.schedule.map((shift) => ({
            date: shift.date,
            shiftData: shift.shiftData,
          })),
        })) || [],
    };

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-rotas`,
        { rota: newTemplate },
        { withCredentials: true }
      );

      // Update common rotas and reset form
      setCommonRotas(response.data.commonRotas);
      setAddTemplateVisible(false);
      setNewRotaLabel("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Template Handler
  const handleDeleteTemplate = async (id: string) => {
    try {
      const response = await ServerApi.delete(
        `api/v1/venue/${selectedvenueID}/common-rotas/${id}`,
        { withCredentials: true }
      );
      setCommonRotas(response.data.commonRotas);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <Collapsible
        open={toolbarSections.rotaTemplates}
        onOpenChange={toggleRotaTemplates}
      >
        <CardHeader className="p-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Rota Templates</span>
            <CollapsibleTrigger>
              <ChevronDown
                className={`
                  h-4 w-4 transition-transform 
                  ${toolbarSections.rotaTemplates ? "transform rotate-180" : ""}
                `}
              />
            </CollapsibleTrigger>
          </CardTitle>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              Drag and drop these rotas onto the current rota
            </p>
            <ScrollArea className="h-[180px] w-full rounded-md border p-2">
              <DroppableRotaContainer>
                {commonRotas.map((rotaItem) => (
                  <DraggableRotaTemplate
                    key={rotaItem.id}
                    rota={rotaItem}
                    onDelete={handleDeleteTemplate}
                  />
                ))}
              </DroppableRotaContainer>
            </ScrollArea>

            <Button
              size="sm"
              className="w-full mt-2"
              onClick={() => setAddTemplateVisible(!addTemplateVisible)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>

            {addTemplateVisible && (
              <form onSubmit={handleAddNewTemplate} className="mt-2 space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="rota-label">Rota Label</Label>
                  <Input
                    id="rota-label"
                    type="text"
                    value={newRotaLabel}
                    onChange={(e) => setNewRotaLabel(e.target.value)}
                    placeholder="Enter rota label"
                    className="h-8"
                  />
                </div>
                <Button type="submit" size="sm" className="w-full">
                  Add Template
                </Button>
              </form>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RotaTemplates;
