import { useKanbanBoard } from "@/features/kanban/hooks/useKanbanBoard";
import { useMemosWithFilters } from "@/features/memos/hooks/useMemosWithFilters";
import type { Column } from "@/entities/kanban";
import type { Memo } from "@/entities/memo";
import { MainLayout } from "@/app/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, StickyNote, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { columns, loading: kanbanLoading } = useKanbanBoard();
  const { memos, loading: memosLoading } = useMemosWithFilters();
  const navigate = useNavigate();

  if (kanbanLoading || memosLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalCards = columns.reduce((acc: number, col: Column) => acc + col.cards.length, 0);
  const recentMemos = memos.slice(0, 5);

  // 메모 통계
  const totalMemos = memos.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMemos = memos.filter((m: Memo) => new Date(m.created_at) >= today).length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekMemos = memos.filter((m: Memo) => new Date(m.created_at) >= weekAgo).length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 md:mb-8">
          Dashboard
        </h1>

        {/* Kanban 통계 */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 md:h-6 md:w-6" />
            Kanban Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Total Cards</CardDescription>
                <CardTitle className="text-2xl md:text-3xl">{totalCards}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Across all columns</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/kanban")}
                    className="gap-1 h-7 md:h-8 text-xs md:text-sm"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {columns.map((column: Column, index: number) => {
              const colors = {
                0: "text-green-700",
                1: "text-blue-700",
                2: "text-purple-700",
              };
              const textColor = colors[index as keyof typeof colors];

              return (
                <Card key={column.id}>
                  <CardHeader className="pb-2 md:pb-3">
                    <CardDescription className="text-xs md:text-sm">{column.title}</CardDescription>
                    <CardTitle className={`text-2xl md:text-3xl ${textColor}`}>
                      {column.cards.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {column.cards.length === 0
                        ? "No cards"
                        : `${column.cards.length} card${column.cards.length > 1 ? "s" : ""}`}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Memos 통계 */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <StickyNote className="h-5 w-5 md:h-6 md:w-6" />
            Memo Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Total Memos</CardDescription>
                <CardTitle className="text-2xl md:text-3xl text-orange-700">{totalMemos}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">All time</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/memos")}
                    className="gap-1 h-7 md:h-8 text-xs md:text-sm"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Today's Memos</CardDescription>
                <CardTitle className="text-2xl md:text-3xl text-orange-700">{todayMemos}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {todayMemos === 0
                    ? "No memos today"
                    : `${todayMemos} memo${todayMemos > 1 ? "s" : ""} created`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">This Week</CardDescription>
                <CardTitle className="text-2xl md:text-3xl text-orange-700">{weekMemos}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {weekMemos === 0
                    ? "No memos this week"
                    : `${weekMemos} memo${weekMemos > 1 ? "s" : ""} created`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Average Length</CardDescription>
                <CardTitle className="text-2xl md:text-3xl text-orange-700">
                  {totalMemos === 0
                    ? 0
                    : Math.round(
                        memos.reduce((acc: number, m: Memo) => acc + m.content.length, 0) / totalMemos
                      )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-muted-foreground">characters per memo</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kanban 미리보기 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5" />
                  <CardTitle>Kanban Board</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/kanban")}
                >
                  View All
                </Button>
              </div>
              <CardDescription>Quick overview of your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {columns.map((column: Column) => (
                  <div key={column.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{column.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {column.cards.length} cards
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 최근 메모 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-5 w-5" />
                  <CardTitle>Recent Memos</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/memos")}
                >
                  View All
                </Button>
              </div>
              <CardDescription>Your latest notes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMemos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No memos yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentMemos.map((memo: Memo) => (
                    <div key={memo.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <h4 className="font-medium text-sm">{memo.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {memo.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
