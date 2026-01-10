import { useState, useMemo } from "react";
import {
  useMemosWithTagsQuery,
  useCreateMemoMutation,
  useUpdateMemoMutation,
  useDeleteMemoMutation,
} from "@/entities/memo";

export function useMemosWithFilters() {
  const { data: allMemos = [], isLoading: loading } = useMemosWithTagsQuery();
  const createMemoMutation = useCreateMemoMutation();
  const updateMemoMutation = useUpdateMemoMutation();
  const deleteMemoMutation = useDeleteMemoMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);

  // 클라이언트 측 필터링
  const memos = useMemo(() => {
    return allMemos.filter((memo) => {
      // 검색어 필터
      if (searchQuery && !memo.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 날짜 필터
      if (selectedDate && !memo.created_at.startsWith(selectedDate)) {
        return false;
      }

      // 태그 필터
      if (selectedTagIds.length > 0) {
        const memoTagIds = memo.tags?.map((t) => t.tag_id) || [];
        if (!selectedTagIds.some((id) => memoTagIds.includes(id))) {
          return false;
        }
      }

      return true;
    });
  }, [allMemos, searchQuery, selectedDate, selectedTagIds]);

  const createMemo = async (
    title: string,
    content: string,
    tagIds: string[]
  ) => {
    return createMemoMutation.mutateAsync({ title, content, tagIds });
  };

  const editMemo = async (
    id: string,
    title: string,
    content: string,
    tagIds: string[]
  ) => {
    await updateMemoMutation.mutateAsync({ id, title, content, tagIds });
    setEditingMemoId(null);
  };

  const removeMemo = async (id: string) => {
    return deleteMemoMutation.mutateAsync(id);
  };

  return {
    memos,
    loading,
    searchQuery,
    selectedDate,
    selectedTagIds,
    editingMemoId,
    setSearchQuery,
    setSelectedDate,
    setSelectedTagIds,
    setEditingMemoId,
    createMemo,
    editMemo,
    removeMemo,
  };
}
