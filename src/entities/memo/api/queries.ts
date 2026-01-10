import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/libs/queryKeys";
import {
  fetchMemosWithTags,
  createMemo,
  updateMemo,
  deleteMemo,
} from "./memoApi";

// Query: 태그와 함께 메모 가져오기
export function useMemosWithTagsQuery() {
  return useQuery({
    queryKey: queryKeys.memosWithTags(),
    queryFn: fetchMemosWithTags,
  });
}

// Mutation: 메모 생성
export function useCreateMemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      content,
      tagIds,
    }: {
      title: string;
      content: string;
      tagIds: string[];
    }) => createMemo(title, content, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memos });
    },
  });
}

// Mutation: 메모 수정
export function useUpdateMemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      content,
      tagIds,
    }: {
      id: string;
      title: string;
      content: string;
      tagIds: string[];
    }) => updateMemo(id, title, content, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memos });
    },
  });
}

// Mutation: 메모 삭제
export function useDeleteMemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memos });
    },
  });
}
