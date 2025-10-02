// app/page.tsx - Simplified and realistic version
"use client";

import { useUser } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";
import HeroPreview from "@/components/HeroPreview";
import PricingSection from "@/components/PricingSection";
import LoginButton from "@/components/LoginButton";

export default function Page() {
  const { user, isSignedIn } = useUser();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";

  const handleStartScanning = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scansnap.io";
    
    if (isSignedIn) {
      // Create session and navigate in same window
      fetch('/api/app/session/create', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.sessionToken) {
            window.location.href = `${appUrl}?session=${data.sessionToken}`;
          } else {
            window.location.href = `${appUrl}?login-required=true`;
          }
        })
        .catch(() => {
          window.location.href = `${appUrl}?login-required=true`;
        });
    } else {
      // Not signed in - direct to app with login prompt in same window
      window.location.href = `${appUrl}?login-required=true`;
    }
  };

  return (
    <>
      <SiteHeader />

      {/* ===== HERO ===== */}
      <section className="hero section">
        <div className="bg-gradient" />
        <div className="container hero-grid">
          <div>
            <h1>
              Finally. <span className="accent">Barcode scanning</span> that actually works offline.
            </h1>
            <p className="lede">
              Scan inventory, verify deliveries, build orders—all without internet. 
              Upload your lists, scan to verify, export your results. <strong>No complex setup. No training needed.</strong>
            </p>
            <div className="actions">
              <button className="btn primary" onClick={handleStartScanning}>
                {isSignedIn ? '🚀 Launch App' : 'Try it free'}
              </button>
              <a className="btn" href="#how-it-works">See how it works</a>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <p className="note">Works on any device with a camera. No app download required.</p>
            </div>
          </div>

          <div>
            <div className="device">
              <div className="device-top" />
              <HeroPreview src="/assets/app-preview.gif" alt="ScanSnap in action" />
              <div className="bar">
                <button className="pill" type="button">100% Offline</button>
                <button className="pill" type="button">Web-Based</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Three simple modes. Zero complexity.</h2>
            <p>Pick your mode, start scanning. It's that simple.</p>
          </div>
          <div className="grid cols-3">
            <div className="card">
              <span className="tag">Mode 1</span>
              <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Basic Scanning</h3>
              <p className="muted">Just need to capture barcodes quickly?</p>
              <ul className="feature">
                <li>Scan with camera or handheld scanner</li>
                <li>Type in codes manually if needed</li>
                <li>Export to PDF, CSV, or Excel</li>
                <li>Works completely offline</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag">Mode 2</span>
              <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Verify Mode</h3>
              <p className="muted">Got a list to check against?</p>
              <ul className="feature">
                <li>Upload your CSV or Excel file</li>
                <li>Scan items to mark them as verified</li>
                <li>See what's been found vs. missing</li>
                <li>Export your verification results</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag">Mode 3</span>
              <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Order Builder</h3>
              <p className="muted">Need to build orders from a catalog?</p>
              <ul className="feature">
                <li>Upload your product catalog (CSV)</li>
                <li>Scan items to add to order</li>
                <li>Quantities increase with each scan</li>
                <li>Export complete order forms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHO USES THIS ===== */}
      <section id="use-cases" className="section" style={{ background: 'var(--card)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>Who's using ScanSnap?</h2>
            <p>Simple problems, simple solutions</p>
          </div>
          
          <div className="grid cols-2">
            <div className="card">
              <h3>📦 Warehouse Teams</h3>
              <p className="muted">
                Upload your pick list, scan items as you pick them, export the completed list. 
                No more paper and pen.
              </p>
            </div>

            <div className="card">
              <h3>🏪 Store Managers</h3>
              <p className="muted">
                When recalls hit, upload the recall list and scan your shelves. 
                Know exactly what needs to be pulled.
              </p>
            </div>

            <div className="card">
              <h3>🚐 Delivery Drivers</h3>
              <p className="muted">
                Verify deliveries by scanning against the packing list. 
                Catch missing items before leaving.
              </p>
            </div>

            <div className="card">
              <h3>📊 Inventory Counters</h3>
              <p className="muted">
                Do cycle counts with a phone instead of clipboard. 
                Export results straight to spreadsheet.
              </p>
            </div>

            <div className="card">
              <h3>🛠️ Field Service</h3>
              <p className="muted">
                Scan parts used on jobs, build material lists, 
                create reorder sheets from your van.
              </p>
            </div>

            <div className="card">
              <h3>🏢 Office Managers</h3>
              <p className="muted">
                Scan supplies to reorder, verify office deliveries, 
                track equipment with simple exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIMPLE BENEFITS ===== */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why teams love ScanSnap</h2>
          
          <div className="grid cols-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔌</div>
              <h4>Works Without Internet</h4>
              <p className="muted">
                Scan in warehouses, basements, or remote sites. 
                No WiFi? No problem.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
              <h4>Nothing to Install</h4>
              <p className="muted">
                Works on phones, tablets, computers. 
                Just open your browser and scan.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
              <h4>Start in 30 Seconds</h4>
              <p className="muted">
                No training, no manual, no setup. 
                If you can use a camera, you can use this.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
              <h4>Your Data Stays Yours</h4>
              <p className="muted">
                Everything processes in your browser. 
                We never see your scans or lists.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
              <h4>Export Anywhere</h4>
              <p className="muted">
                Download as PDF, CSV, or Excel. 
                Email it, save it, import it anywhere.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <h4>Honest Pricing</h4>
              <p className="muted">
                Start free. Upgrade when you need more. 
                Cancel anytime. No surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS (Simple) ===== */}
      <section className="section" style={{ background: 'var(--card)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>What users say</h2>
          
          <div className="grid cols-3">
            <div className="card">
              <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                "Replaced our expensive handheld scanners. This just works better."
              </p>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                - Mike, Warehouse Manager
              </p>
            </div>
            
            <div className="card">
              <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                "I can finally do inventory counts without staying after hours."
              </p>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                - Sarah, Store Owner
              </p>
            </div>
            
            <div className="card">
              <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                "Upload list, scan items, export results. It's stupid simple."
              </p>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                - Tom, Operations Lead
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Simple, transparent pricing</h2>
            <p>Start free. Upgrade when you need more features.</p>
          </div>
          <PricingSection />
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p className="note">
              All plans are single-user. Need multiple users?{' '}
              <a href="mailto:hello@scansnap.io" className="link">Contact us</a> for team pricing.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" style={{ background: 'var(--card)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Common questions</h2>
          
          <div className="grid cols-2">
            <div className="card">
              <h4>Do I need to download an app?</h4>
              <p className="muted">No. ScanSnap runs in your web browser. Works on any device.</p>
            </div>
            
            <div className="card">
              <h4>Does it really work offline?</h4>
              <p className="muted">Yes. Once loaded, you can scan without internet. Sync when you reconnect.</p>
            </div>
            
            <div className="card">
              <h4>What barcode types can it read?</h4>
              <p className="muted">
                Basic & Plus: Standard 1D barcodes (UPC, EAN, Code 128, etc.)<br/>
                Pro: Adds QR codes and DataMatrix<br/>
                Pro + DPMS (Coming Soon): Dot-peen and laser marks
              </p>
            </div>
            
            <div className="card">
              <h4>Can I use my own barcode scanner?</h4>
              <p className="muted">Yes. Any USB or Bluetooth scanner that types like a keyboard works.</p>
            </div>
            
            <div className="card">
              <h4>How do I get my data out?</h4>
              <p className="muted">Export to PDF, CSV, or Excel. Then email, save, or import wherever you need.</p>
            </div>
            
            <div className="card">
              <h4>Is my data secure?</h4>
              <p className="muted">Your scans and lists never leave your device. We can't see them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--brand0), var(--brand1))', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to ditch the clipboard?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.95 }}>
            Start scanning in 30 seconds. No credit card required.
          </p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <button 
              className="btn" 
              onClick={handleStartScanning}
              style={{ background: '#fff', color: '#00131c', fontWeight: 'bold' }}
            >
              Start Free Trial
            </button>
            <a 
              className="btn" 
              href="#pricing"
              style={{ background: 'transparent', border: '2px solid #fff', color: '#fff' }}
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site">
        <div className="container foot-grid">
          <div className="brand-row">
            <div className="brand footer-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
              <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
              <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
              <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
            </div>
            <p className="muted">© {new Date().getFullYear()} ScanSnap. All rights reserved.</p>
          </div>
          <div>
            <h4>Product</h4>
            <div className="grid">
              <a className="link" href="#how-it-works">How it Works</a>
              <a className="link" href="#pricing">Pricing</a>
              <a className="link" href="#use-cases">Use Cases</a>
              <a className="link" href={appUrl}>Open App</a>
            </div>
          </div>
          <div>
            <h4>Support</h4>
            <div className="grid">
              <a className="link" href="mailto:hello@scansnap.io">Contact Us</a>
              <a className="link" href="/login">Sign In</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}