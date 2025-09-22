"use client";
import { useEffect } from "react";
import { useUIStore } from "@repo/store";
import { toast } from "sonner";

export default function ToastListener() {
  const { error, message, setError, setMessage } = useUIStore();

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null); 
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage(null);
    }
  }, [message]);

  return null; 
}