import React, { useState, useEffect } from "react";
import ShiftTemplates from "./ShiftTemplates";
import RotaTemplates from "./RotaTemplates";
import { ChevronRight, HammerIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRotaContext } from "@/Context/RotaContext";

interface SidebarProps {
  isOpen: boolean;
  rota: any;
  selectedVenueId: string;
  commonShifts: any[];
  commonRotas: any[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  rota,
  selectedVenueId,
  commonShifts,
  commonRotas,
}) => {
  const [commonShiftsList, setCommonShiftsList] = useState(commonShifts);
  const [commonRotasList, setCommonRotasList] = useState(commonRotas);

  useEffect(() => {
    setCommonShiftsList(commonShifts);
    setCommonRotasList(commonRotas);
  }, [commonShifts, commonRotas]);

  return (
    <div
      className={` 
          bg-white shadow-lg transition-all duration-300 
        ${
          isOpen
            ? "w-[320px] translate-x-0 border-l-[20px]"
            : "w-0 translate-x-full border-none"
        }
        overflow-y-auto z-20 flex flex-col border
      `}
    >
      {rota?._id && (
        <div className="p-4 space-y-4">
          <span className="text-xl flex items-center space-x-5 font-bold pb-2 border-b-2">
            Rota Tools
            <HammerIcon className="h-5 w-5 ml-2" />
          </span>

          <ShiftTemplates
            selectedvenueID={selectedVenueId}
            commonShifts={commonShiftsList}
            setCommonShifts={setCommonShiftsList}
          />

          <RotaTemplates
            rota={rota}
            commonRotas={commonRotasList}
            setCommonRotas={setCommonRotasList}
            selectedvenueID={selectedVenueId}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
