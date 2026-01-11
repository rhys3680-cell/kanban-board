import { useState, useRef } from "react";
import type { Memo, Tag } from "@/entities/memo";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, X } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { useTags } from "@/features/tags/hooks/useTags";

interface MemoItemProps {
  memo: Memo;
  isEditing: boolean;
  onEdit: (id: string, title: string, content: string, tagIds: string[]) => void;
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
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    memo.tags?.map((mt) => mt.tag!).filter(Boolean) || []
  );
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const { tags } = useTags();

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(memo.id, editTitle, editContent, selectedTags.map((t) => t.id));
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
      const textarea = editorRef.current?.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    } else if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    }
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
      <Card className="border-2 border-primary">
        <CardContent className="pt-6 space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            className="font-semibold"
            autoFocus
          />
          <div data-color-mode="light" ref={editorRef}>
            <MDEditor
              value={editContent}
              onChange={(val) => setEditContent(val || "")}
              preview="live"
              height={300}
              textareaProps={{
                onKeyDown: handleEditorKeyDown
              }}
            />
          </div>

          {/* 태그 편집 */}
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

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button onClick={onCancelEdit} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-snug">
              {memo.title}
            </CardTitle>
            {memo.tags && memo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {memo.tags.map((memoTag) => (
                  <Badge key={memoTag.id} variant="secondary" className="text-xs">
                    {memoTag.tag?.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStartEdit(memo.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(memo.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {memo.content && (
        <CardContent className="pt-0 space-y-3">
          <div data-color-mode="light">
            <MDEditor.Markdown source={memo.content} className="bg-transparent!" />
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(memo.created_at)}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
