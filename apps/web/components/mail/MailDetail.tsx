import { useEmailStore, useUIStore } from "@repo/store";
import { Archive, Reply, Send, Star, Trash2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NoEmailSelected } from "./NoEmailSelected";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { toast } from "sonner";

export const MailDetail = () => {
  const {
    selectedThread,
    getFullEmail,
    setSelectedThread,
    archiveThread,
    trashThread,
    starThread,
    unstarThread,
  } = useEmailStore();
  const { isSmallScreen, setShowMailList } = useUIStore();
  console.log(selectedThread, "selectedThread in MailDetail");
  const searchParams = useSearchParams();
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

  const handleCloseEmailDetail = () => {
    const category = searchParams.get("category");
    if (isSmallScreen) {
      setShowMailList(true);
    }
    if (category) {
      router.push(`/mail/inbox?category=${category}`);
    } else {
      router.push("/mail/inbox");
    }
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
            return isStarred
              ? "Thread unstarred successfully!"
              : "Thread starred successfully!";
          },
          error: "Failed to toggle star on thread.",
        }
      );
    }
  };

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
              <div className="flex flex-col items-start text-xl font-semibold text-white pb-5 border-b border-[#3f3f3f7a] space-y-2">
                <div className="flex items-center gap-2">
                  <span>{selectedThread.subject}</span>
                  {selectedThread.messageCount > 1 && (
                    <span className="text-sm text-gray-500">
                      [{selectedThread.messageCount}]
                    </span>
                  )}
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
                        className="text-sm text-gray-200 leading-relaxed px-2 mt-3 overflow-hidden"
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
