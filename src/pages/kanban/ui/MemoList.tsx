import type { Memo } from "@/pages/kanban/model/types";
import { MemoItem } from "./MemoItem";
import { Card, CardContent } from "@/shared/ui/card";

interface MemoListProps {
  memos: Memo[];
  editingMemoId: string | null;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
}

export function MemoList({
  memos,
  editingMemoId,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
}: MemoListProps) {
  if (memos.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No memos found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          memo={memo}
          isEditing={editingMemoId === memo.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  );
}
