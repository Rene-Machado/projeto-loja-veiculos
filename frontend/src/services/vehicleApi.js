import api from "../api/axios";

// Lista todos os veículos (GET /api/vehicles)
export async function listarVeiculos() {
  const resp = await api.get("/api/vehicles");
  return resp.data.content; // porque o backend retorna Page<Vehicle>
}

// Busca um veículo por ID (GET /api/vehicles/{id})
export async function buscarVeiculo(id) {
  const resp = await api.get(`/api/vehicles/${id}`);
  return resp.data;
}
