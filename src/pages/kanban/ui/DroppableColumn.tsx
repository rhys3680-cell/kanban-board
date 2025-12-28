import { useDroppable } from "@dnd-kit/core";
import type { Column } from "@/pages/kanban/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/libs/utils";

interface DroppableColumnProps {
  column: Column;
  children: React.ReactNode;
}

export function DroppableColumn({ column, children }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // Assign header text colors based on column position (To Do = green, In Progress = blue, Done = purple)
  const headerColors = {
    0: "text-green-700",
    1: "text-blue-700",
    2: "text-purple-700",
  };

  const headerColorClass =
    headerColors[column.position as keyof typeof headerColors] || "text-foreground";

  return (
    <Card
      ref={setNodeRef}
      className="w-80 min-h-96 transition-colors"
    >
      <CardHeader className="pb-3">
        <CardTitle className={cn("text-xl font-semibold", headerColorClass)}>
          {column.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}
