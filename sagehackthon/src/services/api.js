/**
 * api.js
 * Axios instance with JWT interceptor.
 * All API calls go through this instance.
 * Replace BASE_URL with your real backend URL.
 */
import axios from "axios";

// ── Base URL — change this to your backend ──
const BASE_URL = import.meta.env.VITE_API_URL || "https://api.eduinsight.ai/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduinsight_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 (token expired) globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("eduinsight_user");
      localStorage.removeItem("eduinsight_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── API endpoint functions (backend-ready placeholders) ──

export const authAPI = {
  login:  (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/register", data),
  logout: ()     => api.post("/auth/logout"),
};

export const teacherAPI = {
  getDashboard:   ()       => api.get("/teacher/dashboard"),
  getStudents:    (params) => api.get("/teacher/students", { params }),
  getInsights:    ()       => api.get("/teacher/ai-insights"),
  getPredictions: ()       => api.get("/teacher/predictions"),
  uploadMarks:    (data)   => api.post("/teacher/upload/marks", data),
  uploadAttendance:(data)  => api.post("/teacher/upload/attendance", data),
  chatbot:        (msg)    => api.post("/teacher/chatbot", { message: msg }),
};

export const studentAPI = {
  getDashboard:   ()    => api.get("/student/dashboard"),
  getPerformance: ()    => api.get("/student/performance"),
  getInsights:    ()    => api.get("/student/ai-insights"),
  getPrediction:  ()    => api.get("/student/prediction"),
  chatbot:        (msg) => api.post("/student/chatbot", { message: msg }),
};

export const adminAPI = {
  getDashboard:    ()       => api.get("/admin/dashboard"),
  getDepartments:  ()       => api.get("/admin/departments"),
  getInsights:     ()       => api.get("/admin/ai-insights"),
  getStudents:     (params) => api.get("/admin/students", { params }),
  getTeachers:     (params) => api.get("/admin/teachers", { params }),
  exportReport:    (type)   => api.get(`/admin/export/${type}`, { responseType: "blob" }),
  chatbot:         (msg)    => api.post("/admin/chatbot", { message: msg }),
};

export default api;
