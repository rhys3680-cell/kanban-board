import { lazy, Suspense } from "react";
import {
  AuthProvider,
  useAuth,
  QueryProvider,
  ErrorBoundaryProvider,
} from "./providers";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/shared/ui/sonner";

// Lazy load pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const KanbanPage = lazy(() => import("@/pages/KanbanPage"));
const MemosPage = lazy(() => import("@/pages/MemosPage"));
const TagsPage = lazy(() => import("@/pages/TagsPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-xl text-gray-600">Loading...</div>
  </div>
);

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memos"
          element={
            <ProtectedRoute>
              <MemosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tags"
          element={
            <ProtectedRoute>
              <TagsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
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