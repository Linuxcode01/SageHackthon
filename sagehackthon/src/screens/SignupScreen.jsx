/**
 * SignupScreen.jsx
 * Registration screen — backend-ready structure.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Eye, EyeOff, ChevronDown, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen() {
  const [form, setForm]         = useState({ name: "", email: "", password: "", confirm: "", role: "student" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const { signup }              = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      await signup(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Account Created!</h2>
          <p className="text-white/60 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Brain size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-white/60 text-sm mt-1">Join EduInsight AI Platform</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Role</label>
              <div className="relative">
                <select name="role" value={form.role} onChange={handleChange} className="input appearance-none pr-10 cursor-pointer">
                  <option value="student">🎓 Student</option>
                  <option value="teacher">👨‍🏫 Teacher</option>
                  <option value="admin">🏛️ Institutional Administrator</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} className="input pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="input" placeholder="Re-enter password" />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
