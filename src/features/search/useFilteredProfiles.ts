import { useMemo } from "react";
import type { Platform } from "@/types";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function useFilteredProfiles(platform: Platform, query: string) {
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, query),
    [allProfiles, query]
  );

  return { allProfiles, filtered };
}
