interface AddCardFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AddCardForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}: AddCardFormProps) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Card title..."
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
        autoFocus
      />
      <textarea
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="px-4 py-1.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow-md transition-all"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
