import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Check, X } from "lucide-react";
import { useKanbanBoard } from "@/features/kanban/hooks/useKanbanBoard";
import { SortableCard } from "@/pages/kanban/ui/SortableCard";
import { DroppableColumn } from "@/pages/kanban/ui/DroppableColumn";
import { AddCardForm } from "@/pages/kanban/ui/AddCardForm";
import { CardDragOverlay } from "@/pages/kanban/ui/CardDragOverlay";
import { MainLayout } from "@/app/layouts";
import { BoardTabs } from "@/modules/BoardTabs";
import { useBoardsQuery } from "@/entities/board";
import {
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
} from "@/entities/kanban";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";

function KanbanBoard() {
  const { data: boards = [], isLoading: boardsLoading } = useBoardsQuery();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const createColumnMutation = useCreateColumnMutation();
  const updateColumnMutation = useUpdateColumnMutation();
  const deleteColumnMutation = useDeleteColumnMutation();

  // 보드 목록이 로드되면 첫 번째 보드 선택
  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const {
    columns,
    loading,
    newCardTitle,
    newCardDescription,
    showAddCard,
    activeCard,
    editingCardId,
    setNewCardTitle,
    setNewCardDescription,
    setShowAddCard,
    setEditingCardId,
    addCard,
    editCard,
    deleteCard,
    handleDragStart,
    handleDragEnd,
  } = useKanbanBoard(selectedBoardId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim() || !selectedBoardId) return;

    await createColumnMutation.mutateAsync({
      boardId: selectedBoardId,
      title: newColumnTitle.trim(),
      position: columns.length,
    });

    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  if (boardsLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-4">
        <BoardTabs
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
        />
      </div>

      {!selectedBoardId || boards.length === 0 ? (
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          보드를 추가해주세요
        </div>
      ) : loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="container mx-auto px-4 py-6 md:p-8">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4">
              {columns.map((column) => {
                return (
                  <div key={column.id} className="flex-shrink-0">
                    <DroppableColumn
                      column={column}
                      onUpdateColumn={(columnId, title) =>
                        updateColumnMutation.mutate({ columnId, title })
                      }
                      onDeleteColumn={(columnId) =>
                        deleteColumnMutation.mutate(columnId)
                      }
                    >
                      <SortableContext
                        items={column.cards.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3 mb-4 min-h-25">
                          {column.cards.map((card) => (
                            <SortableCard
                              key={card.id}
                              card={card}
                              isEditing={editingCardId === card.id}
                              onEdit={editCard}
                              onDelete={deleteCard}
                              onStartEdit={setEditingCardId}
                              onCancelEdit={() => setEditingCardId(null)}
                            />
                          ))}
                        </div>
                      </SortableContext>

                      {showAddCard[column.id] ? (
                        <AddCardForm
                          title={newCardTitle[column.id] || ""}
                          description={newCardDescription[column.id] || ""}
                          onTitleChange={(value) =>
                            setNewCardTitle({
                              ...newCardTitle,
                              [column.id]: value,
                            })
                          }
                          onDescriptionChange={(value) =>
                            setNewCardDescription({
                              ...newCardDescription,
                              [column.id]: value,
                            })
                          }
                          onSubmit={() => addCard(column.id)}
                          onCancel={() => {
                            setShowAddCard({
                              ...showAddCard,
                              [column.id]: false,
                            });
                            setNewCardTitle({
                              ...newCardTitle,
                              [column.id]: "",
                            });
                            setNewCardDescription({
                              ...newCardDescription,
                              [column.id]: "",
                            });
                          }}
                        />
                      ) : (
                        <button
                          onClick={() =>
                            setShowAddCard({
                              ...showAddCard,
                              [column.id]: true,
                            })
                          }
                          className="w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-md transition-all border-2 border-dashed border-gray-300 hover:border-gray-400"
                        >
                          + Add Card
                        </button>
                      )}
                    </DroppableColumn>
                  </div>
                );
              })}

              {/* 컬럼 추가 버튼 */}
              <div className="flex-shrink-0">
                {isAddingColumn ? (
                  <Card className="w-full md:w-80 p-4">
                    <CardContent className="p-0 space-y-3">
                      <Input
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddColumn();
                          if (e.key === "Escape") {
                            setIsAddingColumn(false);
                            setNewColumnTitle("");
                          }
                        }}
                        placeholder="컬럼 이름"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleAddColumn}
                          disabled={createColumnMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          추가
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsAddingColumn(false);
                            setNewColumnTitle("");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <button
                    onClick={() => setIsAddingColumn(true)}
                    className="w-full md:w-80 min-h-96 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    컬럼 추가
                  </button>
                )}
              </div>
            </div>
          </div>

          <DragOverlay>
            <CardDragOverlay card={activeCard} />
          </DragOverlay>
        </DndContext>
      )}
    </MainLayout>
  );
}

export default KanbanBoard;
