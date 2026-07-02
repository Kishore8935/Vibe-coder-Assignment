import { useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/features/search/PlatformFilter";
import { useFilteredProfiles } from "@/features/search/useFilteredProfiles";
import { ProfileList } from "@/components/profile/ProfileList";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getPlatformLabel } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 200);

  const { allProfiles, filtered } = useFilteredProfiles(
    platform,
    debouncedQuery
  );

  return (
    <Layout title="Find Influencers">
      <p className="-mt-4 mb-6 text-muted-foreground">
        Browse and save top creators across Instagram, YouTube, and TikTok.
      </p>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filtered.length} of {allProfiles.length} on{" "}
        {getPlatformLabel(platform)}
      </p>

      <ProfileList profiles={filtered} platform={platform} />
    </Layout>
  );
}
