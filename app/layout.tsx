import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "ScanSnap",
  description: "Fast, accurate scanning. Nothing leaves your device."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/assets/favicon_1024_light.png" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}