"use client";

import { OrganizationProfile } from "@clerk/nextjs";

export default function OrgPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="card">
          <OrganizationProfile />
        </div>
      </div>
    </section>
  );
}
