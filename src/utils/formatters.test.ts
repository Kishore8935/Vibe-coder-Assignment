import { describe, expect, it } from "vitest";
import { formatEngagementRate, formatFollowers } from "./formatters";

describe("formatFollowers", () => {
  it("formats millions with one decimal and an M suffix", () => {
    expect(formatFollowers(92_690_266)).toBe("92.7M");
    expect(formatFollowers(1_000_000)).toBe("1.0M");
  });

  it("formats thousands with one decimal and a K suffix", () => {
    expect(formatFollowers(17_383)).toBe("17.4K");
    expect(formatFollowers(1_000)).toBe("1.0K");
  });

  it("returns the raw number below 1,000", () => {
    expect(formatFollowers(328)).toBe("328");
    expect(formatFollowers(0)).toBe("0");
  });
});

describe("formatEngagementRate", () => {
  it("converts a fraction to a percentage with two decimals", () => {
    // 0.01425 => 1.43% (the bug we fixed multiplied by 10000)
    expect(formatEngagementRate(0.01425)).toBe("1.43%");
  });

  it("returns N/A when the rate is undefined", () => {
    expect(formatEngagementRate(undefined)).toBe("N/A");
  });
});
