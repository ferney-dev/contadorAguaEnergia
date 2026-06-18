"use client";

import { Search, Layers, CalendarDays, Filter } from "lucide-react";
import { MESES } from "./constants";

interface Props {
  modoNoche: boolean;
  card: string;
  subCard: string;
  busqueda: string;
  setBusqueda: (value: string) => void;
  filtroArea: string;
  setFiltroArea: (value: string) => void;
  filtroAnio: string;
  setFiltroAnio: (value: string) => void;
  filtroMes: string;
  setFiltroMes: (value: string) => void;
  areas: { id: number; nombre: string }[];
}

export default function TonnerFiltros({
  modoNoche,
  card,
  subCard,
  busqueda,
  setBusqueda,
  filtroArea,
  setFiltroArea,
  filtroAnio,
  setFiltroAnio,
  filtroMes,
  setFiltroMes,
  areas,
}: Props) {
  return (
    <div className={`p-5 sm:p-6 mb-6 rounded-3xl ${card}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 rounded-2xl bg-red-500/10">
          <Filter className="text-red-500" size={22} />
        </div>
        <div>
          <h3 className="font-bold text-xl">Filtros avanzados</h3>
          <p className="text-sm opacity-70">
            Filtra por búsqueda, área, año y mes (formato BD).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* BUSCADOR */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${subCard}`}>
          <Search className="text-blue-500" size={20} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* ÁREA */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${subCard}`}>
          <Layers className="text-red-500" size={20} />
          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Todas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* AÑO */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${subCard}`}>
          <CalendarDays className="text-purple-500" size={20} />
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Año</option>
            {[2026, 2027, 2028, 2029, 2030, 2031, 2032].map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        {/* MES */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${subCard}`}>
          <CalendarDays className="text-green-500" size={20} />
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Todos los meses</option>
            {MESES.map((mes) => (
              <option key={mes.valor} value={mes.valor}>
                {mes.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
