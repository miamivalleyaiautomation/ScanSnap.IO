import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "ScanSnap",
  description: "ScanSnap",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <SiteHeader />
          <main className="container">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
