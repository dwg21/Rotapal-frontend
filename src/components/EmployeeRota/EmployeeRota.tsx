import React from "react";
import { useEmployeeRota } from "../../hooks/useEmployeeRota";
import ShiftSwap from "./ShiftSwap.jsx";
import EmployeeRotaTable from "../RotaMisc/EmployeeRotaTable";
import EmployeeToolbar from "../RotaMisc/EmployeeToolbar";
import EmployeeRotaTableMobile from "../RotaMisc/EmployeeRotaTableMobile";

const EmployeeRota = () => {
  const {
    rotas,
    selectedRota,
    setSelectedRota,
    selectedWeek,
    setSelectedWeek,
    startOfWeekDate,
    dates,
    rotaNames,
    weeks,
  } = useEmployeeRota();

  return (
    <div className="overflow-x-auto p-4 w-full">
      <>
        <EmployeeToolbar
          venueName={rotas[selectedRota]?.name?.split("-")[0]}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          startOfWeek={startOfWeekDate}
          setSelectedRota={setSelectedRota}
          selectedRota={selectedRota}
          rotaNames={rotaNames}
        />
        <div className="hidden lg:block">
          <EmployeeRotaTable rota={rotas[selectedRota]} dates={dates} />
        </div>
        <div className="block lg:hidden">
          <EmployeeRotaTableMobile
            rota={rotas[selectedRota]?.rotaData}
            dates={dates}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        </div>
        {rotas[selectedRota]?.rotaData ? (
          <div>
            {!rotas[selectedRota].archived && (
              <ShiftSwap
                rota={rotas[selectedRota]}
                weeks={weeks}
                selectedWeek={selectedWeek}
              />
            )}
          </div>
        ) : (
          <div>
            <p className="text-center font-semibold text-md">
              No Rota has been published for this week yet.
            </p>
            <p className="text-center italic">
              Contact your rota admin for any questions
            </p>
          </div>
        )}
      </>
    </div>
  );
};

export default EmployeeRota;
