import { motion } from "framer-motion";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "@/components/profile/ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({ profiles, platform }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <p>No profiles match your search.</p>
      </div>
    );
  }

  return (
    // Keyed by platform so switching tabs replays the entrance stagger.
    <div key={platform} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.user_id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: Math.min(index * 0.04, 0.4),
            ease: "easeOut",
          }}
        >
          <ProfileCard profile={profile} platform={platform} />
        </motion.div>
      ))}
    </div>
  );
}
