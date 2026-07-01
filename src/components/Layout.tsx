import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {title && (
          <h1 className="mb-6 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
