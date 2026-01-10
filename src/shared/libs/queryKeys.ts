export const queryKeys = {
  // Tags
  tags: ['tags'] as const,
  tagsList: () => [...queryKeys.tags, 'list'] as const,

  // Kanban (나중에 추가)
  kanban: ['kanban'] as const,
  columns: () => [...queryKeys.kanban, 'columns'] as const,

  // Memos (나중에 추가)
  memos: ['memos'] as const,
  memosWithTags: () => [...queryKeys.memos, 'with-tags'] as const,
  memo: (id: string) => [...queryKeys.memos, id] as const,
};
