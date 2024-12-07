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

// Define types for the components' props
interface Rota {
  id: string;
  label: string;
  rotaData: Array<{
    employee: string;
    schedule: Array<{
      date: string;
      shiftData: any;
    }>;
  }>;
}

interface DraggableRotaTemplateProps {
  rota: Rota;
  handleDeleteTemplate: (id: string) => void;
}

interface DroppableRotaContainerProps {
  children: React.ReactNode;
}

interface RotaTemplatesProps {
  rota: any;
  commonRotas: Rota[];
  setCommonRotas: React.Dispatch<React.SetStateAction<Rota[]>>;
  selectedvenueID: string;
}

const DraggableRotaTemplate = ({
  rota,
  handleDeleteTemplate,
}: DraggableRotaTemplateProps) => {
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
      <CardContent className="p-4 flex justify-between items-center">
        <span>{rota.label}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteTemplate(rota.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const DroppableRotaContainer = ({ children }: DroppableRotaContainerProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "commonRotas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 p-4 rounded-md transition-colors ${
        isOver ? "bg-blue-100" : "bg-slate-100"
      }`}
    >
      {children}
    </div>
  );
};

const RotaTemplates = ({
  rota,
  commonRotas,
  setCommonRotas,
  selectedvenueID,
}: RotaTemplatesProps) => {
  const [newRotaLabel, setNewRotaLabel] = useState<string>("");
  const [addTemplateVisible, setAddTemplateVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAddNewTemplate = async (e: FormEvent) => {
    e.preventDefault();
    if (newRotaLabel.trim() === "") return;

    const newTemplate = {
      id: `${newRotaLabel}-${Date.now()}`,
      label: newRotaLabel,
      rotaData: rota?.rotaData.map((person: any) => ({
        employee: person.employee,
        schedule: person.schedule.map((shift: any) => ({
          date: shift.date,
          shiftData: shift.shiftData,
        })),
      })),
    };

    try {
      const response = await ServerApi.post(
        `api/v1/venue/${selectedvenueID}/common-rotas`,
        { rota: newTemplate },
        { withCredentials: true }
      );
      setCommonRotas(response.data.commonRotas);
      setAddTemplateVisible(false);
      setNewRotaLabel("");
    } catch (err) {
      console.error(err);
    }
  };

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
    <Card className="w-full">
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
        <CardContent>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop these rotas onto the current rota.
            </p>
            <DroppableRotaContainer>
              {commonRotas &&
                commonRotas.map((rota) => (
                  <DraggableRotaTemplate
                    key={rota.id}
                    rota={rota}
                    handleDeleteTemplate={handleDeleteTemplate}
                  />
                ))}
            </DroppableRotaContainer>
            <Button
              onClick={() => setAddTemplateVisible(!addTemplateVisible)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
            {addTemplateVisible && (
              <form onSubmit={handleAddNewTemplate} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rota-label">Rota Label</Label>
                  <Input
                    id="rota-label"
                    type="text"
                    value={newRotaLabel}
                    onChange={(e) => setNewRotaLabel(e.target.value)}
                    placeholder="Enter rota label"
                  />
                </div>
                <Button type="submit">Add Template</Button>
              </form>
            )}
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default RotaTemplates;