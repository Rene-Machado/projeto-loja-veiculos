import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Email ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full p-6 border border-gray-700 rounded bg-gray-900 shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-white">Entrar</h2>

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
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center mt-2">
            <Link
              to="/register"
              className="block bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 transition-colors text-center"
            >
              Cadastrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
