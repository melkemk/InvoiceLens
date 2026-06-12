import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoiceLens — Turn documents into data in seconds",
  description:
    "AI-powered invoice and receipt extraction. Upload a document, get clean structured data with per-field confidence — exportable as CSV or JSON.",
  openGraph: {
    title: "InvoiceLens",
    description: "Turn documents into data in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
