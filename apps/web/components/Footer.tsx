"use client"

import Link from 'next/link'
import { BsGithub } from 'react-icons/bs'

export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5 text-sm text-slate-600">
            <Link
              href="https://github.com/sarthakitaliya/Zynbox"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-slate-900"
            >
              <BsGithub className="h-4 w-4" />
              GitHub Repo
            </Link>
          </div>
        </div>
        <div className="pt-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Zenbox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
