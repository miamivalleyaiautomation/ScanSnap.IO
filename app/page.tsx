// app/page.tsx
import SiteHeader from "@/components/SiteHeader";
import HeroPreview from "@/components/HeroPreview";

export const metadata = {
  title: "ScanSnap — Fast, accurate barcode & matrix code scanning",
  description: "Scan barcodes, QR & DataMatrix locally. Nothing leaves your device. Team-ready with per-seat pricing.",
};

export default function Page() {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.scansnap.io";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";
  const LS_BASIC = process.env.NEXT_PUBLIC_LS_BUY_BASIC ?? "#pricing";
  const LS_PLUS = process.env.NEXT_PUBLIC_LS_BUY_PLUS ?? "#pricing";
  const LS_PRO = process.env.NEXT_PUBLIC_LS_BUY_PRO ?? "#pricing";
  const LS_DPMS = process.env.NEXT_PUBLIC_LS_BUY_PRO_DPMS ?? "#pricing";

  return (
    <>
      <SiteHeader />
      <section className="hero section">
        <div className="bg-gradient" />
        <div className="container hero-grid">
          <div>
            <h1>Most affordable, fast, and accurate <span className="accent">barcode & matrix code</span> scanner.</h1>
            <p className="lede">OCR & cleanup run locally—<strong>no customer data is uploaded</strong>. Invite teammates, manage seats, and keep your workflow precise.</p>
            <div className="actions">
              <a className="btn primary" href={`${portalUrl}/login`}>Get started</a>
              <a className="btn" href="#features">See features</a>
            </div>
            <div style={{ height: 12 }} />
            <div className="note">Works on modern browsers. Ideal for teams and businesses.</div>
          </div>
          <div>
            <div className="device">
              <div className="device-top" />
              <HeroPreview src="/assets/app-preview.gif" alt="ScanSnap in action" />
              <div className="bar">
                <button className="pill" type="button">Preview</button>
                <button className="pill" type="button">Local-only</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
