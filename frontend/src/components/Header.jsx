import React from "react";

export default function Header({ search, setSearch, brands, selectedBrand, setSelectedBrand }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-blue-600">
          AutoFinder
        </h1>

        {/* BARRA DE BUSCA */}
        <input
          type="text"
          placeholder="Buscar modelo (ex: Onix)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-72"
        />

        {/* DROPDOWN DE MARCAS */}
        <select
          className="border px-4 py-2 rounded-lg w-full md:w-48"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Todas as marcas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
