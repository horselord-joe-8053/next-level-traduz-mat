/** Browser-local translation history (localStorage seam for tests). */

export const HISTORY_STORAGE_KEY = "traduz.translationHistory.v1";
export const HISTORY_MAX_ENTRIES = 20;

export type HistoryEntry = {
  source: string;
  translation: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadHistory(storage: StorageLike): HistoryEntry[] {
  const raw = storage.getItem(HISTORY_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is HistoryEntry =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as HistoryEntry).source === "string" &&
        typeof (item as HistoryEntry).translation === "string",
    );
  } catch {
    return [];
  }
}

export function saveHistory(storage: StorageLike, entries: HistoryEntry[]): void {
  storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
}

export function recordSuccessfulTranslation(
  storage: StorageLike,
  current: HistoryEntry[],
  source: string,
  translation: string,
): HistoryEntry[] {
  const next: HistoryEntry[] = [{ source, translation }, ...current];
  if (next.length > HISTORY_MAX_ENTRIES) {
    next.length = HISTORY_MAX_ENTRIES;
  }
  saveHistory(storage, next);
  return next;
}

export function clearHistory(storage: StorageLike): void {
  storage.removeItem(HISTORY_STORAGE_KEY);
}
