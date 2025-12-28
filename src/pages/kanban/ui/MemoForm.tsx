import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSubmit();
            }
          }}
        />
        <Textarea
          placeholder="Content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSubmit();
            }
          }}
          className="resize-none"
          rows={4}
        />
        <Button onClick={handleSubmit} className="w-full">
          Add Memo (Ctrl + Enter)
        </Button>
      </CardContent>
    </Card>
  );
}
