import { MailNavbar } from "./MailNavbar";
import { Email } from "./Email";
import { useEffect, useMemo } from "react";
import { useEmailStore, useAiStore, useUIStore } from "@repo/store";
import { EmailSkeleton } from "./EmailListSkeleton";
import { useParams, useSearchParams } from "next/navigation";

const INITIAL_CATEGORIZATION_KEY = "zenbox:initial-categorization-attempted";

export const MailList = () => {
  const { getEmails, emails } = useEmailStore();
  const { getcategorizeInitialEmails } = useAiStore();
  const { loadingList } = useUIStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const folder = Array.isArray(params.folder) ? params.folder[0] : params.folder;
  const activeFolder = folder || "inbox";
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    console.log("Fetching emails for folder:", activeFolder);

    const fetchEmails = async () => {
      try {
        await getEmails(activeFolder);

        // Initial categorization is best-effort and should never block inbox rendering.
        if (
          activeFolder === "inbox" &&
          typeof window !== "undefined" &&
          window.sessionStorage.getItem(INITIAL_CATEGORIZATION_KEY) !== "1"
        ) {
          window.sessionStorage.setItem(INITIAL_CATEGORIZATION_KEY, "1");
          const res = await getcategorizeInitialEmails(10);
          if (res.success && (res.data?.newlyCategorizedCount || 0) > 0) {
            await getEmails(activeFolder, { forceRefresh: true });
          }
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
    };
    fetchEmails();
  }, [activeFolder, getEmails, getcategorizeInitialEmails]);

  const visibleEmails = useMemo(() => {
    if (!query) return emails;

    return emails.filter((email) => {
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
  }, [emails, query]);

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
              visibleEmails.map((email) => (
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
              ))
            ) : (
              <div className="text-center text-gray-500">No emails found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
