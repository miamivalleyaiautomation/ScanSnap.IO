import Link from ‘next/link’;

export default function LoginButton() {
return (
<Link href="/sign-in" className="btn primary">
Sign In
</Link>
);
}
