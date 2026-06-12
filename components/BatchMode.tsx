"use client";

import { useState } from "react";
import type { Extraction } from "@/lib/schema";
import { prepareFile } from "@/lib/document";
import { extractDocument } from "@/lib/api";
import { Dropzone } from "./Dropzone";
import { ExportButtons } from "./ExportButtons";

const MAX_FILES = 5;

type BatchItem = {
  fileName: string;
  status: "queued" | "processing" | "done" | "error";
  data?: Extraction;
  error?: string;
};

export function BatchMode() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const patch = (index: number, patchValue: Partial<BatchItem>) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patchValue } : item))
    );

  const run = async (files: File[]) => {
    setNotice(
      files.length > MAX_FILES
        ? `Only the first ${MAX_FILES} files were taken (batch limit).`
        : null
    );
    const batch = files.slice(0, MAX_FILES);
    setItems(batch.map((f) => ({ fileName: f.name, status: "queued" })));
    setRunning(true);

    // Sequential on purpose: keeps the demo inside per-IP rate limits and
    // makes the progress bar honest.
    for (let i = 0; i < batch.length; i++) {
      patch(i, { status: "processing" });
      try {
        const prepared = await prepareFile(batch[i]);
        const data = await extractDocument(prepared.imageDataUrl);
        patch(i, { status: "done", data });
      } catch (err) {
        patch(i, {
          status: "error",
          error: err instanceof Error ? err.message : "Failed",
        });
      }
    }
    setRunning(false);
  };

  const finished = items.filter((i) => i.status === "done" || i.status === "error").length;
  const succeeded = items
    .filter((i): i is BatchItem & { data: Extraction } => i.status === "done" && !!i.data)
    .map((i) => ({ fileName: i.fileName, data: i.data }));

  return (
    <div className="space-y-4">
      <Dropzone
        multiple
        disabled={running}
        onFiles={run}
        hint={`Up to ${MAX_FILES} files — PNG, JPEG, WebP, or PDF, 10 MB each`}
      />

      {notice && <p className="text-xs text-amber-600">{notice}</p>}

      {items.length > 0 && (
        <>
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
              <span>
                {running
                  ? `Processing ${Math.min(finished + 1, items.length)} of ${items.length}…`
                  : `Processed ${finished} of ${items.length}`}
              </span>
              <span>{Math.round((finished / items.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${(finished / items.length) * 100}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
                <StatusIcon status={item.status} />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-700">
                  {item.fileName}
                </span>
                {item.status === "done" && item.data && (
                  <span className="shrink-0 text-xs text-slate-500">
                    {item.data.vendorName.value || "Unknown vendor"} ·{" "}
                    <span className="font-semibold text-slate-700">
                      {item.data.currency} {item.data.grandTotal.value.toFixed(2)}
                    </span>
                  </span>
                )}
                {item.status === "error" && (
                  <span className="shrink-0 text-xs text-rose-500">{item.error}</span>
                )}
              </li>
            ))}
          </ul>

          {!running && succeeded.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="text-sm font-medium text-emerald-800">
                {succeeded.length} document{succeeded.length > 1 ? "s" : ""} extracted
              </span>
              <ExportButtons entries={succeeded} csvName="invoicelens-batch.csv" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: BatchItem["status"] }) {
  if (status === "processing")
    return (
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
    );
  if (status === "done")
    return (
      <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  if (status === "error")
    return (
      <svg className="h-4 w-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  return <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-200" />;
}
