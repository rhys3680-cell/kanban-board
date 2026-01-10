import { useMemos } from "@/pages/kanban/hooks/useMemos";
import { MemoForm } from "@/pages/kanban/ui/MemoForm";
import { MemoFilters } from "@/pages/kanban/ui/MemoFilters";
import { MemoList } from "@/pages/kanban/ui/MemoList";
import { MainLayout } from "@/app/layouts";

export default function MemosPage() {
  const {
    memos,
    loading,
    searchQuery,
    selectedDate,
    selectedTagIds,
    editingMemoId,
    setSearchQuery,
    setSelectedDate,
    setSelectedTagIds,
    setEditingMemoId,
    createMemo,
    editMemo,
    removeMemo,
  } = useMemos();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 md:mb-8">
          Memos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <MemoForm onSubmit={createMemo} />
            <MemoFilters
              searchQuery={searchQuery}
              selectedDate={selectedDate}
              selectedTagIds={selectedTagIds}
              onSearchChange={setSearchQuery}
              onDateChange={setSelectedDate}
              onTagsChange={setSelectedTagIds}
            />
          </div>
          <div className="lg:col-span-2">
            <MemoList
              memos={memos}
              editingMemoId={editingMemoId}
              onEdit={editMemo}
              onDelete={removeMemo}
              onStartEdit={setEditingMemoId}
              onCancelEdit={() => setEditingMemoId(null)}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
