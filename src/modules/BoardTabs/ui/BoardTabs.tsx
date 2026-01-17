import { useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/libs/utils";
import type { Board } from "@/entities/board";
import {
  useBoardsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} from "@/entities/board";

interface BoardTabsProps {
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
}

export function BoardTabs({ selectedBoardId, onSelectBoard }: BoardTabsProps) {
  const { data: boards = [], isLoading } = useBoardsQuery();
  const createBoardMutation = useCreateBoardMutation();
  const updateBoardMutation = useUpdateBoardMutation();
  const deleteBoardMutation = useDeleteBoardMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleAddBoard = async () => {
    if (!newBoardTitle.trim()) return;

    const newBoard = await createBoardMutation.mutateAsync({
      title: newBoardTitle.trim(),
    });

    setNewBoardTitle("");
    setIsAdding(false);
    onSelectBoard(newBoard.id);
  };

  const handleStartEdit = (board: Board) => {
    setEditingBoardId(board.id);
    setEditingTitle(board.title);
  };

  const handleSaveEdit = async () => {
    if (!editingBoardId || !editingTitle.trim()) return;

    await updateBoardMutation.mutateAsync({
      boardId: editingBoardId,
      updates: { title: editingTitle.trim() },
    });

    setEditingBoardId(null);
    setEditingTitle("");
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!confirm("이 보드를 삭제하시겠습니까? 보드 내 모든 컬럼과 카드가 삭제됩니다.")) return;

    await deleteBoardMutation.mutateAsync(boardId);

    if (selectedBoardId === boardId) {
      const remainingBoards = boards.filter((b) => b.id !== boardId);
      if (remainingBoards.length > 0) {
        onSelectBoard(remainingBoards[0].id);
      }
    }
  };

  if (isLoading) {
    return <div className="h-10 flex items-center text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {boards.map((board) => (
        <div key={board.id} className="relative group">
          {editingBoardId === board.id ? (
            <div className="flex items-center gap-1">
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setEditingBoardId(null);
                }}
                className="h-8 w-32 text-sm"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleSaveEdit}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant={selectedBoardId === board.id ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-3 text-sm whitespace-nowrap",
                selectedBoardId === board.id && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => onSelectBoard(board.id)}
              onDoubleClick={() => handleStartEdit(board)}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: board.color }}
              />
              {board.title}
            </Button>
          )}

          {selectedBoardId === board.id && editingBoardId !== board.id && (
            <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-0.5">
              <button
                className="p-0.5 bg-white rounded-full shadow-sm border hover:bg-gray-100"
                onClick={() => handleStartEdit(board)}
              >
                <Pencil className="h-2.5 w-2.5 text-gray-500" />
              </button>
              <button
                className="p-0.5 bg-white rounded-full shadow-sm border hover:bg-red-100"
                onClick={() => handleDeleteBoard(board.id)}
              >
                <X className="h-2.5 w-2.5 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-1">
          <Input
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddBoard();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewBoardTitle("");
              }
            }}
            placeholder="보드 이름"
            className="h-8 w-32 text-sm"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleAddBoard}
            disabled={createBoardMutation.isPending}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => {
              setIsAdding(false);
              setNewBoardTitle("");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}