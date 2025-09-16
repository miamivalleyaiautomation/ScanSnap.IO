// app/page.tsx
import type { Metadata } from ‘next’;
import SiteHeader from ‘@/components/SiteHeader’;
import HeroPreview from ‘@/components/HeroPreview’;

export const metadata: Metadata = {
title: ‘ScanSnap — Fast, accurate barcode & matrix code scanning’,
description:
‘Scan barcodes, QR & DataMatrix locally. Nothing leaves your device. Team-ready with per-seat pricing.’,
};

export default function Page() {
const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? ‘https://portal.scansnap.io’;
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ‘https://app.scansnap.io’;

const LS_BASIC = process.env.NEXT_PUBLIC_LS_BUY_BASIC ?? ‘#pricing’;
const LS_PLUS = process.env.NEXT_PUBLIC_LS_BUY_PLUS ?? ‘#pricing’;
const LS_PRO = process.env.NEXT_PUBLIC_LS_BUY_PRO ?? ‘#pricing’;
const LS_DPMS = process.env.NEXT_PUBLIC_LS_BUY_PRO_DPMS ?? ‘#pricing’;

return (
<>
<SiteHeader />

```
  {/* ===== HERO ===== */}
  <section className="hero section">
    <div className="bg-gradient" />
    <div className="container hero-grid">
      <div>
        <h1>
          Most affordable, fast, and accurate{' '}
          <span style={{ color: '#00d1ff' }}>barcode &amp; matrix code</span> scanner.
        </h1>
        <p style={{ fontSize: '1.25rem', lineHeight: '1.6', margin: '0.8rem 0' }}>
          OCR &amp; cleanup run locally—<strong>no customer data is uploaded</strong>. Invite
          teammates, manage seats, and keep your workflow precise.
        </p>
        <div className="actions">
          <a className="btn primary" href={`${portalUrl}/login`}>
            Get started
          </a>
          <a className="btn" href="#features">
            See features
          </a>
        </div>
        <div style={{ height: 12 }} />
        <div style={{ color: '#93a0b3', fontSize: '0.95rem' }}>
          Works on modern browsers. Ideal for teams and businesses.
        </div>
      </div>

      <div>
        <div className="device">
          <div className="device-top" />
          <HeroPreview src="/assets/app-preview.gif" alt="ScanSnap in action" />
          <div className="bar">
            <button className="pill" type="button">
              Preview
            </button>
            <button className="pill" type="button">
              Local-only
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ===== FEATURES ===== */}
  <section id="features" className="section">
    <div className="container">
      <div style={{ margin: '0 0 1.5rem 0', textAlign: 'center', paddingTop: '0.5rem' }}>
        <h2>Features</h2>
        <p style={{ color: '#93a0b3', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Everything you need for professional barcode scanning
        </p>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <span style={{ 
            display: 'inline-block', 
            background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
            color: '#00131c', 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            padding: '0.3rem 0.6rem', 
            borderRadius: '999px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px' 
          }}>
            Local &amp; Private
          </span>
          <h3>Nothing leaves your device</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
            <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
              On-device processing (no cloud upload)
            </li>
            <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
              Fast OCR + cleanup pipeline
            </li>
            <li style={{ padding: '0.4rem 0' }}>
              Works offline after initial load
            </li>
          </ul>
        </div>

        <div className="card">
          <span style={{ 
            display: 'inline-block', 
            background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
            color: '#00131c', 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            padding: '0.3rem 0.6rem', 
            borderRadius: '999px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px' 
          }}>
            Barcode Pro
          </span>
          <h3>Accurate scanning</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
            <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
              UPC, EAN, Code-128, Code-39, and more
            </li>
            <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
              QR &amp; DataMatrix (Pro tier)
            </li>
            <li style={{ padding: '0.4rem 0' }}>
              Laser mark &amp; Dot-Peen matrix (DPMS tier)
            </li>
          </ul>
        </div>

        <div className="card">
          <span style={{ 
            display: 'inline-block', 
            background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
            color: '#00131c', 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            padding: '0.3rem 0.6rem', 
            borderRadius: '999px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px' 
          }}>
            Team-ready
          </span>
          <h3>Seats &amp; roles</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
            <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
              Per-seat licensing
            </li>
            <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
              Invite/Remove users anytime
            </li>
            <li style={{ padding: '0.4rem 0' }}>
              Use your company email domain
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  {/* ===== PRICING ===== */}
  <section id="pricing" className="section">
    <div className="container">
      <div style={{ margin: '0 0 1.5rem 0', textAlign: 'center', paddingTop: '0.5rem' }}>
        <h2>Pricing</h2>
        <p style={{ color: '#93a0b3', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Simple, transparent pricing that scales with your team
        </p>
      </div>

      <div className="pricing-grid">
        <div className="card">
          <div>
            <span style={{ 
              display: 'inline-block', 
              background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
              color: '#00131c', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              padding: '0.3rem 0.6rem', 
              borderRadius: '999px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}>
              BASIC
            </span>
            <h3>Free</h3>
            <p style={{ color: '#93a0b3' }}>Scan barcodes and export to PDF, CSV, or Excel.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                Core barcode scanning
              </li>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                Export: PDF / CSV / XLSX
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                Personal use
              </li>
            </ul>
          </div>
          <div style={{ height: 8 }} />
          <a className="btn block" href={`${portalUrl}/login`}>
            Start free
          </a>
        </div>

        <div className="card">
          <div>
            <span style={{ 
              display: 'inline-block', 
              background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
              color: '#00131c', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              padding: '0.3rem 0.6rem', 
              borderRadius: '999px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}>
              PLUS
            </span>
            <h3>
              $9.99 <span style={{ color: '#93a0b3' }}>/ user / mo</span>
            </h3>
            <p style={{ color: '#93a0b3' }}>
              Everything in Basic + import your catalog CSV and run two modes.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                <strong>Verify</strong>: track scans against uploaded file
              </li>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                <strong>Order Builder</strong>: create vendor/in-house orders
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                Reduce manual errors
              </li>
            </ul>
          </div>
          <div style={{ height: 8 }} />
          <a className="btn primary block" href={LS_PLUS}>
            Choose Plus
          </a>
        </div>

        <div className="card">
          <div>
            <span style={{ 
              display: 'inline-block', 
              background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
              color: '#00131c', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              padding: '0.3rem 0.6rem', 
              borderRadius: '999px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}>
              PRO
            </span>
            <h3>
              $14.99 <span style={{ color: '#93a0b3' }}>/ user / mo</span>
            </h3>
            <p style={{ color: '#93a0b3' }}>Everything in Plus + QR &amp; DataMatrix support.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                All Plus features
              </li>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                QR code reading
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                DataMatrix reading
              </li>
            </ul>
          </div>
          <div style={{ height: 8 }} />
          <a className="btn primary block" href={LS_PRO}>
            Choose Pro
          </a>
        </div>

        <div className="card">
          <div>
            <span style={{ 
              display: 'inline-block', 
              background: 'linear-gradient(135deg, #00d1ff, #4a90e2)', 
              color: '#00131c', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              padding: '0.3rem 0.6rem', 
              borderRadius: '999px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}>
              PRO + DPMS
            </span>
            <h3>
              $49.99 <span style={{ color: '#93a0b3' }}>/ user / mo</span>
            </h3>
            <p style={{ color: '#93a0b3' }}>
              Pro + specialized reader for laser-mark &amp; Dot-Peen matrix codes.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0' }}>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                All Pro features
              </li>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid #161b22' }}>
                Custom scanning pipeline
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                Designed for tough marks
              </li>
            </ul>
          </div>
          <div style={{ height: 8 }} />
          <a className="btn primary block" href={LS_DPMS}>
            Choose Pro + DPMS
          </a>
        </div>
      </div>

      <div style={{ 
        background: 'var(--card)', 
        border: '1px solid #161b22', 
        borderRadius: '18px', 
        padding: '1.5rem', 
        marginTop: '2rem', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0, color: '#93a0b3', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Prices in USD. Per-seat licensing. You can add/remove users anytime from your portal.
          Data stays on your device—no customer data is uploaded to our servers.
        </p>
      </div>
    </div>
  </section>

  {/* ===== CONTACT ===== */}
  <section id="contact" className="section">
    <div className="container">
      <div style={{ margin: '0 0 1.5rem 0', textAlign: 'center', paddingTop: '0.5rem' }}>
        <h2>Contact</h2>
        <p style={{ color: '#93a0b3', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Get in touch with our team
        </p>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Contact us</h3>
          <p style={{ color: '#93a0b3' }}>Questions about pricing, teams, or a custom rollout?</p>
          <div style={{ height: 8 }} />
          <a className="btn" href="mailto:hello@scansnap.io">
            hello@scansnap.io
          </a>
        </div>

        <div className="card">
          <h3>Already a customer?</h3>
          <p style={{ color: '#93a0b3' }}>Manage your subscription, seats, and billing in the portal.</p>
          <div style={{ height: 8 }} />
          <div className="actions">
            <a className="btn" href={appUrl}>
              Go to App
            </a>
            <a className="btn primary" href={`${portalUrl}/login`}>
              Open Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ===== FOOTER ===== */}
  <footer className="site">
    <div className="container foot-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
          <img className="mark mark-dark" src="/assets/favicon_1024_dark.png" alt="" />
          <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
          <img className="word word-dark" src="/assets/text_1024_dark.png" alt="ScanSnap" />
        </div>
        <p style={{ color: '#93a0b3' }}>© {new Date().getFullYear()} ScanSnap. All rights reserved.</p>
      </div>

      <div>
        <h4>Product</h4>
        <div className="grid">
          <a style={{ color: '#93a0b3' }} href="#features">
            Features
          </a>
          <a style={{ color: '#93a0b3' }} href="#pricing">
            Pricing
          </a>
        </div>
      </div>

      <div>
        <h4>Company</h4>
        <div className="grid">
          <a style={{ color: '#93a0b3' }} href="#contact">
            Contact
          </a>
          <a style={{ color: '#93a0b3' }} href={appUrl}>
            App
          </a>
        </div>
      </div>
    </div>
  </footer>
</>
```

);
}
