export default function MarketingHome() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Scan barcodes and auto-build clean order lists—without errors.</h1>
            <p className="lede">
              Free exports your scans to CSV, PDF, and Excel. Pro verifies each code against your catalog,
              pulls the description, and builds a sorted order list with quantities.
            </p>
            <div className="actions">
              <a className="btn primary" href="/subscribe">Try Pro</a>
              <a className="btn" href="/app/">Try Free</a>
              <a className="btn" href="/app/pro/">Pro Workspace</a>
            </div>
            <p className="note">Mobile-friendly • No install • Works in your browser</p>
          </div>

          {/* Live app preview styled as device */}
          <div className="card device" id="devicePreview1">
            <div className="device-top"></div>
            <iframe
              title="ScanSnap App Preview"
              src="https://scansnapio.netlify.app/"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="bar">
              {/* (optional) live toggle JS you had in main.js; left as a visual button */}
              <button className="pill" data-live="#devicePreview1">Enable live</button>
              <a className="pill" href="/app/" title="Open on this domain">Open app</a>
            </div>
          </div>
        </div>
        <div className="bg-gradient" aria-hidden="true"></div>
      </section>

      {/* FEATURES */}
      <section className="container section">
        <div className="grid cols-3">
          <div className="card">
            <h3>Scan fast</h3>
            <p className="note">Use your camera anywhere. Manual input stays available when needed.</p>
          </div>
          <div className="card">
            <h3>Verify against catalog (Pro)</h3>
            <p className="note">Upload <span className="mono">barcode,description</span>. Matches confirmed instantly; unknowns flagged.</p>
          </div>
          <div className="card">
            <h3>Export clean lists</h3>
            <p className="note">CSV, PDF, or Excel—ready for purchasing. Pro aggregates quantities and sorts by description.</p>
          </div>
        </div>
      </section>

      {/* PLANS: Free / Pro */}
      <section className="container section">
        <div className="compare">
          <div className="card">
            <span className="tag">Free</span>
            <h3>Scan &amp; Export</h3>
            <ul className="feature">
              <li>Camera barcode scanning</li>
              <li>Manual add fallback</li>
              <li>Export CSV / PDF / Excel</li>
            </ul>
            <a className="btn" href="/app/">Open Free Scanner</a>
          </div>

          <div className="card">
            <span className="tag pro">Pro</span>
            <h3>Scan, Verify &amp; Sort</h3>
            <ul className="feature">
              <li>Import catalog (CSV/XLSX)</li>
              <li>Scan &amp; verify description</li>
              <li>Auto-build order list with qty</li>
              <li>Track “found parts” at a glance</li>
            </ul>
            <a className="btn primary" href="/subscribe">Get Pro</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container section">
        <div className="grid cols-3">
          <div className="card">
            <span className="tag">1</span>
            <h4>Open scanner</h4>
            <p className="note">Start on phone or desktop. No cables, no installs.</p>
          </div>
          <div className="card">
            <span className="tag">2</span>
            <h4>(Pro) Load catalog</h4>
            <p className="note">Provide your <span className="mono">barcode,description</span> sheet (CSV/XLSX).</p>
          </div>
          <div className="card">
            <span className="tag">3</span>
            <h4>Export order list</h4>
            <p className="note">Send accurate lists to purchasing. Save time and prevent mistakes.</p>
          </div>
        </div>
      </section>

      {/* (Optional) Carousel / gallery placeholder */}
      {/* <section className="container section">
           <div className="card">
             <h3>Screenshots</h3>
             <div className="carousel">
               <img src="/landing/slide-1.png" alt="" />
               <img src="/landing/slide-2.png" alt="" />
               <img src="/landing/slide-3.png" alt="" />
             </div>
           </div>
         </section> */}

      {/* FAQ */}
      <section className="container section">
        <div className="card">
          <h3>FAQ</h3>
          <div className="faq" role="list">
            <details>
              <summary>Do I need to install anything?</summary>
              <p className="note">No. ScanSnap runs in your browser on desktop and mobile.</p>
            </details>
            <details>
              <summary>What file format should my catalog use?</summary>
              <p className="note">CSV or XLSX with headers <span className="mono">barcode</span> and <span className="mono">description</span>.</p>
            </details>
            <details>
              <summary>Does the free version limit scanning?</summary>
              <p className="note">Free scans and exports lists. Pro adds catalog verification and order list aggregation.</p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER (uses your classes) */}
      <footer className="site">
        <div className="container foot-grid">
          <div className="brand-row">
            <a className="brand" href="/">
              {/* Toggle mark + word by theme */}
              <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="ScanSnap icon" width={28} height={28} />
              <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="ScanSnap icon" width={28} height={28} />
              <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" width={160} height={32} />
              <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" width={160} height={32} />
            </a>
            <p className="note">Fast barcode scanning that saves time and prevents errors.</p>
          </div>
          <div>
            <h5>Product</h5>
            <p><a href="/app/">Free Scanner</a></p>
            <p><a href="/app/pro/">Pro Workspace</a></p>
            <p><a href="/subscribe">Pricing</a></p>
          </div>
          <div>
            <h5>Account</h5>
            <p><a href="/login">Log in / Sign up</a></p>
            <p><a href="/billing">Billing</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}
