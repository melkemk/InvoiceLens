"use client";

import { useRef, useState } from "react";
import { ACCEPTED_TYPES } from "@/lib/document";

export function Dropzone({
  onFiles,
  multiple = false,
  disabled = false,
  hint,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (list: FileList | null) => {
    if (!list || disabled) return;
    onFiles(Array.from(list));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload documents"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
        dragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-700">
        Drop {multiple ? "files" : "a file"} here or{" "}
        <span className="text-indigo-600">browse</span>
      </p>
      <p className="text-xs text-slate-400">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
