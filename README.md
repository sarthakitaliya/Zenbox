# Zenbox 📥

Zenbox is an AI-powered Gmail attachment and email management platform. It intelligently categorizes, summarizes, and organizes your emails.

---

## 🔑 Features

### ✨ Authentication
- Google login support using `better-auth`
- Custom OAuth flow for connecting multiple Gmail accounts per user (in v2)

### 📬 Email Management
- Secure Gmail API integration to fetch emails and metadata

### 🧠 AI Categorization
- User-defined categories (with name + description)
- AI automatically classifies new emails into the most relevant category

### 📨 Summarization & Reply Drafting
- Summarizes email content using lightweight LLMs
- Drafts professional replies with prompt-based AI responses

### 🗂️ Smart Document Handling
- Stores attachments in Cloudinary with searchable tags
- Easily view and download stored documents


---

## 🧠 Tech Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS, Zustand
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Auth:** Better-auth, Google OAuth2
- **Infra:** Turborepo, Cloudinary (attachments)

---

## 📌 Notes

- Emails are not stored entirely to ensure privacy. Only metadata and categorized IDs are kept.

---

## 🔄 Planned Features

- Shared inboxes with role-based access
- Enhanced analytics dashboard (email volume by category, response trends)
- Custom OAuth flow for connecting multiple Gmail accounts per user

---
