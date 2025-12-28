import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder="Card title..."
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Textarea
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <Button
          onClick={onSubmit}
          size="sm"
          className="flex-1"
        >
          Add
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
