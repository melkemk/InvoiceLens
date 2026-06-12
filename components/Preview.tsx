"use client";

export type PreviewSource =
  | { kind: "image"; src: string; name: string }
  | { kind: "html"; html: string; name: string }
  | null;

export function Preview({ source }: { source: PreviewSource }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 truncate text-xs font-medium text-slate-500">
          {source ? source.name : "Document preview"}
        </span>
      </div>
      <div className="min-h-[320px] flex-1 overflow-auto p-4">
        {!source && (
          <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-slate-400">
            Upload a document or pick a sample to preview it here
          </div>
        )}
        {source?.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={source.src}
            alt={`Preview of ${source.name}`}
            className="mx-auto max-w-full rounded-lg shadow-sm ring-1 ring-slate-200"
          />
        )}
        {source?.kind === "html" && (
          <div className="doc-preview mx-auto max-w-[640px] overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-200">
            <div
              className="doc-scale"
              dangerouslySetInnerHTML={{ __html: source.html }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
