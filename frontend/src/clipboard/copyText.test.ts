import { describe, expect, it, vi } from "vitest";

import { copyText } from "./copyText";

describe("copyText", () => {
  it("writes text via clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const result = await copyText("Hello", { writeText });
    expect(result).toEqual({ ok: true });
    expect(writeText).toHaveBeenCalledWith("Hello");
  });

  it("returns error when clipboard write fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    const result = await copyText("Hello", { writeText });
    expect(result.ok).toBe(false);
  });
});
