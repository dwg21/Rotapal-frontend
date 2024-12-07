import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RotaDropdownProps {
  rotaNames: string[];
  setSelectedRota: (rota: number) => void;
  selectedRota: number;
}

const RotaDropdown = ({
  rotaNames,
  setSelectedRota,
  selectedRota,
}: RotaDropdownProps) => {
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
