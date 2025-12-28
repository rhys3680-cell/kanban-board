import { Header } from "@/modules/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 w-full">
      <Header />
      {children}
    </div>
  );
}
