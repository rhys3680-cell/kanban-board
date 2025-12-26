import { useState, useEffect } from "react";
import type { Memo } from "@/pages/kanban/model/types";
import {
  fetchMemos,
  addMemo,
  updateMemo,
  deleteMemo,
} from "@/pages/kanban/api/memoApi";

export function useMemo() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await fetchMemos();
      setMemos(data);
    } catch (error) {
      console.error("Error fetching memos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createMemo(title: string, content: string) {
    if (!title.trim()) return;

    try {
      await addMemo(title, content);
      await fetchData();
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  }

  async function editMemo(id: string, title: string, content: string) {
    if (!title.trim()) return;

    try {
      await updateMemo(id, title, content);
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

    return matchesSearch && matchesDate;
  });

  return {
    memos: filteredMemos,
    loading,
    searchQuery,
    selectedDate,
    editingMemoId,
    setSearchQuery,
    setSelectedDate,
    setEditingMemoId,
    createMemo,
    editMemo,
    removeMemo,
  };
}
