import { useState } from "react";

interface MemoFormProps {
  onSubmit: (title: string, content: string) => void;
}

export function MemoForm({ onSubmit }: MemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">New Memo</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSubmit();
            }
          }}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
        />
        <textarea
          placeholder="Content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSubmit();
            }
          }}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all resize-none"
          rows={4}
        />
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all font-medium"
        >
          Add Memo (Ctrl + Enter)
        </button>
      </div>
    </div>
  );
}
