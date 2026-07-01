import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavedListDrawer } from "@/components/saved/SavedListDrawer";
import { useSavedCount } from "@/store/useSavedStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const savedCount = useSavedCount();

  return (
    <div className="p-4 min-h-screen">
      <header className="mb-6 flex items-start justify-between border-b pb-4">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Influencer Search
          </Link>
          {title && <h1 className="text-2xl mt-2">{title}</h1>}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          aria-label={`View saved list (${savedCount} saved)`}
        >
          <Bookmark />
          Saved
          {savedCount > 0 && <Badge variant="secondary">{savedCount}</Badge>}
        </Button>
      </header>
      <main>{children}</main>

      <SavedListDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
