import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import MDEditor from "@uiw/react-md-editor";

interface MemoFormProps {
  onSubmit: (title: string, content: string) => void;
}

export function MemoForm({ onSubmit }: MemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title, content);
    setTitle("");
    setContent("");
  };

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
        <Button onClick={handleSubmit} className="w-full">
          Add Memo (Ctrl + Enter)
        </Button>
      </CardContent>
    </Card>
  );
}
