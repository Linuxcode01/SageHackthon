/**
 * SplashScreen.jsx
 * Animated app loading screen shown on first launch.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen grad-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce-slow"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
            <Brain size={56} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center shadow-lg animate-bounce-slow">
            <Sparkles size={14} className="text-white" />
          </div>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tight">EduInsight</h1>
          <p className="text-xl font-light text-white/80 tracking-widest mt-1">AI</p>
          <p className="text-sm text-white/60 mt-3 font-medium tracking-wide">
            AI-Powered Student Performance System
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <p className="text-white/40 text-xs mt-2">Initializing AI Engine...</p>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-10 text-center animate-fade-in" style={{ animationDelay: "1s" }}>
        <p className="text-white/30 text-xs">Powered by Machine Learning & AI Analytics</p>
        <p className="text-white/20 text-[10px] mt-1">v1.0.0 · Hackathon Edition</p>
      </div>
    </div>
  );
}
