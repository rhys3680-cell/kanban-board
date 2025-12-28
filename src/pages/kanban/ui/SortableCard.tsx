import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/pages/kanban/model/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/shared/libs/utils";

interface SortableCardProps {
  card: CardType;
  isEditing: boolean;
  onEdit: (cardId: string, title: string, description: string) => void;
  onDelete: (cardId: string) => void;
  onStartEdit: (cardId: string) => void;
  onCancelEdit: () => void;
}

export function SortableCard({
  card,
  isEditing,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
}: SortableCardProps) {
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(card.id, editTitle, editDescription);
  };

  if (isEditing) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="border-2 border-primary"
      >
        <CardContent className="pt-6 space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="resize-none text-sm"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="flex-1"
            >
              Save
            </Button>
            <Button
              onClick={onCancelEdit}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-200 hover:shadow-lg group",
        isDragging && "opacity-50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="touch-none cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors md:opacity-0 md:group-hover:opacity-100"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <CardTitle className="text-base leading-snug flex-1">
            {card.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit(card.id);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {card.description && (
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed">
            {card.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
