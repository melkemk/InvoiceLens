import { z } from "zod";

/** A scalar field paired with the model's self-reported confidence (0–1). */
const confidence = z.number().min(0).max(1);

export const stringField = z.object({
  value: z.string(),
  confidence,
});

export const numberField = z.object({
  value: z.number(),
  confidence,
});

export const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
  confidence,
});

export const extractionSchema = z.object({
  vendorName: stringField,
  invoiceDate: stringField,
  invoiceNumber: stringField,
  currency: z.string().default("USD"),
  lineItems: z.array(lineItemSchema),
  subtotal: numberField,
  tax: numberField,
  grandTotal: numberField,
});

export type StringField = z.infer<typeof stringField>;
export type NumberField = z.infer<typeof numberField>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type Extraction = z.infer<typeof extractionSchema>;

/** Shape of a successful /api/extract response. */
export type ExtractResponse =
  | { ok: true; data: Extraction }
  | { ok: false; error: string };
