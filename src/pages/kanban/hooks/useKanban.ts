import { useState, useEffect } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Card, Column } from "@/pages/kanban/model/types";
import {
  fetchKanbanData,
  addCardToColumn,
  updateCard,
  deleteCardById,
  moveCardToColumn,
} from "@/pages/kanban/api/kanbanApi";

export function useKanban() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCardTitle, setNewCardTitle] = useState<{ [key: string]: string }>(
    {}
  );
  const [newCardDescription, setNewCardDescription] = useState<{ [key: string]: string }>(
    {}
  );
  const [showAddCard, setShowAddCard] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await fetchKanbanData();
      setColumns(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addCard(columnId: string) {
    const title = newCardTitle[columnId]?.trim();
    if (!title) return;

    try {
      const column = columns.find((col) => col.id === columnId);
      const position = column?.cards.length || 0;
      const description = newCardDescription[columnId]?.trim() || "";

      await addCardToColumn(columnId, title, description, position);

      await fetchData();

      setNewCardTitle({ ...newCardTitle, [columnId]: "" });
      setNewCardDescription({ ...newCardDescription, [columnId]: "" });
      setShowAddCard({ ...showAddCard, [columnId]: false });
    } catch (error) {
      console.error("Error adding card:", error);
    }
  }

  async function editCard(cardId: string, title: string, description: string) {
    if (!title.trim()) return;

    try {
      await updateCard(cardId, title, description);
      await fetchData();
      setEditingCardId(null);
    } catch (error) {
      console.error("Error editing card:", error);
    }
  }

  async function deleteCard(cardId: string) {
    try {
      await deleteCardById(cardId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const card = columns
      .flatMap((col) => col.cards)
      .find((c) => c.id === active.id);
    setActiveCard(card || null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overColumnId = over.id as string;

    let activeCard: Card | undefined;
    let sourceColumn: Column | undefined;

    for (const column of columns) {
      const card = column.cards.find((c) => c.id === activeCardId);
      if (card) {
        activeCard = card;
        sourceColumn = column;
        break;
      }
    }

    if (!activeCard || !sourceColumn) return;

    const targetColumn = columns.find((col) => col.id === overColumnId);
    if (!targetColumn) return;

    if (sourceColumn.id !== targetColumn.id) {
      try {
        const newPosition = targetColumn.cards.length;
        await moveCardToColumn(activeCardId, targetColumn.id, newPosition);
        await fetchData();
      } catch (error) {
        console.error("Error moving card:", error);
      }
    }
  }

  return {
    columns,
    loading,
    newCardTitle,
    newCardDescription,
    showAddCard,
    activeCard,
    editingCardId,
    setNewCardTitle,
    setNewCardDescription,
    setShowAddCard,
    setEditingCardId,
    addCard,
    editCard,
    deleteCard,
    handleDragStart,
    handleDragEnd,
  };
}
