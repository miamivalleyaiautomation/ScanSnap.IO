"use client";
import { useRef, useState } from "react";


type Plan = "basic" | "plus" | "pro" | "pro-dpms";


type Props = { plan: Plan; label?: string };


export default function BuyButton({ plan, label = "Choose" }: Props) {
const aRef = useRef<HTMLAnchorElement>(null);
const [busy, setBusy] = useState(false);


async function onClick() {
try {
setBusy(true);
// Ensure lemon.js present for overlay
if (!document.querySelector('script[src*="lemonsqueezy.com/js/lemon.js"]')) {
const s = document.createElement("script");
s.src = "https://app.lemonsqueezy.com/js/lemon.js";
s.async = true;
document.head.appendChild(s);
await new Promise((r) => { s.onload = () => r(null); setTimeout(r, 800); });
}


const res = await fetch("/api/ls/create-checkout", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ plan }),
});
const data = await res.json();
if (!res.ok) throw new Error(data?.error || "Checkout failed");


const el = aRef.current!;
el.href = data.url;
el.click(); // lemon.js hijacks anchor for overlay
} catch (e: any) {
alert(e.message || String(e));
} finally {
setBusy(false);
}
}


return (
<>
<script async src="https://app.lemonsqueezy.com/js/lemon.js" />
<a ref={aRef} className="lemonsqueezy-button" href="#" style={{ display: "none" }} />
<button className="btn primary" onClick={onClick} disabled={busy}>
{busy ? "Loading…" : label}
</button>
</>
);
}
