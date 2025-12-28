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
import { useKanban } from "@/pages/kanban/hooks/useKanban";
import { SortableCard } from "@/pages/kanban/ui/SortableCard";
import { DroppableColumn } from "@/pages/kanban/ui/DroppableColumn";
import { AddCardForm } from "@/pages/kanban/ui/AddCardForm";
import { CardDragOverlay } from "@/pages/kanban/ui/CardDragOverlay";
import { MainLayout } from "@/app/layouts";

function KanbanBoard() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="container mx-auto px-4 py-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
            {columns.map((column) => {
              return (
                <DroppableColumn key={column.id} column={column}>
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
                        setNewCardDescription({
                          ...newCardDescription,
                          [column.id]: value,
                        })
                      }
                      onSubmit={() => addCard(column.id)}
                      onCancel={() => {
                        setShowAddCard({ ...showAddCard, [column.id]: false });
                        setNewCardTitle({ ...newCardTitle, [column.id]: "" });
                        setNewCardDescription({
                          ...newCardDescription,
                          [column.id]: "",
                        });
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
    </MainLayout>
  );
}

export default KanbanBoard;
