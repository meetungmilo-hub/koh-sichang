import { describe, expect, it } from "vitest";
import { islandActivities, nightActivities } from "@/lib/island-activities";
import { islandPlaces, mergeIslandPlaceIds, parseIslandPlaceIds } from "@/lib/island-places";

describe("activities and route planning data", () => {
  it("keeps the nine primary activities in order and squid fishing in the night section", () => {
    expect(islandActivities.map((activity) => activity.id)).toEqual([
      "sunrise",
      "viewpoints",
      "sunset",
      "worship",
      "beach-kayak",
      "food-cafes",
      "snorkeling",
      "batik-workshop",
      "crab-bank",
    ]);
    expect(nightActivities.map((activity) => activity.id)).toContain("night-squid");
    expect(islandActivities.some((activity) => activity.id === "night-squid")).toBe(false);
    expect(
      [...islandActivities, ...nightActivities]
        .flatMap((activity) => activity.placeIds)
        .every((id) => islandPlaces.some((place) => place.id === id)),
    ).toBe(true);
  });

  it("deduplicates place IDs when parsing or adding selected stops", () => {
    expect(parseIslandPlaceIds("atsadang-bridge,tham-phang-beach,atsadang-bridge")).toEqual([
      "atsadang-bridge",
      "tham-phang-beach",
    ]);
    expect(
      mergeIslandPlaceIds(["atsadang-bridge"], ["tham-phang-beach", "atsadang-bridge"]),
    ).toEqual(["atsadang-bridge", "tham-phang-beach"]);
  });
});
