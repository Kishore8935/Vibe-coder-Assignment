import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useIsProfileSaved, useSavedStore } from "@/store/useSavedStore";
import type { Platform, UserProfileSummary } from "@/types";

type SavableProfile = Pick<
  UserProfileSummary,
  "user_id" | "username" | "fullname" | "picture" | "is_verified" | "followers" | "url"
>;

interface AddToListButtonProps {
  profile: SavableProfile;
  platform: Platform;
  compact?: boolean;
  className?: string;
}

export function AddToListButton({
  profile,
  platform,
  compact = false,
  className,
}: AddToListButtonProps) {
  const isSaved = useIsProfileSaved(profile.user_id);
  const addProfile = useSavedStore((state) => state.addProfile);
  const removeProfile = useSavedStore((state) => state.removeProfile);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isSaved) {
      removeProfile(profile.user_id);
      toast(`Removed @${profile.username} from your list`);
    } else {
      addProfile({ ...profile, platform });
      toast.success(`Added @${profile.username} to your list`);
    }
  };

  return (
    <Button
      type="button"
      variant={isSaved ? "secondary" : "default"}
      size={compact ? "icon-sm" : "sm"}
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={
        isSaved
          ? `Remove @${profile.username} from list`
          : `Add @${profile.username} to list`
      }
      className={className}
    >
      {isSaved ? <BookmarkCheck /> : <Bookmark />}
      {!compact && <span>{isSaved ? "Saved" : "Add to List"}</span>}
    </Button>
  );
}
