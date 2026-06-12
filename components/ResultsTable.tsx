"use client";

import type { Extraction, LineItem } from "@/lib/schema";
import { ConfidenceDot } from "./Confidence";

const inputCls =
  "w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 transition focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400";

function Field({
  label,
  value,
  confidence,
  onChange,
}: {
  label: string;
  value: string;
  confidence?: number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {confidence !== undefined && <ConfidenceDot value={confidence} />}
      </span>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function ResultsTable({
  data,
  onChange,
}: {
  data: Extraction;
  onChange: (next: Extraction) => void;
}) {
  const setStr = (key: "vendorName" | "invoiceDate" | "invoiceNumber", v: string) =>
    onChange({ ...data, [key]: { ...data[key], value: v } });
  const setNum = (key: "subtotal" | "tax" | "grandTotal", v: string) =>
    onChange({ ...data, [key]: { ...data[key], value: Number(v) || 0 } });
  const setItem = (i: number, patch: Partial<LineItem>) => {
    const lineItems = data.lineItems.map((item, idx) =>
      idx === i ? { ...item, ...patch } : item
    );
    onChange({ ...data, lineItems });
  };
  const removeItem = (i: number) =>
    onChange({ ...data, lineItems: data.lineItems.filter((_, idx) => idx !== i) });
  const addItem = () =>
    onChange({
      ...data,
      lineItems: [
        ...data.lineItems,
        { description: "", quantity: 1, unitPrice: 0, total: 0, confidence: 1 },
      ],
    });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Vendor"
          value={data.vendorName.value}
          confidence={data.vendorName.confidence}
          onChange={(v) => setStr("vendorName", v)}
        />
        <Field
          label="Date"
          value={data.invoiceDate.value}
          confidence={data.invoiceDate.confidence}
          onChange={(v) => setStr("invoiceDate", v)}
        />
        <Field
          label="Invoice #"
          value={data.invoiceNumber.value}
          confidence={data.invoiceNumber.confidence}
          onChange={(v) => setStr("invoiceNumber", v)}
        />
        <Field
          label="Currency"
          value={data.currency}
          onChange={(v) => onChange({ ...data, currency: v.toUpperCase() })}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Line items
          </span>
          <button
            onClick={addItem}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            + Add row
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Description</th>
                <th className="w-16 px-2 py-2">Qty</th>
                <th className="w-24 px-2 py-2">Unit</th>
                <th className="w-24 px-2 py-2">Total</th>
                <th className="w-14 px-2 py-2 text-center">Conf.</th>
                <th className="w-8 px-1 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-1.5">
                    <input
                      className={inputCls}
                      value={item.description}
                      onChange={(e) => setItem(i, { description: e.target.value })}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      className={`${inputCls} text-right`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => setItem(i, { quantity: Number(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      className={`${inputCls} text-right`}
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => setItem(i, { unitPrice: Number(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      className={`${inputCls} text-right`}
                      type="number"
                      step="0.01"
                      value={item.total}
                      onChange={(e) => setItem(i, { total: Number(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <ConfidenceDot value={item.confidence} />
                  </td>
                  <td className="px-1 py-1.5 text-center">
                    <button
                      onClick={() => removeItem(i)}
                      className="text-slate-300 transition hover:text-rose-500"
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              {data.lineItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-xs text-slate-400">
                    No line items detected
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(
          [
            ["Subtotal", "subtotal"],
            ["Tax", "tax"],
            ["Grand total", "grandTotal"],
          ] as const
        ).map(([label, key]) => (
          <label key={key} className="block">
            <span className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {label}
              <ConfidenceDot value={data[key].confidence} />
            </span>
            <input
              className={`${inputCls} text-right font-medium ${
                key === "grandTotal" ? "border-indigo-200 bg-indigo-50/50" : ""
              }`}
              type="number"
              step="0.01"
              value={data[key].value}
              onChange={(e) => setNum(key, e.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
