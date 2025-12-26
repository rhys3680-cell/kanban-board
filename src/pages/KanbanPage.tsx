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
import { SortableCard } from "@/pages/kanban/ui/SortableCard";
import { DroppableColumn } from "@/pages/kanban/ui/DroppableColumn";
import { AddCardForm } from "@/pages/kanban/ui/AddCardForm";
import { CardDragOverlay } from "@/pages/kanban/ui/CardDragOverlay";

function KanbanBoard() {
  const {
    columns,
    loading,
    newCardTitle,
    showAddCard,
    activeCard,
    setNewCardTitle,
    setShowAddCard,
    addCard,
    deleteCard,
    handleDragStart,
    handleDragEnd,
  } = useKanban();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Kanban Board
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full">
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
                        onDelete={deleteCard}
                      />
                    ))}
                  </div>
                </SortableContext>

                {showAddCard[column.id] ? (
                  <AddCardForm
                    value={newCardTitle[column.id] || ""}
                    onValueChange={(value) =>
                      setNewCardTitle({ ...newCardTitle, [column.id]: value })
                    }
                    onSubmit={() => addCard(column.id)}
                    onCancel={() => {
                      setShowAddCard({ ...showAddCard, [column.id]: false });
                      setNewCardTitle({ ...newCardTitle, [column.id]: "" });
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
      </div>

      <DragOverlay>
        <CardDragOverlay card={activeCard} />
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
