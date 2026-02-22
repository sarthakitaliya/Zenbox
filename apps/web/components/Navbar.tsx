"use client"

import Link from 'next/link'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white">
            Z
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">Zenbox</span>
        </Link>
      </div>
    </header>
  )
}
