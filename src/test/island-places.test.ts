import { describe, expect, it } from "vitest";
import { islandActivities, nightActivities } from "@/lib/island-activities";
import { islandPlaces } from "@/lib/island-places";
import { seriesActivities } from "@/lib/series-activities";

describe("shared island places", () => {
  it("keeps the 12 reference numbers stable and unique place IDs", () => {
    const referencePlaces = islandPlaces.filter((place) => place.mapNumber !== undefined);
    expect(referencePlaces.map((place) => place.mapNumber)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
    expect(new Set(islandPlaces.map((place) => place.id)).size).toBe(islandPlaces.length);
    expect(referencePlaces.map((place) => place.name)).toEqual([
      "ประภาคารเกาะสีชัง",
      "ศาลเจ้าแม่กวนอิม",
      "ศาลเจ้าพ่อเขาใหญ่",
      "มณฑปรอยพระพุทธบาท",
      "ช่องเขาขาด (ช่องอิศริยาภรณ์)",
      "วัดถ้ำยายปริก",
      "หาดถ้ำพัง (อ่าวอัษฎางค์)",
      "สะพานอัษฎางค์",
      "พระจุฑาธุชราชฐาน",
      "เรือนไม้ลวดลายขนมปังขิง ในพระจุฑาธุชราชฐาน",
      "วัดอัษฎางคนิมิตร",
      "Islandish Café",
    ]);
  });

  it("links activity records to existing central place IDs only", () => {
    const placeIds = new Set(islandPlaces.map((place) => place.id));
    const linkedIds = [
      ...islandActivities.flatMap((activity) => activity.placeIds),
      ...nightActivities.flatMap((activity) => activity.placeIds),
      ...seriesActivities.flatMap((activity) =>
        activity.locations.flatMap((location) => (location.placeId ? [location.placeId] : [])),
      ),
    ];
    expect(linkedIds.every((id) => placeIds.has(id))).toBe(true);
  });

  it("does not invent GPS coordinates", () => {
    expect(islandPlaces.every((place) => !place.coordinates || place.coordinates.sourceUrl)).toBe(
      true,
    );
  });
});
