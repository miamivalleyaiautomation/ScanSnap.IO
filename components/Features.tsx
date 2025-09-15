// components/Features.tsx
export default function Features() {
  return (
    <div className="grid cols-3">
      <div className="card">
        <h3>Scan everything</h3>
        <ul className="feature" style={{ paddingLeft: 18 }}>
          <li>1D barcodes for SKUs & inventory</li>
          <li>QR Codes & DataMatrix (Pro)</li>
          <li>Laser-marked & Dot-Peen (Pro + DPMS)</li>
          <li>Auto straighten & crop</li>
          <li>Smart file names</li>
        </ul>
      </div>

      <div className="card">
        <h3>Verify against your catalog</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          Import your CSV/XLS catalog and select the columns you care about. In <strong>Verify</strong> mode we match scans to rows and keep running tallies.
        </p>
        <ul className="feature" style={{ paddingLeft: 18 }}>
          <li>Upload CSV/XLS, choose columns</li>
          <li>Instant lookups, no cloud latency</li>
          <li>Mismatch flags & counts</li>
        </ul>
      </div>

      <div className="card">
        <h3>Build perfect orders</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          Use <strong>Order Builder</strong> to assemble vendor orders or internal requests as you scan—no more manual typing or errors.
        </p>
        <ul className="feature" style={{ paddingLeft: 18 }}>
          <li>One-tap add to order</li>
          <li>Quantities from repeated scans</li>
          <li>Export orders to PDF / CSV / Excel</li>
        </ul>
      </div>

      <div className="card">
        <h3>Export anywhere</h3>
        <ul className="feature" style={{ paddingLeft: 18 }}>
          <li>PDF, CSV or Excel</li>
          <li>Clean, shareable reports</li>
          <li>Works offline</li>
        </ul>
      </div>

      <div className="card">
        <h3>On-device processing</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          No customer data uploaded. Scans, catalogs and orders are processed locally in your browser and stored on your device.
        </p>
      </div>

      <div className="card">
        <h3>Built for teams</h3>
        <ul className="feature" style={{ paddingLeft: 18 }}>
          <li>Seat-based billing</li>
          <li>Invite teammates</li>
          <li>Admin controls & member management</li>
        </ul>
      </div>
    </div>
  );
}
