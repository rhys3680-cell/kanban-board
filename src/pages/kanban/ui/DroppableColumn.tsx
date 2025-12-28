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

  // Assign colors based on column position (To Do = green, In Progress = blue, Done = purple)
  const columnBgColors = {
    0: "bg-green-50/50",
    1: "bg-blue-50/50",
    2: "bg-purple-50/50",
  };

  const headerColors = {
    0: "text-green-700",
    1: "text-blue-700",
    2: "text-purple-700",
  };

  const bgColorClass =
    columnBgColors[column.position as keyof typeof columnBgColors] || "bg-background";

  const headerColorClass =
    headerColors[column.position as keyof typeof headerColors] || "text-foreground";

  return (
    <Card
      ref={setNodeRef}
      className={cn("w-80 min-h-96 transition-colors", bgColorClass)}
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
