import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function EditVehicle() {
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
    mileage: "",
    price: "",
    type: "CAR",
  });
  const [images, setImages] = useState([]);
  const [replace, setReplace] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setAuthError("Você precisa estar logado como ADMIN para editar veículos.");
    }
  }, [user]);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const resp = await api.get(`/api/vehicles/${id}`);
        const v = resp.data;
        setForm({
          title: v.title || "",
          description: v.description || "",
          year: v.year || "",
          mileage: v.mileage || "",
          price: v.price || "",
          type: v.type || "CAR",
        });
      } catch (err) {
        console.error("Erro ao buscar veículo:", err);
        setAuthError("Veículo não encontrado");
      } finally {
        setLoading(false);
      }
    }
    if (user && user.role === "ADMIN") {
      fetchVehicle();
    }
  }, [id, user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFiles(e) {
    setImages(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();

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

      images.forEach((file) => fd.append("images", file));

      const token = localStorage.getItem("token");

      const query = `?replace=${replace}`;
      const resp = await api.put(`/api/admin/vehicles/${id}${query}`, fd, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      alert("Veículo atualizado com sucesso!");
      console.log("Atualizado:", resp.data);
      navigate(`/vehicles/${id}`);
    } catch (err) {
      console.error("Erro ao editar:", err);
      if (err.response?.status === 403) {
        setAuthError("Você não tem permissão para editar este veículo.");
        alert("Erro 403: Acesso negado.");
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
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white p-6">
        Carregando...
      </div>
    );

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-900 p-6 rounded shadow border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Editar Veículo #{id}</h2>

        {authError && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}

        {!user || user.role !== "ADMIN" ? (
          <div className="bg-yellow-900 border border-yellow-700 p-4 rounded text-center">
            <p className="text-yellow-200 font-semibold mb-3">Acesso Restrito</p>
            <p className="text-yellow-300 mb-4">
              Apenas administradores podem editar veículos.
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

            <label className="text-sm text-gray-400">Adicionar imagens (opcional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="text-gray-400"
            />

            <label className="flex items-center gap-2 text-gray-300 mt-2">
              <input
                type="checkbox"
                checked={replace}
                onChange={(e) => setReplace(e.target.checked)}
              />
              Substituir imagens existentes
            </label>
            <p className="text-xs text-gray-400">
              Se marcado, todas as imagens atuais serão removidas e substituídas pelas novas.
              Se desmarcado, as novas imagens serão adicionadas às existentes.
            </p>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white p-2 rounded disabled:opacity-60 hover:bg-blue-700 transition-colors"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/vehicles/${id}`)}
                className="flex-1 bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
