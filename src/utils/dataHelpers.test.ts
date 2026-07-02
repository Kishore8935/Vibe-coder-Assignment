import { describe, expect, it } from "vitest";
import {
  extractProfiles,
  filterProfiles,
  getPlatformLabel,
  isPlatform,
} from "./dataHelpers";
import type { UserProfileSummary } from "@/types";

function profile(
  overrides: Partial<UserProfileSummary> = {}
): UserProfileSummary {
  return {
    user_id: "1",
    username: "cristiano",
    url: "https://example.com",
    picture: "https://example.com/p.jpg",
    fullname: "Cristiano Ronaldo",
    is_verified: true,
    followers: 100,
    ...overrides,
  };
}

describe("filterProfiles", () => {
  const list = [
    profile({ user_id: "1", username: "cristiano", fullname: "Cristiano Ronaldo" }),
    profile({ user_id: "2", username: "leomessi", fullname: "Leo Messi" }),
  ];

  it("returns all profiles for an empty or whitespace query", () => {
    expect(filterProfiles(list, "")).toHaveLength(2);
    expect(filterProfiles(list, "   ")).toHaveLength(2);
  });

  it("matches username case-insensitively", () => {
    const res = filterProfiles(list, "CRISTIANO");
    expect(res).toHaveLength(1);
    expect(res[0].username).toBe("cristiano");
  });

  it("matches fullname case-insensitively", () => {
    const res = filterProfiles(list, "messi");
    expect(res).toHaveLength(1);
    expect(res[0].username).toBe("leomessi");
  });

  it("trims surrounding whitespace before matching", () => {
    expect(filterProfiles(list, "  leo  ")).toHaveLength(1);
  });
});

describe("extractProfiles", () => {
  it("returns 10 profiles per platform", () => {
    expect(extractProfiles("instagram")).toHaveLength(10);
    expect(extractProfiles("youtube")).toHaveLength(10);
    expect(extractProfiles("tiktok")).toHaveLength(10);
  });

  it("never yields an empty username (falls back to handle/user_id)", () => {
    for (const p of extractProfiles("youtube")) {
      expect(p.username.length).toBeGreaterThan(0);
    }
  });
});

describe("isPlatform / getPlatformLabel", () => {
  it("recognizes valid platforms and rejects others", () => {
    expect(isPlatform("instagram")).toBe(true);
    expect(isPlatform("threads")).toBe(false);
  });

  it("maps platforms to display labels", () => {
    expect(getPlatformLabel("instagram")).toBe("Instagram");
    expect(getPlatformLabel("youtube")).toBe("YouTube");
    expect(getPlatformLabel("tiktok")).toBe("TikTok");
  });
});
