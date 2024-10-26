// import React, { useState } from "react";
// import { MdEdit } from "react-icons/md";
// import { IoAddSharp } from "react-icons/io5";

// const EditShiftResponsive = ({
//   personIndex,
//   dayIndex,
//   rota,
//   setRota,
//   updateRota,
//   emptyShift,
// }) => {
//   const [shift, setShift] = useState({
//     personIndex: null,
//     dayIndex: null,
//     shiftData: {
//       startTime: "",
//       endTime: "",
//       label: "",
//       message: "",
//       break_duration: 0,
//       break_startTime: "",
//     },
//   });

//   const [editSectionVisible, setEditSectionVisible] = useState(false);

//   const handleEditShift = () => {
//     const shiftData = rota[personIndex].schedule[dayIndex]?.shiftData || {};

//     setShift({
//       personIndex,
//       dayIndex,
//       shiftData: {
//         startTime: shiftData.startTime || "",
//         endTime: shiftData.endTime || "",
//         label: shiftData.label || "",
//         message: shiftData.message || "",
//         break_duration: shiftData.break_duration || 0,
//         break_startTime: shiftData.break_startTime || "",
//       },
//     });
//   };

//   const handleSaveShift = async (updatedShift) => {
//     const { personIndex, dayIndex, shiftData } = updatedShift;
//     const updatedRotaData = rota.map((person, pIndex) => {
//       if (pIndex === personIndex) {
//         return {
//           ...person,
//           schedule: person.schedule.map((shift, dIndex) => {
//             if (dIndex === dayIndex) {
//               return {
//                 ...shift,
//                 shiftData: { ...shiftData },
//               };
//             }
//             return shift;
//           }),
//         };
//       }
//       return person;
//     });

//     // Set the updated rota state
//     setRota({
//       ...rota,
//       rotaData: updatedRotaData,
//     });

//     await updateRota({
//       ...rota,
//       rotaData: updatedRotaData,
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setShift((prev) => ({
//       ...prev,
//       shiftData: {
//         ...prev.shiftData,
//         [name]: value,
//       },
//     }));
//   };

//   const handleOpenShift = () => {
//     setEditSectionVisible(true);
//     handleEditShift();
//   };

//   const handleSave = () => {
//     console.log(shift);
//     handleSaveShift(shift);
//     setEditSectionVisible(false);
//   };

//   return (
//     <div className="p-2">
//       {!emptyShift ? (
//         <button
//           onClick={() => handleOpenShift()}
//           className="flex justify-center items-center gap-2"
//         >
//           Edit <MdEdit />
//         </button>
//       ) : (
//         <div className="w-full h-[90px] flex justify-center items-center hover:cursor-pointer">
//           <button onClick={() => setEditSectionVisible(true)}>
//             <IoAddSharp className="text-3xl hover:block text-center" />
//           </button>
//         </div>
//       )}
//       {editSectionVisible && (
//         <div>
//           <div className="flex flex-col justify-center items-center gap-2">
//             <h2 className="text-center text-lg font-bold">
//               {emptyShift ? `ADD SHIFT` : `EDIT SHIFT`}
//             </h2>
//             <label className="text-center mt-4 mb-1">
//               Start Time:
//               <input
//                 type="time"
//                 name="startTime"
//                 value={shift.shiftData?.startTime || ""}
//                 onChange={handleChange}
//                 className="ml-2 p-1 border border-gray-300 rounded"
//               />
//             </label>
//             <label className="text-center">
//               End Time:
//               <input
//                 type="time"
//                 name="endTime"
//                 value={shift.shiftData?.endTime || ""}
//                 onChange={handleChange}
//                 className="ml-2 p-1 border border-gray-300 rounded"
//               />
//             </label>
//             <br />
//             <label className="text-center">
//               Label:
//               <input
//                 type="text"
//                 name="label"
//                 value={shift.shiftData?.label || ""}
//                 onChange={handleChange}
//                 className="ml-2 p-1 border border-gray-300 rounded"
//               />
//             </label>

//             <label className="text-center">
//               Break
//               <select
//                 name="break_duration"
//                 value={shift.shiftData?.break_duration}
//                 onChange={handleChange}
//                 className="ml-2 p-1 border border-gray-300 rounded"
//               >
//                 <option value="none">None</option>
//                 <option value="30">30 Mins</option>
//                 <option value="60">1 hour</option>
//               </select>
//             </label>

//             <label className="text-center mt-4 mb-1">
//               Break Starting:
//               <input
//                 type="time"
//                 name="break_startTime"
//                 value={shift.shiftData?.break_startTime || ""}
//                 onChange={handleChange}
//                 className="ml-2 p-1 border border-gray-300 rounded"
//               />
//             </label>

//             <label className="text-center flex">
//               Message:
//               <textarea
//                 type="multitext"
//                 name="message"
//                 value={shift.shiftData?.message || ""}
//                 onChange={handleChange}
//                 className="ml-2 p-1 border border-gray-300 rounded"
//               />
//             </label>

//             <br />
//             <button
//               onClick={() => handleSave()}
//               className="bg-blue-500 text-white p-2 rounded w-[200px] my-3"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditSectionVisible(false)}
//               className="bg-red-500 text-white p-2 rounded w-[200px]"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditShiftResponsive;

import React, { useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EditShiftResponsive = ({
  personIndex,
  dayIndex,
  rota,
  setRota,
  updateRota,
  emptyShift,
}) => {
  const [shift, setShift] = useState({
    personIndex: null,
    dayIndex: null,
    shiftData: {
      startTime: "",
      endTime: "",
      label: "",
      message: "",
      break_duration: 0,
      break_startTime: "",
    },
  });

  const [open, setOpen] = useState(false);

  const handleEditShift = () => {
    const shiftData = rota[personIndex].schedule[dayIndex]?.shiftData || {};

    setShift({
      personIndex,
      dayIndex,
      shiftData: {
        startTime: shiftData.startTime || "",
        endTime: shiftData.endTime || "",
        label: shiftData.label || "",
        message: shiftData.message || "",
        break_duration: shiftData.break_duration || 0,
        break_startTime: shiftData.break_startTime || "",
      },
    });
    setOpen(true);
  };

  const handleSaveShift = async (updatedShift) => {
    const { personIndex, dayIndex, shiftData } = updatedShift;
    const updatedRotaData = rota.map((person, pIndex) => {
      if (pIndex === personIndex) {
        return {
          ...person,
          schedule: person.schedule.map((shift, dIndex) => {
            if (dIndex === dayIndex) {
              return {
                ...shift,
                shiftData: { ...shiftData },
              };
            }
            return shift;
          }),
        };
      }
      return person;
    });

    setRota({
      ...rota,
      rotaData: updatedRotaData,
    });

    await updateRota({
      ...rota,
      rotaData: updatedRotaData,
    });
  };

  const handleChange = (name, value) => {
    setShift((prev) => ({
      ...prev,
      shiftData: {
        ...prev.shiftData,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    handleSaveShift(shift);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full" onClick={handleEditShift}>
          {emptyShift ? (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Shift
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Edit Shift
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{emptyShift ? "Add Shift" : "Edit Shift"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={shift.shiftData?.startTime || ""}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              value={shift.shiftData?.endTime || ""}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={shift.shiftData?.label || ""}
              onChange={(e) => handleChange("label", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break_duration" className="text-right">
              Break
            </Label>
            <Select
              value={shift.shiftData?.break_duration.toString()}
              onValueChange={(value) =>
                handleChange("break_duration", parseInt(value))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select break duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="30">30 Mins</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break_startTime" className="text-right">
              Break Start
            </Label>
            <Input
              id="break_startTime"
              type="time"
              value={shift.shiftData?.break_startTime || ""}
              onChange={(e) => handleChange("break_startTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={shift.shiftData?.message || ""}
              onChange={(e) => handleChange("message", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditShiftResponsive;
