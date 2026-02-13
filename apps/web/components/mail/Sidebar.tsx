"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Star,
  Folder,
  FileText,
  Send,
  Archive,
  Shield,
  Trash2,
  Plus,
  X,
  LogOut,
} from "lucide-react";
import { useUIStore, useUserStore } from "@repo/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { name: "Inbox", href: "/mail/inbox", icon: Inbox },
  { name: "Starred", href: "/mail/starred", icon: Star },
  { name: "Categories", href: "/mail/categories", icon: Folder },
  { name: "Drafts", href: "/mail/drafts", icon: FileText },
  { name: "Sent", href: "/mail/sent", icon: Send },
  { name: "Archive", href: "/mail/archive", icon: Archive },
  { name: "Spam", href: "/mail/spam", icon: Shield },
  { name: "Bin", href: "/mail/bin", icon: Trash2 },
];

const bottomItems: {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [];
    
export default function Sidebar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useUserStore();
  const { setSidebarOpen, setComposeOpen, setComposeMinimized } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearUser();
      router.replace("/auth/signin");
    }
  };

  const displayEmail = (() => {
    const email = user?.email;
    if (!email) return "No email";

    if (email.length <= 24) return email;
    const [local = "", domain = ""] = email.split("@");
    if (!domain) return `${email.slice(0, 21)}...`;
    return `${local.slice(0, 10)}...@${domain}`;
  })();

  return (
    <>
      <aside
        className={`h-screen text-white flex flex-col justify-between p-4 w-[220px] ${className}`}
      >
        <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-bold">Zenbox</h1>
          <button
            type="button"
            className="md:hidden p-1 text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 mb-5">
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="Profile Picture"
            className="rounded-full"
            width={30}
            height={30}
          />
          <div className="flex min-w-0 flex-col">
            <span className="font-semibold">{user?.name || "No name"}</span>
            <span
              className="text-xs text-gray-400 rounded bg-gray-800/60 px-1.5 py-0.5 w-fit max-w-full truncate"
              title={user?.email || "No email"}
            >
              {displayEmail}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={closeSidebarOnMobile}
              className={`
              flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition text-sm
              ${pathname === href ? "bg-gray-800" : ""}
            `}
              style={{ textDecoration: 'none' }}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          ))}
        </nav>
        </div>

        {/* Bottom Links */}
        <div className="space-y-2 mt-4 pt-3 border-t border-gray-800/80">
          {bottomItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={closeSidebarOnMobile}
              className={`
            flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-800 transition text-sm
            ${pathname === href ? "bg-gray-800" : ""}
          `}
              style={{ textDecoration: 'none' }}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-800 transition text-sm text-gray-300 hover:text-white cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {pathname !== "/mail/categories" && (
        <button
          type="button"
          aria-label="Compose"
          title="Compose"
          onClick={() => {
            setComposeOpen(true);
            setComposeMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg ring-1 ring-black/10 transition hover:scale-105 hover:bg-slate-100 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
