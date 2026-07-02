import { beforeEach, describe, expect, it } from "vitest";
import { useSavedStore, type SavedProfile } from "./useSavedStore";

function saved(overrides: Partial<SavedProfile> = {}): SavedProfile {
  return {
    user_id: "1",
    username: "cristiano",
    fullname: "Cristiano Ronaldo",
    picture: "https://example.com/p.jpg",
    is_verified: true,
    followers: 100,
    url: "https://example.com",
    platform: "instagram",
    ...overrides,
  };
}

describe("useSavedStore", () => {
  beforeEach(() => {
    useSavedStore.setState({ saved: [] });
    localStorage.clear();
  });

  it("adds a profile", () => {
    useSavedStore.getState().addProfile(saved());
    expect(useSavedStore.getState().saved).toHaveLength(1);
  });

  it("ignores duplicates by user_id", () => {
    const { addProfile } = useSavedStore.getState();
    addProfile(saved({ user_id: "1" }));
    addProfile(saved({ user_id: "1", username: "changed" }));
    const state = useSavedStore.getState().saved;
    expect(state).toHaveLength(1);
    expect(state[0].username).toBe("cristiano");
  });

  it("removes a profile by user_id", () => {
    const { addProfile, removeProfile } = useSavedStore.getState();
    addProfile(saved({ user_id: "1" }));
    addProfile(saved({ user_id: "2", username: "leomessi" }));
    removeProfile("1");
    const state = useSavedStore.getState().saved;
    expect(state).toHaveLength(1);
    expect(state[0].user_id).toBe("2");
  });

  it("clears all profiles", () => {
    const { addProfile, clear } = useSavedStore.getState();
    addProfile(saved({ user_id: "1" }));
    addProfile(saved({ user_id: "2" }));
    clear();
    expect(useSavedStore.getState().saved).toHaveLength(0);
  });

  it("persists to localStorage under the wobb:saved-list key", () => {
    useSavedStore.getState().addProfile(saved({ user_id: "42" }));
    const raw = localStorage.getItem("wobb:saved-list");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.saved).toHaveLength(1);
    expect(parsed.state.saved[0].user_id).toBe("42");
  });
});
