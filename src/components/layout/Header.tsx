import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavedListDrawer } from "@/components/saved/SavedListDrawer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useSavedCount } from "@/store/useSavedStore";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const savedCount = useSavedCount();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight sm:text-lg"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          Influencer Search
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            aria-label={`View saved list (${savedCount} saved)`}
          >
            <Bookmark />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <Badge variant="secondary" aria-hidden>
                {savedCount}
              </Badge>
            )}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <SavedListDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </header>
  );
}
