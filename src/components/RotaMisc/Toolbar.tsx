import React from "react";
import { addWeeks, subDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import ServerApi from "../../serverApi/axios";
import { getDayLabel } from "../../Utils/utils";
import exportToPDF from "../../Utils/exportToPdf";
import exportToPng from "../../Utils/exportToPng";
import { useRotaContext } from "../../Context/RotaContext"; // Update this import path

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

// Updated prop types to remove filter and week-related props
interface ToolbarProps {
  venueName: string;
  weekStarting: string;
  rota: { _id: string; published: boolean } | null;
  setRota: React.Dispatch<
    React.SetStateAction<{ _id: string; published: boolean } | null>
  >;
}

// Define the type for the export options
interface ExportOption {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const Toolbar = ({ venueName, weekStarting, rota, setRota }: ToolbarProps) => {
  // Use the new RotaContext
  const { setSelectedWeek, filters, setFilters } = useRotaContext();

  const handleClickPublishRota = async () => {
    try {
      const { data } = await ServerApi.post(
        `/api/v1/rotas/${rota?._id}/publish`,
        { isPublished: true },
        { withCredentials: true }
      );
      setRota(data.rota);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeWeek = (direction: "left" | "right") => {
    setSelectedWeek((prev) => prev + (direction === "right" ? 1 : -1));
  };

  const startOfWeek = getDayLabel(new Date(weekStarting));
  const endOfWeek = getDayLabel(
    subDays(addWeeks(new Date(weekStarting), 1), 1)
  );

  const exportOptions: ExportOption[] = [
    {
      label: "PDF",
      icon: <FileText className="mr-2 h-4 w-4" />,
      onClick: exportToPDF,
    },
    {
      label: "Image",
      icon: <Image className="mr-2 h-4 w-4" />,
      onClick: exportToPng,
    },
    {
      label: "Excel",
      icon: <FileSpreadsheet className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-wrap flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{venueName}</h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant={rota?.published ? "secondary" : "default"}
              onClick={handleClickPublishRota}
              disabled={rota?.published}
            >
              {rota?.published ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Published
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Rota
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangeWeek("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {startOfWeek} - {endOfWeek}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangeWeek("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Export</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {exportOptions.map((option) => (
                  <DropdownMenuItem key={option.label} onClick={option.onClick}>
                    {option.icon}
                    <span>{option.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Toggle
                pressed={filters.showCost}
                onPressedChange={(pressed) =>
                  setFilters((prev) => ({ ...prev, showCost: pressed }))
                }
                aria-label="Toggle cost"
              >
                Cost
              </Toggle>
              <Toggle
                pressed={filters.showHours}
                onPressedChange={(pressed) =>
                  setFilters((prev) => ({ ...prev, showHours: pressed }))
                }
                aria-label="Toggle hours"
              >
                Hours
              </Toggle>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Toolbar;
