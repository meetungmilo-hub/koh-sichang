import { useSyncExternalStore } from "react";

const PLACE_KEY = "sichang.activityFavoritePlaceIds.v1";
const ACTIVITY_KEY = "sichang.activityFavoriteIds.v1";
const CHANGE_EVENT = "sichang:activity-favorites-change";
const EMPTY_IDS: string[] = [];
let placeSnapshot: string[] | undefined;
let activitySnapshot: string[] | undefined;

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
      : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  const onStorage = () => {
    placeSnapshot = undefined;
    activitySnapshot = undefined;
    callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function save(key: string, id: string, favorite: boolean) {
  const ids = read(key).filter((item) => item !== id);
  if (favorite) ids.push(id);
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Keep the current session responsive if browser storage is unavailable.
  }
  if (key === PLACE_KEY) placeSnapshot = ids;
  else activitySnapshot = ids;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getPlaceSnapshot() {
  return (placeSnapshot ??= read(PLACE_KEY));
}

function getActivitySnapshot() {
  return (activitySnapshot ??= read(ACTIVITY_KEY));
}

export function useFavoritePlaceIds() {
  return useSyncExternalStore(subscribe, getPlaceSnapshot, () => EMPTY_IDS);
}

export function useFavoriteActivityIds() {
  return useSyncExternalStore(subscribe, getActivitySnapshot, () => EMPTY_IDS);
}

export function setActivityPlaceFavorite(id: string, favorite: boolean) {
  save(PLACE_KEY, id, favorite);
}

/** Keep a favorite isolated to one activity and its related place. */
export function activityPlaceFavoriteKey(activityId: string, placeId: string) {
  return `${activityId}::${placeId}`;
}

export function hasActivityPlaceFavorite(
  activityId: string,
  placeIds: readonly string[],
  favoriteIds: readonly string[],
) {
  return placeIds.some((placeId) =>
    favoriteIds.includes(activityPlaceFavoriteKey(activityId, placeId)),
  );
}

/** The card star summarizes its related places; saving chooses the first place, clearing removes this activity's saved places. */
export function toggleActivityPlaceFavorites(activityId: string, placeIds: readonly string[]) {
  const keys = placeIds.map((placeId) => activityPlaceFavoriteKey(activityId, placeId));
  if (!keys.length) return;
  const current = read(PLACE_KEY);
  const hasFavorite = keys.some((key) => current.includes(key));
  const next = current.filter((id) => !keys.includes(id));
  if (!hasFavorite) next.push(keys[0]!);
  try {
    window.localStorage.setItem(PLACE_KEY, JSON.stringify(next));
  } catch {
    // Keep the current session responsive if browser storage is unavailable.
  }
  placeSnapshot = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleActivityFavorite(id: string) {
  save(ACTIVITY_KEY, id, !read(ACTIVITY_KEY).includes(id));
}
