import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // redireciona para home após login
    } catch {
      alert("Credenciais inválidas ou usuário não encontrado");
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full p-6 border border-gray-700 rounded bg-gray-900 shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-white">Entrar</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Entrar
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
