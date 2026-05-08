/**
 * ragService.js
 * Simple Retrieval-Augmented Generation helper tailored for EduInsight.
 * It gathers relevant student data (results, assignments, profile) and
 * injects it into a prompt sent to Ollama so replies are grounded in data.
 */
import { getStudent, getResultsByStudent, getAssignmentsByStudent, getChatsByStudent, createChatLog } from "./backendApi.js";
import { sendPromptToOllama, isOllamaConfigured } from "./ollamaService.js";

function summarizeResults(results = []) {
  if (!results || results.length === 0) return "No exam results available.";
  // take latest 6
  const latest = results.slice(-6);
  const bySubject = latest.map((r) => `- ${r.subject}: ${r.marksObtained}/${r.maxMarks} (${r.grade}) [${r.examType}]`);
  const avg = Math.round(results.reduce((a, r) => a + (r.marksObtained || 0), 0) / results.length);
  return `Average across ${results.length} records: ${avg}/100. Recent results:\n${bySubject.join("\n")}`;
}

function summarizeAssignments(assignments = []) {
  if (!assignments || assignments.length === 0) return "No assignments on record.";
  const recent = assignments.slice(-6).map((a) => `- ${a.title} (${a.subject}) — status: ${a.status}${a.marksObtained != null ? `, marks: ${a.marksObtained}/${a.maxMarks}` : ""}, due: ${new Date(a.dueDate).toLocaleDateString()}`);
  return `Recent assignments:\n${recent.join("\n")}`;
}

export async function buildStudentContext(studentId) {
  try {
    const [student, results, assignments] = await Promise.all([
      getStudent(studentId).catch(() => null),
      getResultsByStudent(studentId).catch(() => []),
      getAssignmentsByStudent(studentId).catch(() => []),
    ]);

    const profile = student
      ? `Name: ${student.name}\nRoll: ${student.rollNumber}\nCourse: ${student.course} · Semester: ${student.semester}\nGPA: ${student.gpa} · Attendance: ${student.attendance}%\nStatus: ${student.status}`
      : "Student profile not available.";

    const resultsSummary = summarizeResults(results);
    const assignmentSummary = summarizeAssignments(assignments);

    // Fetch recent chat history for the student (if any)
    let chatSummary = "No prior chat history.";
    try {
      const chats = await getChatsByStudent(studentId).catch(() => []);
      if (chats && chats.length > 0) {
        const last = chats.slice(-20).map((c) => `${c.role === "user" ? "User" : c.role === "assistant" ? "Assistant" : "System"}: ${c.message}`);
        chatSummary = `Recent chat history:\n${last.join("\n")}`;
      }
    } catch (e) {
      /* ignore */
    }

    return `STUDENT CONTEXT:\n${profile}\n\n${resultsSummary}\n\n${assignmentSummary}\n\n${chatSummary}`;
  } catch (err) {
    console.warn("[RAG] failed to build student context", err);
    return "No contextual data available.";
  }
}

/**
 * sendRagQuery
 * - studentId: optional. If provided, builds context for that student.
 * - query: user question
 * - role: teacher|student|admin to choose system prompt in Ollama
 */
export async function sendRagQuery({ query, studentId = null, role = "teacher", history = [] } = {}) {
  if (!isOllamaConfigured()) throw new Error("OLLAMA_NOT_CONFIGURED");

  const context = studentId ? await buildStudentContext(studentId) : "";

  const prompt = context
    ? `You are given the following STUDENT CONTEXT. Use only this data to answer the question and be concise. If the answer is not present in the context, say you don't know and suggest next steps.\n\n${context}\n\nQUESTION: ${query}\n\nAnswer:`
    : `QUESTION: ${query}\n\nAnswer:`;

  // Log the incoming user query to backend chat logs (best-effort)
  if (studentId) {
    createChatLog({ studentId, role: "user", message: query }).catch(() => null);
  }

  // Send to Ollama
  const reply = await sendPromptToOllama(prompt, { history, model: undefined });

  // Log assistant reply
  if (studentId) {
    createChatLog({ studentId, role: "assistant", message: reply }).catch(() => null);
  }

  return reply;
}

export default {
  buildStudentContext,
  sendRagQuery,
};
