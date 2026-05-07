/**
 * TeacherChatbot.jsx — AI Chatbot screen for teachers.
 */
import DashboardLayout from "../../components/DashboardLayout";
import ChatBot from "../../components/ChatBot";

export default function TeacherChatbot() {
  return (
    <DashboardLayout title="AI Chatbot" subtitle="Ask anything about your students">
      <div className="max-w-2xl">
        <div className="mb-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">
            🤖 This AI assistant uses your class data to answer questions about student performance,
            attendance trends, and predictions. Powered by RAG + LLM simulation.
          </p>
        </div>
        <ChatBot role="teacher" />
      </div>
    </DashboardLayout>
  );
}
