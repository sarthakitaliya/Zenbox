import { useEmailStore, useUIStore } from "@repo/store";
import { Archive, Reply, Send, Sparkles, Star, Trash2, X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NoEmailSelected } from "./NoEmailSelected";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { toast } from "sonner";
import { useAiStore } from "@repo/store";

const formatSummaryText = (text: string) => {
  if (!text) return "";

  const lines = text
    .split("\n")
    .map((line) =>
      line
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/^#{1,6}\s*/, "")
        .replace(/^\s*[-*]\s+/, "• ")
        .trimEnd()
    );

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const parseRgb = (value: string): [number, number, number] | null => {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

const getLuminance = ([r, g, b]: [number, number, number]) => {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const getContrastRatio = (
  foreground: [number, number, number],
  background: [number, number, number]
) => {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const getEffectiveBg = (el: HTMLElement): [number, number, number] => {
  let node: HTMLElement | null = el;
  while (node) {
    const rgb = parseRgb(window.getComputedStyle(node).backgroundColor);
    if (rgb) {
      const alphaMatch = window
        .getComputedStyle(node)
        .backgroundColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([0-9.]+)\)/i);
      const alpha = alphaMatch ? Number(alphaMatch[1]) : 1;
      if (alpha > 0) return rgb;
    }
    node = node.parentElement;
  }
  return [26, 26, 26];
};

const fixEmailContrast = (root: HTMLElement | null) => {
  if (!root) return;

  const targets = root.querySelectorAll<HTMLElement>(
    "p, span, div, li, td, th, h1, h2, h3, h4, h5, h6, a"
  );

  targets.forEach((el) => {
    if (!el.textContent?.trim()) return;

    const color = parseRgb(window.getComputedStyle(el).color);
    if (!color) return;
    const bg = getEffectiveBg(el);
    const contrast = getContrastRatio(color, bg);
    if (contrast >= 3) return;

    const bgIsLight = getLuminance(bg) > 0.5;
    if (el.tagName.toLowerCase() === "a") {
      el.style.color = bgIsLight ? "#1d4ed8" : "#93c5fd";
    } else {
      el.style.color = bgIsLight ? "#111827" : "#e5e7eb";
    }
  });
};

export const MailDetail = () => {
  const {
    selectedThread,
    getFullEmail,
    setSelectedThread,
    archiveThread,
    trashThread,
    starThread,
    unstarThread,
    getEmails,
  } = useEmailStore();
  const { summarizeEmail, summariesByThread, summaryLoadingByThread } = useAiStore();
  const { isSmallScreen, setShowMailList } = useUIStore();
  console.log(selectedThread, "selectedThread in MailDetail");
  const searchParams = useSearchParams();
  const params = useParams();
  const activeFolder = Array.isArray(params.folder) ? params.folder[0] : params.folder;
  const mailId = searchParams.get("threadId");
  const router = useRouter();

  const [openMessageIndex, setOpenMessageIndex] = useState<number>(-1);

  useEffect(() => {
    if (mailId && selectedThread?.threadId !== mailId) {
      getFullEmail(mailId).then((email) => {
        console.log("Fetched full email:", email);
      });
    } else if (!mailId) {
      setSelectedThread(null);
    }
  }, [mailId]);

  useEffect(() => {
    if (selectedThread?.messages?.length) {
      setOpenMessageIndex(selectedThread.messages.length - 1);
    }
  }, [selectedThread]);

  useEffect(() => {
    const roots = document.querySelectorAll<HTMLElement>(".email-html-body");
    roots.forEach((root) => fixEmailContrast(root));
  }, [selectedThread?.threadId, openMessageIndex]);

  const handleCloseEmailDetail = () => {
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const qs = new URLSearchParams();
    if (isSmallScreen) {
      setShowMailList(true);
    }

    if (category) {
      qs.set("category", category);
    }
    if (query) {
      qs.set("q", query);
    }

    router.push(qs.toString() ? `/mail/inbox?${qs.toString()}` : "/mail/inbox");
    setSelectedThread(null);
  };
  const iconData = CATEGORY_ICONS[selectedThread?.categoryIcon ?? ""];

  if (isSmallScreen && !selectedThread) {
    return null;
  }

  const handleArchiveThread = async () => {
    if (selectedThread) {
      const isArchived = selectedThread.messages[0].labelIds?.includes("INBOX");
      toast.promise(archiveThread(selectedThread.threadId), {
        loading: "loading...",
        success: () => {
          handleCloseEmailDetail();
          return isArchived
            ? "Already archived"
            : "Thread archived successfully!";
        },
        error: "Failed to archive thread.",
      });
    }
  };
  const handleTrashThread = async () => {
    if (selectedThread) {
      toast.promise(trashThread(selectedThread.threadId), {
        loading: "Trashing thread...",
        success: () => {
          handleCloseEmailDetail();
          return "Thread trashed successfully!";
        },
        error: "Failed to trash thread.",
      });
    }
  };
  const handleStarThread = async () => {
    if (selectedThread) {
      const isStarred =
        selectedThread.messages[0].labelIds?.includes("STARRED");

      toast.promise(
        isStarred
          ? unstarThread(selectedThread.threadId)
          : starThread(selectedThread.threadId),
        {
          loading: isStarred ? "Unstarring thread..." : "Starring thread...",
          success: () => {
            setSelectedThread({
              ...selectedThread,
              messages: selectedThread.messages.map((msg, i) =>
                i === 0
                  ? {
                      ...msg,
                      labelIds: isStarred
                        ? msg.labelIds?.filter((label) => label !== "STARRED")
                        : [...(msg.labelIds || []), "STARRED"],
                    }
                  : msg
              ),
            });

            if (isStarred && activeFolder === "starred") {
              getEmails("starred", { forceRefresh: true });
            }

            return isStarred
              ? "Thread unstarred successfully!"
              : "Thread starred successfully!";
          },
          error: "Failed to toggle star on thread.",
        }
      );
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedThread) return;

    const threadId = selectedThread.threadId;
    const subject = selectedThread.subject || "No subject";
    const body =
      selectedThread.messages
        ?.map((msg) => msg.body?.content || "")
        .join("\n\n")
        .trim() || "";

    if (!body) {
      toast.error("No email content available to summarize.");
      return;
    }

    const res = await summarizeEmail(threadId, subject, body);

    if (res.success && res.data?.summary) {
      toast.success("Summary generated");
    } else {
      toast.error(res.message || "Failed to generate summary.");
    }
  };

  const currentThreadId = selectedThread?.threadId || "";
  const summary = currentThreadId ? summariesByThread[currentThreadId] : "";
  const isSummarizing = currentThreadId
    ? Boolean(summaryLoadingByThread[currentThreadId])
    : false;
  const formattedSummary = useMemo(() => formatSummaryText(summary), [summary]);

  return (
    <div className="flex flex-col h-full">
      {selectedThread ? (
        <>
          <div className="sticky top-0 z-10 bg-[#1A1A1A]">
            <div className="flex items-center justify-between p-3 border-b border-[#3f3f3f7a]">
              <div
                className="cursor-pointer text-gray-400 hover:bg-gray-700 rounded p-1"
                onClick={handleCloseEmailDetail}
              >
                <X size={18} />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-[#313131] p-1 rounded-lg items-center gap-1.5 px-2 cursor-pointer hover:bg-gray-700">
                  <Reply size={16} className="text-gray-400" />
                  <p className="text-gray-300 text-sm">Reply</p>
                </div>
                <div className="cursor-pointer text-gray-400 hover:bg-gray-700 rounded p-2">
                  {selectedThread?.messages[0].labelIds?.includes("STARRED") ? (
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                      onClick={handleStarThread}
                    />
                  ) : (
                    <Star
                      size={16}
                      className="text-gray-400"
                      onClick={handleStarThread}
                    />
                  )}
                </div>
                <div className="cursor-pointer text-gray-400 hover:bg-gray-700 rounded p-2">
                  <Archive
                    size={16}
                    className="text-gray-400"
                    onClick={handleArchiveThread}
                  />
                </div>
                <div className="cursor-pointer text-gray-400 hover:bg-gray-700 rounded p-2">
                  <Trash2
                    size={16}
                    className="text-red-500"
                    onClick={handleTrashThread}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-custom">
            <div className="p-4 space-y-5">
              {summary && (
                <div className="rounded-lg border border-[#3f3f3f7a] bg-[#161616] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    AI Summary
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                    {formattedSummary}
                  </p>
                </div>
              )}
              <div className="text-xl font-semibold text-white pb-5 border-b border-[#3f3f3f7a] space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate">{selectedThread.subject}</span>
                    {selectedThread.messageCount > 1 && (
                      <span className="text-sm text-gray-500">
                        [{selectedThread.messageCount}]
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isSummarizing}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#3f3f3f7a] bg-[#242424] px-2.5 py-1 text-xs font-medium text-gray-200 transition hover:bg-[#2f2f2f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isSummarizing ? "Generating..." : "Generate Summary"}
                  </button>
                </div>
                {iconData && (
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${iconData.bg}`}
                  >
                    <iconData.icon className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
              {selectedThread.messages.map((email, index) => (
                <div
                  key={email.id}
                  className="border-b border-[#3f3f3f7a] pb-4"
                >
                  <div
                    className="cursor-pointer flex items-center justify-between rounded-lg"
                    onClick={() =>
                      setOpenMessageIndex(
                        index === openMessageIndex ? -1 : index
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold uppercase">
                        {email.senderName?.charAt(0) ?? "?"}
                      </div>
                      <div className="text-white font-medium">
                        {email.senderName || email.from}
                        <p className="text-sm text-gray-500">To: You</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {email.date ?? ""}
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {openMessageIndex === index && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="email-html-body mt-3 overflow-x-auto px-2 text-sm leading-relaxed text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: email.body?.content ?? "",
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <NoEmailSelected />
      )}
    </div>
  );
};
