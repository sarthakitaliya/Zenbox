import { MailNavbar } from "./MailNavbar";
import { Email } from "./Email";
import { useEffect } from "react";
import { useEmailStore, useAiStore, useUIStore } from "@repo/store";
import { EmailSkeleton } from "./EmailListSkeleton";
import { useParams } from "next/navigation";

export const MailList = () => {
  const { getEmails, setEmails, emails } = useEmailStore();
  const { getcategorizeInitialEmails } = useAiStore();
  const { loadingList } = useUIStore();
  const params = useParams();
  const folder = Array.isArray(params.folder) ? params.folder[0] : params.folder;

  useEffect(() => {
    console.log("Fetching emails for folder:", folder);

    const fetchEmails = async () => {
      try {
        if (emails.length > 0) {
          setEmails([]);
        }

        const freshEmails: any[] = await getEmails(folder as string);
        setEmails(freshEmails);

        // Initial categorization is best-effort and should never block inbox rendering.
        if (folder === "inbox") {
          const res = await getcategorizeInitialEmails(10);
          if (res.success) {
            const categorizedEmails: any[] = await getEmails(folder as string);
            setEmails(categorizedEmails);
          }
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
    };
    fetchEmails();
  }, [folder]);

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
            {emails.length > 0 ? (
              emails.map((email) => (
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
                  folder={folder} 
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
