import { useState, useEffect } from "react";
import type { Memo } from "@/pages/kanban/model/types";
import {
  addMemo,
  updateMemo,
  deleteMemo,
} from "@/pages/kanban/api/memoApi";
import { fetchMemosWithTags, updateMemoTags } from "@/entities/tag";

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await fetchMemosWithTags();
      setMemos(data);
    } catch (error) {
      console.error("Error fetching memos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createMemo(title: string, content: string, tagIds?: string[]) {
    if (!title.trim()) return;

    try {
      const memoId = await addMemo(title, content);
      if (tagIds && tagIds.length > 0) {
        await updateMemoTags(memoId, tagIds);
      }
      await fetchData();
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  }

  async function editMemo(id: string, title: string, content: string, tagIds?: string[]) {
    if (!title.trim()) return;

    try {
      await updateMemo(id, title, content);
      if (tagIds !== undefined) {
        await updateMemoTags(id, tagIds);
      }
      await fetchData();
      setEditingMemoId(null);
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  }

  async function removeMemo(id: string) {
    try {
      await deleteMemo(id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  }

  const filteredMemos = memos.filter((memo) => {
    const matchesSearch =
      searchQuery === "" ||
      memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate =
      selectedDate === "" ||
      memo.created_at.startsWith(selectedDate);

    const matchesTags =
      selectedTagIds.length === 0 ||
      selectedTagIds.some((tagId) =>
        memo.tags?.some((mt) => mt.tag?.id === tagId)
      );

    return matchesSearch && matchesDate && matchesTags;
  });

  return {
    memos: filteredMemos,
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
