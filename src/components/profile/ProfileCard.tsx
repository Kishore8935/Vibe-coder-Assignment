import { memo } from "react";
import { Link } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { AddToListButton } from "@/components/profile/AddToListButton";
import { PlatformBadge } from "@/components/profile/PlatformBadge";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { Card } from "@/components/ui/card";
import { formatFollowers } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  return (
    <Card
      size="sm"
      className="justify-between transition-all hover:shadow-md motion-safe:hover:-translate-y-0.5"
    >
      <Link
        to={`/profile/${profile.username}?platform=${platform}`}
        className="flex items-start gap-3 px-4 focus-visible:outline-none"
      >
        <img
          src={profile.picture}
          alt={`${profile.fullname} profile picture`}
          loading="lazy"
          className="size-14 shrink-0 rounded-full object-cover ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 font-medium">
            <span className="truncate group-hover/card:underline">
              @{profile.username}
            </span>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="truncate text-sm text-muted-foreground">
            {profile.fullname}
          </div>
          <div className="mt-1 text-sm font-semibold">
            {formatFollowers(profile.followers)}
            <span className="font-normal text-muted-foreground"> followers</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-4">
        <PlatformBadge platform={platform} />
        <AddToListButton profile={profile} platform={platform} compact />
      </div>
    </Card>
  );
});
