import { useState, useEffect } from "react";
import type { Tag } from "@/entities/memo/model/types";
import { fetchTags, createTag, updateTag, deleteTag } from "@/entities/tag";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await fetchTags();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTag(name: string, color?: string): Promise<Tag> {
    try {
      const newTag = await createTag(name, color);
      await fetchData();
      return newTag;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  }

  async function editTag(id: string, updates: Partial<Pick<Tag, "name" | "color">>) {
    try {
      await updateTag(id, updates);
      await fetchData();
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  }

  async function removeTag(id: string) {
    try {
      await deleteTag(id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  }

  return {
    tags,
    loading,
    addTag,
    editTag,
    removeTag,
    refetch: fetchData,
  };
}
