import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { useState, useRef } from "react";

const DraggableItem = ({ id, children, isSpacePressed, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });
  const [clickTimeout, setClickTimeout] = useState(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = (event) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    isDraggingRef.current = false;
    setClickTimeout(
      setTimeout(() => {
        if (!isDraggingRef.current) {
          listeners.onMouseDown(event);
        }
      }, 200)
    );
  };

  const handleMouseUp = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    if (!isDraggingRef.current) {
      onDoubleClick();
    }
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      initial={{ scale: 1 }}
      animate={{
        scale: isDragging && !isSpacePressed ? 1.1 : 1,
        rotate: isDragging && !isSpacePressed ? 5 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`cursor-pointer flex items-center justify-center w-full h-full ${
        isDragging && !isSpacePressed ? "opacity-50" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    >
      {children}
    </motion.div>
  );
};

export default DraggableItem;
