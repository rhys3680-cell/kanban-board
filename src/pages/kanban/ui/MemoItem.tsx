import { useState } from "react";
import type { Memo } from "@/pages/kanban/model/types";

interface MemoItemProps {
  memo: Memo;
  isEditing: boolean;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
}

export function MemoItem({
  memo,
  isEditing,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
}: MemoItemProps) {
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(memo.id, editTitle, editContent);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-300 transition-all">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all font-semibold"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all font-medium"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-gray-900 flex-1">
          {memo.title}
        </h4>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onStartEdit(memo.id)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit memo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(memo.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete memo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        </div>
      </div>
      {memo.content && (
        <p className="text-gray-600 mb-3 whitespace-pre-wrap leading-relaxed">
          {memo.content}
        </p>
      )}
      <div className="text-sm text-gray-400">
        {formatDate(memo.created_at)}
      </div>
    </div>
  );
}
