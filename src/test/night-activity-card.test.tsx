import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { nightActivities } from "@/lib/island-activities";
import { ActivityDetailsModal, NightCard, type ActivityDetails } from "@/routes/activities";

function getNightActivity(id: string): (typeof nightActivities)[number] {
  const activity = nightActivities.find((item) => item.id === id);
  if (!activity) throw new Error(`Missing test night activity: ${id}`);
  return activity;
}

function TestNightCard({ activity }: { activity: (typeof nightActivities)[number] }) {
  const [selected, setSelected] = useState<ActivityDetails | null>(null);
  return (
    <>
      <NightCard
        activity={activity}
        onSelect={() =>
          setSelected({
            id: `night:${activity.id}`,
            category: "กิจกรรมยามค่ำคืน",
            title: activity.title,
            description: activity.description,
            highlight: activity.highlight,
            image: activity.image,
            imageAlt: activity.imageAlt,
            timing: activity.service,
            cost: activity.cost,
            preparation:
              activity.id === "night-squid"
                ? "ต้องตรวจสอบรอบเรือ สภาพอากาศ และเงื่อนไขของผู้ให้บริการก่อนนัดหมาย ขณะนี้ยังไม่มีสถานะพร้อมจอง"
                : "สอบถามผู้ให้บริการและตรวจสอบสภาพอากาศก่อนเดินทาง ข้อมูลบริการยังไม่มีการยืนยัน",
            placeIds: activity.placeIds,
          })
        }
        favorite={false}
        onFavorite={vi.fn()}
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

describe("NightCard", () => {
  it("opens the correct night activity details without inventing a linked location", () => {
    render(<TestNightCard activity={getNightActivity("night-squid")} />);

    fireEvent.click(screen.getByRole("button", { name: /เปิดรายละเอียดกิจกรรม/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ออกเรือตกหมึกยามค่ำคืน" })).toBeInTheDocument();
    expect(screen.getByText(/ยังไม่มีสถานที่ที่ยืนยันและเชื่อมด้วย place ID/)).toBeInTheDocument();
    expect(screen.getByText(/ต้องตรวจสอบรอบเรือ สภาพอากาศ/)).toBeInTheDocument();
  });

  it("calls the favorite handler without opening its details", () => {
    const onFavorite = vi.fn();
    render(
      <NightCard
        activity={getNightActivity("night-coast")}
        onSelect={vi.fn()}
        favorite={false}
        onFavorite={onFavorite}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /บันทึกชมแสงไฟ/ }));
    expect(onFavorite).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
