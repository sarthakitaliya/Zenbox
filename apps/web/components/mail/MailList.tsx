import { MailNavbar } from "./MailNavbar";
import { Email } from "./Email";
import { useEffect, useMemo, useRef } from "react";
import { useEmailStore, useAiStore, useUIStore, useUserStore } from "@repo/store";
import { EmailSkeleton } from "./EmailListSkeleton";
import { useParams, useSearchParams } from "next/navigation";

const INITIAL_CATEGORIZATION_KEY = "zenbox:initial-categorization-attempted";

export const MailList = () => {
  const {
    getEmails,
    loadMoreEmails,
    hasMoreEmails,
    loadingMoreByFolder,
    emails,
  } = useEmailStore();
  const { getcategorizeInitialEmails } = useAiStore();
  const { user } = useUserStore();
  const { loadingList } = useUIStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const folder = Array.isArray(params.folder) ? params.folder[0] : params.folder;
  const activeFolder = folder || "inbox";
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const activeCategory = (searchParams.get("category") || "").trim();
  const isCategoryFiltered = Boolean(activeCategory);
  const hasMore = hasMoreEmails(activeFolder);
  const isLoadingMore = Boolean(loadingMoreByFolder[activeFolder]);

  const categorizationAttemptKey = `${INITIAL_CATEGORIZATION_KEY}:${user?.id || "anonymous"}`;

  useEffect(() => {
    console.log("Fetching emails for folder:", activeFolder);

    const fetchEmails = async () => {
      try {
        await getEmails(activeFolder);

        // Initial categorization is best-effort and should never block inbox rendering.
        if (
          activeFolder === "inbox" &&
          typeof window !== "undefined" &&
          window.sessionStorage.getItem(categorizationAttemptKey) !== "1"
        ) {
          const res = await getcategorizeInitialEmails(15);
          if (res?.success) {
            window.sessionStorage.setItem(categorizationAttemptKey, "1");
          }
          if (res.success && (res.data?.newlyCategorizedCount || 0) > 0) {
            await getEmails(activeFolder, { forceRefresh: true });
          }
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
    };
    fetchEmails();
  }, [activeFolder, getEmails, getcategorizeInitialEmails, categorizationAttemptKey]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    if (isCategoryFiltered || !hasMore || isLoadingMore || loadingList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          loadMoreEmails(activeFolder).catch((error) => {
            console.error("Failed to load more emails:", error);
          });
        }
      },
      {
        root: null,
        rootMargin: "120px",
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeFolder, hasMore, isLoadingMore, loadingList, loadMoreEmails, isCategoryFiltered]);

  const visibleEmails = useMemo(() => {
    const normalizedCategory = activeCategory.toLowerCase();
    const categoryScopedEmails = activeCategory
      ? emails.filter(
          (email) => (email.categoryName || "").toLowerCase() === normalizedCategory
        )
      : emails;
    if (!query) return categoryScopedEmails;

    return categoryScopedEmails.filter((email) => {
      const latest = email.latest;
      const searchableText = [
        latest?.subject,
        latest?.snippet,
        latest?.from,
        latest?.senderName,
        latest?.senderEmail,
        email.categoryName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [emails, query, activeCategory]);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10">
        <MailNavbar />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {loadingList ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <EmailSkeleton key={i} />
            ))}
          </>
        ) : (
          <div className="py-2">
            {visibleEmails.length > 0 ? (
              <>
                {visibleEmails.map((email) => (
                  <Email 
                    key={email.threadId} 
                    email={{
                      ...email,
                      latest: email.latest
                        ? {
                            ...email.latest,
                            senderEmail: email.latest.senderEmail ?? "",
                          }
                        : undefined,
                    }}
                    folder={activeFolder}
                  />
                ))}
                {!isCategoryFiltered && <div ref={loadMoreRef} className="h-1" />}
                {!isCategoryFiltered && isLoadingMore && (
                  <div className="py-3 text-center text-xs text-gray-500">
                    Loading more emails...
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500">No emails found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
