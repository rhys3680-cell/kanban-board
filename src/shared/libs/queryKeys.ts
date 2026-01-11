export const queryKeys = {
  // Tags
  tags: ['tags'] as const,
  tagsList: () => [...queryKeys.tags, 'list'] as const,

  // Kanban
  kanban: ['kanban'] as const,

  // Memos
  memos: ['memos'] as const,
  memosWithTags: () => [...queryKeys.memos, 'with-tags'] as const,
  memo: (id: string) => [...queryKeys.memos, id] as const,
};
