/** Clipboard seam for tests (navigator.clipboard). */

export type CopyResult = { ok: true } | { ok: false; message: string };

export async function copyText(
  text: string,
  clipboard: Pick<Clipboard, "writeText"> = navigator.clipboard,
): Promise<CopyResult> {
  try {
    await clipboard.writeText(text);
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not copy to clipboard." };
  }
}
