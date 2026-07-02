import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { useSavedStore } from "@/store/useSavedStore";

export function SavedListPage() {
  const saved = useSavedStore((state) => state.saved);
  const clear = useSavedStore((state) => state.clear);

  return (
    <Layout title="Saved Profiles">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {saved.length} profile{saved.length === 1 ? "" : "s"} in your list
        </p>
        {saved.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            Clear all
          </Button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          <Bookmark className="size-10" />
          <p>You haven&apos;t saved any profiles yet.</p>
          <Button asChild size="sm">
            <Link to="/">Browse influencers</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((profile) => (
            <ProfileCard
              key={profile.user_id}
              profile={profile}
              platform={profile.platform}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
