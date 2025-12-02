import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }
    if (password.length < 6) {
      setError("Senha deve ter ao menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", { email, password });
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || err.message || "Erro ao registrar";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full p-6 border border-gray-700 rounded bg-gray-900 shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-white">Registrar</h2>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
