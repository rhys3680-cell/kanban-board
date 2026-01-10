import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/entities": path.resolve(__dirname, "./src/entities"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리를 별도 청크로 분리
          react: ["react", "react-dom", "react-router-dom"],
          // UI 라이브러리
          ui: ["@radix-ui/react-dropdown-menu", "@radix-ui/react-label", "@radix-ui/react-slot"],
          // DnD 라이브러리
          dnd: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
          // 마크다운 에디터
          markdown: ["@uiw/react-md-editor"],
          // Supabase
          supabase: ["@supabase/supabase-js"],
          // TanStack Query
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
