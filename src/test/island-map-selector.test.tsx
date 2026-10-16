import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IslandMapSelector } from "@/components/travel/island-map-selector";

describe("IslandMapSelector", () => {
  it("lists the 12 map reference numbers without inventing map pins", () => {
    render(<IslandMapSelector selectedIds={[]} onToggle={vi.fn()} />);
    const map = screen.getByRole("group", { name: /ไม่มีหมุดพิกัดที่ยืนยันแล้ว/ });
    expect(within(map).queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText(/ยังไม่มีพิกัด GPS ที่ตรวจสอบแล้ว/)).toBeInTheDocument();
    for (const number of Array.from({ length: 12 }, (_, index) => String(index + 1))) {
      expect(screen.getByText(number, { exact: true })).toBeInTheDocument();
    }
    expect(screen.getByText(/เรือนไม้ริมทะเล · เรือนไม้ลวดลายขนมปังขิง/)).toBeInTheDocument();
  });

  it("lets a user choose a canonical place from the shared list", () => {
    const onToggle = vi.fn();
    render(<IslandMapSelector selectedIds={[]} onToggle={onToggle} focusId="atsadang-bridge" />);
    fireEvent.click(screen.getByRole("button", { name: /สะพานอัษฎางค์/ }));
    expect(onToggle).toHaveBeenCalledWith("atsadang-bridge");
  });
});
