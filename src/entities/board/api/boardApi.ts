import { supabase } from "@/shared/libs/supabase";
import type { Board } from "../model/types";

export async function fetchBoards(): Promise<Board[]> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("position");

  if (error) throw error;
  return (data || []) as Board[];
}

export async function createBoard(
  title: string,
  color: string = "#3b82f6",
  icon: string = "layout-grid"
): Promise<Board> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 현재 최대 position 조회
  const { data: boards } = await supabase
    .from("boards")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = boards && boards.length > 0 ? boards[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("boards")
    .insert({
      title,
      color,
      icon,
      position: nextPosition,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Board;
}

export async function updateBoard(
  boardId: string,
  updates: Partial<Pick<Board, "title" | "color" | "icon">>
): Promise<void> {
  const { error } = await supabase
    .from("boards")
    .update(updates)
    .eq("id", boardId);

  if (error) throw error;
}

export async function deleteBoard(boardId: string): Promise<void> {
  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId);

  if (error) throw error;
}