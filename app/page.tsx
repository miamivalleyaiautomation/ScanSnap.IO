import PricingGrid from "@/components/PricingGrid";

export default function HomePage() {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.scansnap.io";

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="bg-gradient" />
        <div className="container hero-grid">
          <div>
            <div className="tag">AI-powered scanning</div>
            <h1>Scan, organize, and ship docs in seconds.</h1>
            <p className="lede">From quick scans to full team workflows — ScanSnap turns paper into searchable, shareable knowledge.</p>
            <div className="actions">
              <a className="btn primary" href="#pricing">See pricing</a>
              <a className="btn" href={`${portalUrl}/login`}>Login</a>
            </div>
          </div>
          <div className="device">
            <div className="device-top" />
            <iframe src="https://app.scansnap.io/app" title="App preview" />
            <div className="bar">
              <button className="pill">Fast</button>
              <button className="pill">Secure</button>
              <button className="pill">Team-ready</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <div className="container">
          <div className="grid cols-3">
            <div className="card">
              <h3>Lightning scans ⚡</h3>
              <p className="muted">Drag-and-drop or camera capture. OCR and cleanup run instantly so you can keep moving.</p>
              <ul className="feature" style={{paddingLeft:18}}>
                <li>Crystal-clear PDFs</li>
                <li>Auto straighten & crop</li>
                <li>Smart file names</li>
              </ul>
            </div>
            <div className="card">
              <h3>Organize & share 📁</h3>
              <p className="muted">Folders, tags, and quick links keep documents tidy and easy to find.</p>
              <ul className="feature" style={{paddingLeft:18}}>
                <li>Searchable text</li>
                <li>One-click share</li>
                <li>Exports anywhere</li>
              </ul>
            </div>
            <div className="card">
              <h3>Team workflows 🧑‍🤝‍🧑</h3>
              <p className="muted">Invite teammates, set seats, and manage access with role-based controls.</p>
              <ul className="feature" style={{paddingLeft:18}}>
                <li>Seat-based billing</li>
                <li>Org & members</li>
                <li>Customer portal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section">
        <div className="container">
          <div style={{display:"grid",gap:8,marginBottom:12}}>
            <div className="tag">Pricing</div>
            <h2 style={{margin:0}}>Simple, transparent plans</h2>
            <p className="muted" style={{margin:0}}>Start free. Upgrade when your team is ready.</p>
          </div>

          <PricingGrid portalUrl={portalUrl} />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container">
          <div className="grid cols-2">
            <div className="card">
              <h3>Talk to us</h3>
              <p className="muted">Enterprise questions, partnerships, or custom needs.</p>
              <form action="https://formspree.io/f/xayz" method="POST" className="inputs">
                <input className="input" name="name" placeholder="Your name" required />
                <input className="input" name="email" type="email" placeholder="Email address" required />
                <textarea name="message" placeholder="What can we help with?" required />
                <button className="btn primary">Send</button>
                <div className="fine">Prefer email? <a href="mailto:hello@scansnap.io">hello@scansnap.io</a></div>
              </form>
            </div>
            <div className="card">
              <h3>Why teams choose ScanSnap</h3>
              <ul className="feature" style={{paddingLeft:18}}>
                <li>Fast setup, no training required</li>
                <li>Secure by default</li>
                <li>Seat-based orgs with admin control</li>
                <li>Billing handled via Lemon Squeezy</li>
              </ul>
              <a className="btn" href={`${portalUrl}/login`}>Login to portal</a>
              <a className="btn" style={{marginLeft:8}} href="#pricing">Compare plans</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
