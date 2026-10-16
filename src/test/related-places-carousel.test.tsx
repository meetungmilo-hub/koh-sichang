import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RelatedPlacesCarousel } from "@/routes/activities";

describe("RelatedPlacesCarousel", () => {
  it("shows an empty state and no controls when there are no linked places", () => {
    render(<RelatedPlacesCarousel placeIds={[]} />);

    expect(screen.getByText(/ยังไม่มีสถานที่ที่ยืนยัน/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows a single place without carousel controls or activity favorite actions", () => {
    render(<RelatedPlacesCarousel placeIds={["tham-phang-beach"]} />);

    expect(screen.getByRole("heading", { name: "หาดถ้ำพัง (อ่าวอัษฎางค์)" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /สถานที่ก่อนหน้า|สถานที่ถัดไป/ })).toBeNull();
    expect(screen.getByRole("link", { name: /ค้นหาชื่อใน Google Maps/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ดูสถานที่ในแผนที่เส้นทาง/ })).toHaveAttribute(
      "href",
      "/routes?focus=tham-phang-beach",
    );
  });

  it("moves between two related places", () => {
    render(<RelatedPlacesCarousel placeIds={["tham-thalu", "tham-phang-beach"]} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ถ้ำทะลุ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ดูสถานที่ก่อนหน้า" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "ดูสถานที่ถัดไป" }));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "หาดถ้ำพัง (อ่าวอัษฎางค์)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ดูสถานที่ถัดไป" })).toBeDisabled();
  });

  it("supports touch swipes across a longer place list", () => {
    const { container } = render(
      <RelatedPlacesCarousel
        placeIds={["tham-thalu", "tham-phang-beach", "sea-split-viewpoint"]}
      />,
    );
    const carousel = container.firstElementChild!;

    fireEvent.touchStart(carousel, { touches: [{ identifier: 0, clientX: 180, clientY: 20 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ identifier: 0, clientX: 90, clientY: 22 }] });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "หาดถ้ำพัง (อ่าวอัษฎางค์)" })).toBeInTheDocument();
  });
});
