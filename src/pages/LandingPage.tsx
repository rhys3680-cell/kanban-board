import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import {
  LayoutGrid,
  StickyNote,
  Tag,
  ArrowRight,
  CheckCircle,
  LogIn,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: LayoutGrid,
      title: "칸반 보드",
      description: "드래그 앤 드롭으로 쉽게 작업을 관리하세요",
    },
    {
      icon: StickyNote,
      title: "메모",
      description: "아이디어와 노트를 빠르게 기록하세요",
    },
    {
      icon: Tag,
      title: "태그 관리",
      description: "태그로 메모를 분류하고 필터링하세요",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-lg md:text-2xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kanban Board
            </h1>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              로그인
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Kanban Board
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            심플하고 직관적인 작업 관리 도구로<br />
            생산성을 높이세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            왜 Kanban Board인가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              "다중 보드로 업무/개인/취미 분리",
              "드래그 앤 드롭 카드 이동",
              "메모와 태그로 아이디어 정리",
              "반응형 디자인으로 어디서나 사용",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
        <p>Built with React, Supabase, and Tailwind CSS</p>
      </footer>
    </div>
  );
}