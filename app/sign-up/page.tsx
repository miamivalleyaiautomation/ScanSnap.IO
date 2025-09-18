import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ScanSnap</h1>
          </Link>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Create your account</p>
        </div>
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}