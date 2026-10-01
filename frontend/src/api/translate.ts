/** Client for Traduz Mat translate API. */

export type TranslateResult =
  | { ok: true; translation: string }
  | { ok: false; message: string };

const API_BASE =
  typeof import.meta.env.VITE_API_BASE_URL === "string" &&
  import.meta.env.VITE_API_BASE_URL.length > 0
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "http://127.0.0.1:8900";

export async function translateText(source: string): Promise<TranslateResult> {
  try {
    const response = await fetch(`${API_BASE}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: source }),
    });

    if (!response.ok) {
      let message = "Translation failed.";
      try {
        const body = (await response.json()) as { detail?: string | { msg?: string }[] };
        if (typeof body.detail === "string") {
          message = body.detail;
        } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
          message = body.detail[0].msg;
        }
      } catch {
        /* keep default */
      }
      return { ok: false, message };
    }

    const data = (await response.json()) as { translation: string };
    return { ok: true, translation: data.translation };
  } catch {
    return { ok: false, message: "Could not reach the translation service." };
  }
}
