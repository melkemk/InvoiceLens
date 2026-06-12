import { Demo } from "@/components/Demo";

const FEATURES = [
  {
    title: "Vision-powered extraction",
    body: "A vision LLM reads invoices, receipts, and PDFs the way a human would — no templates, no per-vendor rules.",
    icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Schema-validated output",
    body: "Every response is checked against a strict Zod schema, with an automatic repair retry — malformed data never reaches your table.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    title: "Per-field confidence",
    body: "Each extracted field carries a confidence score, so you know exactly what to trust and what to double-check.",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "Human-in-the-loop editing",
    body: "Results land in an editable table beside the original document — fix anything inline before exporting.",
    icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  },
  {
    title: "Batch processing",
    body: "Queue up to five documents, watch live progress, and download one combined CSV for your whole stack of receipts.",
    icon: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3",
  },
  {
    title: "CSV & JSON export",
    body: "One click to a spreadsheet-ready CSV or clipboard-ready JSON — wired for whatever comes next in your pipeline.",
    icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
  },
];

const STEPS = [
  { n: "01", title: "Upload", body: "Drop an image or PDF — or pick a built-in sample invoice." },
  { n: "02", title: "Extract", body: "The vision model reads the document and returns structured, schema-validated JSON." },
  { n: "03", title: "Export", body: "Review with confidence scores, edit inline, then export CSV or JSON." },
];

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200 via-sky-100 to-emerald-100 opacity-60 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-40" />
      </div>

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 6v5m-2.5-2.5h5M19 11a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Invoice<span className="text-indigo-600">Lens</span>
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <a href="#demo" className="transition hover:text-slate-900">Demo</a>
          <a href="#how" className="transition hover:text-slate-900">How it works</a>
          <a href="#features" className="transition hover:text-slate-900">Features</a>
        </nav>
        <a
          href="#demo"
          className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          Try it free
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-14 text-center sm:pt-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            Powered by Llama 4 vision on Groq
          </span>
        </div>
        <h1 className="animate-fade-up mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl [animation-delay:80ms]">
          Turn documents into{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
            data
          </span>{" "}
          in seconds
        </h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 [animation-delay:160ms]">
          Upload any invoice or receipt and watch AI extract vendors, line items, and
          totals into clean, validated, export-ready data — complete with confidence
          scores for every field.
        </p>
        <div className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]">
          <a
            href="#demo"
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 sm:w-auto"
          >
            Try the live demo →
          </a>
          <a
            href="https://github.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
          >
            View source
          </a>
        </div>
        <dl className="animate-fade-up mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 [animation-delay:320ms]">
          {(
            [
              ["~5s", "per document"],
              ["10+", "fields extracted"],
              ["100%", "schema-validated"],
            ] as const
          ).map(([stat, label]) => (
            <div key={label}>
              <dt className="text-2xl font-extrabold text-slate-900">{stat}</dt>
              <dd className="mt-0.5 text-xs font-medium text-slate-500">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Live demo */}
      <section className="border-y border-slate-200 bg-slate-50/70 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              See it in action
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Upload your own document, or run a one-click sample — no sign-up needed.
            </p>
          </div>
          <Demo />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-3xl font-extrabold text-indigo-100">{step.n}</span>
              <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 border-t border-slate-200 bg-slate-50/70 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Built like a real product
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
            Not just a model call — validation, retries, rate limiting, and review
            tooling around it.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 transition group-hover:bg-indigo-100">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <span>
            InvoiceLens — a portfolio demo. Sample invoices are fictional; uploaded
            documents are processed transiently and never stored.
          </span>
          <span>Next.js 14 · TypeScript · Tailwind · Groq</span>
        </div>
      </footer>
    </main>
  );
}
