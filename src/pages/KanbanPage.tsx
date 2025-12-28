import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useKanban } from "@/pages/kanban/hooks/useKanban";
import { useMemos } from "@/pages/kanban/hooks/useMemos";
import { useAuth } from "@/shared/contexts/AuthContext";
import { SortableCard } from "@/pages/kanban/ui/SortableCard";
import { DroppableColumn } from "@/pages/kanban/ui/DroppableColumn";
import { AddCardForm } from "@/pages/kanban/ui/AddCardForm";
import { CardDragOverlay } from "@/pages/kanban/ui/CardDragOverlay";
import { MemoForm } from "@/pages/kanban/ui/MemoForm";
import { MemoFilters } from "@/pages/kanban/ui/MemoFilters";
import { MemoList } from "@/pages/kanban/ui/MemoList";

function KanbanBoard() {
  const { user, signOut } = useAuth();

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
  } = useKanban();

  const {
    memos,
    loading: memosLoading,
    searchQuery,
    selectedDate,
    editingMemoId,
    setSearchQuery,
    setSelectedDate,
    setEditingMemoId,
    createMemo,
    editMemo,
    removeMemo,
  } = useMemos();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (loading || memosLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 w-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="p-8 pb-8 flex flex-col items-center w-full">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kanban Board
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {columns.map((column) => {
            const headerColors = {
              0: "text-green-700",
              1: "text-blue-700",
              2: "text-purple-700",
            };
            const headerColor =
              headerColors[column.position as keyof typeof headerColors] ||
              "text-gray-700";

            return (
              <DroppableColumn key={column.id} column={column}>
                <h2 className={`text-xl font-semibold ${headerColor} mb-4`}>
                  {column.title}
                </h2>

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
                      setNewCardTitle({ ...newCardTitle, [column.id]: value })
                    }
                    onDescriptionChange={(value) =>
                      setNewCardDescription({ ...newCardDescription, [column.id]: value })
                    }
                    onSubmit={() => addCard(column.id)}
                    onCancel={() => {
                      setShowAddCard({ ...showAddCard, [column.id]: false });
                      setNewCardTitle({ ...newCardTitle, [column.id]: "" });
                      setNewCardDescription({ ...newCardDescription, [column.id]: "" });
                    }}
                  />
                ) : (
                  <button
                    onClick={() =>
                      setShowAddCard({ ...showAddCard, [column.id]: true })
                    }
                    className="w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-md transition-all border-2 border-dashed border-gray-300 hover:border-gray-400"
                  >
                    + Add Card
                  </button>
                )}
              </DroppableColumn>
            );
          })}
        </div>

        {/* Memo Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Memos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <MemoForm onSubmit={createMemo} />
              <MemoFilters
                searchQuery={searchQuery}
                selectedDate={selectedDate}
                onSearchChange={setSearchQuery}
                onDateChange={setSelectedDate}
              />
            </div>
            <div className="lg:col-span-2">
              <MemoList
                memos={memos}
                editingMemoId={editingMemoId}
                onEdit={editMemo}
                onDelete={removeMemo}
                onStartEdit={setEditingMemoId}
                onCancelEdit={() => setEditingMemoId(null)}
              />
            </div>
          </div>
        </div>
        </div>

        <DragOverlay>
          <CardDragOverlay card={activeCard} />
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
