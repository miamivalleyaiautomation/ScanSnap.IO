// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "ScanSnap",
  description:
    "Lightning-fast barcode & matrix code scanning with team workflows. Nothing leaves your device.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Dark favicon by default; ThemeToggle swaps it at runtime */}
        <link rel="icon" href="/assets/favicon_1024_dark.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
