export const onDragStart = (event) => {
  const { active } = event;
  setActiveId(active?.id);
};

export const onDragEnd = (event) => {
  const { active, over } = event;

  console.log("Drag End Triggered");
  console.log("Active:", active);
  console.log("Over:", over);

  if (!over || !active) {
    console.log("Invalid active or over data");
    return;
  }

  // Extract IDs
  const sourceId = active.id.split("-");
  const destId = over.id.split("-");

  console.log("Source ID Split:", sourceId);
  console.log("Destination ID Split:", destId);

  // Parse indices
  const sourcePersonIndex =
    sourceId.length > 1 ? parseInt(sourceId[0], 10) : null;
  const sourceDayIndex = sourceId.length > 1 ? parseInt(sourceId[1], 10) : null;
  const destPersonIndex = parseInt(destId[0], 10);
  const destDayIndex = parseInt(destId[1], 10);

  console.log("Parsed Indices - Source:", sourcePersonIndex, sourceDayIndex);
  console.log("Parsed Indices - Destination:", destPersonIndex, destDayIndex);

  // Initialize updatedRota
  let updatedRota = [...rota];

  if (active.data.current?.droppableContainer?.id === "commonShifts") {
    console.log("Dragging from commonShifts");
    const shift = commonShifts.find((shift) => shift.id === active.id);
    if (!shift) {
      console.log("Shift not found");
      return;
    }

    if (isNaN(destPersonIndex) || isNaN(destDayIndex)) {
      console.log("Invalid destination indices");
      return;
    }

    const destSchedule = updatedRota[destPersonIndex]?.schedule;
    if (!destSchedule) {
      console.log("Destination schedule not found");
      return;
    }

    const destShift = destSchedule[destDayIndex];
    if (destShift?.holidayBooked) {
      console.log("Destination shift has holiday booked");
      return;
    }

    updatedRota[destPersonIndex].schedule[destDayIndex] = {
      ...shift,
      duration: calculateDuration(shift.startTime, shift.endTime),
    };
  } else if (active.data.current?.droppableContainer?.id === "commonRotas") {
    console.log("Dragging from commonRotas");
    const rotaTemplate = commonRotas.find((r) => r.id === active.id);
    if (!rotaTemplate) {
      console.log("Rota template not found");
      return;
    }

    updatedRota = rotaTemplate.rota;
    setRota(rotaTemplate.rota);
    updateRota(rotaTemplate.rota);
  } else {
    console.log("Dragging within rota");

    if (
      sourcePersonIndex === null ||
      sourceDayIndex === null ||
      isNaN(sourcePersonIndex) ||
      isNaN(sourceDayIndex) ||
      isNaN(destPersonIndex) ||
      isNaN(destDayIndex)
    ) {
      console.log("Invalid indices");
      return;
    }

    // Ensure schedules are defined
    const sourceSchedule = updatedRota[sourcePersonIndex]?.schedule;
    const destSchedule = updatedRota[destPersonIndex]?.schedule;

    if (!sourceSchedule || !destSchedule) {
      console.log("Source or destination schedule not found");
      return;
    }

    const sourceShift = sourceSchedule[sourceDayIndex];
    const destShift = destSchedule[destDayIndex];

    if (sourceShift?.holidayBooked || destShift?.holidayBooked) {
      console.log("Source or destination shift has holiday booked");
      return;
    }

    if (isSpacePressed) {
      console.log("Space key pressed - copying shift");
      updatedRota[destPersonIndex].schedule[destDayIndex] = {
        ...sourceShift,
        duration: calculateDuration(sourceShift.startTime, sourceShift.endTime),
      };
    } else {
      console.log("Swapping shifts");
      updatedRota[sourcePersonIndex].schedule[sourceDayIndex] = destShift;
      updatedRota[destPersonIndex].schedule[destDayIndex] = sourceShift;
    }
  }

  setRota(updatedRota);
  updateRota(updatedRota);

  console.log("Drag end completed");
};
