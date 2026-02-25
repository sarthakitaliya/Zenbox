
"use client";

import { apiFeedback } from "@repo/api-client/apis";
import { useUserStore } from "@repo/store";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitDisabled = useMemo(
    () => submitting || !message.trim() || !email.trim() || !rating,
    [submitting, message, email, rating]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Message is required.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }
    if (!rating) {
      toast.error("Rating is required.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiFeedback.submitFeedback({
        name: name.trim() || undefined,
        email: email.trim(),
        message: message.trim(),
        rating: Number(rating),
      });

      toast.success(res.message || "Feedback submitted");
      setMessage("");
      setRating("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-5 text-white">
      <h2 className="text-2xl font-semibold mb-2">Settings</h2>
      <p className="text-sm text-gray-400 mb-5">
        Share feedback to help us improve Zenbox.
      </p>

      <section className="max-w-2xl rounded-xl border border-[#2A2A2E] bg-[#171718] p-4 md:p-5">
        <h3 className="text-lg font-medium">Submit Feedback</h3>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          This form is available only for logged-in users.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="feedback-name" className="mb-1 block text-sm text-gray-300">
              Name (optional)
            </label>
            <input
              id="feedback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full rounded-md border border-[#323238] bg-[#111112] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#4a4a52]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="feedback-email" className="mb-1 block text-sm text-gray-300">
              Email
            </label>
            <input
              id="feedback-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-md border border-[#323238] bg-[#111112] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#4a4a52]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="feedback-rating" className="mb-1 block text-sm text-gray-300">
              Rating
            </label>
            <select
              id="feedback-rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="w-full rounded-md border border-[#323238] bg-[#111112] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#4a4a52] cursor-pointer"
            >
              <option value="" disabled>
                Select rating
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div>
            <label htmlFor="feedback-message" className="mb-1 block text-sm text-gray-300">
              Message
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={1000}
              className="w-full resize-y rounded-md border border-[#323238] bg-[#111112] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#4a4a52]"
              placeholder="Share your feedback..."
            />
            <p className="mt-1 text-xs text-gray-500">{message.length}/1000</p>
          </div>

          <button
            type="submit"
            disabled={submitDisabled}
            className="inline-flex items-center rounded-md bg-[#2c5edb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3f6be0] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </section>
    </div>
  );
}
