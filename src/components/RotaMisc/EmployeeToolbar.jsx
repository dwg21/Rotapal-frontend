import React from "react";
import RotaDropdown from "../EmployeeRota/RotaDropdown";
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
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  Table,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
} from "lucide-react";
import { format, addDays } from "date-fns";

const EmployeeToolbar = ({
  setSelectedWeek,
  startOfWeek,
  rotaNames,
  setSelectedRota,
  selectedRota,
}) => {
  const handleChangeWeek = (direction) => {
    setSelectedWeek((prev) => prev + (direction === "right" ? 1 : -1));
  };

  const weekStart = new Date(startOfWeek);
  const weekEnd = addDays(weekStart, 6);

  const dateRange = `${format(weekStart, "MMM d")} - ${format(
    weekEnd,
    "MMM d, yyyy"
  )}`;

  return (
    <div className="w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between py-4 gap-4">
          {/* Rota Selection */}
          <div className="w-full md:w-auto">
            <RotaDropdown
              rotaNames={rotaNames}
              setSelectedRota={setSelectedRota}
              selectedRota={selectedRota}
            />
          </div>

          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleChangeWeek("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">{dateRange}</div>
            <Button
              variant="ghost"
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportToPDF()}>
                <FileText className="mr-2 h-4 w-4" />
                <span>PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPng()}>
                <Image className="mr-2 h-4 w-4" />
                <span>Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Table className="mr-2 h-4 w-4" />
                <span>Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default EmployeeToolbar;
