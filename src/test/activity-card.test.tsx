import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { islandActivities, type IslandActivity } from "@/lib/island-activities";
import { toggleActivityFavorite, useFavoriteActivityIds } from "@/lib/activity-favorites";
import { ActivityCard, ActivityDetailsModal, type ActivityDetails } from "@/routes/activities";

function getActivity(id: string): IslandActivity {
  const activity = islandActivities.find((item) => item.id === id);
  if (!activity) throw new Error(`Missing test activity: ${id}`);
  return activity;
}

function TestActivityCard({ activity }: { activity: IslandActivity }) {
  const [selected, setSelected] = useState<ActivityDetails | null>(null);
  const favoriteIds = useFavoriteActivityIds();
  return (
    <>
      <ActivityCard
        activity={activity}
        onSelect={() =>
          setSelected({
            id: activity.id,
            category: activity.category,
            title: activity.title,
            description: activity.description,
            highlight: activity.highlight,
            image: activity.image,
            imageAlt: activity.imageAlt,
            timing: activity.bestTime,
            cost: activity.cost,
            preparation: activity.preparation,
            placeIds: activity.placeIds,
            ...(activity.placeRelationNote
              ? { placeRelationNote: activity.placeRelationNote }
              : {}),
            ...(activity.sources ? { sources: activity.sources } : {}),
          })
        }
        favorite={favoriteIds.includes(activity.id)}
        onFavorite={() => toggleActivityFavorite(activity.id)}
      />
      <ActivityDetailsModal
        activity={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}

describe("ActivityCard", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage"));
  });

  it("opens the activity detail dialog when any part of the card is clicked", () => {
    render(<TestActivityCard activity={getActivity("sunrise")} />);

    fireEvent.click(screen.getByRole("button", { name: /เปิดรายละเอียดกิจกรรม/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ตื่นมารับแสงเช้า" })).toBeInTheDocument();
  });

  it("shows the selected activity and its real place carousel", () => {
    render(<TestActivityCard activity={getActivity("viewpoints")} />);

    fireEvent.click(screen.getByRole("button", { name: /เปิดรายละเอียดกิจกรรม/ }));
    expect(screen.getByRole("heading", { name: "ชมวิวรอบเกาะ" })).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "ช่องเขาขาด (ช่องอิศริยาภรณ์)" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ดูสถานที่ถัดไป" }));
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "หาดถ้ำพัง (อ่าวอัษฎางค์)" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("ค่าใช้จ่าย"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("toggles the star without opening the detail dialog", () => {
    const onFavorite = vi.fn();
    render(
      <ActivityCard
        activity={getActivity("sunrise")}
        onSelect={vi.fn()}
        favorite={false}
        onFavorite={onFavorite}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /บันทึกตื่นมารับแสงเช้า/ }));
    expect(onFavorite).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("favorites the currently selected place from the dialog without closing it", () => {
    render(<TestActivityCard activity={getActivity("viewpoints")} />);

    fireEvent.click(screen.getByRole("button", { name: /เปิดรายละเอียดกิจกรรม/ }));
    fireEvent.click(screen.getByRole("button", { name: "บันทึกชมวิวรอบเกาะเป็นรายการโปรด" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "นำชมวิวรอบเกาะออกจากรายการโปรด" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("button", { name: "นำถ้ำทะลุออกจากรายการโปรด" })).toBeNull();
  });

  it("keeps favorites independent for activities that share the same place ID", () => {
    render(
      <>
        <TestActivityCard activity={getActivity("sunrise")} />
        <TestActivityCard activity={getActivity("sunset")} />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "บันทึกตื่นมารับแสงเช้าเป็นรายการโปรด" }));
    expect(
      screen.getByRole("button", { name: "ยกเลิกบันทึกตื่นมารับแสงเช้าเป็นรายการโปรด" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "บันทึกชมพระอาทิตย์ตกเป็นรายการโปรด" }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
