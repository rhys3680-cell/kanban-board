import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import MDEditor from "@uiw/react-md-editor";
import { useTags } from "@/features/tags/hooks/useTags";
import { X } from "lucide-react";
import type { Tag } from "@/entities/memo/model/types";

interface MemoFormProps {
  onSubmit: (title: string, content: string, tagIds: string[]) => void;
}

export function MemoForm({ onSubmit }: MemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const { tags } = useTags();

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, content, selectedTags.map((t) => t.id));
    setTitle("");
    setContent("");
    setSelectedTags([]);
  };

  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const filteredTags = tags.filter(
    (tag) =>
      tagInput &&
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.find((t) => t.id === tag.id)
  );

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      // MDEditor의 textarea로 포커스 이동
      const textarea = editorRef.current?.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    } else if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Memo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
        />
        <div data-color-mode="light" ref={editorRef}>
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            preview="live"
            height={300}
            textareaProps={{
              placeholder: "Content... (Markdown supported)",
              onKeyDown: handleEditorKeyDown
            }}
          />
        </div>

        {/* 태그 선택 */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="태그 검색..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            {filteredTags.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => addTag(tag)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="gap-1">
                  {tag.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag.id)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Add Memo (Ctrl + Enter)
        </Button>
      </CardContent>
    </Card>
  );
}
