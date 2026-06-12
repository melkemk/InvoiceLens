"use client";

import { useState } from "react";
import type { Extraction } from "@/lib/schema";
import { buildCsv, downloadCsv } from "@/lib/csv";

export function ExportButtons({
  entries,
  csvName,
}: {
  entries: { fileName: string; data: Extraction }[];
  csvName: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyJson = async () => {
    const payload =
      entries.length === 1
        ? entries[0].data
        : entries.map((e) => ({ file: e.fileName, ...e.data }));
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => downloadCsv(csvName, buildCsv(entries))}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
        Download CSV
      </button>
      <button
        onClick={copyJson}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-2M8 7V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-2" />
        </svg>
        {copied ? "Copied!" : "Copy JSON"}
      </button>
    </div>
  );
}
