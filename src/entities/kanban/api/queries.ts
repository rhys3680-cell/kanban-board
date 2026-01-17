import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/libs/queryKeys";
import {
  fetchKanbanData,
  addCardToColumn,
  updateCard,
  deleteCardById,
  moveCardToColumn,
  createColumn,
  updateColumn,
  deleteColumn,
} from "./kanbanApi";

// Query: Kanban 데이터 가져오기 (보드별)
export function useKanbanQuery(boardId: string | null) {
  return useQuery({
    queryKey: queryKeys.kanbanByBoard(boardId || ""),
    queryFn: () => fetchKanbanData(boardId!),
    enabled: !!boardId,
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

// Mutation: 컬럼 추가
export function useCreateColumnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      title,
      position,
    }: {
      boardId: string;
      title: string;
      position: number;
    }) => createColumn(boardId, title, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}

// Mutation: 컬럼 수정
export function useUpdateColumnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      title,
    }: {
      columnId: string;
      title: string;
    }) => updateColumn(columnId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}

// Mutation: 컬럼 삭제
export function useDeleteColumnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (columnId: string) => deleteColumn(columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kanban });
    },
  });
}
