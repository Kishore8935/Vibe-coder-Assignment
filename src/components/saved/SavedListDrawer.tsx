import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSavedStore } from "@/store/useSavedStore";
import { formatFollowers } from "@/utils/formatters";

interface SavedListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SavedListDrawer({ open, onOpenChange }: SavedListDrawerProps) {
  const saved = useSavedStore((state) => state.saved);
  const removeProfile = useSavedStore((state) => state.removeProfile);
  const clear = useSavedStore((state) => state.clear);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Saved profiles ({saved.length})</SheetTitle>
          <SheetDescription>
            Profiles you&apos;ve added to your list. They stay saved across visits.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <Bookmark className="size-8" />
              <p className="text-sm">No profiles saved yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {saved.map((profile) => (
                <li
                  key={profile.user_id}
                  className="flex items-center gap-3 rounded-lg border p-2"
                >
                  <img
                    src={profile.picture}
                    alt={`${profile.fullname}'s avatar`}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                  <Link
                    to={`/profile/${profile.username}?platform=${profile.platform}`}
                    onClick={() => onOpenChange(false)}
                    className="min-w-0 flex-1"
                  >
                    <div className="truncate text-sm font-medium">
                      @{profile.username}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {formatFollowers(profile.followers)} followers
                    </div>
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove @${profile.username}`}
                    onClick={() => removeProfile(profile.user_id)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="flex-row justify-between gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/list" onClick={() => onOpenChange(false)}>
              View full list
            </Link>
          </Button>
          {saved.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              Clear all
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
