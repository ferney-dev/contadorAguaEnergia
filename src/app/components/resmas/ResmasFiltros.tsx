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
  card,
  busqueda,
  setBusqueda,
  anioSeleccionado,
  setAnioSeleccionado,
  aniosDisponibles,
  nuevaArea,
  setNuevaArea,
  crearArea,
}: Props) {
  const tarjetaSuave = modoNoche
    ? "bg-[#161616] border border-white/10"
    : "bg-white border border-gray-200";

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className={`flex items-center gap-3 rounded-3xl px-4 py-3 ${tarjetaSuave}`}>
          <Search className="text-blue-500" size={18} />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar área..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className={`flex items-center gap-3 rounded-3xl px-4 py-3 ${tarjetaSuave}`}>
          <CalendarRange className="text-emerald-500" size={18} />
          <select
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
            className="w-full bg-transparent text-sm outline-none"
          >
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio} className="text-slate-900">
                Año {anio}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className={`flex items-center gap-3 rounded-3xl px-4 py-3 ${tarjetaSuave}`}>
          <Plus className="text-violet-500" size={18} />
          <input
            type="text"
            value={nuevaArea}
            onChange={(e) => setNuevaArea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") crearArea();
            }}
            placeholder="Crear área y guardar con Enter..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}
