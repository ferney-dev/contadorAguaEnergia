"use client";

import { Search, Filter } from "lucide-react";
import type { UseInspeccionesAguaReturn } from "../../../hooks/useInspeccionesAgua";

interface Props {
  modoNoche: boolean;
  estilos: UseInspeccionesAguaReturn["estilos"];
  busqueda: string;
  setBusqueda: (value: string) => void;
  anioFiltro: string;
  setAnioFiltro: (value: string) => void;
  mesFiltro: string;
  setMesFiltro: (value: string) => void;
  aniosDisponibles: string[];
  MESES: UseInspeccionesAguaReturn["MESES"];
  dataBackend: any[];
}

export default function InspeccionesAguaFiltros({
  modoNoche,
  estilos,
  busqueda,
  setBusqueda,
  anioFiltro,
  setAnioFiltro,
  mesFiltro,
  setMesFiltro,
  aniosDisponibles,
  MESES,
  dataBackend,
}: Props) {
  return (
    <div className={`rounded-2xl p-4 ${estilos.inputSuave}`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <h3 className="text-sm sm:text-base font-semibold">
            Filtros de búsqueda
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por área"
            className={`w-full rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none ${estilos.input}`}
          />
        </div>

        <select
          value={anioFiltro}
          onChange={(e) => setAnioFiltro(e.target.value)}
          className={`rounded-xl px-3 py-2.5 text-sm outline-none ${estilos.input}`}
        >
          {aniosDisponibles.map((anio) => (
            <option key={anio} value={anio}>
              Año: {anio}
            </option>
          ))}
        </select>

        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className={`rounded-xl px-3 py-2.5 text-sm outline-none ${estilos.input}`}
        >
          {MESES.map((mes) => (
            <option key={mes.value} value={mes.value}>
              Mes: {mes.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          />
          <input
            type="text"
            placeholder="Nueva área + Enter"
            className={`w-full rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none ${estilos.input}`}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                const input = e.target as HTMLInputElement;
                const valor = input.value.trim();

                if (!valor) return;

                try {
                  const existe = dataBackend.some(
                    (a) =>
                      String(a?.nombre || "").toLowerCase().trim() ===
                      valor.toLowerCase()
                  );

                  if (existe) {
                    // Aquí podrías mostrar un mensaje de error
                    return;
                  }

                  const res = await fetch("/api/areas-sanitarias", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: valor }),
                  });

                  if (res.ok) {
                    input.value = "";
                    // Aquí podrías recargar las áreas
                  }
                } catch (error) {
                  console.error("Error creando área:", error);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
