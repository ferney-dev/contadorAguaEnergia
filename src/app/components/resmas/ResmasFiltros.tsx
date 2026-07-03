"use client";

import { CalendarRange, Plus, Search } from "lucide-react";

interface Props {
  modoNoche: boolean;
  card: string;
  busqueda: string;
  setBusqueda: (value: string) => void;
  anioSeleccionado: number;
  setAnioSeleccionado: (value: number) => void;
  aniosDisponibles: number[];
  nuevaArea: string;
  setNuevaArea: (value: string) => void;
  crearArea: () => void;
}

export default function ResmasFiltros({
  modoNoche,
  busqueda,
  setBusqueda,
  anioSeleccionado,
  setAnioSeleccionado,
  aniosDisponibles,
  nuevaArea,
  setNuevaArea,
  crearArea,
}: Props) {
  const inputBase = modoNoche
    ? "bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500"
    : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400";

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">

      {/* Buscar */}
      <div className="lg:col-span-4">
        <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>
          Buscar área
        </label>
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${inputBase}`}>
          <Search className="shrink-0 text-blue-500" size={16} />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre del área..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Año */}
      <div className="lg:col-span-3">
        <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>
          Año
        </label>
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${inputBase}`}>
          <CalendarRange className="shrink-0 text-emerald-500" size={16} />
          <select
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
            className="w-full bg-transparent text-sm outline-none"
          >
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio} className="text-slate-900">
                {anio}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nueva área */}
      <div className="lg:col-span-5">
        <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>
          Nueva área
        </label>
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${inputBase}`}>
          <Plus className="shrink-0 text-violet-500" size={16} />
          <input
            type="text"
            value={nuevaArea}
            onChange={(e) => setNuevaArea(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") crearArea(); }}
            placeholder="Escribir nombre y presionar Enter..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

    </div>
  );
}
