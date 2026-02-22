"use client";

import { apiAdmin } from "@repo/api-client/apis";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [canRegister, setCanRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        await apiAdmin.getAdminMe();
        if (!mounted) return;
        router.replace("/admin/dashboard");
        return;
      } catch {
        // ignore and continue to setup status
      }

      try {
        const status = await apiAdmin.getAdminSetupStatus();
        if (!mounted) return;
        const allowRegister = status.canRegister;
        setCanRegister(allowRegister);
        setMode(allowRegister ? "register" : "login");
      } catch (error) {
        if (!mounted) return;
        toast.error(error instanceof Error ? error.message : "Failed to load admin setup status.");
        setCanRegister(false);
        setMode("login");
      } finally {
        if (mounted) setCheckingSetup(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router]);

  const submitLabel = useMemo(() => {
    if (submitting) {
      return mode === "register" ? "Creating admin..." : "Signing in...";
    }
    return mode === "register" ? "Create Admin" : "Sign In";
  }, [mode, submitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "register") {
        await apiAdmin.registerAdmin({
          name: name.trim() || undefined,
          email: email.trim(),
          password,
        });
        toast.success("Admin account created.");
      } else {
        await apiAdmin.loginAdmin({
          email: email.trim(),
          password,
        });
        toast.success("Admin login successful.");
      }

      router.replace("/admin/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-[#111112] text-white flex items-center justify-center">
        <div className="text-sm text-gray-300">Checking admin setup...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111112] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-[#171718] p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-2 mb-6">
          {mode === "register"
            ? "Create the first and only admin account."
            : "Sign in with your admin credentials."}
        </p>

        {canRegister && (
          <div className="mb-5 inline-flex rounded-lg bg-[#1f1f20] p-1">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`px-3 py-1.5 text-sm rounded-md cursor-pointer ${
                mode === "register" ? "bg-[#2B2B2D] text-white" : "text-gray-400"
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`px-3 py-1.5 text-sm rounded-md cursor-pointer ${
                mode === "login" ? "bg-[#2B2B2D] text-white" : "text-gray-400"
              }`}
            >
              Login
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="admin-name">
                Name
              </label>
              <input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full rounded-lg border border-[#313135] bg-[#111112] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a78ff]"
                placeholder="Admin name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-lg border border-[#313135] bg-[#111112] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a78ff]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-[#313135] bg-[#111112] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a78ff]"
              placeholder="Minimum 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#3a69ff] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4a78ff] disabled:opacity-70 cursor-pointer"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
