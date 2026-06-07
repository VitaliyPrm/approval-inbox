import { AuthForm } from "./auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to Approval Inbox
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}