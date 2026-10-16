import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toggleActivityFavorite } from "@/lib/activity-favorites";
import { ActivityFavoritesPanel } from "@/routes/routes";

beforeEach(() => {
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent("storage"));
});

describe("route planning from activity favorites", () => {
  it("shows a saved activity and adds its related place by existing place ID", () => {
    toggleActivityFavorite("sunrise");
    const onSetPlaces = vi.fn();
    render(<ActivityFavoritesPanel selectedPlaces={[]} onSetPlaces={onSetPlaces} />);

    expect(screen.getByRole("heading", { name: "ตื่นมารับแสงเช้า" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "เพิ่มสถานที่เกี่ยวข้องลงทริป" }));
    expect(onSetPlaces).toHaveBeenCalledWith(["tham-thalu"]);
  });

  it("adds selected activities without duplicate place IDs", () => {
    toggleActivityFavorite("sunrise");
    toggleActivityFavorite("sunset");
    toggleActivityFavorite("viewpoints");
    const onSetPlaces = vi.fn();
    render(<ActivityFavoritesPanel selectedPlaces={["tham-thalu"]} onSetPlaces={onSetPlaces} />);

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "เลือกกิจกรรมชมวิวรอบเกาะเพื่อเพิ่มสถานที่ลงทริป",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /เพิ่มสถานที่ที่เลือกลงทริป/ }));

    expect(onSetPlaces).toHaveBeenCalledWith(["tham-thalu", "chong-khao-khat", "tham-phang-beach"]);
  });

  it("shows a saved series and links its confirmed resort to the shared route dataset", () => {
    toggleActivityFavorite("series:game-rai-game-rak");
    const onSetPlaces = vi.fn();
    render(<ActivityFavoritesPanel selectedPlaces={[]} onSetPlaces={onSetPlaces} />);

    expect(screen.getByRole("heading", { name: "เกมร้ายเกมรัก" })).toBeInTheDocument();
    expect(screen.getByText(/ปารี ฮัท รีสอร์ท/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "เพิ่มสถานที่เกี่ยวข้องลงทริป" }));
    expect(onSetPlaces).toHaveBeenCalledWith([
      "paree-hut-resort",
      "phra-chudadhuj",
      "atsadang-bridge",
    ]);
  });
});
