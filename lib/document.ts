/**
 * Client-side document preparation: everything sent to the API is normalized
 * to a PNG/JPEG data URL first (images pass through, PDFs are rasterized,
 * sample HTML is painted with html2canvas).
 */

export const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

const MAX_DIMENSION = 1600;

export type PreparedDoc = {
  fileName: string;
  /** data URL fed to the vision model */
  imageDataUrl: string;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

/** Downscale large images so payloads stay small and the model stays fast. */
async function normalizeImage(dataUrl: string): Promise<string> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not decode image."));
    img.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  if (scale === 1 && dataUrl.startsWith("data:image/png")) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.92);
}

/** Rasterize the first page of a PDF to a PNG data URL. */
async function pdfToImage(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Served from public/ (copied by scripts/copy-pdf-worker.mjs on install);
  // letting webpack bundle the ESM worker breaks the production build.
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(2, MAX_DIMENSION / Math.max(viewport.width, viewport.height));
  const scaled = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(scaled.width);
  canvas.height = Math.round(scaled.height);
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport: scaled }).promise;
  return canvas.toDataURL("image/png");
}

export async function prepareFile(file: File): Promise<PreparedDoc> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Upload a PNG, JPEG, WebP, or PDF.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File too large (max 10 MB).");
  }

  const imageDataUrl =
    file.type === "application/pdf"
      ? await pdfToImage(file)
      : await normalizeImage(await fileToDataUrl(file));

  return { fileName: file.name, imageDataUrl };
}

/** Paint a sample invoice's HTML into an offscreen node and rasterize it. */
export async function rasterizeHtml(html: string): Promise<string> {
  const { default: html2canvas } = await import("html2canvas");

  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;width:640px;background:#ffffff;";
  host.innerHTML = html;
  document.body.appendChild(host);
  try {
    const canvas = await html2canvas(host, { scale: 2, backgroundColor: "#ffffff" });
    return canvas.toDataURL("image/png");
  } finally {
    host.remove();
  }
}
