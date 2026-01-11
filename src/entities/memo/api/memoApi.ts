import { supabase } from "@/shared/libs/supabase";
import type { Memo } from "../model/types";

// 태그와 함께 메모 가져오기
export async function fetchMemosWithTags(): Promise<Memo[]> {
  const { data, error } = await supabase
    .from("memos")
    .select(
      `
      *,
      tags:memo_tags(
        id,
        tag_id,
        memo_id,
        created_at,
        tag:tags(*)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// 메모 생성
export async function createMemo(
  title: string,
  content: string,
  tagIds: string[]
): Promise<Memo> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: memo, error: memoError } = await supabase
    .from("memos")
    .insert({ title, content, user_id: user.id })
    .select()
    .single();

  if (memoError) throw memoError;

  if (tagIds.length > 0) {
    const { error: tagsError } = await supabase
      .from("memo_tags")
      .insert(tagIds.map((tagId) => ({ memo_id: memo.id, tag_id: tagId })));

    if (tagsError) throw tagsError;
  }

  return memo;
}

// 메모 수정
export async function updateMemo(
  id: string,
  title: string,
  content: string,
  tagIds: string[]
): Promise<void> {
  const { error: updateError } = await supabase
    .from("memos")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) throw updateError;

  await supabase.from("memo_tags").delete().eq("memo_id", id);

  if (tagIds.length > 0) {
    const { error: tagsError } = await supabase
      .from("memo_tags")
      .insert(tagIds.map((tagId) => ({ memo_id: id, tag_id: tagId })));

    if (tagsError) throw tagsError;
  }
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  const { error } = await supabase.from("memos").delete().eq("id", id);

  if (error) throw error;
}
