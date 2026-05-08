/**
 * generateInsights.js
 * Simulates RAG + LLM AI insight generation.
 * In production: replace with real LLM API call (OpenAI, Gemini, etc.)
 *
 * The function analyzes student data and returns contextual insights.
 */
import { isOllamaConfigured, sendPromptToOllama } from "../services/ollamaService";

function stripCodeFences(text) {
  return String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
}

function normalizeInsightItems(items, fallback) {
  if (!Array.isArray(items)) return fallback;

  const normalized = items
    .filter(Boolean)
    .map((item, index) => ({
      id: item.id ?? index + 1,
      type: ["success", "warning", "danger", "info"].includes(item.type) ? item.type : "info",
      icon: item.icon || "💡",
      title: String(item.title || `Insight ${index + 1}`),
      text: String(item.text || ""),
    }))
    .filter((item) => item.text.trim());

  return normalized.length ? normalized : fallback;
}

async function generateInsightsWithOllama({ role, data, prompt, fallback }) {
  if (!isOllamaConfigured()) return fallback;

  const requestPrompt = `${prompt}\n\nReturn ONLY valid JSON as an array of objects with keys: id, type, icon, title, text. Use double quotes and no markdown.`;

  try {
    const reply = await sendPromptToOllama(requestPrompt, {
      history: [
        { from: "user", text: JSON.stringify(data) },
      ],
    });

    const parsed = JSON.parse(stripCodeFences(reply));
    return normalizeInsightItems(parsed, fallback);
  } catch (err) {
    console.warn(`[generateInsights] Ollama ${role} insight generation failed`, err?.message);
    return fallback;
  }
}

/**
 * Generate AI insights for a teacher based on class data.
 * @param {Object} stats - { avgMarks, attendance, weakCount, totalStudents }
 * @returns {Array} insights array
 */
export function generateTeacherInsights(stats) {
  const insights = [];

  if (stats.avgMarks < 65) {
    insights.push({
      id: 1, type: "danger", icon: "⚠️",
      title: "Low Class Average",
      text: `Class average is ${stats.avgMarks}/100. Consider revising teaching methodology and providing extra sessions.`,
    });
  } else if (stats.avgMarks >= 80) {
    insights.push({
      id: 1, type: "success", icon: "🏆",
      title: "Excellent Performance",
      text: `Class average of ${stats.avgMarks}/100 is outstanding. Top performers improved by 12% this semester.`,
    });
  } else {
    insights.push({
      id: 1, type: "info", icon: "📊",
      title: "Average Performance",
      text: `Class average is ${stats.avgMarks}/100. There is room for improvement, especially in Mathematics.`,
    });
  }

  if (stats.attendance < 70) {
    insights.push({
      id: 2, type: "danger", icon: "📉",
      title: "Critical Attendance",
      text: `Average attendance is ${stats.attendance}%. Students below 70% attendance show 35% lower exam scores.`,
    });
  } else {
    insights.push({
      id: 2, type: "warning", icon: "📅",
      title: "Attendance Insight",
      text: `Attendance at ${stats.attendance}%. Students with >85% attendance score 18% higher on average.`,
    });
  }

  if (stats.weakCount > 0) {
    insights.push({
      id: 3, type: "danger", icon: "🎯",
      title: "At-Risk Students",
      text: `${stats.weakCount} student(s) are at high risk of failing. Immediate academic counseling is recommended.`,
    });
  }

  insights.push({
    id: 4, type: "info", icon: "💡",
    title: "AI Recommendation",
    text: "Based on performance patterns, focus on DBMS and Mathematics. Peer-learning sessions can improve weak students by 15–20%.",
  });

  return insights;
}

/**
 * Generate AI insights for a student based on personal data.
 * @param {Object} data - { marks, attendance, gpa, subjects }
 */
export function generateStudentInsights(data) {
  const insights = [];
  const weakSubjects = data.subjects?.filter((s) => s.marks < 65) || [];

  if (data.attendance < 75) {
    insights.push({
      id: 1, type: "warning", icon: "📅",
      title: "Improve Attendance",
      text: `Your attendance is ${data.attendance}%. Students with <75% attendance risk losing exam eligibility.`,
    });
  } else {
    insights.push({
      id: 1, type: "success", icon: "✅",
      title: "Good Attendance",
      text: `Your attendance is ${data.attendance}%. Keep it above 85% for best results.`,
    });
  }

  if (weakSubjects.length > 0) {
    insights.push({
      id: 2, type: "warning", icon: "📚",
      title: "Focus Areas",
      text: `You need to improve in: ${weakSubjects.map((s) => s.subject).join(", ")}. Dedicate extra study time to these subjects.`,
    });
  }

  insights.push({
    id: 3, type: "success", icon: "🚀",
    title: "Positive Trend",
    text: "Your performance trend is improving. Consistent effort in the next 4 weeks can boost your GPA by 0.3–0.5 points.",
  });

  insights.push({
    id: 4, type: "info", icon: "🎯",
    title: "Study Plan",
    text: "AI suggests: 2 hours daily on weak subjects, 1 hour revision, and weekly mock tests for best results.",
  });

  return insights;
}

/**
 * Generate AI insights for institutional admin.
 * @param {Object} data - { departments, totalStudents, passRate }
 */
export function generateAdminInsights(data) {
  const sorted = [...(data.departments || [])].sort((a, b) => b.avgMarks - a.avgMarks);
  const top    = sorted[0];
  const weak   = sorted[sorted.length - 1];

  return [
    {
      id: 1, type: "success", icon: "🏆",
      title: "Top Department",
      text: `${top?.name || "CSE"} department leads with ${top?.avgMarks || 78}% average marks and ${top?.passRate || 92}% pass rate.`,
    },
    {
      id: 2, type: "warning", icon: "⚠️",
      title: "Needs Attention",
      text: `${weak?.name || "MECH"} department shows declining performance. Faculty review and curriculum update recommended.`,
    },
    {
      id: 3, type: "info", icon: "📈",
      title: "Growth Trend",
      text: `Overall institutional performance improved by 5.3% year-over-year. Student enrollment grew by 8.7%.`,
    },
    {
      id: 4, type: "danger", icon: "📉",
      title: "Attendance Alert",
      text: "Low attendance observed in 1st year students across all departments. Engagement programs recommended.",
    },
    {
      id: 5, type: "success", icon: "💡",
      title: "AI Recommendation",
      text: "Implement peer-mentoring programs and AI-assisted tutoring to improve bottom 20% student performance.",
    },
  ];
}

export async function generateTeacherInsightsFromOllama(data) {
  const fallback = generateTeacherInsights(data);
  const prompt = `You are EduInsight AI for a teacher dashboard. Analyze this class data and return concise, actionable insights: ${JSON.stringify(data)}`;
  return generateInsightsWithOllama({ role: "teacher", data, prompt, fallback });
}

export async function generateStudentInsightsFromOllama(data) {
  const fallback = generateStudentInsights(data);
  const prompt = `You are EduInsight AI for a student dashboard. Analyze this student data and return concise, actionable insights: ${JSON.stringify(data)}`;
  return generateInsightsWithOllama({ role: "student", data, prompt, fallback });
}

export async function generateAdminInsightsFromOllama(data) {
  const fallback = generateAdminInsights(data);
  const prompt = `You are EduInsight AI for an institutional admin dashboard. Analyze this institutional data and return concise, actionable insights: ${JSON.stringify(data)}`;
  return generateInsightsWithOllama({ role: "admin", data, prompt, fallback });
}

/**
 * Mock chatbot response generator.
 * In production: replace with real LLM API call.
 */
export function getChatbotResponse(message, role) {
  const msg = message.toLowerCase().trim();

  const responses = {
    teacher: {
      keywords: [
        { keys: ["weak", "poor", "fail", "low"],       reply: "📊 **At-Risk Students:**\n• Rohan Das (42/100, 55% attendance)\n• Amit Joshi (48/100, 58% attendance)\n• Karan Mehta (55/100, 62% attendance)\n\nRecommendation: Schedule individual counseling sessions immediately." },
        { keys: ["attendance", "present", "absent"],   reply: "📅 **Attendance Analysis:**\n• Class average: 78%\n• Critical (<65%): 3 students\n• Best: Divya Kapoor (97%)\n• Trend: Declining on Mondays\n\nSuggestion: Send automated attendance alerts to parents." },
        { keys: ["predict", "next", "exam", "future"], reply: "🔮 **AI Prediction (Next Exam):**\n• Predicted class average: 79/100\n• Students likely to fail: 2\n• Expected top scorer: Divya Kapoor (~96)\n• DSA scores expected to improve by 8%\n\nBased on Linear Regression model." },
        { keys: ["subject", "topic", "chapter"],       reply: "📚 **Subject Performance:**\n• Best: AI/ML (90 avg)\n• Weakest: DBMS (68 avg)\n• Math needs attention (72 avg)\n\nSuggestion: Extra sessions for DBMS and Math." },
      ],
      default: "🤖 Hi! I'm your AI Teaching Assistant. Try asking:\n• 'Which students are performing poorly?'\n• 'Show attendance trends'\n• 'Predict next exam average'\n• 'Which subject needs attention?'",
    },
    student: {
      keywords: [
        { keys: ["improve", "better", "tips", "help"],  reply: "💡 **Improvement Plan for You:**\n1. Attend all DBMS lectures (your weakest subject)\n2. Practice DSA problems 1 hour daily\n3. Maintain attendance above 85%\n4. Form study groups for Math\n5. Solve 5 previous year papers weekly\n\nPredicted improvement: +8 marks in next exam!" },
        { keys: ["weak", "subject", "low", "bad"],      reply: "📚 **Your Weakest Subject: DBMS (62/100)**\n\nImprovement Plan:\n• Revise normalization (1NF, 2NF, 3NF)\n• Practice SQL queries daily on HackerRank\n• Watch NPTEL DBMS lectures\n• Solve 10 previous year questions\n\nTarget: 75+ in next exam." },
        { keys: ["attendance", "present", "absent"],    reply: "📅 **Your Attendance Report:**\n• Overall: 88% ✅\n• Math: 90% | DSA: 92%\n• DBMS: 82% | OS: 88%\n• CN: 85% | AI/ML: 91%\n\nStatus: Good! Maintain above 85% for best results." },
        { keys: ["predict", "gpa", "score", "future"],  reply: "🔮 **Your Performance Prediction:**\n• Predicted next exam score: 86/100\n• Predicted next semester GPA: 8.6\n• Improvement probability: 78%\n• Risk level: Low ✅\n\nBased on your current performance trend." },
        { keys: ["study", "plan", "schedule", "time"],  reply: "📋 **AI Study Plan for You:**\n• 7–9 AM: DBMS revision\n• 4–6 PM: DSA practice\n• 8–9 PM: Math problems\n• Weekend: Mock tests + revision\n\nConsistency is key! 21 days to build a habit." },
      ],
      default: "🤖 Hi Rahul! I'm your AI Study Assistant. Ask me:\n• 'How can I improve?'\n• 'Which subject is weak?'\n• 'Show my attendance report'\n• 'Predict my GPA'\n• 'Create a study plan'",
    },
    admin: {
      keywords: [
        { keys: ["top", "best", "perform", "highest"],  reply: "🏆 **Top Performing Department: CSE**\n• Average Marks: 78/100\n• Pass Rate: 92%\n• Attendance: 85%\n• Student Satisfaction: 4.2/5\n\nCSE performance improved by 8% this semester." },
        { keys: ["weak", "low", "poor", "worst"],       reply: "⚠️ **Department Needing Attention: MECH**\n• Average Marks: 70/100\n• Pass Rate: 85%\n• Attendance: 79%\n\nRecommendation: Faculty review, curriculum update, and additional lab sessions." },
        { keys: ["attendance", "present", "absent"],    reply: "📅 **Institutional Attendance:**\n• Overall: 82%\n• CSE: 85% | ECE: 82%\n• MECH: 79% | CIVIL: 81%\n• IT: 84%\n\nAlert: 1st year students show lowest attendance (74%)." },
        { keys: ["student", "total", "count", "enroll"],reply: "👥 **Student Statistics:**\n• Total Students: 1,500\n• Active: 1,487 | Inactive: 13\n• New Admissions: 380\n• Dropout Rate: 0.87%\n\nEnrollment grew by 8.7% vs last year." },
        { keys: ["teacher", "faculty", "staff"],        reply: "👨‍🏫 **Faculty Statistics:**\n• Total Teachers: 75\n• PhD Holders: 42 (56%)\n• Average Experience: 8.3 years\n• Student-Teacher Ratio: 20:1\n\nFaculty satisfaction score: 4.1/5." },
      ],
      default: "🤖 Hi! I'm your Institutional AI Assistant. Ask me:\n• 'Which department is performing best?'\n• 'Show attendance analytics'\n• 'Total student count'\n• 'Faculty statistics'\n• 'Risk analysis report'",
    },
  };

  const roleResponses = responses[role] || responses.teacher;

  for (const item of roleResponses.keywords) {
    if (item.keys.some((k) => msg.includes(k))) {
      return item.reply;
    }
  }

  return roleResponses.default;
}
