import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { setActivityPlaceFavorite, useFavoritePlaceIds } from "@/lib/activity-favorites";

function FavoriteButton({ placeId }: { placeId: string }) {
  const favoriteIds = useFavoritePlaceIds();
  const favorite = favoriteIds.includes(placeId);

  return (
    <button
      type="button"
      aria-pressed={favorite}
      onClick={() => setActivityPlaceFavorite(placeId, !favorite)}
    >
      {placeId}
    </button>
  );
}

describe("activity card favorites", () => {
  beforeEach(() => window.localStorage.clear());

  it("updates shared place IDs immediately and persists changes", () => {
    render(
      <>
        <FavoriteButton placeId="tham-phang-beach" />
        <FavoriteButton placeId="tham-phang-beach" />
      </>,
    );

    const buttons = screen.getAllByRole("button", { name: "tham-phang-beach" });
    const firstButton = buttons[0];
    const secondButton = buttons[1];
    if (!firstButton || !secondButton) throw new Error("Expected both favorite buttons");
    fireEvent.click(firstButton);

    expect(firstButton).toHaveAttribute("aria-pressed", "true");
    expect(secondButton).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("sichang.activityFavoritePlaceIds.v1")).toBe(
      '["tham-phang-beach"]',
    );

    fireEvent.click(secondButton);
    expect(firstButton).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("sichang.activityFavoritePlaceIds.v1")).toBe("[]");
  });

  it("removes duplicate place IDs when saving", () => {
    render(<FavoriteButton placeId="tham-phang-beach" />);
    window.localStorage.setItem(
      "sichang.activityFavoritePlaceIds.v1",
      '["tham-phang-beach","tham-phang-beach"]',
    );
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "sichang.activityFavoritePlaceIds.v1" }),
      );
    });
    expect(screen.getByRole("button", { name: "tham-phang-beach" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "tham-phang-beach" }));

    expect(window.localStorage.getItem("sichang.activityFavoritePlaceIds.v1")).toBe("[]");
  });
});
