/**
 * AuthContext.jsx
 * Global authentication state using React Context API.
 * Stores the logged-in user, JWT token, and role.
 * Backend-ready: swap the mock login with a real API call.
 */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ── Mock users (replace with real API call in production) ──
const MOCK_USERS = [
  {
    id: "t1",
    name: "Dr. Priya Sharma",
    email: "teacher@demo.com",
    password: "teacher123",
    role: "teacher",
    avatar: "PS",
    department: "Computer Science",
    designation: "Associate Professor",
    subject: "Data Structures & Algorithms",
    token: "mock-jwt-teacher-token",
  },
  {
    id: "s1",
    name: "Rahul Verma",
    email: "student@demo.com",
    password: "student123",
    role: "student",
    avatar: "RV",
    rollNumber: "CS2021045",
    course: "B.Tech CSE",
    semester: "5th Semester",
    department: "Computer Science",
    token: "mock-jwt-student-token",
  },
  {
    id: "a1",
    name: "Prof. Anil Kumar",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    avatar: "AK",
    designation: "Dean of Academics",
    institution: "National Institute of Technology",
    token: "mock-jwt-admin-token",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("eduinsight_user");
    const savedToken = localStorage.getItem("eduinsight_token");
    if (savedUser && savedToken) {
      const parsed = JSON.parse(savedUser);
      /* eslint-disable react-hooks/set-state-in-effect */
      setUser(parsed);
      setToken(savedToken);
    }
    setLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  /**
   * login() — authenticates user against mock data.
   * In production: replace with axios.post('/api/auth/login', { email, password, role })
   */
  const login = async (email, password, role) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const found = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!found) throw new Error("Invalid credentials. Please check your email, password, and role.");

    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    setToken(safeUser.token);
    localStorage.setItem("eduinsight_user", JSON.stringify(safeUser));
    localStorage.setItem("eduinsight_token", safeUser.token);
    return safeUser;
  };

  /**
   * signup() — placeholder for real registration API.
   * In production: axios.post('/api/auth/register', payload)
   */
  // eslint-disable-next-line no-unused-vars
  const signup = async (_payload) => {
    await new Promise((r) => setTimeout(r, 1000));
    // Mock success — in real app, backend creates user and returns JWT
    return { success: true, message: "Account created! Please login." };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("eduinsight_user");
    localStorage.removeItem("eduinsight_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
