"use client";

import { useState } from "react";
import type { Extraction } from "@/lib/schema";
import { SAMPLES, type Sample } from "@/lib/samples";
import { prepareFile, rasterizeHtml } from "@/lib/document";
import { extractDocument } from "@/lib/api";
import { Dropzone } from "./Dropzone";
import { Preview, type PreviewSource } from "./Preview";
import { ResultsTable } from "./ResultsTable";
import { ExportButtons } from "./ExportButtons";
import { BatchMode } from "./BatchMode";

type Status = "idle" | "working" | "done" | "error";

export function Demo() {
  const [tab, setTab] = useState<"single" | "batch">("single");
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState("");
  const [preview, setPreview] = useState<PreviewSource>(null);
  const [fileName, setFileName] = useState("document");
  const [data, setData] = useState<Extraction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const begin = () => {
    setStatus("working");
    setError(null);
    setData(null);
  };
  const fail = (err: unknown) => {
    setError(err instanceof Error ? err.message : "Something went wrong.");
    setStatus("error");
  };

  const onUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    begin();
    setStage("Reading document…");
    try {
      const prepared = await prepareFile(file);
      setFileName(prepared.fileName);
      setPreview({ kind: "image", src: prepared.imageDataUrl, name: prepared.fileName });
      setStage("Extracting with AI…");
      setData(await extractDocument(prepared.imageDataUrl));
      setStatus("done");
    } catch (err) {
      fail(err);
    }
  };

  const onSample = async (sample: Sample) => {
    begin();
    setFileName(`${sample.id}.png`);
    setPreview({ kind: "html", html: sample.html, name: `${sample.vendor} (sample)` });
    try {
      setStage("Rendering sample…");
      const image = await rasterizeHtml(sample.html);
      setStage("Extracting with AI…");
      setData(await extractDocument(image));
      setStatus("done");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <div id="demo" className="scroll-mt-20">
      {/* Tab switcher */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {(
            [
              ["single", "Single document"],
              ["batch", "Batch (up to 5)"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                tab === key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "batch" ? (
        <div className="mx-auto max-w-2xl">
          <BatchMode />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: input + preview */}
          <div className="space-y-4">
            <Dropzone
              onFiles={onUpload}
              disabled={status === "working"}
              hint="PNG, JPEG, WebP, or PDF — max 10 MB"
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                No invoice handy? Try a sample:
              </span>
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSample(sample)}
                  disabled={status === "working"}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
                >
                  {sample.name} · {sample.amount}
                </button>
              ))}
            </div>
            <Preview source={preview} />
          </div>

          {/* Right: results */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Extracted data</h3>
              {status === "done" && data && (
                <ExportButtons
                  entries={[{ fileName, data }]}
                  csvName={`${fileName.replace(/\.[^.]+$/, "")}.csv`}
                />
              )}
            </div>

            {status === "idle" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
                <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 3h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                <p className="text-sm text-slate-400">
                  Results will appear here, editable field by field
                </p>
              </div>
            )}

            {status === "working" && (
              <div className="flex-1 space-y-3 py-4" aria-live="polite">
                <p className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                  {stage}
                </p>
                {[20, 14, 14, 32, 14].map((h, i) => (
                  <div key={i} className="skeleton rounded-md" style={{ height: h * 4 }} />
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-1 items-center justify-center py-12">
                <div className="max-w-sm rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-center">
                  <p className="text-sm font-medium text-rose-700">{error}</p>
                  <p className="mt-1 text-xs text-rose-500">
                    Check the file and try again.
                  </p>
                </div>
              </div>
            )}

            {status === "done" && data && (
              <ResultsTable data={data} onChange={setData} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
