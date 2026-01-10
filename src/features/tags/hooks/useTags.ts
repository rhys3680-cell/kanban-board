import type { Tag } from "@/entities/memo/model/types";
import {
  useTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "@/entities/tag/api/queries";

export function useTags() {
  const { data: tags = [], isLoading: loading, refetch } = useTagsQuery();
  const createTagMutation = useCreateTagMutation();
  const updateTagMutation = useUpdateTagMutation();
  const deleteTagMutation = useDeleteTagMutation();

  const addTag = async (name: string, color?: string): Promise<Tag> => {
    return createTagMutation.mutateAsync({ name, color });
  };

  const editTag = async (id: string, updates: Partial<Pick<Tag, "name" | "color">>) => {
    return updateTagMutation.mutateAsync({ id, updates });
  };

  const removeTag = async (id: string) => {
    return deleteTagMutation.mutateAsync(id);
  };

  return {
    tags,
    loading,
    addTag,
    editTag,
    removeTag,
    refetch,
  };
}
