import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/libs/queryKeys";
import type { Tag } from "@/entities/memo/model/types";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from "./tagApi";

// Query: 모든 태그 가져오기
export function useTagsQuery() {
  return useQuery({
    queryKey: queryKeys.tagsList(),
    queryFn: fetchTags,
  });
}

// Mutation: 태그 생성
export function useCreateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      createTag(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

// Mutation: 태그 수정
export function useUpdateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Tag, "name" | "color">>;
    }) => updateTag(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

// Mutation: 태그 삭제
export function useDeleteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}
