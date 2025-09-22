"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Inbox,
  Star,
  Folder,
  FileText,
  Send,
  Archive,
  Shield,
  Trash2,
  CreditCard,
  Settings,
  Plus,
} from "lucide-react";
import { useUserStore } from "@repo/store";
import Image from "next/image";

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

const bottomItems = [
  { name: "Billing", href: "/mail/billing", icon: CreditCard },
  { name: "Settings", href: "/mail/settings", icon: Settings },
];
    
export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <aside
      className={`h-screen text-white flex flex-col justify-between p-4 w-[220px] ${className}`}
    >
      <div>
        <h1 className="text-lg font-bold mb-5">Zenbox</h1>

        {/* Profile */}
        <div className="flex items-center gap-3 mb-5">
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="Profile Picture"
            className="rounded-full"
            width={30}
            height={30}
          />
          <div className="flex flex-col">
            <span className="font-semibold">{user?.name || "No name"}</span>
            <span className="text-xs text-gray-400">
              {user?.email || "No email"}
            </span>
          </div>
        </div>

        {/* Compose Button */}
        <button className="w-full bg-white text-black font-semibold py-1.5 rounded-md flex items-center justify-center gap-2 mb-6 hover:bg-gray-200 transition">
          <Plus className="w-4 h-4" />
          Compose
        </button>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
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
      <div className="space-y-2 mt-4">
        {bottomItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
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
      </div>
    </aside>
  );
}
