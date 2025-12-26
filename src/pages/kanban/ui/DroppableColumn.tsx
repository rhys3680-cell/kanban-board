import { useDroppable } from "@dnd-kit/core";
import type { Column } from "@/pages/kanban/model/types";

interface DroppableColumnProps {
  column: Column;
  children: React.ReactNode;
}

export function DroppableColumn({ column, children }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // Assign colors based on column position (To Do = green, In Progress = blue, Done = purple)
  const columnColors = {
    0: "border-green-200 bg-green-50",
    1: "border-blue-200 bg-blue-50",
    2: "border-purple-200 bg-purple-50",
  };

  const colorClass =
    columnColors[column.position as keyof typeof columnColors] ||
    "border-gray-200 bg-white";

  return (
    <div
      ref={setNodeRef}
      className={`${colorClass} rounded-lg shadow-md p-4 border-2 transition-colors`}
    >
      {children}
    </div>
  );
}
