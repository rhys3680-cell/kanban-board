import { useState } from "react";
import { MainLayout } from "@/app/layouts";
import { useTags } from "@/features/tags/hooks/useTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import type { Tag } from "@/entities/memo/model/types";

export default function TagsPage() {
  const { tags, loading, addTag, editTag, removeTag } = useTags();
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    try {
      await addTag(newTagName.trim());
      setNewTagName("");
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const handleEdit = async () => {
    if (!editingTag || !editName.trim()) return;
    try {
      await editTag(editingTag.id, { name: editName.trim() });
      setEditingTag(null);
      setEditName("");
    } catch (error) {
      console.error("Failed to edit tag:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 태그를 삭제하시겠습니까?")) return;
    try {
      await removeTag(id);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditName(tag.name);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setEditName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 md:mb-8">
          태그 관리
        </h2>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* 새 태그 생성 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">새 태그 만들기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="태그 이름 입력..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                  }}
                />
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 태그 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">태그 목록 ({tags.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tags.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  아직 태그가 없습니다. 위에서 태그를 만들어보세요.
                </p>
              ) : (
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      {editingTag?.id === tag.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                          />
                          <Button size="sm" onClick={handleEdit}>
                            저장
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge variant="secondary">{tag.name}</Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(tag)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(tag.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
