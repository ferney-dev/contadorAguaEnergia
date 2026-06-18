"use client";

import { Building2, Calendar, Filter, TrendingUp } from "lucide-react";

interface Props {
  modoNoche: boolean;
  card: string;
  anio: string;
  setAnio: (value: string) => void;
  years: number[];
  tipoTotal: string;
  setTipoTotal: (value: string) => void;
  sedeSeleccionada: string;
  setSedeSeleccionada: (value: string) => void;
  sedesDB: any[];
}

export default function ComparativoEnergiaFiltros({
  modoNoche,
  card,
  anio,
  setAnio,
  years,
  tipoTotal,
  setTipoTotal,
  sedeSeleccionada,
  setSedeSeleccionada,
  sedesDB,
}: Props) {
  return (
    <div
      className={`p-6 rounded-2xl ${card} shadow-md border ${modoNoche ? "border-[#333]" : "border-gray-200"}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-yellow-500/10 shadow-[0_0_12px_rgba(234,179,8,0.4)]">
          <Filter size={20} className="text-yellow-500" />
        </div>

        <div>
          <h3 className="font-semibold text-lg tracking-wide">
            Filtros Avanzados
          </h3>
          <p className="text-xs opacity-60">
            Filtra el consumo de energía por diferentes criterios
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div className="relative group w-full">
          <Calendar
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />

          <select
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className={`w-full p-3 pl-10 rounded-xl border text-sm font-medium transition shadow-sm
        ${
          modoNoche
            ? "bg-[#1f1f1f] border-[#333] text-white focus:ring-2 focus:ring-yellow-500"
            : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-yellow-400"
        }
        `}
          >
            <option value="">Todos los años</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group w-full">
          <TrendingUp
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />

          <select
            value={tipoTotal}
            onChange={(e) => setTipoTotal(e.target.value)}
            className={`w-full p-3 pl-10 rounded-xl border text-sm shadow-sm
        ${
          modoNoche
            ? "bg-[#1f1f1f] border-[#333] text-white"
            : "bg-white border-gray-300 text-gray-800"
        }
        `}
          >
            <option value="todos">Todos</option>
            <option value="principal">Total sede principal</option>
            <option value="receptorias">Total receptorías</option>
          </select>
        </div>

        <div className="relative group w-full">
          <Building2
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />

          <select
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
            className={`w-full p-3 pl-10 rounded-xl border text-sm font-medium transition shadow-sm
  ${
    modoNoche
      ? "bg-[#1f1f1f] border-[#333] text-white focus:ring-2 focus:ring-yellow-500"
      : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-yellow-400"
  }
  `}
          >
            <option value="">Todas las sedes</option>

            {Array.isArray(sedesDB) &&
              sedesDB.map((sede: any) => (
                <option key={sede.id} value={sede.nombre}>
                  {sede.nombre}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
