import { lazy, Suspense } from "react";
import { AuthProvider, useAuth, QueryProvider, ErrorBoundaryProvider } from "./providers";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/shared/ui/sonner";

// Lazy load pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const KanbanPage = lazy(() => import("@/pages/KanbanPage"));
const MemosPage = lazy(() => import("@/pages/MemosPage"));
const TagsPage = lazy(() => import("@/pages/TagsPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      }>
        <AuthPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/memos" element={<MemosPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundaryProvider>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
            <Toaster position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundaryProvider>
  );
}

export default App;
