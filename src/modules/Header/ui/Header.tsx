import { useAuth } from "@/app/providers";
import { Button } from "@/shared/ui/button";
import { LogOut, LayoutDashboard, LayoutGrid, StickyNote, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/libs/utils";

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/kanban", label: "Kanban", icon: LayoutGrid },
    { path: "/memos", label: "Memos", icon: StickyNote },
    { path: "/tags", label: "Tags", icon: Tag },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between mb-3 md:mb-0">
          <Link to="/">
            <h1 className="text-lg md:text-2xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
              Kanban Board
            </h1>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {user?.email && (
              <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="gap-1 md:gap-2 h-8 md:h-9 text-xs md:text-sm"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>

        <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-1 md:gap-2 h-8 md:h-9 text-xs md:text-sm whitespace-nowrap",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
