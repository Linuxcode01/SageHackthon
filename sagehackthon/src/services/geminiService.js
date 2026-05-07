/**
 * geminiService.js
 * ─────────────────────────────────────────────────────────────
 * Handles all communication with Google Gemini API.
 *
 * Model  : gemini-2.0-flash  (fast, free-tier friendly)
 * Method : POST to Gemini generateContent REST endpoint
 * Auth   : API Key via query param (no OAuth needed)
 *
 * Endpoint:
 *   POST https://generativelanguage.googleapis.com/v1beta/models/
 *        gemini-2.0-flash:generateContent?key=YOUR_API_KEY
 *
 * Get your FREE API key → https://aistudio.google.com/app/apikey
 * ─────────────────────────────────────────────────────────────
 */
import axios from "axios";

// ── Gemini REST endpoint ──────────────────────────────────────
// gemini-1.5-flash has higher free-tier RPM quota than gemini-2.0-flash
const GEMINI_MODEL    = "gemini-1.5-flash";
// Use Vite proxy path in dev to avoid direct browser calls
// /gemini-api/... → https://generativelanguage.googleapis.com/...
const GEMINI_BASE_URL = "/gemini-api/v1beta/models";
const GEMINI_API_KEY  = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPTS = {
  teacher: `You are EduInsight AI, a teaching assistant for a B.Tech CSE professor.
Class data: 12 students, avg marks 76/100, avg attendance 78%.
At-risk: Rohan Das (42/100, 55%), Amit Joshi (48/100, 58%), Karan Mehta (55/100, 62%).
Top: Divya Kapoor (95/100), Ananya Singh (91/100).
Subjects avg: Math 72, DSA 85, DBMS 68, OS 78, CN 81, AI/ML 90.
Answer concisely in under 150 words using bullet points.`,

  student: `You are EduInsight AI, a personal study assistant for Rahul Verma.
His data: Roll CS2021045, B.Tech CSE Sem 5, marks 82/100, attendance 88%, GPA 8.2, rank #4.
Subjects: Math 75, DSA 88, DBMS 62 (weakest), OS 79, CN 83, AI/ML 91 (best).
Predicted next score: 86, predicted GPA: 8.6.
Be motivating and concise. Answer in under 150 words using bullet points.`,

  admin: `You are EduInsight AI, an institutional analytics assistant.
Institution: NIT, 1500 students, 75 teachers, pass rate 88.4%, attendance 82%.
Departments: CSE(78% marks,92% pass), ECE(74%,88%), MECH(70%,85%), CIVIL(72%,87%), IT(76%,90%).
Top dept: CSE. Needs attention: MECH. Enrollment grew 8.7% YoY.
Answer professionally in under 150 words using bullet points.`,
};

/**
 * sendMessageToGemini()
 * ─────────────────────────────────────────────────────────────
 * Sends a user message + conversation history to Gemini API.
 *
 * @param {string}   userMessage  - The user's current question
 * @param {string}   role         - "teacher" | "student" | "admin"
 * @param {Array}    history      - Previous messages for multi-turn context
 *                                  [{ role: "user"|"model", parts: [{text}] }]
 * @returns {Promise<string>}     - Gemini's text response
 */
export async function sendMessageToGemini(userMessage, role = "teacher", history = []) {
  // Guard: no API key configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    throw new Error("NO_API_KEY");
  }

  const systemPrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.teacher;

  // Build the Gemini request body
  // We inject the system prompt as the first "user" turn so Gemini
  // understands the context (Gemini 1.5+ supports systemInstruction,
  // but this approach works on all versions including free tier)
  const contents = [
    // System context as first user message
    {
      role: "user",
      parts: [{ text: `[SYSTEM CONTEXT - Do not repeat this back]\n${systemPrompt}` }],
    },
    {
      role: "model",
      parts: [{ text: "Understood. I'm ready to assist as EduInsight AI." }],
    },
    // Previous conversation history (for multi-turn chat)
    ...history,
    // Current user message
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const requestBody = {
    contents,
    generationConfig: {
      temperature:     0.7,
      topK:            40,
      topP:            0.95,
      maxOutputTokens: 256,   // reduced to stay within free tier quota
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  // POST to Gemini via Vite proxy (avoids direct browser CORS + rate limit issues)
  const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  let response;
  let lastErr;

  // Retry up to 2 times on 429 (rate limit) with backoff
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      response = await axios.post(url, requestBody, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });
      break; // success — exit retry loop
    } catch (err) {
      lastErr = err;
      if (err.response?.status === 429 && attempt < 2) {
        console.warn(`[Gemini] 429 rate limit — retrying in 3s (attempt ${attempt}/2)`);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        throw err;
      }
    }
  }

  if (!response) throw lastErr;

  // Extract text from Gemini response structure
  const candidate = response.data?.candidates?.[0];
  const text      = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text.trim();
}

/**
 * isGeminiConfigured()
 * Returns true if a valid API key is set in .env
 */
export function isGeminiConfigured() {
  return (
    !!GEMINI_API_KEY &&
    GEMINI_API_KEY !== "your_gemini_api_key_here" &&
    GEMINI_API_KEY.length > 10
  );
}
