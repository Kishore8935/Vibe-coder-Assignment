import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types";
import { getPlatformLabel } from "@/utils/dataHelpers";

const platformStyles: Record<Platform, string> = {
  instagram:
    "border-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white",
  youtube: "border-transparent bg-red-600 text-white",
  tiktok:
    "border-transparent bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900",
};

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  return (
    <Badge className={cn(platformStyles[platform], className)}>
      {getPlatformLabel(platform)}
    </Badge>
  );
}
