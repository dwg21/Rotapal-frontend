import React from "react";
import ServerApi from "../../serverApi/axios";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { TiTick } from "react-icons/ti";

import { getDayLabel } from "../../Utils/utils";

import exportToPDF from "../../Utils/exportToPdf";
import exportToPng from "../../Utils/exportToPng";

const Toolbar = ({
  venueName,
  setSelectedWeek,
  selectedWeek,
  weeks,
  rota,
  setRota,
}) => {
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
    } else if (direction === "left" && selectedWeek > 0) {
      setSelectedWeek((prev) => prev - 1);
    }
  };

  let startOfweek = getDayLabel(new Date(weeks[selectedWeek][0]));
  let endOfWeek = getDayLabel(
    new Date(weeks[selectedWeek][weeks[selectedWeek].length - 1])
  );

  return (
    <div
      className="flex items-center gap-6 py-2 my-1  border-b w-full
    "
    >
      <p className="mr-4 font-semibold">{venueName && venueName}</p>
      {rota?.published ? (
        <button className="border p-2 my-2 rounded-md bg-green-400">
          <div className="flex gap-2">
            <p>Rota is published</p>
            <TiTick className="text-2xl" />
          </div>
        </button>
      ) : (
        <button
          className="border p-2 my-2 rounded-md bg-orange-400"
          onClick={handleClickPublishRota}
        >
          Publish Rota
        </button>
      )}
      <div className=" w-[300px] flex justify-center gap-1 p-2 ">
        <IoMdArrowDropleft
          className="mx-2 text-2xl cursor-pointer"
          onClick={() => handleChangeWeek("left")}
        />
        <p>
          {startOfweek} - {endOfWeek}
        </p>
        <IoMdArrowDropright
          className="mx-2 text-2xl cursor-pointer"
          onClick={() => handleChangeWeek("right")}
        />
      </div>

      <button
        onClick={exportToPDF}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Export to PDF
      </button>

      <button
        onClick={exportToPng}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Export to image
      </button>
    </div>
  );
};

export default Toolbar;
