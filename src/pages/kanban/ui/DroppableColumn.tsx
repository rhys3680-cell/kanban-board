import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/libs/utils";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { Column } from "@/entities/kanban";

interface DroppableColumnProps {
  column: Column;
  children: React.ReactNode;
  onUpdateColumn?: (columnId: string, title: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export function DroppableColumn({
  column,
  children,
  onUpdateColumn,
  onDeleteColumn,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const headerColors = {
    0: "text-green-700",
    1: "text-blue-700",
    2: "text-purple-700",
  };

  const headerColorClass =
    headerColors[column.position as keyof typeof headerColors] ||
    "text-foreground";

  const handleSave = () => {
    if (editTitle.trim() && onUpdateColumn) {
      onUpdateColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDeleteColumn && confirm(`"${column.title}" 컬럼을 삭제하시겠습니까?\n컬럼 내 모든 카드가 삭제됩니다.`)) {
      onDeleteColumn(column.id);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      className="w-full md:w-80 min-h-96 transition-colors"
    >
      <CardHeader className="pb-2 md:pb-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditTitle(column.title);
                }
              }}
              className="h-8 text-lg font-semibold"
              autoFocus
            />
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(column.title);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <CardTitle
              className={cn("text-lg md:text-xl font-semibold", headerColorClass)}
            >
              {column.title}
            </CardTitle>
            {(onUpdateColumn || onDeleteColumn) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onUpdateColumn && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
                {onDeleteColumn && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-3">{children}</CardContent>
    </Card>
  );
}