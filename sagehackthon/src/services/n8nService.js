/**
 * n8nService.js
 * Handles communication with the n8n webhook automation.
 *
 * POST VITE_N8N_WEBHOOK_URL
 *   Body : { chatInput, message, role, context, history }
 *   Reply: any shape — we deep-search for the text value
 */
import axios from "axios";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL?.trim();

// ── Role context injected into every request ──────────────────
const ROLE_CONTEXT = {
  teacher: {
    role: "teacher",
    description: "College professor for B.Tech CSE Semester 5",
    data: {
      totalStudents: 12,
      avgMarks: 76,
      avgAttendance: 78,
      weakStudents: [
        "Rohan Das (42/100, 55%)",
        "Amit Joshi (48/100, 58%)",
        "Karan Mehta (55/100, 62%)",
      ],
      topStudents: [
        "Divya Kapoor (95/100, 97%)",
        "Ananya Singh (91/100, 95%)",
      ],
      subjectAvg: { Math: 72, DSA: 85, DBMS: 68, OS: 78, CN: 81, "AI/ML": 90 },
      weakestSubject: "DBMS",
      bestSubject: "AI/ML",
    },
  },
  student: {
    role: "student",
    description: "B.Tech CSE Semester 5 student",
    data: {
      name: "Rahul Verma",
      roll: "CS2021045",
      marks: 82,
      attendance: 88,
      gpa: 8.2,
      rank: 4,
      subjects: { Math: 75, DSA: 88, DBMS: 62, OS: 79, CN: 83, "AI/ML": 91 },
      weakSubject: "DBMS",
      bestSubject: "AI/ML",
      predictedScore: 86,
      predictedGPA: 8.6,
    },
  },
  admin: {
    role: "admin",
    description: "Institutional Administrator at National Institute of Technology",
    data: {
      totalStudents: 1500,
      totalTeachers: 75,
      passRate: 88.4,
      avgAttendance: 82,
      departments: [
        { name: "CSE",   avgMarks: 78, passRate: 92, attendance: 85, trend: "+8%" },
        { name: "ECE",   avgMarks: 74, passRate: 88, attendance: 82, trend: "+3%" },
        { name: "MECH",  avgMarks: 70, passRate: 85, attendance: 79, trend: "-2%" },
        { name: "CIVIL", avgMarks: 72, passRate: 87, attendance: 81, trend: "+1%" },
        { name: "IT",    avgMarks: 76, passRate: 90, attendance: 84, trend: "+5%" },
      ],
      topDept: "CSE",
      weakDept: "MECH",
    },
  },
};

// ── Deep-search any object for a text reply ───────────────────
function extractReply(data) {
  // 1. Plain string — return it directly (even short ones)
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed) return trimmed;
    return null;
  }

  // 2. Unwrap array — take first element
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = extractReply(item);
      if (found) return found;
    }
    return null;
  }

  // 3. Not an object
  if (typeof data !== "object" || data === null) return null;

  // 4. Check all known field names (order = priority)
  const KNOWN_KEYS = [
    "output",       // n8n AI Agent node default ← most common
    "reply",        // custom
    "text",         // text
    "message",      // message
    "response",     // response
    "answer",       // answer
    "chatOutput",   // chat output
    "content",      // content
    "result",       // result
    "data",         // nested data wrapper
    "json",         // n8n sometimes wraps in { json: {...} }
    "body",         // body wrapper
  ];

  for (const key of KNOWN_KEYS) {
    if (data[key] !== undefined && data[key] !== null) {
      const val = data[key];
      if (typeof val === "string" && val.trim()) return val.trim();
      if (typeof val === "object") {
        const found = extractReply(val);
        if (found) return found;
      }
    }
  }

  // 5. Last resort — find ANY non-empty string value in the object
  for (const val of Object.values(data)) {
    if (typeof val === "string" && val.trim()) return val.trim();
  }

  return null;
}

/**
 * sendMessageToN8n()
 * POSTs message to n8n webhook and returns the AI reply string.
 */
export async function sendMessageToN8n(message, role = "teacher", history = []) {
  if (!N8N_WEBHOOK_URL) throw new Error("NO_WEBHOOK_URL");

  // chatInput is the default field n8n AI Agent reads from
  const payload = {
    chatInput:  message,
    message:    message,
    role,
    context:    ROLE_CONTEXT[role],
    history:    history.slice(-6),
    timestamp:  new Date().toISOString(),
    source:     "EduInsight AI",
  };

  console.group("📤 [n8n] Sending request");
  console.log("URL    :", N8N_WEBHOOK_URL);
  console.log("Payload:", payload);
  console.groupEnd();

  let response;
  try {
    response = await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });
  } catch (err) {
    console.group("❌ [n8n] Request failed");
    console.error("Status :", err.response?.status);
    console.error("Message:", err.message);
    console.error("Data   :", err.response?.data);
    console.groupEnd();

    const status = err.response?.status;
    if (status === 404) throw new Error("N8N_404: Webhook not found — activate your workflow in n8n", { cause: err });
    if (status === 500) throw new Error("N8N_500: n8n workflow error — check your n8n execution logs", { cause: err });
    if (status === 403) throw new Error("N8N_403: n8n access denied", { cause: err });
    if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT: Request timed out", { cause: err });
    throw err;
  }

  // ── Log full raw response so we can see the exact shape ──
  console.group("📥 [n8n] Response received");
  console.log("Status :", response.status);
  console.log("Raw    :", response.data);
  console.log("JSON   :", JSON.stringify(response.data, null, 2));
  console.groupEnd();

  // ── Deep-search the response for any text reply ───────────
  const reply = extractReply(response.data);

  if (!reply) {
    // Log the full structure so we know exactly what n8n returned
    console.error("❌ [n8n] Could not extract reply.");
    console.error("Full response data:", response.data);
    console.error("Type:", typeof response.data);
    console.error(
      "Keys at top level:",
      typeof response.data === "object" ? Object.keys(response.data) : "N/A"
    );

    throw new Error(
      `N8N_EMPTY: n8n responded but no text found. ` +
      `Keys: [${typeof response.data === "object" ? Object.keys(response.data).join(", ") : typeof response.data}]. ` +
      `Check browser console (F12) for the full response.`
    );
  }

  console.log("✅ [n8n] Reply:", reply);
  return reply;
}

/**
 * isN8nConfigured()
 */
export function isN8nConfigured() {
  return (
    !!N8N_WEBHOOK_URL &&
    (N8N_WEBHOOK_URL.startsWith("http") || N8N_WEBHOOK_URL.startsWith("/"))
  );
}
