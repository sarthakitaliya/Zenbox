"use client"

import { features } from '@/utils/features'

export const Features = () => {
  return (
    <section id="features" className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Features</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Built for focused email workflows
          </h2>
          <p className="mt-4 text-slate-600">
            Essential tools only, designed to reduce clutter and help you triage faster.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:bg-slate-100">
              <feature.icon className="mb-4 h-5 w-5 text-slate-700" />
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
