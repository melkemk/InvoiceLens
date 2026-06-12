import { NextRequest, NextResponse } from "next/server";
import { extractionSchema, type ExtractResponse } from "@/lib/schema";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

// Any OpenAI-compatible chat-completions provider works; defaults target
// Groq's free tier with their Llama 4 Scout vision model.
const BASE_URL = process.env.AI_BASE_URL ?? "https://api.groq.com/openai/v1";
const MODEL = process.env.AI_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // ~8 MB of base64 payload

const SYSTEM_PROMPT = `You are an expert invoice and receipt data extractor.
You will be shown an image of a document. Extract its data and respond with ONLY a JSON object — no markdown, no commentary — in exactly this shape:

{
  "vendorName":    { "value": string, "confidence": number },
  "invoiceDate":   { "value": string, "confidence": number },
  "invoiceNumber": { "value": string, "confidence": number },
  "currency":      string,
  "lineItems": [
    { "description": string, "quantity": number, "unitPrice": number, "total": number, "confidence": number }
  ],
  "subtotal":   { "value": number, "confidence": number },
  "tax":        { "value": number, "confidence": number },
  "grandTotal": { "value": number, "confidence": number }
}

Rules:
- "confidence" is your honest 0–1 estimate that the field was read correctly. Use lower values for blurry, ambiguous, or inferred fields.
- Dates: normalize to YYYY-MM-DD when possible; otherwise transcribe as printed.
- currency: 3-letter ISO code inferred from symbols or text (e.g. "$" → "USD"); default "USD".
- If a field is missing from the document, use "" for strings and 0 for numbers, with confidence 0.
- Numbers must be plain JSON numbers (no currency symbols or thousands separators).`;

async function callModel(
  apiKey: string,
  imageDataUrl: string,
  repairHint?: string
): Promise<string> {
  const userContent: object[] = [
    {
      type: "text",
      text: repairHint
        ? `Your previous JSON failed validation:\n${repairHint}\nRe-extract the document and return corrected JSON in the required shape.`
        : "Extract the data from this document.",
    },
    { type: "image_url", image_url: { url: imageDataUrl } },
  ];

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("The AI provider rejected the API key. Check GROQ_API_KEY.");
    if (res.status === 429) throw new Error("AI provider rate limit hit. Try again in a moment.");
    throw new Error(`AI provider error ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Empty response from model.");
  return content;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ExtractResponse>(
      { ok: false, error: "Server is missing GROQ_API_KEY. See README setup." },
      { status: 500 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json<ExtractResponse>(
      { ok: false, error: `Rate limit reached. Try again in ${limit.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let imageDataUrl: string;
  try {
    const body = await req.json();
    imageDataUrl = body?.image;
    if (
      typeof imageDataUrl !== "string" ||
      !/^data:image\/(png|jpeg|webp|gif);base64,/.test(imageDataUrl)
    ) {
      throw new Error("bad payload");
    }
    if (imageDataUrl.length > MAX_IMAGE_BYTES) {
      return NextResponse.json<ExtractResponse>(
        { ok: false, error: "Image too large (max ~6 MB). Try a smaller file." },
        { status: 413 }
      );
    }
  } catch {
    return NextResponse.json<ExtractResponse>(
      { ok: false, error: "Expected JSON body: { image: <base64 data URL> }." },
      { status: 400 }
    );
  }

  try {
    // First attempt, plus one retry that feeds the validation errors back to the model.
    let repairHint: string | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      const raw = await callModel(apiKey, imageDataUrl, repairHint);

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        repairHint = "Response was not valid JSON.";
        continue;
      }

      const result = extractionSchema.safeParse(parsed);
      if (result.success) {
        return NextResponse.json<ExtractResponse>({ ok: true, data: result.data });
      }
      repairHint = result.error.issues
        .slice(0, 8)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n");
    }

    return NextResponse.json<ExtractResponse>(
      { ok: false, error: "The model returned malformed data twice. Try a clearer image." },
      { status: 422 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed.";
    return NextResponse.json<ExtractResponse>({ ok: false, error: message }, { status: 502 });
  }
}
