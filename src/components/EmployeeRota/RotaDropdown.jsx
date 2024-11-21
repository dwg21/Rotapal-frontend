import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
