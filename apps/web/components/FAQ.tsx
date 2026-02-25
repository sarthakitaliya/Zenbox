const faqs = [
  {
    question: "Is Zenbox an email client replacement?",
    answer:
      "No. Zenbox is a workflow layer for Gmail that helps with organization, AI summaries, and faster replies.",
  },
  {
    question: "Do I need to create categories first?",
    answer:
      "Yes. New users are guided to setup categories before using the full mail dashboard.",
  },
  {
    question: "Can I search and filter emails together?",
    answer:
      "Yes. You can use keyword search and category filter at the same time in the inbox view.",
  },
  {
    question: "Does AI assist work for both compose and reply?",
    answer:
      "Yes. Compose supports prompt-based draft generation, and reply supports quick AI reply or custom instructions.",
  },
  {
    question: "Can I refresh emails manually?",
    answer:
      "Yes. The refresh action in the mail navbar forces a new backend fetch for the active folder.",
  },
];

export const FAQ = () => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            FAQ
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-slate-600">
            Quick answers about how Zenbox works.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-slate-200 bg-slate-50 px-5 py-4"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-slate-900">
                {item.question}
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
