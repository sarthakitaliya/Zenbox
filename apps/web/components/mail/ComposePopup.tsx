"use client";

import { useEmailStore, useUIStore } from "@repo/store";
import { Minimize2, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAiStore } from "@repo/store";

export default function ComposePopup() {
  const { composeOpen, composeMinimized, setComposeOpen, setComposeMinimized } =
    useUIStore();
  const { sendEmail } = useEmailStore();
  const { generateComposeBody } = useAiStore();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!composeOpen) return null;

  const closeCompose = () => {
    setComposeOpen(false);
    setComposeMinimized(false);
  };

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast.error("To, subject and message body are required.");
      return;
    }

    try {
      await sendEmail({
        to: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
      });
      toast.success("Email sent successfully.");
      setTo("");
      setSubject("");
      setBody("");
      setAiPrompt("");
      setAiPromptOpen(false);
      closeCompose();
    } catch (error) {
      toast.error("Failed to send email.");
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter what kind of email you want.");
      return;
    }

    setIsGenerating(true);
    const res = await generateComposeBody(aiPrompt.trim());
    setIsGenerating(false);

    if (res.success && res.data?.body) {
      const generated = res.data.body.trim();
      setBody((prev) => (prev.trim() ? `${prev}\n\n${generated}` : generated));
      setAiPromptOpen(false);
      setAiPrompt("");
      toast.success("AI draft added to compose body.");
      return;
    }

    toast.error(res.message || "Failed to generate email body.");
  };

  if (composeMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 w-[320px] rounded-t-lg border border-[#3f3f3f7a] bg-[#1A1A1A] shadow-2xl">
        <button
          type="button"
          onClick={() => setComposeMinimized(false)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-200"
        >
          <span>New Message</span>
          <X
            className="h-4 w-4 cursor-pointer text-gray-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              closeCompose();
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-[460px] overflow-hidden rounded-lg border border-[#3f3f3f7a] bg-[#1A1A1A] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#3f3f3f7a] bg-[#202020] px-3 py-2">
        <p className="text-sm font-medium text-gray-200">New Message</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setComposeMinimized(true)}
            className="rounded p-1 text-gray-400 hover:bg-[#2b2b2b] hover:text-white"
            aria-label="Minimize compose"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={closeCompose}
            className="rounded p-1 text-gray-400 hover:bg-[#2b2b2b] hover:text-white"
            aria-label="Close compose"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-b border-[#2f2f2f] px-3 py-2">
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none"
        />
      </div>

      <div className="border-b border-[#2f2f2f] px-3 py-2">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none"
        />
      </div>

      <div className="relative px-3 py-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          className="h-52 w-full resize-none bg-transparent text-sm leading-relaxed text-gray-200 placeholder-gray-500 outline-none"
        />

        {aiPromptOpen && (
          <div className="absolute bottom-3 right-3 z-10 w-[min(360px,calc(100%-1.5rem))] rounded-md border border-[#353535] bg-[#131313] p-2 shadow-xl">
            <p className="mb-1 text-xs font-medium text-gray-300">
              Tell AI what email you want
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Write a polite email for internship application."
              className="h-20 w-full resize-none rounded-md border border-[#303030] bg-[#0f0f0f] px-2 py-1.5 text-xs text-gray-200 placeholder-gray-500 outline-none"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAiPromptOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="inline-flex items-center gap-1 rounded-md bg-[#2b2b2b] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#3a3a3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#2f2f2f] px-3 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-2 rounded-md bg-[#2c5edb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3f6be0]"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
          <button
            type="button"
            onClick={() => setAiPromptOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#3a3a3a] bg-[#222222] px-3 py-2 text-xs font-medium text-gray-200 transition hover:bg-[#2d2d2d]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Assist
          </button>
        </div>
        <button
          type="button"
          onClick={closeCompose}
          className="text-xs text-gray-400 hover:text-gray-200"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
