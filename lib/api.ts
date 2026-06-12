import type { Extraction, ExtractResponse } from "./schema";

/** POST an image data URL to the extraction endpoint; throws on any failure. */
export async function extractDocument(imageDataUrl: string): Promise<Extraction> {
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageDataUrl }),
  });

  let payload: ExtractResponse;
  try {
    payload = await res.json();
  } catch {
    throw new Error(`Server error (${res.status}). Please try again.`);
  }

  if (!payload.ok) throw new Error(payload.error);
  return payload.data;
}
