export interface Tag {
  id: string;
  name: string;
  color: string | null;
  user_id: string;
  created_at: string;
}

export interface MemoTag {
  id: string;
  memo_id: string;
  tag_id: string;
  created_at: string;
  tag?: Tag;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  tags?: MemoTag[];
}