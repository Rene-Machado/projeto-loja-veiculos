import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
  const imageUrl =
    vehicle.imagePaths && vehicle.imagePaths.length > 0
      ? (() => {
          const seg = vehicle.imagePaths[0].split('/').map(encodeURIComponent).join('/');
          return `http://localhost:8080/files/${seg}`;
        })()
      : "/placeholder-car.jpg";

  return (
    <div className="border border-gray-700 rounded shadow p-4 flex flex-col h-full bg-gray-900 hover:border-gray-500 transition-colors">
      <div className="w-full h-56 bg-gray-800 rounded overflow-hidden flex items-center justify-center mb-2">
        <img
          src={imageUrl}
          alt={vehicle.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mt-2 line-clamp-2 text-white">{vehicle.title}</h2>
      <p className="text-sm text-gray-400 line-clamp-2 flex-grow">{vehicle.description}</p>
      <p className="mt-2 font-bold text-lg text-green-400">R$ {vehicle.price?.toLocaleString("pt-BR") || "N/A"}</p>
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="mt-3 inline-block bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-center transition-colors"
      >
        Ver detalhes
      </Link>
    </div>
  );
}
