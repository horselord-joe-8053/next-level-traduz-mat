import { describe, expect, it, beforeEach } from "vitest";

import {
  clearHistory,
  HISTORY_MAX_ENTRIES,
  HISTORY_STORAGE_KEY,
  loadHistory,
  recordSuccessfulTranslation,
  saveHistory,
  type HistoryEntry,
} from "./translationHistory";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe("translationHistory", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("returns empty when nothing stored", () => {
    expect(loadHistory(storage)).toEqual([]);
  });

  it("records successful translation newest first", () => {
    const first = recordSuccessfulTranslation(storage, [], "a", "A");
    const second = recordSuccessfulTranslation(storage, first, "b", "B");
    expect(second).toEqual([
      { source: "b", translation: "B" },
      { source: "a", translation: "A" },
    ]);
    expect(loadHistory(storage)).toEqual(second);
  });

  it("caps at HISTORY_MAX_ENTRIES and drops oldest", () => {
    let entries: HistoryEntry[] = [];
    for (let i = 0; i < HISTORY_MAX_ENTRIES + 1; i += 1) {
      entries = recordSuccessfulTranslation(
        storage,
        entries,
        `s${i}`,
        `t${i}`,
      );
    }
    expect(entries).toHaveLength(HISTORY_MAX_ENTRIES);
    expect(entries[0]).toEqual({
      source: `s${HISTORY_MAX_ENTRIES}`,
      translation: `t${HISTORY_MAX_ENTRIES}`,
    });
    expect(entries[HISTORY_MAX_ENTRIES - 1]?.source).toBe("s1");
  });

  it("clearHistory removes storage key", () => {
    saveHistory(storage, [{ source: "x", translation: "X" }]);
    clearHistory(storage);
    expect(storage.getItem(HISTORY_STORAGE_KEY)).toBeNull();
    expect(loadHistory(storage)).toEqual([]);
  });
});
