/**
 * ollamaService.js
 * Simple adapter to call a local or remote Ollama HTTP API.
 *
 * Expects environment variables:
 *  - VITE_OLLAMA_URL    e.g. http://127.0.0.1:11434
 *  - VITE_OLLAMA_MODEL  e.g. deepseek-r1:8b
 */
import axios from "axios";

const OLLAMA_URL   = import.meta.env.VITE_OLLAMA_URL?.trim();
export const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL?.trim() || "deepseek-r1:8b";
const OLLAMA_TIMEOUT_MS = Number(import.meta.env.VITE_OLLAMA_TIMEOUT_MS?.trim() || 120000);

const SYSTEM_PROMPTS = {
  teacher: `You are EduInsight AI, a teaching assistant for a B.Tech CSE professor. Answer concisely using bullet points where appropriate.`,
  student: `You are EduInsight AI, a personal study assistant for Rahul Verma. Be motivating and concise.`,
  admin:   `You are EduInsight AI, an institutional analytics assistant. Answer professionally and concisely.`,
};

function stripCodeFences(text) {
  return String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
}

function extractReply(data) {
  if (!data) return null;
  if (typeof data === "string") return data.trim() || null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const r = extractReply(item);
      if (r) return r;
    }
    return null;
  }
  if (typeof data === "object") {
    // Common fields
    const keys = ["text", "output", "response", "result", "reply", "content", "message"];
    for (const k of keys) {
      if (data[k]) {
        const r = extractReply(data[k]);
        if (r) return r;
      }
    }
    for (const v of Object.values(data)) {
      const r = extractReply(v);
      if (r) return r;
    }
  }
  return null;
}

export async function sendMessageToOllama(userMessage, role = "teacher", history = []) {
  const prompt = `${SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.teacher}\n\n${userMessage}`;
  return sendPromptToOllama(prompt, { history });
}

export async function sendPromptToOllama(prompt, { history = [], model = OLLAMA_MODEL, timeoutMs = OLLAMA_TIMEOUT_MS } = {}) {
  if (!OLLAMA_URL) throw new Error("NO_OLLAMA_URL");

  // Build a prompt that provides system context and recent history
  const recent = (history || []).slice(-6).map((h) => {
    if (h.from === "user") return `User: ${h.text}`;
    return `Assistant: ${h.text}`;
  }).join("\n");

  const finalPrompt = recent
    ? `${prompt}\n\nConversation history:\n${recent}`
    : prompt;

  const payload = {
    model,
    prompt: finalPrompt,
    temperature: 0.2,
    max_tokens: 512,
    stream: false,
  };

  let resp;
  try {
    resp = await axios.post(`${OLLAMA_URL.replace(/\/$/, "")}/api/generate`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 120000,
    });
  } catch (err) {
    console.error("[Ollama] request failed", err?.response?.status, err?.message);
    if (err.code === "ECONNABORTED") {
      throw new Error(`OLLAMA_TIMEOUT: Ollama did not respond within ${timeoutMs}ms`);
    }
    throw err;
  }

  // Try to extract a sensible reply from the response body
  const reply = extractReply(resp.data) || extractReply(resp.data?.response) || extractReply(resp.data?.output) || null;

  if (!reply) {
    console.error("[Ollama] could not extract reply", resp.data);
    throw new Error("OLLAMA_EMPTY: Ollama responded but no text found");
  }

  return stripCodeFences(reply);
}

export function isOllamaConfigured() {
  return !!OLLAMA_URL && OLLAMA_URL.startsWith("http");
}
