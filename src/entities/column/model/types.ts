import type { Card } from "@/entities/card/model/types";

export interface Column {
  id: string;
  title: string;
  position: number;
  created_at: string;
  cards: Card[];
}