import { useEffect, useState } from "react";
import VehicleCard from "../components/VehicleCard";
import api from "../api/axios";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const resp = await api.get("/api/vehicles", {
          params: { page: 0, size: 20 }
        });
        setVehicles(resp.data.content);
      } catch (err) {
        console.error("Erro ao carregar veículos:", err);
      }
    }

    fetchVehicles();
  }, []);

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
