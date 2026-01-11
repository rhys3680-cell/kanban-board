import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/libs/queryKeys";
import {
  fetchKanbanData,
  addCardToColumn,
  updateCard,
  deleteCardById,
  moveCardToColumn,
} from "./kanbanApi";

// Query: Kanban 데이터 가져오기
export function useKanbanQuery() {
  return useQuery({
    queryKey: queryKeys.kanban,
    queryFn: fetchKanbanData,
  });
}

// Mutation: 카드 추가
export function useAddCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      title,
      description,
      position,
    }: {
      columnId: string;
      title: string;
      description: string;
      position: number;
    }) => addCardToColumn(columnId, title, description, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}

// Mutation: 카드 수정
export function useUpdateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      title,
      description,
    }: {
      cardId: string;
      title: string;
      description: string;
    }) => updateCard(cardId, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}

// Mutation: 카드 삭제
export function useDeleteCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => deleteCardById(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}

// Mutation: 카드 이동
export function useMoveCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      targetColumnId,
      newPosition,
    }: {
      cardId: string;
      targetColumnId: string;
      newPosition: number;
    }) => moveCardToColumn(cardId, targetColumnId, newPosition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}
