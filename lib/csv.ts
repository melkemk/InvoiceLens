import type { Extraction } from "./schema";

function escapeCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADER = [
  "file",
  "vendor",
  "invoice_date",
  "invoice_number",
  "currency",
  "item_description",
  "quantity",
  "unit_price",
  "line_total",
  "subtotal",
  "tax",
  "grand_total",
];

/**
 * Flattens one extraction per line item; invoice-level fields repeat on
 * every row so the CSV opens cleanly in a spreadsheet.
 */
export function toCsvRows(fileName: string, data: Extraction): string[] {
  const base = [
    fileName,
    data.vendorName.value,
    data.invoiceDate.value,
    data.invoiceNumber.value,
    data.currency,
  ];
  const totals = [data.subtotal.value, data.tax.value, data.grandTotal.value];

  if (data.lineItems.length === 0) {
    return [[...base, "", "", "", "", ...totals].map(escapeCell).join(",")];
  }
  return data.lineItems.map((item) =>
    [
      ...base,
      item.description,
      item.quantity,
      item.unitPrice,
      item.total,
      ...totals,
    ]
      .map(escapeCell)
      .join(",")
  );
}

export function buildCsv(entries: { fileName: string; data: Extraction }[]): string {
  const rows = entries.flatMap((e) => toCsvRows(e.fileName, e.data));
  return [HEADER.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
