import { 
    BsInbox, 
    BsTag, 
    BsSearch, 
    BsRobot, 
    BsGear, 
    BsFileText,
    BsFilter,
    BsEye
} from 'react-icons/bs'

export const features = [
    {
        icon: BsTag,
        title: "AI-Based Categorization",
        description: "Automatically sorts incoming emails into custom user-defined categories."
    },
    {
        icon: BsInbox,
        title: "Smart Inbox View",
        description: "Unified inbox with filters for categories, starred, drafts, sent, spam, and trash."
    },
    {
        icon: BsFileText,
        title: "AI Summaries",
        description: "Generates concise summaries of long emails for quick reading."
    },
    {
        icon: BsSearch,
        title: "Search & Filter",
        description: "Search by sender, keyword, category with powerful filtering options."
    },
    {
        icon: BsRobot,
        title: "AI Reply Suggestions",
        description: "Context-aware, auto-generated reply drafts for faster responses."
    },
    {
        icon: BsGear,
        title: "Category Management",
        description: "Create, edit, and manage up to four personalized categories with icons and descriptions."
    }
]