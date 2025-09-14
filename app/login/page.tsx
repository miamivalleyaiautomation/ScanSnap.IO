// app/login/page.tsx
"use client";
import { SignIn } from "@clerk/nextjs";
export default function LoginPage() {
  return <div style={{ maxWidth:420, margin:"40px auto" }}><SignIn path="/login" routing="path" signUpUrl="/login" /></div>;
}

// app/account/page.tsx
"use client";
import { UserProfile } from "@clerk/nextjs";
export default function AccountPage() {
  return <section className="section"><div className="container"><div className="card"><UserProfile /></div></div></section>;
}

// app/org/page.tsx
"use client";
import { OrganizationProfile } from "@clerk/nextjs";
export default function OrgPage() {
  return <section className="section"><div className="container"><div className="card"><OrganizationProfile /></div></div></section>;
}
