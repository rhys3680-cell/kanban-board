import { useState } from "react";
import type { Memo } from "@/pages/kanban/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface MemoItemProps {
  memo: Memo;
  isEditing: boolean;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
}

export function MemoItem({
  memo,
  isEditing,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
}: MemoItemProps) {
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(memo.id, editTitle, editContent);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-primary">
        <CardContent className="pt-6 space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold"
            autoFocus
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="resize-none"
            rows={4}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button onClick={onCancelEdit} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-snug flex-1">
            {memo.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStartEdit(memo.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(memo.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {memo.content && (
        <CardContent className="pt-0 space-y-3">
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {memo.content}
          </p>
          <div className="text-sm text-muted-foreground">
            {formatDate(memo.created_at)}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
