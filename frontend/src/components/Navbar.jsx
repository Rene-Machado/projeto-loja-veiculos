import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full shadow-md p-4 bg-gray-900 border-b border-gray-700">
      <div className="max-w-full mx-0 px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600">
          Lojas veículos
        </Link>

        <div className="flex gap-4 items-center">
          <Link 
            to="/" 
            className="bg-red-600 text-white px-3 py-1 rounded font-semibold hover:bg-red-700 transition-colors"
          >
            Veículos
          </Link>

          {/* botão só aparece para ADMIN */}
          {user?.role === "ADMIN" && (
            <Link
              to="/vehicles/new"
              className="bg-white text-black px-3 py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
            >
              + Cadastrar Veículo
            </Link>
          )}

          {/* login/logout */}
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                Olá, {user.email} ({user.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-black px-3 py-1 rounded font-semibold hover:bg-gray-200 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
