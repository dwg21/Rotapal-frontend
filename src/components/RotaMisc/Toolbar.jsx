import React from "react";
import ServerApi from "../../serverApi/axios";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { FaLock } from "react-icons/fa";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import ArchiveIcon from "@mui/icons-material/Archive";

import { getDayLabel } from "../../Utils/utils";
import exportToPDF from "../../Utils/exportToPdf";
import exportToPng from "../../Utils/exportToPng";
import CustDropdownButton from "../misc/CustDropdownButton";
import FilterButton from "./FilterButton";
import { addWeeks } from "date-fns";

const Toolbar = ({
  venueName,
  setSelectedWeek,
  selectedWeek,
  weekStarting,
  rota,
  setRota,
  showCost,
  setShowCost,
  showHours,
  setShowHours,
}) => {
  console.log(rota);
  const handleClickPublishRota = async () => {
    try {
      console.log("hhs");
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

  const handleChangeWeek = (direction) => {
    if (direction === "right") {
      setSelectedWeek((prev) => prev + 1);
      console.log(selectedWeek);
    } else if (direction === "left") {
      setSelectedWeek((prev) => prev - 1);
    }
  };

  // let startOfweek = getDayLabel(new Date(weeks[selectedWeek][0]));

  let startOfweek = getDayLabel(new Date(weekStarting));
  let endOfWeek = getDayLabel(addWeeks(new Date(weekStarting), 1));

  // let endOfWeek = getDayLabel(
  //   new Date(weeks[selectedWeek][weeks[selectedWeek].length - 1])
  // );
  const exportOptions = [
    {
      label: "PDF",
      icon: <PictureAsPdfIcon className="mr-2 text-gray-500" />,
      onClick: exportToPDF,
    },
    {
      label: "Image",
      icon: <ImageIcon className="mr-2 text-gray-500" />,
      onClick: exportToPng,
    },
    { label: "Excel", icon: <ArchiveIcon className="mr-2 text-gray-500" /> },
  ];

  return (
    <div>
      <p className="text-md text-center font-semibold mr-4 md:text-base md:hidden ">
        {venueName && venueName}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 py-2 my-1 border-b w-full md:gap-6 md:flex-nowrap">
        <p className="text-sm font-semibold mr-4 md:text-base hidden md:block">
          {venueName && venueName}
        </p>
        {rota?.published ? (
          <button className="border p-2 my-2 rounded-md bg-green-400 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <p>Rota is published</p>
              <FaLock className="text-lg md:text-xl" />
            </div>
          </button>
        ) : (
          <button
            className="border p-2 my-2 rounded-md bg-orange-400 text-xs md:text-sm"
            onClick={handleClickPublishRota}
          >
            Publish Rota
          </button>
        )}
        <div className="justify-center items-center w-full md:w-[300px] gap-1 p-2 hidden  md:flex">
          <IoMdArrowDropleft
            className="text-xl cursor-pointer md:text-2xl"
            onClick={() => handleChangeWeek("left")}
          />
          <p className="text-sm md:text-base">
            {startOfweek} - {endOfWeek}
          </p>
          <IoMdArrowDropright
            className="text-xl cursor-pointer md:text-2xl"
            onClick={() => handleChangeWeek("right")}
          />
        </div>

        <CustDropdownButton title="Export" options={exportOptions} />
        <FilterButton
          showCost={showCost}
          setShowCost={setShowCost}
          showHours={showHours}
          setShowHours={setShowHours}
        />
      </div>
    </div>
  );
};

export default Toolbar;
