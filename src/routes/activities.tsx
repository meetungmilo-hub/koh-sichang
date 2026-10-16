import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  ExternalLink,
  Film,
  MapPin,
  Moon,
  Route as RouteIcon,
  Star,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  activityCategories,
  islandActivities,
  nightActivities,
  type ActivityFilter,
  type IslandActivity,
} from "@/lib/island-activities";
import { islandPlaces, type IslandPlaceId } from "@/lib/island-places";
import {
  seriesActivities,
  type SeriesActivity,
  type SeriesLocation,
} from "@/lib/series-activities";
import {
  activityPlaceFavoriteKey,
  hasActivityPlaceFavorite,
  setActivityPlaceFavorite,
  toggleActivityPlaceFavorites,
  useFavoritePlaceIds,
} from "@/lib/activity-favorites";
import { pageHead } from "@/lib/travel";
import { resolveTravelImage, travelImages, type TravelImage } from "@/lib/travel-images";

export const Route = createFileRoute("/activities")({
  head: () =>
    pageHead(
      "กิจกรรมน่าทำบนเกาะสีชัง",
      "รวมกิจกรรมชมวิว ธรรมชาติ วัฒนธรรม อาหารและกิจกรรมกลางแจ้งบนเกาะสีชัง",
    ),
  component: ActivitiesPage,
});

const imageFor = resolveTravelImage;

export type ActivityDetails = {
  id: string;
  category: string;
  title: string;
  description: string;
  highlight?: string;
  image: TravelImage;
  imageAlt: string;
  timing: string;
  cost: string;
  preparation: string;
  placeIds: readonly IslandPlaceId[];
  placeRelationNote?: string;
  workshop?: { provider?: string };
  confirmedFilmingScope?: string;
  seriesLocations?: readonly SeriesLocation[];
  sources?: { label: string; url: string }[];
};

function detailsForActivity(activity: IslandActivity): ActivityDetails {
  return {
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
    ...(activity.placeRelationNote ? { placeRelationNote: activity.placeRelationNote } : {}),
    ...(activity.workshop
      ? { workshop: activity.provider ? { provider: activity.provider } : {} }
      : {}),
    ...(activity.sources ? { sources: activity.sources } : {}),
  };
}

function detailsForNightActivity(activity: (typeof nightActivities)[number]): ActivityDetails {
  return {
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
    ...(activity.placeRelationNote ? { placeRelationNote: activity.placeRelationNote } : {}),
  };
}

function detailsForSeriesActivity(activity: (typeof seriesActivities)[number]): ActivityDetails {
  return {
    id: `series:${activity.id}`,
    category: activity.genre,
    title: activity.title,
    description: activity.description,
    image: activity.image,
    imageAlt: activity.imageAlt,
    timing: "ตรวจสอบเวลาเปิดและเงื่อนไขการเข้าถึงกับแต่ละสถานที่ก่อนเดินทาง",
    cost: "ยังไม่มีข้อมูลค่าใช้จ่ายสำหรับเส้นทางตามรอยนี้",
    preparation: "ตรวจสอบการอนุญาตเข้าพื้นที่ สภาพอากาศ และเส้นทางปลอดภัยก่อนเดินทาง",
    placeIds: activity.locations.flatMap((location) =>
      location.placeId ? [location.placeId] : [],
    ),
    confirmedFilmingScope: activity.confirmedFilmingScope,
    seriesLocations: activity.locations,
    sources: activity.sources,
  };
}

type ActivityTabId = "day" | "night" | "series";

export function ActivityImage({
  src,
  alt,
  className,
  loading,
}: {
  src: TravelImage;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? travelImages.coast : imageFor(src)}
      alt={failed ? `${alt} · ใช้ภาพสำรอง` : alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}

export function ActivityTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ActivityTabId;
  onTabChange: (tab: ActivityTabId) => void;
}) {
  return (
    <div
      className="mt-6 grid max-w-2xl grid-cols-3 gap-2"
      role="group"
      aria-label="หมวดกิจกรรมบนเกาะสีชัง"
    >
      <button
        id="activity-tab-day"
        type="button"
        aria-pressed={activeTab === "day"}
        aria-controls="activity-panel-day"
        onClick={() => onTabChange("day")}
        aria-label="กิจกรรมกลางวัน"
        className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-2 text-[10px] font-medium leading-tight transition sm:text-sm ${activeTab === "day" ? "border-white bg-white text-primary shadow-sm" : "border-white/35 bg-slate-950/35 text-white hover:bg-white/15"}`}
      >
        <Sun className="size-4" aria-hidden="true" /> กิจกรรมกลางวัน
      </button>
      <button
        id="activity-tab-series"
        type="button"
        aria-pressed={activeTab === "series"}
        aria-controls="activity-panel-series"
        onClick={() => onTabChange("series")}
        aria-label="ตามรอยซีรีส์"
        className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-2 text-[10px] font-medium leading-tight transition sm:text-sm ${activeTab === "series" ? "border-white bg-primary text-primary-foreground shadow-sm" : "border-white/35 bg-slate-950/35 text-white hover:bg-white/15"}`}
      >
        <Film className="size-4" aria-hidden="true" /> ตามรอยซีรีส์
      </button>
      <button
        id="activity-tab-night"
        type="button"
        aria-pressed={activeTab === "night"}
        aria-controls="activity-panel-night"
        onClick={() => onTabChange("night")}
        aria-label="กิจกรรมกลางคืน"
        className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-2 text-[10px] font-medium leading-tight transition sm:text-sm ${activeTab === "night" ? "border-amber-200 bg-slate-900 text-amber-100 shadow-sm" : "border-white/35 bg-slate-950/35 text-white hover:bg-white/15"}`}
      >
        <Moon className="size-4" aria-hidden="true" /> กิจกรรมกลางคืน
      </button>
    </div>
  );
}

function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<ActivityTabId>("day");
  const [category, setCategory] = useState<ActivityFilter>("ทั้งหมด");
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetails | null>(null);
  const favoritePlaceIds = useFavoritePlaceIds();
  const visibleActivities = useMemo(
    () =>
      category === "ทั้งหมด"
        ? islandActivities
        : islandActivities.filter((activity) => activity.category === category),
    [category],
  );
  const focusActivitySection = (tab: ActivityTabId) => {
    setActiveTab(tab);
    const section = document.getElementById(`activity-panel-${tab}`);
    section?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    section?.focus({ preventScroll: true });
  };

  return (
    <main>
      <section className="activities-hero relative overflow-hidden text-white">
        <img
          src={travelImages.coast}
          alt="ทะเลและสะพานริมชายฝั่งเกาะสีชัง"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="activities-hero-shade absolute inset-0" />
        <div className="container-site relative z-10 grid min-h-[440px] items-end gap-8 py-12 md:grid-cols-[1fr_280px] md:items-center md:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-2 text-white/75">
              <span className="h-px w-7 bg-white/70" /> ISLAND DAYS, YOUR WAY
            </p>
            <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">
              กิจกรรมบนเกาะสีชัง
              <br />
              เลือกจังหวะที่ใช่
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
              มองวิวให้เต็มตา ไหว้สถานที่สำคัญ ลงทะเล หรือใช้เวลาทำความรู้จักวิถีชุมชนและธรรมชาติ
            </p>
            <ActivityTabs activeTab={activeTab} onTabChange={focusActivitySection} />
          </div>
          <div className="rounded-lg border border-white/30 bg-slate-950/55 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Compass className="size-4" /> เที่ยวแบบรู้จังหวะเกาะ
            </div>
            <p className="mt-2 text-xs leading-6 text-white/90">
              เวลาออกเรือ จุดลงน้ำ และบริการต่าง ๆ เปลี่ยนได้ตามอากาศและผู้ให้บริการ
              โปรดสอบถามก่อนเดินทาง
            </p>
            <p className="mt-3 border-t border-white/25 pt-3 text-[11px] text-white/85">
              ข้อมูลที่ยังไม่ยืนยันระบุไว้ชัดเจน
            </p>
          </div>
        </div>
        <div className="container-site relative z-10 flex items-center gap-2 pb-5 text-xs text-white/90">
          <MapPin className="size-3.5" /> เกาะสีชัง · ชลบุรี
        </div>
      </section>

      <section className="container-site py-12 md:py-16" id="activity-list">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">FIND YOUR ISLAND MOMENT</p>
            <h2 className="section-title mt-2">เลือกหมวดกิจกรรม</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              เลือกหมวดกิจกรรม แล้วเปิดรายละเอียดเพื่อดูสถานที่ที่เชื่อมกับเส้นทาง
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/routes">
              <RouteIcon className="size-4" /> รายการโปรด ({favoritePlaceIds.length}) ·
              แผนการเดินทาง
            </Link>
          </Button>
        </div>
        <div
          id="activity-panel-day"
          tabIndex={-1}
          aria-labelledby="activity-tab-day"
          className="scroll-mt-20"
        >
          <div
            className="activity-filters mb-8 flex gap-2 overflow-x-auto pb-2"
            role="group"
            aria-label="กรองตามหมวดกิจกรรม"
          >
            {activityCategories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`activity-filter shrink-0 rounded-full border px-4 py-2 text-sm transition ${category === item ? "activity-filter-active" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onSelect={() => setSelectedActivity(detailsForActivity(activity))}
                favorite={hasActivityPlaceFavorite(
                  activity.id,
                  activity.placeIds,
                  favoritePlaceIds,
                )}
                favoriteLabel={
                  islandPlaces.find((place) => place.id === activity.placeIds[0])?.name ??
                  "สถานที่ในกิจกรรมนี้"
                }
                onFavorite={() => {
                  toggleActivityPlaceFavorites(activity.id, activity.placeIds);
                }}
              />
            ))}
          </div>
          {visibleActivities.length === 0 && (
            <p className="rounded-md bg-secondary p-6 text-center text-sm">ไม่พบกิจกรรมในหมวดนี้</p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            มี 9 กิจกรรมหลัก · การ์ด Workshop เป็นแนวคิด รอการยืนยันผู้จัดและสถานที่
          </p>
        </div>
      </section>

      <section
        id="activity-panel-series"
        tabIndex={-1}
        aria-labelledby="activity-tab-series"
        className="container-site scroll-mt-20 pt-10 pb-6 md:pt-14 md:pb-8"
      >
        <div className="mb-7 max-w-3xl">
          <p className="eyebrow text-muted-foreground">FILM & SERIES LOCATIONS</p>
          <h2 className="section-title mt-2">ตามรอยเรื่องโปรดบนเกาะสีชัง</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            ออกเดินทางตามรอยฉากประทับใจจากละครและซีรีส์ พร้อมค้นพบสถานที่จริงบนเกาะสีชังในมุมมองใหม่
            โดยแยกจุดถ่ายทำที่มีแหล่งข้อมูลออกจากจุดแนะนำเพิ่มเติมอย่างชัดเจน
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {seriesActivities.map((activity) => {
            const placeIds = activity.locations.flatMap((location) =>
              location.placeId ? [location.placeId] : [],
            );
            const placeId = placeIds[0];
            return (
              <SeriesCard
                key={activity.id}
                activity={activity}
                onSelect={() => setSelectedActivity(detailsForSeriesActivity(activity))}
                favorite={hasActivityPlaceFavorite(
                  `series:${activity.id}`,
                  placeIds,
                  favoritePlaceIds,
                )}
                favoriteLabel={
                  islandPlaces.find((place) => place.id === placeId)?.name ?? "สถานที่ในกิจกรรมนี้"
                }
                onFavorite={() => {
                  toggleActivityPlaceFavorites(`series:${activity.id}`, placeIds);
                }}
              />
            );
          })}
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          ภาพบนการ์ดเป็นภาพประกอบจากคลังเว็บไซต์ ไม่ใช่ภาพจากฉากถ่ายทำ ·
          ข้อมูลสถานที่ที่ยังไม่ยืนยันระบุไว้ในรายละเอียด
        </p>
      </section>

      <div
        id="activity-panel-night"
        tabIndex={-1}
        aria-labelledby="activity-tab-night"
        className="scroll-mt-20"
      >
        <div aria-hidden="true" className="activities-night-transition" />
        <section className="night-section text-white">
          <div className="container-site py-12 md:py-16">
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="eyebrow text-slate-700">AFTER THE SUN GOES DOWN</p>
                <h2 className="mt-3 text-3xl font-medium text-slate-900 sm:text-4xl">เสน่ห์สีชังยามค่ำคืน</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
                  อย่าเพิ่งรีบกลับ เมื่อพระอาทิตย์ลับขอบฟ้า ยังมีอีกมุมของเกาะที่รอให้คุณออกไปสัมผัส
                </p>
              </div>
              <Moon className="hidden size-12 text-amber-500 sm:block" strokeWidth={1.2} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nightActivities.map((activity) => {
                const favoritePlaceId = activity.placeIds[0];
                const favorite = hasActivityPlaceFavorite(
                  `night:${activity.id}`,
                  activity.placeIds,
                  favoritePlaceIds,
                );
                return (
                  <NightCard
                    key={activity.id}
                    activity={activity}
                    onSelect={() => setSelectedActivity(detailsForNightActivity(activity))}
                    favorite={favorite}
                    onFavorite={() => {
                      toggleActivityPlaceFavorites(`night:${activity.id}`, activity.placeIds);
                    }}
                    favoriteLabel={
                      islandPlaces.find((place) => place.id === favoritePlaceId)?.name ??
                      "สถานที่ในกิจกรรมนี้"
                    }
                  />
                );
              })}
            </div>
            <p className="mt-4 text-xs text-slate-300">
              ภาพยามค่ำใช้ภาพชายฝั่งที่มีอยู่ในเว็บไซต์และปรับโทนสี
              ยังไม่มีภาพถ่ายกิจกรรมกลางคืนจริงในคลังโครงการ
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
              <p className="max-w-xl text-xs leading-6 text-slate-200">
                กิจกรรมกลางคืนยังไม่มีผู้ให้บริการ วันเปิด หรือราคาได้รับการยืนยัน
                โดยเฉพาะการออกเรือตกหมึก โปรดตรวจสอบรอบเรือ สภาพอากาศ และเงื่อนไขก่อนนัดหมาย
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-amber-200 text-slate-950 hover:bg-amber-100">
                  <Link to="/routes">
                    <RouteIcon className="size-4" /> วางแผนการเดินทาง
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="container-site py-12 md:py-16">
        <div className="flex flex-col justify-between gap-6 rounded-lg bg-sea p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="eyebrow text-muted-foreground">MAKE A LITTLE PLAN</p>
            <h2 className="mt-2 text-xl font-medium">เลือกจุดที่สนใจ แล้วค่อยเพิ่มลงทริป</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              เลือกจุดที่สนใจ แล้วเพิ่มลงแผนการเดินทางได้ในแท็บเส้นทาง
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="h-11 bg-background">
              <Link to="/routes">
                ดูเส้นทาง <ArrowRight />
              </Link>
            </Button>
            <Button asChild className="h-11">
              <Link to="/booking">
                ไปวางแผนทริป <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          เว็บไซต์ต้นแบบ · ไม่มีการจองหรือชำระเงินจริง
        </p>
      </section>
      <ActivityDetailsModal
        activity={selectedActivity}
        onOpenChange={(open) => {
          if (!open) setSelectedActivity(null);
        }}
      />
    </main>
  );
}

export function SeriesCard({
  activity,
  onSelect,
  favorite,
  favoriteLabel = "สถานที่ที่เกี่ยวข้อง",
  onFavorite,
}: {
  activity: SeriesActivity;
  onSelect: () => void;
  favorite: boolean;
  favoriteLabel?: string;
  onFavorite: () => void;
}) {
  return (
    <article className="activity-card relative flex h-full flex-col">
      <button
        type="button"
        onClick={onSelect}
        aria-label={`เปิดรายละเอียดตามรอยซีรีส์ ${activity.title}`}
        className="activity-card-trigger flex w-full flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <span className="relative block w-full">
          <span className="activity-photo-wrap">
            <ActivityImage
              className="activity-photo"
              src={activity.image}
              alt={activity.imageAlt}
              loading="lazy"
            />
            <span className="activity-category">{activity.genre}</span>
            <span className="activity-photo-disclaimer">ภาพประกอบ ไม่ใช่ภาพจากฉากจริง</span>
          </span>
        </span>
        <span className="flex flex-1 flex-col p-5">
          <span className="block text-lg font-medium leading-snug text-foreground">
            {activity.title}
          </span>
          <span className="mt-2 block text-sm leading-6 text-foreground/75">
            {activity.description}
          </span>
          <span className="mt-3 block text-xs font-medium text-foreground">เหมาะสำหรับ...</span>
          <ul className="mt-1.5 space-y-1.5 text-xs leading-5 text-foreground/75">
            <li className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>คนที่อยากตามรอยสถานที่ซึ่งเชื่อมโยงกับเรื่องนี้</span>
            </li>
          </ul>
        </span>
      </button>
      {activity.locations.some((location) => location.placeId) && (
        <button
          type="button"
          className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={
            favorite
              ? `นำสถานที่โปรดในกิจกรรม${activity.title}ออก`
              : `บันทึก${favoriteLabel}จากกิจกรรม${activity.title}เป็นสถานที่โปรด`
          }
          aria-pressed={favorite}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
        >
          <Star className={`size-5 ${favorite ? "fill-amber-400 text-amber-500" : ""}`} />
        </button>
      )}
    </article>
  );
}

export function ActivityCard({
  activity,
  onSelect,
  favorite,
  favoriteLabel = "สถานที่ที่เกี่ยวข้อง",
  onFavorite,
}: {
  activity: IslandActivity;
  onSelect: () => void;
  favorite: boolean;
  favoriteLabel?: string;
  onFavorite: () => void;
}) {
  return (
    <article className="activity-card relative flex h-full flex-col">
      <button
        type="button"
        onClick={onSelect}
        aria-label={`เปิดรายละเอียดกิจกรรม ${activity.title}`}
        className="activity-card-trigger flex w-full flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <span className="relative block w-full">
          <span className="activity-photo-wrap">
            <ActivityImage
              className="activity-photo"
              src={activity.image}
              alt={activity.imageAlt}
              loading="lazy"
            />
            <span className="activity-category">{activity.category}</span>
            <span className="activity-photo-disclaimer">ภาพประกอบจากภาพถ่ายในเว็บไซต์</span>
          </span>
        </span>
        <span className="flex flex-1 flex-col p-5">
          <span className="block text-lg font-medium leading-snug text-foreground">
            {activity.title}
          </span>
          <span className="mt-1 block text-sm leading-6 text-foreground/75">
            {activity.description}
          </span>
          <span className="mt-3 block text-xs font-medium text-foreground">เหมาะสำหรับ...</span>
          <ul className="mt-1.5 space-y-1.5 text-xs leading-5 text-foreground/75">
            {activity.audience.map((item) => (
              <li className="flex gap-2" key={item}>
                <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </span>
      </button>
      <button
        type="button"
        className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={
          favorite
            ? `นำสถานที่โปรดในกิจกรรม${activity.title}ออก`
            : `บันทึก${favoriteLabel}จากกิจกรรม${activity.title}เป็นสถานที่โปรด`
        }
        aria-pressed={favorite}
        onClick={(event) => {
          event.stopPropagation();
          onFavorite();
        }}
      >
        <Star className={`size-5 ${favorite ? "fill-amber-400 text-amber-500" : ""}`} />
      </button>
    </article>
  );
}

type ActivityDetailDialogProps = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: TravelImage;
  imageAlt: string;
  timing: string;
  cost: string;
  preparation: string;
  highlight?: string;
  placeIds: readonly IslandPlaceId[];
  placeRelationNote?: string;
  workshop?: { provider?: string };
  confirmedFilmingScope?: string;
  seriesLocations?: readonly SeriesLocation[];
  sources?: { label: string; url: string }[];
};

function ActivityDetailDialog({
  id,
  category,
  title,
  description,
  image,
  imageAlt,
  timing,
  cost,
  preparation,
  highlight,
  placeIds,
  placeRelationNote,
  workshop,
  confirmedFilmingScope,
  seriesLocations,
  sources,
}: ActivityDetailDialogProps) {
  const favoritePlaceIds = useFavoritePlaceIds();
  return (
    <DialogContent className="max-h-[92dvh] max-w-3xl gap-0 overflow-x-hidden overflow-y-auto p-0 sm:max-h-[88dvh]">
      <ActivityImage src={image} alt={imageAlt} className="aspect-[16/8] w-full object-cover" />
      <div className="p-5 sm:p-8">
        <DialogHeader>
          <p className="eyebrow text-muted-foreground">{category}</p>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="!mt-3 text-sm leading-7">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-5 grid grid-cols-1 gap-3 text-sm leading-6 sm:grid-cols-3">
          <section className="min-w-0 rounded-md border border-border bg-secondary/45 px-3 py-3 sm:px-4">
            <h3 className="font-semibold text-foreground">ช่วงเวลาที่เหมาะสม</h3>
            <p className="mt-1 text-foreground/80">{timing}</p>
          </section>
          <section className="min-w-0 rounded-md border border-border bg-secondary/45 px-3 py-3 sm:px-4">
            <h3 className="font-semibold text-foreground">ค่าใช้จ่าย</h3>
            <p className="mt-1 text-foreground/80">{cost}</p>
          </section>
          <section className="min-w-0 rounded-md border border-border bg-secondary/45 px-3 py-3 sm:px-4">
            <h3 className="font-semibold text-foreground">การเตรียมตัวและข้อควรระวัง</h3>
            <p className="mt-1 text-foreground/80">{preparation}</p>
          </section>
        </div>
        {workshop && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <strong>Workshop ลงมือทำ:</strong> {workshop.provider} · รายละเอียดรอบ ราคา วัสดุ
            ชิ้นงาน จำนวนผู้เข้าร่วม และสถานที่จัดย่อยควรยืนยันกับผู้จัด
          </div>
        )}
        {sources?.map((source) => (
          <p key={source.url} className="mt-4 text-xs text-muted-foreground">
            แหล่งข้อมูล:{" "}
            <a
              className="underline underline-offset-2"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.label}
            </a>
          </p>
        ))}
        <div className="mt-7" key={id}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="font-medium">สถานที่ที่เกี่ยวข้อง</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                ใช้อ้างอิงข้อมูลสถานที่ชุดเดียวกับแท็บเส้นทาง
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {seriesLocations?.length ?? placeIds.length} แห่ง
            </span>
          </div>
          {placeRelationNote && (
            <p className="mt-3 rounded bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">
              หมายเหตุ: {placeRelationNote}
            </p>
          )}
          {confirmedFilmingScope && (
            <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              สถานะการถ่ายทำ: {confirmedFilmingScope}
            </p>
          )}
          {seriesLocations ? (
            <SeriesLocationsCarousel activityId={id} locations={seriesLocations} />
          ) : (
            <RelatedPlacesCarousel activityId={id} placeIds={placeIds} />
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export function RelatedPlacesCarousel({
  activityId = "",
  placeIds,
}: {
  activityId?: string;
  placeIds: readonly IslandPlaceId[];
}) {
  const favoritePlaceIds = useFavoritePlaceIds();
  const [orderedPlaceIds] = useState(() =>
    [...placeIds].sort(
      (a, b) =>
        Number(favoritePlaceIds.includes(activityPlaceFavoriteKey(activityId, b))) -
        Number(favoritePlaceIds.includes(activityPlaceFavoriteKey(activityId, a))),
    ),
  );
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  if (orderedPlaceIds.length === 0) {
    return (
      <p className="mt-3 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        ยังไม่มีสถานที่ที่ยืนยันและเชื่อมด้วย place ID สำหรับกิจกรรมนี้
      </p>
    );
  }
  const placeId = orderedPlaceIds[index];
  if (!placeId) {
    return (
      <p className="mt-3 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        ยังไม่มีสถานที่ที่ยืนยันและเชื่อมด้วย place ID สำหรับกิจกรรมนี้
      </p>
    );
  }

  function moveTo(nextIndex: number) {
    setIndex(Math.max(0, Math.min(orderedPlaceIds.length - 1, nextIndex)));
  }

  return (
    <div
      className="mt-3 min-w-0"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (startX === null || endX === undefined) return;
        const delta = endX - startX;
        if (Math.abs(delta) < 45) return;
        moveTo(index + (delta < 0 ? 1 : -1));
      }}
    >
      <PlaceDetails
        key={placeId}
        activityId={activityId}
        id={placeId}
        index={index}
        total={orderedPlaceIds.length}
        onPrevious={() => moveTo(index - 1)}
        onNext={() => moveTo(index + 1)}
      />
    </div>
  );
}

function SeriesLocationsCarousel({
  activityId,
  locations,
}: {
  activityId: string;
  locations: readonly SeriesLocation[];
}) {
  const favorites = useFavoritePlaceIds();
  const [orderedLocations] = useState(() =>
    [...locations].sort(
      (a, b) =>
        Number(
          Boolean(b.placeId && favorites.includes(activityPlaceFavoriteKey(activityId, b.placeId))),
        ) -
        Number(
          Boolean(a.placeId && favorites.includes(activityPlaceFavoriteKey(activityId, a.placeId))),
        ),
    ),
  );
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const location = orderedLocations[index];
  if (!location) {
    return <p className="mt-3 text-sm text-muted-foreground">ยังไม่มีสถานที่ที่เกี่ยวข้อง</p>;
  }

  const previous = () => setIndex((current) => Math.max(0, current - 1));
  const next = () => setIndex((current) => Math.min(orderedLocations.length - 1, current + 1));
  const place = location.placeId
    ? islandPlaces.find((item) => item.id === location.placeId)
    : undefined;

  return (
    <div
      className="mt-3 min-w-0"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start === null || end === undefined || Math.abs(end - start) < 45) return;
        if (end < start) next();
        else previous();
      }}
    >
      {place ? (
        <PlaceDetails
          key={location.id}
          activityId={activityId}
          id={place.id}
          index={index}
          total={orderedLocations.length}
          onPrevious={previous}
          onNext={next}
        />
      ) : (
        <article className="flex min-w-0 flex-col gap-3 rounded-md border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-medium text-foreground">{location.name ?? "สถานที่รอยืนยัน"}</h4>
            <SeriesLocationControls
              index={index}
              total={orderedLocations.length}
              onPrevious={previous}
              onNext={next}
            />
          </div>
          <div className="mx-auto flex h-[230px] w-full max-w-[600px] flex-col items-center justify-center gap-2 rounded bg-secondary/70 text-sm text-muted-foreground sm:h-[300px]">
            <MapPin className="size-5" aria-hidden="true" />
            ยังไม่มีภาพถ่ายที่ยืนยันสำหรับสถานที่นี้
          </div>
          <p className="text-sm leading-6 text-foreground/80">
            <strong>ไฮไลท์:</strong> {location.description ?? "ยังไม่มีข้อมูลยืนยัน"}
          </p>
          <p className="text-xs text-amber-800">
            ชื่อหรือตำแหน่งสถานที่ยังไม่มีข้อมูลยืนยันในแผนที่
          </p>
        </article>
      )}
    </div>
  );
}

function SeriesLocationControls({
  index,
  total,
  onPrevious,
  onNext,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (total <= 1) return null;
  return (
    <div
      className="flex shrink-0 items-center gap-1"
      aria-label={`สถานที่ ${index + 1} จาก ${total}`}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={index === 0}
        aria-label="ดูสถานที่ก่อนหน้า"
        className="grid size-10 place-items-center rounded-md border border-border text-2xl text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35"
      >
        ‹
      </button>
      <span className="min-w-12 text-center text-xs text-muted-foreground" aria-live="polite">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="ดูสถานที่ถัดไป"
        className="grid size-10 place-items-center rounded-md border border-border text-2xl text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35"
      >
        ›
      </button>
    </div>
  );
}

function PlaceDetails({
  activityId,
  id,
  index,
  total,
  onPrevious,
  onNext,
}: {
  activityId: string;
  id: IslandPlaceId;
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const favoritePlaceIds = useFavoritePlaceIds();
  const place = islandPlaces.find((item) => item.id === id);
  if (!place) {
    return <p className="text-sm text-muted-foreground">ไม่พบข้อมูลสถานที่นี้</p>;
  }
  const mapQuery = `${place.name} เกาะสีชัง`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const favoriteKey = activityPlaceFavoriteKey(activityId, place.id);
  const isFavorite = favoritePlaceIds.includes(favoriteKey);
  return (
    <article className="flex w-full min-w-0 flex-col gap-3 overflow-hidden rounded-md border border-border bg-card p-3 sm:p-4">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="break-words font-medium text-foreground">{place.name}</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={
                isFavorite
                  ? `นำ${place.name}ออกจากรายการโปรดในกิจกรรมนี้`
                  : `บันทึก${place.name}เป็นรายการโปรดในกิจกรรมนี้`
              }
              aria-pressed={isFavorite}
              onClick={() => setActivityPlaceFavorite(favoriteKey, !isFavorite)}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star className={`size-5 ${isFavorite ? "fill-amber-400 text-amber-500" : ""}`} />
            </button>
            {total > 1 && (
              <div
                className="flex shrink-0 items-center gap-1"
                aria-label={`สถานที่ ${index + 1} จาก ${total}`}
              >
                <button
                  type="button"
                  onClick={onPrevious}
                  disabled={index === 0}
                  aria-label="ดูสถานที่ก่อนหน้า"
                  className="grid size-10 place-items-center rounded-md border border-border text-2xl leading-none text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ‹
                </button>
                <span
                  className="min-w-12 text-center text-xs text-muted-foreground"
                  aria-live="polite"
                >
                  {index + 1} / {total}
                </span>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={index === total - 1}
                  aria-label="ดูสถานที่ถัดไป"
                  className="grid size-10 place-items-center rounded-md border border-border text-2xl leading-none text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {place.image ? (
        <ActivityImage
          src={place.image}
          alt={place.imageAlt ?? place.name}
          className="mx-auto h-[230px] w-full max-w-[600px] rounded object-cover sm:h-[300px]"
          loading="lazy"
        />
      ) : (
        <div className="mx-auto flex h-[180px] w-full max-w-[600px] flex-col items-center justify-center gap-2 rounded bg-secondary/70 text-sm text-muted-foreground sm:h-[220px]">
          <MapPin className="size-5" aria-hidden="true" />
          ยังไม่มีภาพถ่ายของสถานที่นี้ที่ยืนยันแล้ว
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm leading-6 text-foreground/80">
          <strong>ไฮไลท์:</strong> {place.highlight ?? place.description}
        </p>
        <div className="mt-4 flex flex-col items-stretch gap-2 sm:items-start">
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ค้นหาชื่อใน Google Maps <ExternalLink className="size-4" />
          </a>
          <a
            href={`/routes?focus=${encodeURIComponent(place.id)}`}
            className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ดูสถานที่ในแผนที่เส้นทาง <MapPin className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function NightCard({
  activity,
  onSelect,
  favorite,
  favoriteLabel = "สถานที่ที่เกี่ยวข้อง",
  onFavorite,
}: {
  activity: (typeof nightActivities)[number];
  onSelect: () => void;
  favorite: boolean;
  favoriteLabel?: string;
  onFavorite: () => void;
}) {
  return (
    <article className="activity-card relative flex h-full flex-col">
      <button
        type="button"
        onClick={onSelect}
        aria-label={`เปิดรายละเอียดกิจกรรม ${activity.title}`}
        className="activity-card-trigger flex w-full flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <span className="relative block w-full">
          <span className="activity-photo-wrap">
            <ActivityImage
              src={activity.image}
              alt={activity.imageAlt}
              className="activity-photo"
              loading="lazy"
            />
            <span className="activity-category">กิจกรรมกลางคืน</span>
            <span className="activity-photo-disclaimer">ภาพประกอบ</span>
          </span>
        </span>
        <span className="flex flex-1 flex-col p-5">
          <span className="block text-lg font-medium leading-snug text-foreground">{activity.title}</span>
          <span className="mt-1 block text-sm leading-6 text-foreground/75">
            {activity.description}
          </span>
          <span className="mt-3 block text-xs font-medium text-foreground">เหมาะสำหรับ...</span>
          <ul className="mt-1.5 space-y-1.5 text-xs leading-5 text-foreground/75">
            <li className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>{
                activity.id === "night-squid"
                  ? "คนที่สนใจกิจกรรมตกหมึกยามค่ำคืน"
                  : activity.id === "night-coast"
                    ? "คนที่อยากชมบรรยากาศริมทะเลยามค่ำคืน"
                    : "คนที่อยากรับประทานอาหารทะเลริมทะเลช่วงค่ำ"
              }</span>
            </li>
          </ul>
          <span className="mt-auto pt-3 text-xs leading-5 text-muted-foreground">
            {activity.service} · {activity.cost}
          </span>
        </span>
      </button>
      {activity.placeIds.length > 0 && (
        <button
          type="button"
          className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={
            favorite
              ? `นำสถานที่โปรดในกิจกรรม${activity.title}ออก`
              : `บันทึก${favoriteLabel}จากกิจกรรม${activity.title}เป็นสถานที่โปรด`
          }
          aria-pressed={favorite}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
        >
          <Star className={`size-5 ${favorite ? "fill-amber-400 text-amber-500" : ""}`} />
        </button>
      )}
    </article>
  );
}

export function ActivityDetailsModal({
  activity,
  onOpenChange,
}: {
  activity: ActivityDetails | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={activity !== null} onOpenChange={onOpenChange}>
      {activity && <ActivityDetailDialog {...activity} />}
    </Dialog>
  );
}
