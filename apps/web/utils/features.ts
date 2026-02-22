import { 
    BsInbox, 
    BsTag, 
    BsSearch, 
    BsRobot, 
    BsFileText,
    BsEye
} from 'react-icons/bs'

export const features = [
    {
        icon: BsTag,
        title: "Category Setup Guard",
        description: "Protected flow ensures users define categories before using the main inbox experience."
    },
    {
        icon: BsInbox,
        title: "AI Initial Categorization",
        description: "First inbox sync can auto-categorize recent emails into your custom category set."
    },
    {
        icon: BsFileText,
        title: "AI Summary in Mail Detail",
        description: "Generate quick summaries while reading an email thread to reduce scanning time."
    },
    {
        icon: BsRobot,
        title: "AI Assist in Compose + Reply",
        description: "Create draft body and subject suggestions for compose/reply directly inside your workflow."
    },
    {
        icon: BsSearch,
        title: "Search + Folder Workflow",
        description: "Search across sender/subject/snippet and triage with star, archive, spam, and trash actions."
    },
    {
        icon: BsEye,
        title: "Moderation Support",
        description: "Admin APIs support user listing, activity visibility, and delete actions for demo moderation."
    }
]
