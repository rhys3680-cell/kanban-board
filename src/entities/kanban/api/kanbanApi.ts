import { supabase } from "@/shared/libs/supabase";
import type { Column } from "../model/types";

export async function fetchKanbanData(boardId: string): Promise<Column[]> {
  const { data, error } = await supabase
    .from("columns")
    .select(`
      *,
      cards (*)
    `)
    .eq("board_id", boardId)
    .order("position");

  if (error) throw error;

  return (data || []) as Column[];
}

export async function addCardToColumn(
  columnId: string,
  title: string,
  description: string,
  position: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("cards").insert({
    column_id: columnId,
    title,
    description,
    position,
    user_id: user.id,
  });

  if (error) throw error;
}

export async function updateCard(
  cardId: string,
  title: string,
  description: string
): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .update({
      title,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId);

  if (error) throw error;
}

export async function deleteCardById(cardId: string): Promise<void> {
  const { error } = await supabase.from("cards").delete().eq("id", cardId);

  if (error) throw error;
}

export async function moveCardToColumn(
  cardId: string,
  targetColumnId: string,
  newPosition: number
): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .update({
      column_id: targetColumnId,
      position: newPosition,
    })
    .eq("id", cardId);

  if (error) throw error;
}

// Column CRUD
export async function createColumn(
  boardId: string,
  title: string,
  position: number
): Promise<void> {
  const { error } = await supabase.from("columns").insert({
    board_id: boardId,
    title,
    position,
  });

  if (error) throw error;
}

export async function updateColumn(
  columnId: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from("columns")
    .update({ title })
    .eq("id", columnId);

  if (error) throw error;
}

export async function deleteColumn(columnId: string): Promise<void> {
  const { error } = await supabase.from("columns").delete().eq("id", columnId);

  if (error) throw error;
}
