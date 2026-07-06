"use client";

import { Search, X } from "lucide-react";
import { MESES } from "./constants";

interface Props {
  modoNoche: boolean;
  card: string;
  subCard: string;
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroArea: string;
  setFiltroArea: (v: string) => void;
  filtroAnio: string;
  setFiltroAnio: (v: string) => void;
  filtroMes: string;
  setFiltroMes: (v: string) => void;
  areas: { id: number; nombre: string }[];
  totalFiltrados: number;
}

export default function TonnerFiltros({
  modoNoche,
  busqueda, setBusqueda,
  filtroArea, setFiltroArea,
  filtroAnio, setFiltroAnio,
  filtroMes, setFiltroMes,
  areas,
  totalFiltrados,
}: Props) {
  const inp = modoNoche
    ? "bg-[#1e1e1e] border-white/10 text-white placeholder-gray-500"
    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400";
  const chip = modoNoche
    ? "bg-[#252525] text-gray-300 border-[#333]"
    : "bg-gray-100 text-gray-600 border-gray-200";
  const sub = modoNoche ? "text-gray-400" : "text-gray-500";

  const hayFiltros = busqueda || filtroArea || filtroAnio || filtroMes;

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${modoNoche ? "bg-[#161616] border-white/8" : "bg-white border-gray-100 shadow-sm"}`}>

      {/* fila 1: búsqueda + selects */}
      <div className="flex flex-wrap gap-3">
        {/* buscador */}
        <div className={`flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inp}`}>
          <Search className="w-4 h-4 opacity-40 shrink-0" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar impresora, responsable, área..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="opacity-40 hover:opacity-100 transition shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* área */}
        <select
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          className={`rounded-2xl px-3 py-2.5 text-sm border outline-none ${inp}`}
        >
          <option value="">Todas las áreas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>

        {/* año */}
        <select
          value={filtroAnio}
          onChange={(e) => setFiltroAnio(e.target.value)}
          className={`rounded-2xl px-3 py-2.5 text-sm border outline-none ${inp}`}
        >
          <option value="">Todos los años</option>
          {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* fila 2: chips de meses */}
      <div className="flex flex-wrap gap-2">
        {MESES.map((m) => (
          <button
            key={m.valor}
            onClick={() => setFiltroMes(filtroMes === m.valor ? "" : m.valor)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
              ${filtroMes === m.valor
                ? "bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-400/20"
                : `${chip} hover:border-violet-400 hover:text-violet-500`
              }`}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      {/* fila 3: resumen + limpiar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className={`text-xs ${sub}`}>
          Mostrando <span className="font-bold">{totalFiltrados}</span> registro{totalFiltrados !== 1 ? "s" : ""}
          {filtroMes && <span className="ml-1">· {MESES.find(m => m.valor === filtroMes)?.nombre}</span>}
          {filtroAnio && <span className="ml-1">· {filtroAnio}</span>}
        </p>
        {hayFiltros && (
          <button
            onClick={() => { setBusqueda(""); setFiltroArea(""); setFiltroAnio(""); setFiltroMes(""); }}
            className={`text-xs px-3 py-1 rounded-full border transition font-semibold
              ${modoNoche ? "text-gray-400 border-[#333] hover:text-white hover:border-white/20" : "text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300"}`}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
