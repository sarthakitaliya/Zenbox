import { useEmailStore, useUIStore, useUserStore } from "@repo/store";
import { Archive, ChevronDown, Download, Reply, Send, Sparkles, Star, Trash2, X } from "lucide-react";
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

const stripHtml = (html: string) =>
  html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildEmailSrcDoc = (content: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src data: https: http:; style-src 'unsafe-inline' https: http: data:; font-src data: https: http:; media-src data: https: http:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';"
    />
    <style>
      html, body { margin: 0; padding: 0; }
      img { max-width: 100%; height: auto; }
      table { max-width: 100%; }
      body { overflow-wrap: anywhere; }
    </style>
  </head>
  <body>${content}</body>
</html>`;

const extractEmails = (value?: string) => {
  if (!value) return [];
  const matches = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
  if (matches && matches.length > 0) return matches.map((email) => email.toLowerCase());
  return [value.toLowerCase().trim()];
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
    emailsByFolder,
    archiveThread,
    unarchiveThread,
    trashThread,
    starThread,
    unstarThread,
    getEmails,
    downloadAttachment,
  } = useEmailStore();
  const { user } = useUserStore();
  const { summarizeEmail, summariesByThread, summaryLoadingByThread } = useAiStore();
  const {
    isSmallScreen,
    setShowMailList,
    setComposeOpen,
    setComposeMinimized,
    setComposeDraft,
  } = useUIStore();
  console.log(selectedThread, "selectedThread in MailDetail");
  const searchParams = useSearchParams();
  const params = useParams();
  const activeFolder = Array.isArray(params.folder) ? params.folder[0] : params.folder;
  const mailId = searchParams.get("threadId");
  const router = useRouter();

  const [openMessageIndex, setOpenMessageIndex] = useState<number>(-1);
  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<string | null>(null);
  const [openDetailsMessageId, setOpenDetailsMessageId] = useState<string | null>(null);

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
    setOpenDetailsMessageId(null);
  }, [selectedThread?.threadId, openMessageIndex]);

  useEffect(() => {
    const run = () => {
      const roots = document.querySelectorAll<HTMLElement>(".email-html-body");
      roots.forEach((root) => fixEmailContrast(root));
    };

    run();
    const rafId = window.requestAnimationFrame(run);
    const timeoutId = window.setTimeout(run, 120);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
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

    const targetFolder = activeFolder || "inbox";
    router.push(
      qs.toString() ? `/mail/${targetFolder}?${qs.toString()}` : `/mail/${targetFolder}`
    );
    setSelectedThread(null);
  };
  const iconData = CATEGORY_ICONS[selectedThread?.categoryIcon ?? ""];

  const handleArchiveThread = async () => {
    if (selectedThread) {
      const alreadyArchived = !selectedThread.messages[0].labelIds?.includes("INBOX");

      if (alreadyArchived) {
        toast.promise(unarchiveThread(selectedThread.threadId), {
          loading: "Unarchiving thread...",
          success: () => {
            handleCloseEmailDetail();
            return "Thread unarchived successfully!";
          },
          error: "Failed to unarchive thread.",
        });
        return;
      }

      toast.promise(archiveThread(selectedThread.threadId), {
        loading: "Archiving thread...",
        success: () => {
          handleCloseEmailDetail();
          return "Thread archived successfully!";
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

  const handleReplyClick = () => {
    if (!selectedThread) return;

    const currentUserEmail = user?.email?.toLowerCase().trim() || "";
    const nonSelfMessages = selectedThread.messages.filter((msg) => {
      const sender = msg.senderEmail?.toLowerCase().trim();
      return sender && sender !== currentUserEmail;
    });

    const latestIncomingMessage =
      nonSelfMessages[nonSelfMessages.length - 1] ||
      selectedThread.messages[selectedThread.messages.length - 1] ||
      selectedThread.messages[0];

    const to =
      latestIncomingMessage?.senderEmail ||
      latestIncomingMessage?.from ||
      "";
    const subject = selectedThread.subject?.toLowerCase().startsWith("re:")
      ? selectedThread.subject
      : `Re: ${selectedThread.subject}`;

    const originalBodyRaw = latestIncomingMessage?.body?.content || "";
    const originalBody =
      stripHtml(originalBodyRaw).slice(0, 4000) ||
      latestIncomingMessage?.snippet ||
      "";

    setComposeDraft({
      to,
      subject,
      body: "",
      threadId: selectedThread.threadId,
      replyContext: {
        originalSubject: selectedThread.subject || "No subject",
        originalBody,
        recipientName: latestIncomingMessage?.senderName || "",
        recipientEmail: latestIncomingMessage?.senderEmail || "",
      },
    });
    setComposeOpen(true);
    setComposeMinimized(false);
  };

  const formatAttachmentSize = (size: number) => {
    if (!size || size <= 0) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownloadAttachment = async (params: {
    messageId: string;
    attachmentId: string;
    filename: string;
    mimeType: string;
  }) => {
    const downloadKey = `${params.messageId}:${params.attachmentId}`;

    try {
      setDownloadingAttachmentId(downloadKey);
      const blob = await downloadAttachment(params);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = params.filename || "attachment";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download attachment");
    } finally {
      setDownloadingAttachmentId(null);
    }
  };

  const currentThreadId = selectedThread?.threadId || "";
  const summary = currentThreadId ? summariesByThread[currentThreadId] : "";
  const isSummarizing = currentThreadId
    ? Boolean(summaryLoadingByThread[currentThreadId])
    : false;
  const isThreadArchived = Boolean(
    selectedThread && !selectedThread.messages[0].labelIds?.includes("INBOX")
  );
  const formattedSummary = useMemo(() => formatSummaryText(summary), [summary]);
  const categoryTooltipLabel = useMemo(() => {
    if (selectedThread?.categoryName) return selectedThread.categoryName;
    if (!selectedThread?.threadId) return "Category";

    for (const list of Object.values(emailsByFolder)) {
      const found = list.find((email) => email.threadId === selectedThread.threadId);
      if (found?.categoryName) return found.categoryName;
    }

    return "Category";
  }, [selectedThread?.categoryName, selectedThread?.threadId, emailsByFolder]);
  const currentUserEmail = (user?.email || "").toLowerCase().trim();

  if (isSmallScreen && !selectedThread) {
    return null;
  }

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
                <button
                  type="button"
                  onClick={handleReplyClick}
                  className="flex bg-[#313131] p-1 rounded-lg items-center gap-1.5 px-2 cursor-pointer hover:bg-gray-700"
                >
                  <Reply size={16} className="text-gray-400" />
                  <p className="text-gray-300 text-sm">Reply</p>
                </button>
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
                    className={
                      isThreadArchived
                        ? "text-emerald-400 fill-emerald-400"
                        : "text-gray-400"
                    }
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
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#3f3f3f7a] bg-[#242424] px-2.5 py-1 text-xs font-medium text-gray-200 transition hover:bg-[#2f2f2f] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isSummarizing ? "Generating..." : "Generate Summary"}
                  </button>
                </div>
                {iconData && (
                  <span className="group relative inline-flex">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${iconData.bg}`}
                      title={categoryTooltipLabel}
                    >
                      <iconData.icon className="w-3 h-3 text-white" />
                    </span>
                    <span className="pointer-events-none absolute left-0 top-7 z-20 w-max max-w-56 rounded bg-[#2a2a2a] px-2 py-1 text-[11px] font-medium leading-tight text-gray-100 opacity-0 shadow transition group-hover:opacity-100 whitespace-normal break-words">
                      {categoryTooltipLabel}
                    </span>
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
                      <div className="min-w-0 text-white">
                        <p className="truncate font-medium">
                          {email.senderName || email.from}
                          {email.senderEmail && (
                            <span className="ml-2 text-sm font-normal text-gray-400">
                              {email.senderEmail}
                            </span>
                          )}
                        </p>
                        <div
                          className="relative mt-0.5 flex items-center gap-1 text-xs text-gray-500"
                          onMouseEnter={() => setOpenDetailsMessageId(email.id)}
                          onMouseLeave={() => setOpenDetailsMessageId(null)}
                        >
                          <span className="truncate">
                            To:{" "}
                            {extractEmails(email.to).includes(currentUserEmail)
                              ? "me"
                              : email.to || "You"}
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenDetailsMessageId((prev) =>
                                prev === email.id ? null : email.id
                              );
                            }}
                            className="rounded p-0.5 text-gray-400 transition hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer"
                            aria-label="Show message details"
                          >
                            <ChevronDown size={12} />
                          </button>
                          {openDetailsMessageId === email.id && (
                            <div className="absolute left-0 top-6 z-20 w-[320px] max-w-[80vw] rounded-lg border border-[#2f2f2f] bg-[#141414] p-3 text-xs text-gray-300 shadow-xl">
                              <p className="truncate">
                                <span className="text-gray-500">From:</span>{" "}
                                {email.from || email.senderEmail || "-"}
                              </p>
                              <p className="truncate">
                                <span className="text-gray-500">To:</span> {email.to || "-"}
                              </p>
                              {email.cc && (
                                <p className="truncate">
                                  <span className="text-gray-500">Cc:</span> {email.cc}
                                </p>
                              )}
                              {email.bcc && (
                                <p className="truncate">
                                  <span className="text-gray-500">Bcc:</span> {email.bcc}
                                </p>
                              )}
                              {email.replyTo && (
                                <p className="truncate">
                                  <span className="text-gray-500">Reply-To:</span> {email.replyTo}
                                </p>
                              )}
                              <p className="truncate">
                                <span className="text-gray-500">Date:</span>{" "}
                                {email.dateTime || email.date || "-"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <p>{email.date ?? ""}</p>
                      {email.dateTime && (
                        <p className="text-xs text-gray-500">{email.dateTime}</p>
                      )}
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
                      >
                        {(() => {
                          const bodyContent = email.body?.content ?? "";
                          const bodyType = (email.body as { type?: string; contentType?: string } | undefined)
                            ?.type || (email.body as { type?: string; contentType?: string } | undefined)?.contentType;
                          const isHtmlBody =
                            bodyType === "html" ||
                            /<\/?(html|body|table|tr|td|div|span|p|img|a)\b/i.test(bodyContent);

                          if (isHtmlBody) {
                            return (
                              <div className="mt-3 overflow-hidden rounded-md border border-[#2b2b2f] bg-white">
                                <iframe
                                  title={`email-content-${email.id}`}
                                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                                  className="h-[70vh] min-h-[420px] w-full bg-white"
                                  srcDoc={buildEmailSrcDoc(bodyContent)}
                                />
                              </div>
                            );
                          }

                          return (
                            <div
                              className="email-html-body mt-3 overflow-x-auto px-2 text-sm leading-relaxed text-gray-200"
                              ref={(node) => {
                                if (node) {
                                  fixEmailContrast(node);
                                }
                              }}
                              dangerouslySetInnerHTML={{
                                __html: bodyContent,
                              }}
                            />
                          );
                        })()}
                        {email.attachments && email.attachments.length > 0 && (
                          <div className="mt-4 rounded-lg border border-[#3f3f3f7a] bg-[#151515] p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Attachments ({email.attachments.length})
                            </p>
                            <div className="space-y-2">
                              {email.attachments.map((attachment) => {
                                const downloadKey = `${email.id}:${attachment.attachmentId}`;
                                const isDownloading =
                                  downloadingAttachmentId === downloadKey;

                                return (
                                  <div
                                    key={downloadKey}
                                    className="flex items-center justify-between rounded-md border border-[#2f2f2f] bg-[#1a1a1a] px-3 py-2"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm text-gray-200">
                                        {attachment.filename}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {attachment.mimeType}
                                        {attachment.size
                                          ? ` • ${formatAttachmentSize(attachment.size)}`
                                          : ""}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDownloadAttachment({
                                          messageId: email.id,
                                          attachmentId: attachment.attachmentId,
                                          filename: attachment.filename,
                                          mimeType: attachment.mimeType,
                                        })
                                      }
                                      disabled={isDownloading}
                                      className="inline-flex items-center gap-1.5 rounded-md border border-[#3a3a3a] bg-[#222222] px-2.5 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      {isDownloading ? "Downloading..." : "Download"}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
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
