import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/pages/kanban/model/types";

interface SortableCardProps {
  card: Card;
  isEditing: boolean;
  onEdit: (cardId: string, title: string, description: string) => void;
  onDelete: (cardId: string) => void;
  onStartEdit: (cardId: string) => void;
  onCancelEdit: () => void;
}

export function SortableCard({
  card,
  isEditing,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
}: SortableCardProps) {
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );

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

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(card.id, editTitle, editDescription);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-xl p-4 border-2 border-green-400 transition-all"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all font-semibold"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all resize-none text-sm"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-1.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all font-medium text-sm"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="flex-1 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-green-400 hover:shadow-xl group relative cursor-move transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="absolute top-3 right-3 flex gap-2 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit(card.id);
          }}
          className="px-2 py-1 text-xs flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-500 rounded-md transition-all duration-200 shadow-sm font-medium"
          title="Edit card"
        >
          편집
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="px-2 py-1 text-xs flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-500 rounded-md transition-all duration-200 shadow-sm font-medium"
          title="Delete card"
        >
          삭제
        </button>
      </div>
      <h3 className="font-semibold text-gray-900 pr-16 leading-snug">
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
