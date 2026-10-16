import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IslandMapSelector } from "@/components/travel/island-map-selector";
import {
  islandPlaces,
  mergeIslandPlaceIds,
  parseIslandPlaceIds,
  isIslandPlaceId,
  type IslandPlaceId,
} from "@/lib/island-places";
import { useFavoritePlaceIds } from "@/lib/activity-favorites";
import { islandActivities, nightActivities } from "@/lib/island-activities";
import { seriesActivities } from "@/lib/series-activities";
import { pageHead } from "@/lib/travel";

type RoutesSearch = { places?: string | undefined; focus?: IslandPlaceId };
function validateSearch(search: Record<string, unknown>): RoutesSearch {
  const result: RoutesSearch = {};
  if (typeof search["places"] === "string") result.places = search["places"];
  if (typeof search["focus"] === "string" && isIslandPlaceId(search["focus"])) {
    result.focus = search["focus"];
  }
  return result;
}

export const Route = createFileRoute("/routes")({
  validateSearch,
  head: () => ({
    meta: [
      ...pageHead(
        "เส้นทางและเรื่องราว",
        "แผนที่แนะนำสถานที่ท่องเที่ยวบนเกาะสีชัง เลือกจุดแวะเพื่อวางแผนทริป Skylab",
      ).meta,
    ],
  }),
  component: RoutesPage,
});

function RoutesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/routes" });
  const selectedPlaces = parseIslandPlaceIds(search.places);
  const focusedPlaceId = search.focus;
  const selectedWithoutCoordinates = selectedPlaces.filter(
    (id) => !islandPlaces.find((place) => place.id === id)?.coordinates,
  );

  useEffect(() => {
    if (!focusedPlaceId) return;
    document
      .getElementById(`route-place-${focusedPlaceId}`)
      ?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }, [focusedPlaceId]);

  function setPlaces(next: IslandPlaceId[]) {
    const unique = mergeIslandPlaceIds([], next);
    const places = unique.join(",");
    void navigate({
      search: (current) => ({ ...current, ...(places ? { places } : { places: undefined }) }),
      replace: true,
    });
  }

  function togglePlace(placeId: IslandPlaceId) {
    setPlaces(
      selectedPlaces.includes(placeId)
        ? selectedPlaces.filter((id) => id !== placeId)
        : [...selectedPlaces, placeId],
    );
  }

  return (
    <main className="container-site pb-20">
      <div className="page-intro">
        <p className="eyebrow text-muted-foreground">ALONG THE ISLAND</p>
        <h1 className="section-title mt-3">รู้จักสีชังผ่านจุดแวะระหว่างทาง</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          เลือกสถานที่บนแผนที่หรือจากรายการด้านล่าง แล้วเพิ่มจุดที่ต้องการลงในทริป
        </p>
      </div>

      <ActivityFavoritesPanel selectedPlaces={selectedPlaces} onSetPlaces={setPlaces} />

      <IslandMapSelector
        selectedIds={selectedPlaces}
        onToggle={togglePlace}
        focusId={focusedPlaceId}
      />
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-sea p-5 sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 font-medium">
            <RouteIcon className="size-4" /> จุดในทริปนี้
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedPlaces.length
              ? `เพิ่มแล้ว ${selectedPlaces.length} จุด · รายการนี้อยู่ใน URL และส่งต่อไปหน้าจองได้`
              : "ยังไม่มีจุดในทริป เลือกจากแผนที่หรือรายการสถานที่ได้"}
          </p>
          {selectedWithoutCoordinates.length > 0 && (
            <p className="mt-2 text-xs leading-5 text-amber-800">
              {selectedWithoutCoordinates.length} จุดยังไม่มีพิกัด GPS ที่ยืนยันแล้ว
              โปรดตรวจสอบตำแหน่งกับผู้ดูแลก่อนคำนวณเส้นทาง
            </p>
          )}
        </div>
        <Button asChild className="h-11" disabled={!selectedPlaces.length}>
          <Link to="/booking" search={{ places: selectedPlaces.join(",") || undefined }}>
            วางแผนทริป <ArrowRight />
          </Link>
        </Button>
      </div>
    </main>
  );
}

export function ActivityFavoritesPanel({
  selectedPlaces,
  onSetPlaces,
}: {
  selectedPlaces: readonly IslandPlaceId[];
  onSetPlaces: (next: IslandPlaceId[]) => void;
}) {
  const favoritePlaceIds = useFavoritePlaceIds();
  const [selectedFavoriteIds, setSelectedFavoriteIds] = useState<string[]>([]);
  const favoritePlaceRelations = [
    ...islandActivities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      placeIds: activity.placeIds,
    })),
    ...nightActivities.map((activity) => ({
      id: `night:${activity.id}`,
      title: activity.title,
      placeIds: activity.placeIds,
    })),
    ...seriesActivities.map((activity) => ({
      id: `series:${activity.id}`,
      title: activity.title,
      placeIds: activity.locations.flatMap((location) =>
        location.placeId ? [location.placeId] : [],
      ),
    })),
  ].flatMap((activity) =>
    activity.placeIds.flatMap((placeId) => {
      const key = `${activity.id}::${placeId}`;
      return favoritePlaceIds.includes(key)
        ? [{ id: key, title: activity.title, placeIds: [placeId] }]
        : [];
    }),
  );

  function toggleFavoriteSelection(activityId: string) {
    setSelectedFavoriteIds((current) =>
      current.includes(activityId)
        ? current.filter((id) => id !== activityId)
        : [...current, activityId],
    );
  }

  function relatedIdsForActivities(ids: readonly string[]) {
    return favoritePlaceRelations
      .filter((activity) => ids.includes(activity.id))
      .flatMap((activity) => activity.placeIds);
  }

  function addSelectedFavoritesToTrip() {
    onSetPlaces(mergeIslandPlaceIds(selectedPlaces, relatedIdsForActivities(selectedFavoriteIds)));
    setSelectedFavoriteIds([]);
  }

  return (
    <section
      className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6"
      aria-labelledby="favorite-activities-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="favorite-activities-title" className="font-medium">
            สถานที่โปรด ({favoritePlaceRelations.length})
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            รายการโปรดแยกตามกิจกรรมและสถานที่ · เลือกเพิ่มสถานที่ลงทริปได้แยกต่างหาก
          </p>
        </div>
        <Button
          type="button"
          onClick={addSelectedFavoritesToTrip}
          disabled={
            !selectedFavoriteIds.length || !relatedIdsForActivities(selectedFavoriteIds).length
          }
          className="h-11"
        >
          <Check className="size-4" /> เพิ่มสถานที่ที่เลือกลงทริป ({selectedFavoriteIds.length})
        </Button>
      </div>
      {favoritePlaceRelations.length > 0 && (
        <ul className="mt-4 divide-y divide-border rounded-md border border-border">
          {favoritePlaceRelations.map((activity) => {
            const relatedPlaces = activity.placeIds.flatMap((id) => {
              const place = islandPlaces.find((item) => item.id === id);
              return place ? [place] : [];
            });
            const relatedIds = mergeIslandPlaceIds([], activity.placeIds);
            const newPlaceIds = relatedIds.filter((id) => !selectedPlaces.includes(id));
            const withoutPosition = relatedPlaces.filter((place) => !place.coordinates);
            return (
              <li
                key={activity.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      aria-label={`เลือกกิจกรรม${activity.title}เพื่อเพิ่มสถานที่ลงทริป`}
                      checked={selectedFavoriteIds.includes(activity.id)}
                      disabled={!newPlaceIds.length}
                      onChange={() => toggleFavoriteSelection(activity.id)}
                      className="mt-1 size-4 accent-primary"
                    />
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      {relatedPlaces.length ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          สถานที่ที่เกี่ยวข้อง:{" "}
                          {relatedPlaces.map((place) => place.name).join(" · ")}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          ยังไม่มีสถานที่ยืนยันสำหรับกิจกรรมนี้
                        </p>
                      )}
                      {withoutPosition.length > 0 && (
                        <p className="mt-1 text-xs text-amber-800">
                          บางสถานที่ยังไม่มีพิกัดยืนยัน โปรดตรวจสอบตำแหน่งก่อนคำนวณเส้นทาง
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {relatedPlaces.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!newPlaceIds.length}
                    onClick={() => onSetPlaces(mergeIslandPlaceIds(selectedPlaces, relatedIds))}
                  >
                    {newPlaceIds.length ? "เพิ่มสถานที่เกี่ยวข้องลงทริป" : "อยู่ในทริปแล้ว"}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {favoritePlaceRelations.length === 0 && (
        <p className="mt-4 rounded-md border border-dashed border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          ยังไม่มีสถานที่โปรด · ไปที่แท็บกิจกรรมแล้วกดดาวบนสถานที่ที่สนใจ
        </p>
      )}
    </section>
  );
}
