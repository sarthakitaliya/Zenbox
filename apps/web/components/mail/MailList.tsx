import { ParamValue } from "next/dist/server/request/params";
import { MailNavbar } from "./MailNavbar";
import { Email } from "./Email";
import { useEffect } from "react";
import { useEmailStore, useAiStore, useUIStore } from "@repo/store";
import { EmailSkeleton } from "./EmailListSkeleton";
import { useParams } from "next/navigation";

const dummyEmails = [
  {
    id: "1",
    sender: "Netflix",
    email: "no-reply@netflix.com",
    avatar: "https://i.pravatar.cc/150?img=11",
    subject: "Your Netflix temporary access code",
    preview: "Here's your one-time code to sign in...",
    content:
      "Hi there,\n\nYour temporary access code is: 123456\n\nThanks for using Netflix.",
    date: "2025-06-01",
    category: "Entertainment",
    starred: true,
    read: false,
  },
  {
    id: "2",
    sender: "Amazon",
    email: "order-update@amazon.in",
    avatar: "https://i.pravatar.cc/150?img=24",
    subject: "Your order has been shipped!",
    preview: "Your order #123-4567890-0000 has been shipped...",
    content:
      "Hello,\n\nYour Amazon order has been shipped and will arrive soon.\n\nThanks for shopping with us.",
    date: "2025-06-02",
    category: "Shopping",
    starred: false,
    read: true,
  },
  {
    id: "3",
    sender: "LinkedIn",
    email: "jobs@linkedin.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    subject: "New job opportunities for you",
    preview: "Based on your profile, here are some jobs you might like...",
    content:
      "Hi Sarthak,\n\nWe found new job matches for you. Click to explore.",
    date: "2025-05-31",
    category: "Work",
    starred: false,
    read: false,
  },
  {
    id: "4",
    sender: "IRCTC",
    email: "ticket@irctc.co.in",
    avatar: "https://i.pravatar.cc/150?img=40",
    subject: "Your Train Ticket is Confirmed",
    preview: "PNR: 4567891230, Train No: 22905...",
    content:
      "Dear Sarthak,\n\nYour train ticket from Surat to Mumbai has been confirmed. Have a safe journey!",
    date: "2025-05-28",
    category: "Travel",
    starred: true,
    read: true,
  },
  {
    id: "5",
    sender: "Axis Bank",
    email: "alerts@axisbank.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    subject: "Your Statement is Ready",
    preview: "Download your credit card statement for May 2025...",
    content:
      "Dear Customer,\n\nYour credit card statement for May 2025 is now available.\n\nPlease login to view/download.",
    date: "2025-06-01",
    category: "Finance",
    starred: false,
    read: true,
  },
  {
    id: "6",
    sender: "Spotify",
    email: "no-reply@spotify.com",
    avatar: "https://i.pravatar.cc/150?img=18",
    subject: "Your subscription has been renewed",
    preview: "Thank you for staying with Spotify Premium...",
    content:
      "Hi Sarthak,\n\nYour Spotify Premium plan has been successfully renewed.",
    date: "2025-05-30",
    category: "Entertainment",
    starred: true,
    read: false,
  },
];

export const MailList = () => {
  const { getEmails, setEmails, emails } = useEmailStore();
  const { getcategorizeInitialEmails } = useAiStore();
  const { loadingList } = useUIStore();
  const params = useParams();
  const folder = params.folder;
  useEffect(() => {
    console.log("Fetching emails for folder:", folder);

    const fetchEmails = async () => {
      try {
        if (emails.length > 0) {
          setEmails([]);
        }
        const res = await getcategorizeInitialEmails(10);
        if (res.success) {
          const emails: any[] = await getEmails(folder as string);
          setEmails(emails);
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
