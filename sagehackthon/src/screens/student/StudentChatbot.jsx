/**
 * StudentChatbot.jsx — AI Chatbot for students.
 */
import DashboardLayout from "../../components/DashboardLayout";
import ChatBot from "../../components/ChatBot";

export default function StudentChatbot() {
  return (
    <DashboardLayout title="AI Study Assistant" subtitle="Your personal AI tutor">
      <div className="max-w-2xl">
        <div className="mb-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800">
          <p className="text-sm text-cyan-700 dark:text-cyan-400 font-medium">
            🎓 Your AI Study Assistant can help you understand your weak areas, create study plans,
            and predict your performance. Ask anything!
          </p>
        </div>
        <ChatBot role="student" />
      </div>
    </DashboardLayout>
  );
}
