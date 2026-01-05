import { supabase } from "@/shared/libs/supabase";
import type { Tag, Memo } from "@/entities/memo/model/types";

// 모든 태그 가져오기
export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

// 태그 생성
export async function createTag(name: string, color?: string): Promise<Tag> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tags")
    .insert({ name, color, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 태그 수정
export async function updateTag(
  id: string,
  updates: Partial<Pick<Tag, "name" | "color">>
): Promise<void> {
  const { error } = await supabase.from("tags").update(updates).eq("id", id);

  if (error) throw error;
}

// 태그 삭제
export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) throw error;
}

// 메모에 태그 연결하기
export async function addTagToMemo(
  memoId: string,
  tagId: string
): Promise<void> {
  const { error } = await supabase
    .from("memo_tags")
    .insert({ memo_id: memoId, tag_id: tagId });

  if (error) throw error;
}

// 메모에서 태그 제거하기
export async function removeTagFromMemo(
  memoId: string,
  tagId: string
): Promise<void> {
  const { error } = await supabase
    .from("memo_tags")
    .delete()
    .eq("memo_id", memoId)
    .eq("tag_id", tagId);

  if (error) throw error;
}

// 메모의 태그 전체 업데이트 (기존 태그 모두 제거 후 새로 추가)
export async function updateMemoTags(
  memoId: string,
  tagIds: string[]
): Promise<void> {
  // 기존 태그 모두 제거
  await supabase.from("memo_tags").delete().eq("memo_id", memoId);

  // 새 태그 추가
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from("memo_tags")
      .insert(tagIds.map((tagId) => ({ memo_id: memoId, tag_id: tagId })));

    if (error) throw error;
  }
}

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
