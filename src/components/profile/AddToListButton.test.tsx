import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToListButton } from "./AddToListButton";
import { useSavedStore } from "@/store/useSavedStore";

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn() }),
}));

const profile = {
  user_id: "1",
  username: "cristiano",
  fullname: "Cristiano Ronaldo",
  picture: "https://example.com/p.jpg",
  is_verified: true,
  followers: 100,
  url: "https://example.com",
};

describe("AddToListButton", () => {
  beforeEach(() => {
    useSavedStore.setState({ saved: [] });
    localStorage.clear();
  });

  it("toggles the profile in the store: adds on first click, removes on second", async () => {
    const user = userEvent.setup();
    render(<AddToListButton profile={profile} platform="instagram" />);

    expect(useSavedStore.getState().saved).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: /add @cristiano to list/i })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /add @cristiano to list/i })
    );

    expect(useSavedStore.getState().saved).toHaveLength(1);
    expect(useSavedStore.getState().saved[0].platform).toBe("instagram");
    const removeButton = screen.getByRole("button", {
      name: /remove @cristiano from list/i,
    });
    expect(removeButton).toHaveAttribute("aria-pressed", "true");

    await user.click(removeButton);
    expect(useSavedStore.getState().saved).toHaveLength(0);
  });
});
