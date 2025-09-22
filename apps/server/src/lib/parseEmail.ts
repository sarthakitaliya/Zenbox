import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import md5 from "md5";
import linkifyHtml from "linkify-html";

const window = new JSDOM("").window;
const purifier = DOMPurify(window);
interface GmailHeader {
  name: string;
  value: string;
}

export interface ParsedEmail {
  id: string;
  snippet?: string;
  from: string;
  senderEmail: string;
  profileImage: string;
  to?: string;
  subject: string;
  date?: string;
  labelIds?: string[];
  body?: {
    content: string;
    type: "html" | "plain";
  };
  senderName?: string;
}

function extractHeader(headers: GmailHeader[], key: string): string | undefined {
  return headers.find(h => h.name.toLowerCase() === key.toLowerCase())?.value;
}

function extractEmail(fromValue: string): string {
  const match = fromValue.match(/<(.+?)>/);
  //@ts-ignore
  return match ? match[1] : fromValue;
}

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

function extractSenderName(fromValue: string): string {
  const match = fromValue.match(/^(.*?)</);
  return match && match[1] ? match[1].trim().replace(/"|'/g, '') : fromValue;
}

function formatEmailDate(rawDate?: string): string | undefined {
  if (!rawDate) return undefined;
  const date = new Date(rawDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  }); // e.g., "Jun 02"
}

function extractBody(payload: any): { content: string; type: "html" | "plain" } {
  let htmlContent: string | null = null;
  let plainContent: string | null = null;

  const walkParts = (node: any) => {
    if (!node) return;

    if (node.mimeType === "text/html" && node.body?.data) {
      const html = Buffer.from(node.body.data, "base64").toString("utf-8");
      htmlContent = purifier.sanitize(html, {
         FORBID_TAGS: ["script", "iframe"],
          ALLOWED_ATTR: ["style", "class", "href", "src", "alt", "width", "height", "align"],
      });
    }

    if (node.mimeType === "text/plain" && node.body?.data) {
      const text = Buffer.from(node.body.data, "base64").toString("utf-8");
      const linkified = linkifyHtml(text.replace(/\r?\n/g, "<br>"), { target: "_blank" });
      plainContent = linkified;
    }

    if (node.parts) {
      node.parts.forEach(walkParts);
    }
  };

  walkParts(payload);

  // Fallback if walkParts doesn't find anything
  if (!htmlContent && !plainContent && payload?.body?.data) {
    const fallback = Buffer.from(payload.body.data, "base64").toString("utf-8");
    const type = payload.mimeType === "text/html" ? "html" : "plain";
    if (type === "html") {
      htmlContent = purifier.sanitize(fallback, {
       FORBID_TAGS: ["script", "iframe"],
  ALLOWED_ATTR: ["style", "class", "href", "src", "alt", "width", "height", "align"],
      });
    } else {
      const linkified = linkifyHtml(fallback.replace(/\r?\n/g, "<br>"), { target: "_blank" });
      plainContent = linkified;
    }
  }

  if (htmlContent) return { content: htmlContent, type: "html" };
  if (plainContent) return { content: plainContent, type: "plain" };

  return { content: "", type: "plain" };
}

export function parseEmail(mail: any): ParsedEmail {
  const headers: GmailHeader[] = mail.payload.headers || [];
  const from = extractHeader(headers, "From") || "(Unknown)";
  const to = extractHeader(headers, "To");
  const subject = extractHeader(headers, "Subject") || "(No Subject)";
  const date = formatEmailDate(extractHeader(headers, "Date"));
  const senderEmail = extractEmail(from);
  const profileImage = getGravatarUrl(senderEmail);
  const senderName = extractSenderName(from);

  return {
    id: mail.id,
    snippet: mail.snippet,
    from,
    senderEmail,
    senderName,
    profileImage,
    to,
    subject,
    date,
    labelIds: mail.labelIds,
    body: extractBody(mail.payload)
  };
}

export interface ParsedThreadEmail {
  threadId: string;
  subject: string;
  messageCount: number;
  messages: ParsedEmail[];
}

export function parseThread(thread: any): ParsedThreadEmail {
  const messages = (thread.messages || []).map((msg: any) => parseEmail(msg));
  const subject = messages[0]?.subject || "(No Subject)";
  return {
    threadId: thread.id,
    subject,
    messageCount: messages.length,
    messages,
  };
}