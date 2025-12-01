import { useEffect, useState } from "react";
import VehicleCard from "../components/VehicleCard";
import api from "../api/axios";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const resp = await api.get("/api/vehicles", {
          params: {
            q: query,
            page: 0,
            size: 20,
          },
        });
        setVehicles(resp.data.content);
      } catch (err) {
        console.error("Erro ao carregar veículos:", err);
      }
    }

    fetchVehicles();
  }, [query]);

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      {/* Campo de busca no topo, sem título duplicado */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-400 p-2 rounded w-full md:w-1/3 text-black"
        />
      </div>

      {/* Lista de veículos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
