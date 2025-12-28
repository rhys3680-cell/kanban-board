import { supabase } from "@/shared/libs/supabase";
import type { Memo } from "@/pages/kanban/model/types";

export async function fetchMemos(): Promise<Memo[]> {
  try {
    const { data, error } = await supabase
      .from("memos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []) as Memo[];
  } catch (error) {
    console.error("Error fetching memos:", error);
    throw error;
  }
}

export async function addMemo(
  title: string,
  content: string
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("memos").insert({
      title,
      content,
      user_id: user.id,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error adding memo:", error);
    throw error;
  }
}

export async function updateMemo(
  id: string,
  title: string,
  content: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("memos")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating memo:", error);
    throw error;
  }
}

export async function deleteMemo(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("memos").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting memo:", error);
    throw error;
  }
}
