import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { formatVehicleType } from "../utils/formatType";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const resp = await api.get(`/api/vehicles/${id}`);
        setVehicle(resp.data);
      } catch (err) {
        console.error("Erro ao buscar veículo:", err);
        setError("Veículo não encontrado");
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!vehicle) return <div className="p-6">Veículo não encontrado</div>;

  const isAdmin = user && user.role === "ADMIN";

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja deletar este veículo? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/admin/vehicles/${id}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      alert("Veículo deletado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      if (err.response?.status === 403) {
        alert("Você não tem permissão para deletar este veículo.");
      } else if (err.response?.status === 401) {
        alert("Sua sessão expirou. Faça login novamente.");
      } else {
        alert(`Erro ao deletar: ${err.response?.data?.message || err.message}`);
      }
    }
  }

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">{vehicle.title || `Veículo #${id}`}</h1>
            <p className="text-lg text-gray-400 mt-2">
              {vehicle.year ? `${vehicle.year} - ` : ""}
              {formatVehicleType(vehicle.type)}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/vehicles/${id}/edit`)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded shadow border border-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {vehicle.price && (
              <div>
                <p className="text-gray-400 font-semibold">Preço</p>
                <p className="text-2xl font-bold text-green-400">R$ {vehicle.price.toLocaleString("pt-BR")}</p>
              </div>
            )}
            {vehicle.mileage !== null && (
              <div>
                <p className="text-gray-400 font-semibold">Quilometragem</p>
                <p className="text-2xl font-bold text-white">{vehicle.mileage.toLocaleString("pt-BR")} km</p>
              </div>
            )}
          </div>

          {vehicle.description && (
            <div className="mb-6">
              <p className="text-gray-400 font-semibold mb-2">Descrição</p>
              <p className="text-gray-200">{vehicle.description}</p>
            </div>
          )}

          {vehicle.imagePaths && vehicle.imagePaths.length > 0 && (
            <div>
              <p className="text-gray-400 font-semibold mb-4">Imagens</p>
              <div className="grid grid-cols-3 gap-4">
                {vehicle.imagePaths.map((imgPath, idx) => (
                  <div key={idx} className="w-full h-56 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={`http://localhost:8080/files/${imgPath}`}
                      alt={`Imagem ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
