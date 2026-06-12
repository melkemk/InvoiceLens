/**
 * Three fictional sample invoices, authored as self-contained styled HTML.
 * They render directly in the preview pane and are rasterized client-side
 * (html2canvas) before being sent through the same AI pipeline as uploads.
 */
export type Sample = {
  id: string;
  name: string;
  vendor: string;
  amount: string;
  html: string;
};

const wrap = (body: string) => `
<div style="width:640px;background:#ffffff;color:#111827;font-family:Arial,Helvetica,sans-serif;box-sizing:border-box;">
${body}
</div>`;

export const SAMPLES: Sample[] = [
  {
    id: "northwind",
    name: "SaaS invoice",
    vendor: "Northwind Cloud Services",
    amount: "$1,393.20",
    html: wrap(`
  <div style="padding:40px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #4f46e5;padding-bottom:20px;">
      <div>
        <div style="font-size:24px;font-weight:bold;color:#4f46e5;">Northwind Cloud Services</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">412 Harbor Avenue, Suite 900<br/>Seattle, WA 98101 &middot; billing@northwindcloud.example</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:28px;font-weight:bold;letter-spacing:2px;color:#111827;">INVOICE</div>
        <div style="font-size:13px;color:#6b7280;margin-top:6px;">Invoice #: <b style="color:#111827;">NW-2025-0847</b></div>
        <div style="font-size:13px;color:#6b7280;">Date: <b style="color:#111827;">2025-11-14</b></div>
        <div style="font-size:13px;color:#6b7280;">Due: <b style="color:#111827;">2025-12-14</b></div>
      </div>
    </div>
    <div style="margin-top:20px;font-size:13px;color:#6b7280;">Bill to:<br/><b style="color:#111827;font-size:14px;">Acme Robotics Inc.</b><br/>1200 Innovation Drive, Austin, TX 78701</div>
    <table style="width:100%;border-collapse:collapse;margin-top:24px;font-size:13px;">
      <thead>
        <tr style="background:#4f46e5;color:#ffffff;">
          <th style="text-align:left;padding:10px 12px;">Description</th>
          <th style="text-align:center;padding:10px 12px;">Qty</th>
          <th style="text-align:right;padding:10px 12px;">Unit Price</th>
          <th style="text-align:right;padding:10px 12px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:10px 12px;">Compute Cluster — Standard tier (Nov 2025)</td><td style="text-align:center;padding:10px 12px;">3</td><td style="text-align:right;padding:10px 12px;">$240.00</td><td style="text-align:right;padding:10px 12px;">$720.00</td></tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;"><td style="padding:10px 12px;">Object Storage — 2 TB block</td><td style="text-align:center;padding:10px 12px;">2</td><td style="text-align:right;padding:10px 12px;">$95.00</td><td style="text-align:right;padding:10px 12px;">$190.00</td></tr>
        <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:10px 12px;">Managed PostgreSQL — HA instance</td><td style="text-align:center;padding:10px 12px;">1</td><td style="text-align:right;padding:10px 12px;">$310.00</td><td style="text-align:right;padding:10px 12px;">$310.00</td></tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;"><td style="padding:10px 12px;">Priority support add-on</td><td style="text-align:center;padding:10px 12px;">1</td><td style="text-align:right;padding:10px 12px;">$70.00</td><td style="text-align:right;padding:10px 12px;">$70.00</td></tr>
      </tbody>
    </table>
    <div style="display:flex;justify-content:flex-end;margin-top:16px;">
      <table style="font-size:13px;border-collapse:collapse;min-width:240px;">
        <tr><td style="padding:6px 12px;color:#6b7280;">Subtotal</td><td style="padding:6px 12px;text-align:right;">$1,290.00</td></tr>
        <tr><td style="padding:6px 12px;color:#6b7280;">Tax (8%)</td><td style="padding:6px 12px;text-align:right;">$103.20</td></tr>
        <tr style="border-top:2px solid #4f46e5;"><td style="padding:10px 12px;font-weight:bold;">Total Due</td><td style="padding:10px 12px;text-align:right;font-weight:bold;font-size:16px;color:#4f46e5;">$1,393.20</td></tr>
      </table>
    </div>
    <div style="margin-top:28px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;">Payment terms: Net 30. Please reference invoice number NW-2025-0847 with your payment. Thank you for your business!</div>
  </div>`),
  },
  {
    id: "beanline",
    name: "Café receipt",
    vendor: "Beanline Coffee Co.",
    amount: "$23.49",
    html: wrap(`
  <div style="max-width:380px;margin:0 auto;padding:32px 28px;font-family:'Courier New',monospace;">
    <div style="text-align:center;">
      <div style="font-size:20px;font-weight:bold;letter-spacing:1px;">BEANLINE COFFEE CO.</div>
      <div style="font-size:12px;margin-top:4px;">88 Maple Street, Portland, OR 97204<br/>(503) 555-0142</div>
      <div style="font-size:12px;margin-top:10px;">RECEIPT #R-77231<br/>2026-01-08 &nbsp; 09:42 AM<br/>Cashier: Dana &nbsp; Register: 2</div>
    </div>
    <div style="border-top:1px dashed #111827;margin:14px 0;"></div>
    <table style="width:100%;font-size:12px;border-collapse:collapse;">
      <tr><td style="padding:3px 0;">2x Oat Latte (16oz)</td><td style="text-align:right;">$11.00</td></tr>
      <tr><td style="padding:3px 0;">1x Cold Brew</td><td style="text-align:right;">$4.75</td></tr>
      <tr><td style="padding:3px 0;">1x Almond Croissant</td><td style="text-align:right;">$4.25</td></tr>
      <tr><td style="padding:3px 0;">1x Banana Bread Slice</td><td style="text-align:right;">$3.50</td></tr>
    </table>
    <div style="border-top:1px dashed #111827;margin:14px 0;"></div>
    <table style="width:100%;font-size:12px;border-collapse:collapse;">
      <tr><td>SUBTOTAL</td><td style="text-align:right;">$23.50</td></tr>
      <tr><td>DISCOUNT (loyalty)</td><td style="text-align:right;">-$1.18</td></tr>
      <tr><td>TAX (5.1%)</td><td style="text-align:right;">$1.17</td></tr>
      <tr style="font-weight:bold;font-size:14px;"><td style="padding-top:6px;">TOTAL</td><td style="text-align:right;padding-top:6px;">$23.49</td></tr>
      <tr><td style="padding-top:8px;">VISA ****4821</td><td style="text-align:right;padding-top:8px;">$23.49</td></tr>
    </table>
    <div style="border-top:1px dashed #111827;margin:14px 0;"></div>
    <div style="text-align:center;font-size:12px;">Thanks for visiting!<br/>Earn stars with every cup &#9733;</div>
  </div>`),
  },
  {
    id: "hartwell",
    name: "Consulting invoice",
    vendor: "Hartwell & Associates",
    amount: "€5,512.50",
    html: wrap(`
  <div style="padding:44px;font-family:Georgia,'Times New Roman',serif;">
    <div style="text-align:center;border-bottom:1px solid #111827;padding-bottom:18px;">
      <div style="font-size:26px;letter-spacing:3px;">HARTWELL &amp; ASSOCIATES</div>
      <div style="font-size:12px;color:#4b5563;margin-top:4px;letter-spacing:1px;">MANAGEMENT CONSULTING &middot; AMSTERDAM</div>
    </div>
    <table style="width:100%;margin-top:24px;font-size:13px;">
      <tr>
        <td style="vertical-align:top;">
          <div style="font-size:11px;color:#6b7280;letter-spacing:1px;">INVOICED TO</div>
          <div style="margin-top:6px;font-weight:bold;">Meridian Logistics B.V.</div>
          <div style="color:#4b5563;">Keizersgracht 220<br/>1016 DZ Amsterdam, Netherlands</div>
        </td>
        <td style="vertical-align:top;text-align:right;">
          <div>Invoice No.: <b>HA-INV-3306</b></div>
          <div>Issue Date: <b>15 March 2026</b></div>
          <div>VAT No.: NL862834912B01</div>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-top:26px;font-size:13px;">
      <thead>
        <tr style="border-top:2px solid #111827;border-bottom:2px solid #111827;">
          <th style="text-align:left;padding:10px 8px;">Service</th>
          <th style="text-align:center;padding:10px 8px;">Hours</th>
          <th style="text-align:right;padding:10px 8px;">Rate</th>
          <th style="text-align:right;padding:10px 8px;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #d1d5db;"><td style="padding:10px 8px;">Supply chain assessment — Phase 1</td><td style="text-align:center;padding:10px 8px;">18</td><td style="text-align:right;padding:10px 8px;">&euro;165.00</td><td style="text-align:right;padding:10px 8px;">&euro;2,970.00</td></tr>
        <tr style="border-bottom:1px solid #d1d5db;"><td style="padding:10px 8px;">Stakeholder workshops (2 sessions)</td><td style="text-align:center;padding:10px 8px;">8</td><td style="text-align:right;padding:10px 8px;">&euro;150.00</td><td style="text-align:right;padding:10px 8px;">&euro;1,200.00</td></tr>
        <tr style="border-bottom:1px solid #d1d5db;"><td style="padding:10px 8px;">Final report &amp; recommendations</td><td style="text-align:center;padding:10px 8px;">4</td><td style="text-align:right;padding:10px 8px;">&euro;95.00</td><td style="text-align:right;padding:10px 8px;">&euro;380.00</td></tr>
      </tbody>
    </table>
    <table style="margin-left:auto;margin-top:18px;font-size:13px;min-width:260px;">
      <tr><td style="padding:5px 8px;color:#4b5563;">Subtotal</td><td style="text-align:right;padding:5px 8px;">&euro;4,550.00</td></tr>
      <tr><td style="padding:5px 8px;color:#4b5563;">VAT (21%)</td><td style="text-align:right;padding:5px 8px;">&euro;955.50</td></tr>
      <tr style="border-top:1px solid #111827;"><td style="padding:9px 8px;font-weight:bold;">Amount Due</td><td style="text-align:right;padding:9px 8px;font-weight:bold;font-size:15px;">&euro;5,512.50</td></tr>
    </table>
    <div style="margin-top:30px;font-size:11px;color:#6b7280;border-top:1px solid #d1d5db;padding-top:12px;">
      Payment within 14 days to IBAN NL21 INGB 0001 2345 67, BIC INGBNL2A.<br/>All amounts in EUR. Hartwell &amp; Associates, KvK 78231904.
    </div>
  </div>`),
  },
];
