"use client";

import { Search, X, CalendarRange } from "lucide-react";

interface Props {
  modoNoche: boolean;
  card: string;
  busqueda: string;
  setBusqueda: (v: string) => void;
  anioSeleccionado: number;
  setAnioSeleccionado: (v: number) => void;
  aniosDisponibles: number[];
  nuevaArea: string;
  setNuevaArea: (v: string) => void;
  crearArea: () => void;
}

export default function ResmasFiltros({
  modoNoche, busqueda, setBusqueda,
  anioSeleccionado, setAnioSeleccionado, aniosDisponibles,
  nuevaArea, setNuevaArea, crearArea,
}: Props) {
  const inp = modoNoche
    ? "bg-[#1e1e1e] border-white/10 text-white placeholder-gray-500"
    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400";
  const sub = modoNoche ? "text-gray-400" : "text-gray-500";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* buscador */}
      <div className={`flex-1 min-w-[180px] flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inp}`}>
        <Search className="w-4 h-4 opacity-40 shrink-0" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar área..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {busqueda && (
          <button onClick={() => setBusqueda("")} className="opacity-40 hover:opacity-100 transition shrink-0">
            <X size={14} />
          </button>
        )}
      </div>

      {/* selector año */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inp}`}>
        <CalendarRange className="w-4 h-4 text-indigo-500 shrink-0" />
        <select
          value={anioSeleccionado}
          onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
          className="bg-transparent outline-none text-sm"
        >
          {aniosDisponibles.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* nueva área */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border flex-1 min-w-[180px] ${inp}`}>
        <span className="text-indigo-500 font-bold text-sm shrink-0">+</span>
        <input
          value={nuevaArea}
          onChange={(e) => setNuevaArea(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") crearArea(); }}
          placeholder="Nueva área + Enter"
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {nuevaArea && (
          <button
            onClick={crearArea}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold transition hover:bg-indigo-700 active:scale-95"
          >
            Crear
          </button>
        )}
      </div>
    </div>
  );
}
