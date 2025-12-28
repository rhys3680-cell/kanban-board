import { useAuth } from "@/app/providers";
import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kanban Board
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-sm text-muted-foreground">{user.email}</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
