import { AuthProvider, useAuth, QueryProvider, ErrorBoundaryProvider } from "./app/providers";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import KanbanPage from "@/pages/KanbanPage";
import MemosPage from "@/pages/MemosPage";
import TagsPage from "@/pages/TagsPage";
import AuthPage from "@/pages/AuthPage";
import { Toaster } from "@/shared/ui/sonner";

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
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/kanban" element={<KanbanPage />} />
      <Route path="/memos" element={<MemosPage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
