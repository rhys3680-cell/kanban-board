import { supabase } from "@/shared/libs/supabase";
import type { Column } from "@/pages/kanban/model/types";

export async function fetchKanbanData(): Promise<Column[]> {
  try {
    const { data, error } = await supabase
      .from("columns")
      .select(`
        *,
        cards (*)
      `)
      .order("position");

    if (error) throw error;

    return (data || []) as Column[];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function addCardToColumn(
  columnId: string,
  title: string,
  position: number
): Promise<void> {
  try {
    const { error } = await supabase.from("cards").insert({
      column_id: columnId,
      title,
      description: "",
      position,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error adding card:", error);
    throw error;
  }
}

export async function deleteCardById(cardId: string): Promise<void> {
  try {
    const { error } = await supabase.from("cards").delete().eq("id", cardId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
}

export async function moveCardToColumn(
  cardId: string,
  targetColumnId: string,
  newPosition: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from("cards")
      .update({
        column_id: targetColumnId,
        position: newPosition,
      })
      .eq("id", cardId);

    if (error) throw error;
  } catch (error) {
    console.error("Error moving card:", error);
    throw error;
  }
}
