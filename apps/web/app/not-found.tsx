import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#111112] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#2A2A2E] bg-[#171718] p-8 text-center shadow-xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg border border-[#34343a] bg-[#1A1A1D] px-4 py-2 text-sm hover:bg-[#222226]"
          >
            Go to Home
          </Link>
          <Link
            href="/mail/inbox"
            className="rounded-lg bg-[#3a69ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a78ff]"
          >
            Go to Inbox
          </Link>
        </div>
      </div>
    </main>
  );
}
