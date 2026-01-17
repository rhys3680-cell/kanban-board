import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/libs/queryKeys";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "./boardApi";

export function useBoardsQuery() {
  return useQuery({
    queryKey: queryKeys.boards,
    queryFn: fetchBoards,
  });
}

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      color,
      icon,
    }: {
      title: string;
      color?: string;
      icon?: string;
    }) => createBoard(title, color, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards });
    },
  });
}

export function useUpdateBoardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      updates,
    }: {
      boardId: string;
      updates: Partial<{ title: string; color: string; icon: string }>;
    }) => updateBoard(boardId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards });
    },
  });
}

export function useDeleteBoardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId: string) => deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards });
    },
  });
}