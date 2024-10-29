import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import { format, addWeeks, subDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent } from "@/components/ui/card";
import { getDayLabel } from "../../Utils/utils";
import exportToPDF from "../../Utils/exportToPdf";
import exportToPng from "../../Utils/exportToPng";

// Improved RotaDropdown Component
const RotaDropdown = ({ rotaNames, setSelectedRota, selectedRota }) => {
  return (
    <Select
      value={selectedRota.toString()}
      onValueChange={(value) => setSelectedRota(parseInt(value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue>{rotaNames[selectedRota]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {rotaNames.map((name, index) => (
          <SelectItem key={index} value={index.toString()}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const EmployeeToolbar = ({
  venueName,
  setSelectedWeek,
  selectedWeek,
  startOfWeek,
  showCost,
  setShowCost,
  showHours,
  setShowHours,
  rotaNames,
  setSelectedRota,
  selectedRota,
}) => {
  const handleChangeWeek = (direction) => {
    setSelectedWeek((prev) => prev + (direction === "right" ? 1 : -1));
  };

  const weekStart = getDayLabel(new Date(startOfWeek));
  const weekEnd = getDayLabel(subDays(addWeeks(new Date(startOfWeek), 1), 1));

  const exportOptions = [
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
            {/* Rota Selection */}
            <RotaDropdown
              rotaNames={rotaNames}
              setSelectedRota={setSelectedRota}
              selectedRota={selectedRota}
            />

            {/* Week Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangeWeek("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {weekStart} - {weekEnd}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangeWeek("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Export Options */}
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

            {/* View Toggles */}
            <div className="flex items-center gap-2">
              <Toggle
                pressed={showCost}
                onPressedChange={setShowCost}
                aria-label="Toggle cost"
              >
                Cost
              </Toggle>
              <Toggle
                pressed={showHours}
                onPressedChange={setShowHours}
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

export default EmployeeToolbar;
