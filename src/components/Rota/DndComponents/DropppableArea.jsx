import { motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";

const DroppableArea = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ scale: 1 }}
      animate={{ scale: isOver ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-full transition-colors duration-300 ${
        isOver ? "bg-blue-100" : "bg-white"
      }`}
    >
      {children}
    </motion.div>
  );
};

export default DroppableArea;
