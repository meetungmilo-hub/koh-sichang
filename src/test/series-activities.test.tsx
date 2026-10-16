import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { seriesActivities } from "@/lib/series-activities";
import {
  ActivityDetailsModal,
  ActivityTabs,
  ActivityImage,
  SeriesCard,
  type ActivityDetails,
} from "@/routes/activities";

describe("series activities", () => {
  it("uses public image paths directly and falls back when an activity image fails", () => {
    render(
      <ActivityImage
        src="/images/activities/custom.jpg"
        alt="ภาพกิจกรรมทดสอบ"
        className="test-image"
      />,
    );
    const image = screen.getByAltText("ภาพกิจกรรมทดสอบ");
    expect(image).toHaveAttribute("src", "/images/activities/custom.jpg");

    fireEvent.error(image);
    expect(screen.getByAltText("ภาพกิจกรรมทดสอบ · ใช้ภาพสำรอง")).toHaveAttribute(
      "src",
      expect.stringContaining("sichang-bridge"),
    );
  });

  it("offers all three activity tabs and switches the active selection", () => {
    function TabsHarness() {
      const [activeTab, setActiveTab] = useState<"day" | "night" | "series">("day");
      return <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />;
    }
    render(<TabsHarness />);

    const seriesTab = screen.getByRole("button", { name: "ตามรอยซีรีส์" });
    expect(screen.getByRole("button", { name: "กิจกรรมกลางวัน" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "กิจกรรมกลางคืน" })).toBeInTheDocument();
    fireEvent.click(seriesTab);
    expect(seriesTab).toHaveAttribute("aria-pressed", "true");
  });

  it("opens the selected series details and keeps the favorite button independent", () => {
    const activity = seriesActivities[0];
    if (!activity) throw new Error("Missing series fixture");
    const onSelect = vi.fn();
    const onFavorite = vi.fn();
    render(
      <SeriesCard
        activity={activity}
        onSelect={onSelect}
        favorite={false}
        onFavorite={onFavorite}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /เปิดรายละเอียดตามรอยซีรีส์ เกมร้ายเกมรัก/ }),
    );
    expect(onSelect).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: /บันทึกเกมร้ายเกมรักเป็นรายการโปรด/ }));
    expect(onFavorite).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("shows filming confidence and uses shared place IDs for Google Maps", () => {
    const activity = seriesActivities[0];
    if (!activity) throw new Error("Missing series fixture");
    const details: ActivityDetails = {
      id: `series:${activity.id}`,
      category: activity.genre,
      title: activity.title,
      description: activity.description,
      image: activity.image,
      imageAlt: activity.imageAlt,
      timing: "ตรวจสอบเวลาเข้าชมกับสถานที่",
      cost: "ยังไม่มีข้อมูลยืนยัน",
      preparation: "ตรวจสอบการเข้าถึง",
      placeIds: activity.locations.flatMap((location) =>
        location.placeId ? [location.placeId] : [],
      ),
      confirmedFilmingScope: activity.confirmedFilmingScope,
      seriesLocations: activity.locations,
      sources: activity.sources,
    };
    render(<ActivityDetailsModal activity={details} onOpenChange={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/มีรายงานสื่อท่องเที่ยวระบุว่า/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "ปารี ฮัท รีสอร์ท (Paree Hut Resort)" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /ค้นหาชื่อใน Google Maps/ }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("สถานที่แนะนำ · ไม่ยืนยันฉากถ่ายทำ").length).toBeGreaterThan(0);
  });
});
