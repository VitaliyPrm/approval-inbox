import Link from "next/link";
import { AuthForm } from "../login/auth-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Start centralizing your client approvals
          </p>
        </div>
        <AuthForm mode="signup" />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}