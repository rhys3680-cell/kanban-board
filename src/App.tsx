import { AuthProvider, useAuth, QueryProvider } from "./app/providers";
import KanbanBoard from "@/pages/KanbanPage";
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

  return user ? <KanbanBoard /> : <AuthPage />;
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
