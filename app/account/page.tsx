"use client";

import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="card">
          <UserProfile />
        </div>
      </div>
    </section>
  );
}
