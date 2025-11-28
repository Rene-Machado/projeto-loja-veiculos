import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { formatVehicleType } from "../utils/formatType";

export default function NewVehicle() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
    mileage: "",
    price: "",
    type: "CAR", // ou "MOTO"
  });
  const [images, setImages] = useState([]); // arquivos File
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Verificar se o usuário é ADMIN
  React.useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setAuthError("Você precisa estar logado como ADMIN para cadastrar veículos.");
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFiles(e) {
    setImages(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // vehicle JSON como parte 'vehicle'
      fd.append(
        "vehicle",
        new Blob(
          [
            JSON.stringify({
              title: form.title,
              description: form.description,
              year: form.year ? Number(form.year) : null,
              mileage: form.mileage ? Number(form.mileage) : null,
              price: form.price ? Number(form.price) : null,
              type: form.type,
            }),
          ],
          { type: "application/json" }
        )
      );

      // imagens (opcional)
      images.forEach((file) => fd.append("images", file));

      // O axios.interceptor adiciona Authorization automaticamente, mas para FormData
      // vamos garantir que está sendo enviado
      const token = localStorage.getItem("token");
      console.log("Token presente:", !!token);
      console.log("User role:", user?.role);

      const resp = await api.post("/api/admin/vehicles", fd, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });

      alert("Veículo cadastrado com sucesso!");
      console.log("Criado:", resp.data);

      if (resp.data && resp.data.id) navigate(`/vehicles/${resp.data.id}`);
      else navigate("/");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      console.error("Response status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      if (err.response?.status === 403) {
        setAuthError("Você não tem permissão para cadastrar veículos. Faça login como ADMIN.");
        alert("Erro 403: Acesso negado. Você precisa ser ADMIN.");
      } else if (err.response?.status === 401) {
        setAuthError("Sua sessão expirou. Faça login novamente.");
        alert("Erro 401: Sua sessão expirou. Faça login novamente.");
      } else if (err.response) {
        alert(
          `Erro ${err.response.status}: ${
            err.response.data?.message || JSON.stringify(err.response.data)
          }`
        );
      } else {
        alert("Erro de conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-900 p-6 rounded shadow border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Cadastrar Veículo</h2>

        {authError && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}

        {!user || user.role !== "ADMIN" ? (
          <div className="bg-yellow-900 border border-yellow-700 p-4 rounded text-center">
            <p className="text-yellow-200 font-semibold mb-3">Acesso Restrito</p>
            <p className="text-yellow-300 mb-4">
              Apenas administradores podem cadastrar veículos.
            </p>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ir para Login
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3">
            <input
              name="title"
              required
              placeholder="Título (ex: Honda Civic)"
              value={form.title}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
            />
            <textarea
              name="description"
              placeholder="Descrição"
              value={form.description}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                name="year"
                type="number"
                placeholder="Ano"
                value={form.year}
                onChange={handleChange}
                className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
              />
              <input
                name="mileage"
                type="number"
                placeholder="Quilometragem"
                value={form.mileage}
                onChange={handleChange}
                className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
              />
              <input
                name="price"
                type="number"
                placeholder="Preço (ex: 45000)"
                value={form.price}
                onChange={handleChange}
                className="bg-gray-800 text-white border border-gray-700 p-2 rounded placeholder-gray-500 focus:border-blue-500 outline-none"
              />
            </div>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-700 p-2 rounded focus:border-blue-500 outline-none"
            >
              <option value="CAR">Carro</option>
              <option value="MOTO">Moto</option>
            </select>

            <label className="text-sm text-gray-400">Imagens (opcional)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFiles}
              className="text-gray-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white p-2 rounded disabled:opacity-60 hover:bg-blue-700 transition-colors"
            >
              {loading ? "Enviando..." : "Cadastrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
