import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/pages/kanban/model/types";

interface SortableCardProps {
  card: Card;
  onDelete: (cardId: string) => void;
}

export function SortableCard({ card, onDelete }: SortableCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-green-400 hover:shadow-lg group relative cursor-move transition-all duration-200"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        ×
      </button>
      <h3 className="font-semibold text-gray-900 pr-6">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-500 mt-2">{card.description}</p>
      )}
    </div>
  );
}
