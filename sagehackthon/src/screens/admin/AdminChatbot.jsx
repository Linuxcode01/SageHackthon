/**
 * AdminChatbot.jsx — AI Chatbot for institutional admin.
 */
import DashboardLayout from "../../components/DashboardLayout";
import ChatBot from "../../components/ChatBot";

export default function AdminChatbot() {
  return (
    <DashboardLayout title="AI Institutional Assistant" subtitle="Ask anything about your institution">
      <div className="max-w-2xl">
        <div className="mb-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
          <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
            🏛️ Your Institutional AI Assistant analyzes data from all departments, students, and faculty
            to provide actionable insights. Ask about performance, attendance, or risk analysis.
          </p>
        </div>
        <ChatBot role="admin" />
      </div>
    </DashboardLayout>
  );
}
