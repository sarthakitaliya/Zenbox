import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <h2 className="text-center text-2xl font-semibold tracking-tight text-red-600">
              Authentication Error
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              {error || "An error occurred during authentication"}
            </p>
          </div>
          <div className="space-y-2">
            <Link
              href="/auth/signin"
              className="group relative flex w-full justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="group relative flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
  );
}
