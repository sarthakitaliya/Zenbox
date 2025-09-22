import { Email, useEmailStore } from "@repo/store";

let pollingInterval: NodeJS.Timeout | null = null;

export const useEmailPolling = () => {
  const setEmails = useEmailStore((state) => state.setEmails);
  const getRecentEmails = useEmailStore((state) => state.getRecentEmails);
  const startPolling = () => {
    const interval = setInterval(async () => {
      const since = Math.floor(Date.now() / 1000) - 15;
      const res = await getRecentEmails(since);

      if (res.length > 0) {
        //@ts-ignore
        setEmails((prev) => [...res, ...prev]);
      }
    }, 15000);

    pollingInterval = interval;
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  return { startPolling, stopPolling };
};
