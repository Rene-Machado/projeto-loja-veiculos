import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    return token && raw ? JSON.parse(raw) : null;
  });

  async function login(email, password) {
    const resp = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", resp.data.token);
    localStorage.setItem("user", JSON.stringify({
      id: resp.data.id,
      email: resp.data.email,
      role: resp.data.role
    }));
    setUser({ id: resp.data.id, email: resp.data.email, role: resp.data.role });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
