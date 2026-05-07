/**
 * LoginScreen.jsx
 * Professional login screen with role selection.
 * Demo credentials shown for hackathon evaluation.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Eye, EyeOff, Sparkles, ChevronDown, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "teacher", label: "👨‍🏫 Teacher",                  color: "text-indigo-600" },
  { value: "student", label: "🎓 Student",                   color: "text-cyan-600"   },
  { value: "admin",   label: "🏛️ Institutional Administrator", color: "text-purple-600" },
];

const DEMO_CREDS = {
  teacher: { email: "teacher@demo.com", password: "teacher123" },
  student: { email: "student@demo.com", password: "student123" },
  admin:   { email: "admin@demo.com",   password: "admin123"   },
};

export default function LoginScreen() {
  const [form, setForm]         = useState({ email: "", password: "", role: "student" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const fillDemo = () => {
    const creds = DEMO_CREDS[form.role];
    setForm((f) => ({ ...f, ...creds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const user = await login(form.email, form.password, form.role);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4 shadow-2xl">
            <Brain size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">EduInsight AI</h1>
          <p className="text-white/60 text-sm mt-1">AI-Powered Student Performance System</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Welcome back 👋</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Select Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="input appearance-none pr-10 cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary-500" />
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">Demo Credentials</p>
            </div>
            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p>🎓 Student: student@demo.com / student123</p>
              <p>👨‍🏫 Teacher: teacher@demo.com / teacher123</p>
              <p>🏛️ Admin: admin@demo.com / admin123</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2 text-xs text-primary-500 hover:text-primary-600 font-semibold underline"
            >
              Auto-fill for selected role →
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-500 font-semibold hover:text-primary-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
