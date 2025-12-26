export interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  title: string;
  position: number;
  created_at: string;
  cards: Card[];
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
