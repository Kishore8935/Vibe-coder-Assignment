import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { AddToListButton } from "@/components/profile/AddToListButton";
import { PlatformBadge } from "@/components/profile/PlatformBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { isPlatform } from "@/utils/dataHelpers";
import { loadProfileByUsername } from "@/utils/profileLoader";

interface LoadedProfile {
  username: string;
  data: ProfileDetailResponse | null;
}

interface Stat {
  label: string;
  value: string;
}

function BackLink() {
  return (
    <Link
      to="/"
      className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Back to search
    </Link>
  );
}

function ProfileDetailSkeleton() {
  return (
    <div>
      <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Skeleton className="size-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform") ?? "";
  const [result, setResult] = useState<LoadedProfile | null>(null);

  useEffect(() => {
    if (!username) return;

    let active = true;
    loadProfileByUsername(username)
      .then((data) => {
        if (active) setResult({ username, data });
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
        if (active) setResult({ username, data: null });
      });

    return () => {
      active = false;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/" className="text-primary underline">
          Back
        </Link>
      </Layout>
    );
  }

  // While the fetch for the current username is in flight, `result` is either
  // null or still holds the previous username's data — both mean "loading".
  if (!result || result.username !== username) {
    return (
      <Layout title={`@${username}`}>
        <BackLink />
        <ProfileDetailSkeleton />
      </Layout>
    );
  }

  if (!result.data) {
    return (
      <Layout title={`@${username}`}>
        <BackLink />
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="mb-2 text-muted-foreground">
            Could not load profile details for @{username}.
          </p>
          <Button asChild size="sm">
            <Link to="/">Back to search</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = result.data.data.user_profile;
  const profileType = user.type ?? "";
  const resolvedPlatform: Platform = isPlatform(platformParam)
    ? platformParam
    : isPlatform(profileType)
      ? profileType
      : "instagram";

  const stats: Stat[] = [
    { label: "Followers", value: formatFollowers(user.followers) },
    {
      label: "Engagement Rate",
      value: formatEngagementRate(user.engagement_rate),
    },
    ...(user.posts_count !== undefined
      ? [{ label: "Posts", value: formatFollowers(user.posts_count) }]
      : []),
    ...(user.avg_likes !== undefined
      ? [{ label: "Avg Likes", value: formatFollowers(user.avg_likes) }]
      : []),
    ...(user.avg_comments !== undefined
      ? [{ label: "Avg Comments", value: formatFollowers(user.avg_comments) }]
      : []),
    ...(user.avg_views !== undefined && user.avg_views > 0
      ? [{ label: "Avg Views", value: formatFollowers(user.avg_views) }]
      : []),
    ...(user.engagements !== undefined
      ? [{ label: "Engagements", value: formatFollowers(user.engagements) }]
      : []),
  ];

  return (
    <Layout title={user.fullname}>
      <BackLink />

      <div className="rounded-xl bg-card p-6 text-card-foreground ring-1 ring-foreground/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <img
            src={user.picture}
            alt={`${user.fullname} profile picture`}
            className="size-24 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">@{user.username}</h2>
              <VerifiedBadge verified={user.is_verified} />
              <PlatformBadge platform={resolvedPlatform} />
            </div>
            <p className="text-muted-foreground">{user.fullname}</p>
            {user.description && (
              <p className="mt-2 max-w-prose text-sm">{user.description}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <AddToListButton profile={user} platform={resolvedPlatform} />
              {user.url && (
                <Button asChild variant="outline" size="sm">
                  <a href={user.url} target="_blank" rel="noopener noreferrer">
                    View on platform
                    <ExternalLink />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10"
          >
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
