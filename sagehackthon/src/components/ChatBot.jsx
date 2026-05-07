
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles, Zap, AlertCircle, Workflow } from "lucide-react";
import { sendMessageToN8n, isN8nConfigured }       from "../services/n8nService";
import { sendMessageToGemini, isGeminiConfigured } from "../services/geminiService";
import { getChatbotResponse }                       from "../utils/generateInsights";

// ── Quick prompt chips per role ───────────────────────────────
const QUICK_PROMPTS = {
  teacher: [
    "Which students are performing poorly?",
    "Show attendance trends",
    "Predict next exam average",
    "Which subject needs attention?",
  ],
  student: [
    "How can I improve my marks?",
    "Which subject is my weakest?",
    "Show my attendance report",
    "Predict my next semester GPA",
  ],
  admin: [
    "Which department is performing best?",
    "Show attendance analytics",
    "Total student count",
    "Risk analysis report",
  ],
};

const ROLE_LABELS = {
  teacher: "AI Teaching Assistant",
  student: "AI Study Assistant",
  admin:   "AI Institutional Assistant",
};

const ENGINE_CONFIG = {
  n8n:    { label: "n8n Automation", Icon: Workflow, badge: "bg-white/20 text-white",         dot: "bg-emerald-400 animate-pulse", status: "Online"  },
  gemini: { label: "Gemini AI",      Icon: Zap,      badge: "bg-white/20 text-white",         dot: "bg-emerald-400 animate-pulse", status: "Online"  },
  local:  { label: "Local AI",       Icon: Bot,      badge: "bg-amber-400/30 text-amber-200", dot: "bg-amber-400",                 status: "Offline" },
};

// ── Determine active engine once (outside component) ─────────
function getEngine() {
  if (isN8nConfigured())    return "n8n";
  if (isGeminiConfigured()) return "gemini";
  return "local";
}

// ── Welcome message per engine ────────────────────────────────
function buildWelcome(engine, role) {
  const hi = role === "student" ? "Hi Rahul" : "Hi";
  if (engine === "n8n") {
    return `👋 ${hi}! I'm your **${ROLE_LABELS[role]}**, connected to your n8n automation.\n\nI have full context of your ${role === "admin" ? "institution's" : role === "teacher" ? "class'" : "academic"} data. Ask me anything!`;
  }
  if (engine === "gemini") {
    return `👋 ${hi}! I'm your **${ROLE_LABELS[role]}**, powered by Google Gemini AI.\n\nAsk me anything about ${role === "admin" ? "your institution" : role === "teacher" ? "your students" : "your performance"}!`;
  }
  return getChatbotResponse("", role);
}

// ── Error message helper ──────────────────────────────────────
function buildError(err, engine) {
  // Show the specific n8n error codes from n8nService.js
  if (err.message === "NO_WEBHOOK_URL")          return "⚙️ n8n webhook URL not set in .env file.";
  if (err.message === "NO_API_KEY")              return "⚙️ Gemini API key not set in .env file.";
  if (err.message?.startsWith("N8N_404"))        return "❌ n8n webhook not found (404). Make sure your workflow is ACTIVATED in n8n (toggle top-right → blue).";
  if (err.message?.startsWith("N8N_500"))        return "❌ n8n workflow error (500). Check your n8n execution logs for details.";
  if (err.message?.startsWith("N8N_403"))        return "❌ n8n access denied (403). Check your webhook URL.";
  if (err.message?.startsWith("N8N_TIMEOUT"))    return "⏱️ n8n request timed out. Check your internet connection.";
  if (err.message?.startsWith("N8N_EMPTY"))      return `❌ ${err.message.replace("N8N_EMPTY: ", "")}`;
  if (err.response?.status === 429)              return "⏱️ Rate limit reached. Please wait a moment and try again.";
  if (err.code === "ERR_NETWORK")                return "🌐 Network error. Check your internet connection.";
  // Show raw error message so we can debug unknown errors
  return `⚠️ ${engine === "n8n" ? "n8n" : "AI"} error: ${err.message || "Unknown error"} — using local fallback.`;
}

// ── Timestamp helper ──────────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─────────────────────────────────────────────────────────────
// ChatBot Component
// ─────────────────────────────────────────────────────────────
export default function ChatBot({ role = "teacher" }) {
  const engine    = getEngine();
  const cfg       = ENGINE_CONFIG[engine];
  const { Icon }  = cfg;

  // ── State ─────────────────────────────────────────────────
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: buildWelcome(engine, role), time: getTime(), engine },
  ]);
  const [n8nHistory,    setN8nHistory]    = useState([]); // n8n conversation history
  const [geminiHistory, setGeminiHistory] = useState([]); // Gemini multi-turn history
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Add a bot message to the chat ────────────────────────
  const addBotMessage = useCallback((text, usedEngine) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, from: "bot", text, time: getTime(), engine: usedEngine },
    ]);
  }, []);

  // ── Send message ─────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setError("");

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: msg, time: getTime() },
    ]);

    setLoading(true);

    // ── TIER 1: n8n Webhook ──────────────────────────────
    if (isN8nConfigured()) {
      try {
        const reply = await sendMessageToN8n(msg, role, n8nHistory);
        setN8nHistory((prev) => [
          ...prev,
          { from: "user", text: msg   },
          { from: "bot",  text: reply },
        ].slice(-12));
        addBotMessage(reply, "n8n");
        setLoading(false);
        return;
      } catch (err) {
        setError(buildError(err, "n8n"));
        // fall through to next tier
      }
    }

    // ── TIER 2: Gemini ───────────────────────────────────
    if (isGeminiConfigured()) {
      try {
        const reply = await sendMessageToGemini(msg, role, geminiHistory);
        setGeminiHistory((prev) => [
          ...prev,
          { role: "user",  parts: [{ text: msg   }] },
          { role: "model", parts: [{ text: reply  }] },
        ]);
        addBotMessage(reply, "gemini");
        setLoading(false);
        return;
      } catch (err) {
        setError(buildError(err, "gemini"));
        // fall through to local
      }
    }

    // ── TIER 3: Local keyword matching ───────────────────
    await new Promise((r) => setTimeout(r, 600));
    addBotMessage(getChatbotResponse(msg, role), "local");
    setLoading(false);

  }, [input, loading, role, n8nHistory, geminiHistory, addBotMessage]);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[560px] card overflow-hidden">

      {/* ── Header ── */}
      <div className="grad-primary px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{ROLE_LABELS[role]}</p>
          <p className="text-white/70 text-xs">Powered by {cfg.label}</p>
        </div>

        {/* Engine badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
          <Icon size={11} />
          {cfg.label}
        </div>

        {/* Status dot */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-white/70 text-xs">{cfg.status}</span>
        </div>
      </div>

      {/* ── Warning banner (no AI connected) ── */}
      {engine === "local" && (
        <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <span className="font-semibold">No AI connected.</span> Add{" "}
            <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded font-mono text-[11px]">VITE_N8N_WEBHOOK_URL</code>{" "}
            to your <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded font-mono text-[11px]">.env</code> to enable n8n AI.
          </p>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 animate-slide-up ${m.from === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.from === "bot" ? "grad-primary" : "bg-slate-300 dark:bg-slate-600"}`}>
              {m.from === "bot"
                ? <Bot  size={14} className="text-white" />
                : <User size={14} className="text-white" />
              }
            </div>

            <div className={`flex flex-col gap-1 ${m.from === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
              {/* Bubble */}
              <div className={m.from === "user" ? "chat-user" : "chat-bot"}>
                <FormattedMessage text={m.text} />
              </div>

              {/* Timestamp + engine tag */}
              <div className={`flex items-center gap-1.5 ${m.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <span className="text-[10px] text-slate-400">{m.time}</span>
                {m.from === "bot" && m.engine && m.engine !== "local" && (
                  <span className="flex items-center gap-0.5 text-[10px] text-primary-400 font-medium">
                    {m.engine === "n8n"
                      ? <><Workflow size={9} /> n8n</>
                      : <><Zap size={9} className="fill-primary-400" /> Gemini</>
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-full grad-primary flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="chat-bot flex items-center gap-1.5 py-3 px-4">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms"   }} />
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-slate-400 ml-1">
                {engine === "n8n" ? "n8n is processing..." : engine === "gemini" ? "Gemini is thinking..." : "Thinking..."}
              </span>
            </div>
          </div>
        )}

        {/* Error toast */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick prompts ── */}
      <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        {QUICK_PROMPTS[role]?.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={loading}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full
                       bg-primary-50 dark:bg-primary-900/30
                       text-primary-600 dark:text-primary-400
                       border border-primary-200 dark:border-primary-700
                       hover:bg-primary-100 dark:hover:bg-primary-900/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
        <input
          className="input flex-1 py-2.5"
          placeholder={
            engine === "n8n"    ? "Ask your n8n AI anything..." :
            engine === "gemini" ? "Ask Gemini AI anything..."   :
                                  "Ask anything..."
          }
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Send size={16} />
          }
        </button>
      </div>
    </div>
  );
}

// ── FormattedMessage ──────────────────────────────────────────
// Renders **bold**, bullet points, and line breaks from AI responses
function FormattedMessage({ text }) {
  return (
    <div className="space-y-0.5 leading-relaxed">
      {String(text).split("\n").map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className={line.startsWith("•") || line.startsWith("-") || /^\d+\./.test(line) ? "pl-1" : ""}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} className="font-semibold">{part}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}
