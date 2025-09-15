export const metadata = {
  title: "ScanSnap",
  description: "Fast document scanning and AI workspace",
};

import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <header className="site-header">
          <div className="container header-row header-3col">
            {/* LEFT ICON */}
            <a className="brand-left" href="/" aria-label="ScanSnap home">
              <img className="mark mark-light" src="/assets/favicon_1024_dark.png"  alt="" width={42} height={42} />
              <img className="mark mark-dark"  src="/assets/favicon_1024_light.png" alt="" width={42} height={42} />
            </a>

            {/* CENTER WORDMARK */}
            <a className="brand-center" href="/" aria-label="ScanSnap">
              <img className="word word-light" src="/assets/text_1024_dark.png"  alt="ScanSnap" />
              <img className="word word-dark"  src="/assets/text_1024_light.png" alt="ScanSnap" />
            </a>

            {/* RIGHT HAMBURGER + THEME handled by SiteHeader */}
            <SiteHeader />
          </div>
        </header>

        <main>{children}</main>
        <footer className="site container">
          <div className="foot-grid">
            <div>
              <div className="brand-row">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <img className="mark mark-light" src="/assets/favicon_1024_dark.png"  alt="" width={22} height={22}/>
                  <img className="mark mark-dark"  src="/assets/favicon_1024_light.png" alt="" width={22} height={22}/>
                  <img className="word word-light" src="/assets/text_1024_dark.png"  alt="ScanSnap" style={{height:18}}/>
                  <img className="word word-dark"  src="/assets/text_1024_light.png" alt="ScanSnap" style={{height:18}}/>
                </div>
                <p className="muted">© {new Date().getFullYear()} ScanSnap. All rights reserved.</p>
              </div>
            </div>
            <div>
              <h4>Product</h4>
              <div className="grid">
                <a className="link" href="#features">Features</a>
                <a className="link" href="#pricing">Pricing</a>
                <a className="link" href="https://app.scansnap.io/app">Go to App</a>
              </div>
            </div>
            <div>
              <h4>Company</h4>
              <div className="grid">
                <a className="link" href="#contact">Contact</a>
                <a className="link" href="mailto:hello@scansnap.io">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
