// categoryIcons.ts
import {
  Bell,
  User,
  Zap,
  Briefcase,
  Book,
  Heart,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  MoreHorizontal,
  Tag,
} from "lucide-react";

export const CATEGORY_ICONS: any = {
  "zap-yellow": { label: "Zap", icon: Zap, bg: "bg-yellow-500" },
  "user-green": { label: "User", icon: User, bg: "bg-green-500" },
  "bell-purple": { label: "Bell", icon: Bell, bg: "bg-purple-500" },
  "briefcase-blue": { label: "Work", icon: Briefcase, bg: "bg-blue-500" },
  "finance-green": { label: "Finance", icon: DollarSign, bg: "bg-green-600" },
  "book-orange": { label: "Study", icon: Book, bg: "bg-orange-500" },
  "heart-red": { label: "Favorites", icon: Heart, bg: "bg-red-500" },
  "mail-indigo": { label: "Mail", icon: Mail, bg: "bg-indigo-500" },
  "promotion-yellow": { label: "Promotion", icon: Tag, bg: "bg-yellow-500" },
  "calendar-rose": { label: "Events", icon: Calendar, bg: "bg-rose-500" },
  "file-gray": { label: "Documents", icon: FileText, bg: "bg-gray-500" },
  "other-gray": { label: "Other", icon: MoreHorizontal, bg: "bg-gray-400" },
};