"use client"

import Link from 'next/link'

export const CTA = () => {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Start now</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Ready to organize your inbox?
              </h2>
              <p className="text-slate-600">
                Connect Gmail, define your categories, and let Zenbox keep your inbox structured from day one.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/auth/signin"
                className="rounded-md bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-700"
              >
                Continue with Google
              </Link>
              <a
                href="#features"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                View features
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
