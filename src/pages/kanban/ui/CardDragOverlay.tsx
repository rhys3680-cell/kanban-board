import type { Card } from "@/entities/kanban";

interface CardDragOverlayProps {
  card: Card | null;
}

export function CardDragOverlay({ card }: CardDragOverlayProps) {
  if (!card) return null;

  return (
    <div className="bg-white rounded-lg p-4 border-2 shadow-xl opacity-90 rotate-2">
      <h3 className="font-semibold text-gray-900">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 mt-2">{card.description}</p>
      )}
    </div>
  );
}
