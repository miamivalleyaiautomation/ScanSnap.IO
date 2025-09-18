// app/sign-up/page.tsx
import Link from “next/link”;
import { SignUp } from “@clerk/nextjs”;

export default function SignUpPage() {
return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
<div className="w-full max-w-md">
{/* Header with Logo */}
<div className="text-center mb-8">
<Link href="/" className="inline-block">
<div className="flex items-center justify-center gap-3 mb-4">
<img 
src="/assets/favicon_1024_light.png" 
alt="ScanSnap" 
className="w-10 h-10 dark:hidden"
/>
<img 
src="/assets/favicon_1024_dark.png" 
alt="ScanSnap" 
className="w-10 h-10 hidden dark:block"
/>
<img 
src="/assets/text_1024_light.png" 
alt="ScanSnap" 
className="h-8 dark:hidden"
/>
<img 
src="/assets/text_1024_dark.png" 
alt="ScanSnap" 
className="h-8 hidden dark:block"
/>
</div>
</Link>
<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
Get Started
</h1>
<p className="text-gray-600 dark:text-gray-400">
Create your ScanSnap account
</p>
</div>

```
    {/* Clerk Sign Up Component */}
    <div className="glass p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
      <SignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#00d1ff",
            colorTextOnPrimaryBackground: "#ffffff",
            borderRadius: "12px"
          },
          elements: {
            card: {
              background: "transparent",
              border: "none",
              boxShadow: "none",
            },
            headerTitle: {
              display: "none"
            },
            headerSubtitle: {
              display: "none"
            },
            socialButtonsBlockButton: {
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "inherit",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.15)"
              }
            },
            formButtonPrimary: {
              background: "linear-gradient(135deg, #00d1ff, #4a90e2)",
              color: "#ffffff",
              "&:hover": {
                background: "linear-gradient(135deg, #00b8e6, #3a7bc8)"
              }
            },
            formFieldInput: {
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "&:focus": {
                border: "1px solid #00d1ff"
              }
            }
          }
        }}
      />
    </div>

    {/* Footer Links */}
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link 
          href="/sign-in" 
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
        >
          Sign in here
        </Link>
      </p>
      <Link 
        href="/" 
        className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Back to home
      </Link>
    </div>
  </div>
</div>
```

);
}
