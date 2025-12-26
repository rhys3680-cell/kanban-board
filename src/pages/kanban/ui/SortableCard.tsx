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
      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-green-400 hover:shadow-xl group relative cursor-move transition-all duration-200 hover:scale-[1.02]"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-sm"
        title="Delete card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 transition-colors duration-200"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <h3 className="font-semibold text-gray-900 pr-8 leading-snug">
        {card.title}
      </h3>
      {card.description && (
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {card.description}
        </p>
      )}
    </div>
  );
}
