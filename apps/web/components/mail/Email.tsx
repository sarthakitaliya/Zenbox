import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { useEmailStore, useUIStore } from "@repo/store";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter, useSearchParams } from "next/navigation";

export const Email = ({
  email,
  folder = "inbox",
}: {
  email: {
    threadId: string;
    messageCount: number;
    categoryName?: string;
    categoryIcon?: string;
    latest?: {
      from: string;
      subject: string;
      snippet: string;
      date: string;
      category: string;
      read: boolean;
      body?: {
        content: string;
        contentType: string;
      };
      profileImage?: string;
      senderEmail: string;
      senderName?: string;
      to: string;
    };
  };
  folder: ParamValue;
}) => {
  const { selectedEmail, getFullEmail } = useEmailStore();
  const { setShowMailList, isSmallScreen } = useUIStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const category = searchParams.get("category");
    const params = new URLSearchParams();
    if (isSmallScreen) {
      setShowMailList(false);
    }

    if (category) {
      params.set("category", category);
    }
    params.set("threadId", email.threadId);

    router.push(`/mail/${folder}?${params.toString()}`);
  };

  const isSelected = selectedEmail?.threadId === email.threadId;

  const iconData = CATEGORY_ICONS[email.categoryIcon ?? ""];

  return (
    <div
      className={`flex items-center space-x-3 p-4 m-2 rounded-lg cursor-pointer ${isSelected ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
      onClick={handleClick}
    >
      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold uppercase">
        {email.latest?.senderName?.charAt(0) ?? "?"}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">
            {email.latest?.senderName ?? "Unknown"}

            {email.messageCount > 1 && (
              <span className="text-sm text-gray-500 ml-2">
                [{email.messageCount}]
              </span>
            )}
          </h3>
          <span className="text-xs text-gray-400">
            {email.latest?.date ?? ""}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="max-w-[20vw] text-xs text-gray-500 truncate">
            {email.latest?.subject ?? ""}
          </p>
          {iconData && (
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center ${iconData.bg}`}
            >
              <iconData.icon className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
