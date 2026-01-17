import { useState } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Card, Column } from "@/entities/kanban";
import {
  useKanbanQuery,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useMoveCardMutation,
} from "@/entities/kanban";

export function useKanbanBoard(boardId: string | null) {
  const { data: columns = [], isLoading: loading } = useKanbanQuery(boardId);
  const addCardMutation = useAddCardMutation();
  const updateCardMutation = useUpdateCardMutation();
  const deleteCardMutation = useDeleteCardMutation();
  const moveCardMutation = useMoveCardMutation();

  const [newCardTitle, setNewCardTitle] = useState<{ [key: string]: string }>(
    {}
  );
  const [newCardDescription, setNewCardDescription] = useState<{
    [key: string]: string;
  }>({});
  const [showAddCard, setShowAddCard] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const addCard = async (columnId: string) => {
    const title = newCardTitle[columnId]?.trim();
    if (!title) return;

    const column = columns.find((col) => col.id === columnId);
    const position = column?.cards.length || 0;
    const description = newCardDescription[columnId]?.trim() || "";

    await addCardMutation.mutateAsync({
      columnId,
      title,
      description,
      position,
    });

    setNewCardTitle({ ...newCardTitle, [columnId]: "" });
    setNewCardDescription({ ...newCardDescription, [columnId]: "" });
    setShowAddCard({ ...showAddCard, [columnId]: false });
  };

  const editCard = async (
    cardId: string,
    title: string,
    description: string
  ) => {
    if (!title.trim()) return;

    await updateCardMutation.mutateAsync({ cardId, title, description });
    setEditingCardId(null);
  };

  const deleteCard = async (cardId: string) => {
    await deleteCardMutation.mutateAsync(cardId);
  };

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

    if (!over) {
      console.log("No drop target found");
      return;
    }

    const activeCardId = active.id as string;
    const overId = over.id as string;

    console.log("Drag end:", { activeCardId, overId });

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

    if (!activeCard || !sourceColumn) {
      console.log("Card or source column not found");
      return;
    }

    let targetColumn: Column | undefined = columns.find(
      (col) => col.id === overId
    );

    if (!targetColumn) {
      for (const column of columns) {
        if (column.cards.find((c) => c.id === overId)) {
          targetColumn = column;
          break;
        }
      }
    }

    if (!targetColumn) {
      console.log("Target column not found for overId:", overId);
      console.log(
        "Available columns:",
        columns.map((c) => ({ id: c.id, title: c.title }))
      );
      return;
    }

    if (sourceColumn.id !== targetColumn.id) {
      console.log("Moving card to different column:", targetColumn.title);
      const newPosition = targetColumn.cards.length;
      await moveCardMutation.mutateAsync({
        cardId: activeCardId,
        targetColumnId: targetColumn.id,
        newPosition,
      });
    } else {
      console.log("Card dropped in same column");
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
