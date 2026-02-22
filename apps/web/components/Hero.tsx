"use client"

import Link from 'next/link'

export const Hero = () => {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-600">
            AI Gmail workflow assistant
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Organize Gmail faster with AI-powered inbox workflows.
          </h1>

          <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Zenbox helps you set categories, auto-classify emails, summarize long threads, and generate compose/reply drafts so triage stays quick and clean.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signin"
              className="rounded-md bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Sign in with Google
            </Link>
            <a
              href="#features"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Explore features
            </a>
          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Inbox preview</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Synced</span>
          </div>

          <div className="space-y-3">
            {[
              { sender: 'Google', subject: 'Security alert', label: 'Other' },
              { sender: 'Stripe', subject: 'Payment received', label: 'Finance' },
              { sender: 'GitHub', subject: 'Pull request review', label: 'Work' },
              { sender: 'Notion', subject: 'Weekly digest', label: 'Starred' }
            ].map((item) => (
              <div key={item.sender + item.subject} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{item.sender}</p>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.label}</span>
                </div>
                <p className="text-sm text-slate-600">{item.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
