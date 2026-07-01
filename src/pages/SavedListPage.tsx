import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { useSavedStore } from "@/store/useSavedStore";

export function SavedListPage() {
  const saved = useSavedStore((state) => state.saved);
  const clear = useSavedStore((state) => state.clear);

  return (
    <Layout title="Saved Profiles">
      <p className="mb-4 text-sm text-gray-500">
        {saved.length} profile{saved.length === 1 ? "" : "s"} in your list
      </p>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
          <Bookmark className="size-10" />
          <p>You haven&apos;t saved any profiles yet.</p>
          <Button asChild size="sm">
            <Link to="/">Browse influencers</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            {saved.map((profile) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                platform={profile.platform}
                searchQuery=""
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              Clear all
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
}
