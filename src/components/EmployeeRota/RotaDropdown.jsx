import React from "react";
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

export default RotaDropdown;
