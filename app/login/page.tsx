"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <SignIn path="/login" routing="path" signUpUrl="/login" />
    </div>
  );
}
