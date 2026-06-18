"use client";

import { Filter, Calendar, CalendarDays, Hash, Tag } from "lucide-react";

interface Props {
  buscadorClase: string;
  inputClase: string;
  mesSeleccionado: number | "todos";
  setMesSeleccionado: (value: number | "todos") => void;
  meses: string[];
  anioSeleccionado: number;
  setAnioSeleccionado: (value: number) => void;
  aniosDisponibles: number[];
  filtroDia: string;
  setFiltroDia: (value: string) => void;
  filtroTipoDia: "todos" | "domingos" | "festivos" | "habiles";
  setFiltroTipoDia: (value: "todos" | "domingos" | "festivos" | "habiles") => void;
}

export default function ConsumoEnergiaFiltros({
  buscadorClase,
  inputClase,
  mesSeleccionado,
  setMesSeleccionado,
  meses,
  anioSeleccionado,
  setAnioSeleccionado,
  aniosDisponibles,
  filtroDia,
  setFiltroDia,
  filtroTipoDia,
  setFiltroTipoDia,
}: Props) {
  return (
    <div className={`p-6 rounded-xl ${buscadorClase}`}>
      {/* TÍTULO */}
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
          <Filter size={18} />
        </div>
        <div>
          <h3 className="font-semibold">
            Buscador avanzado
          </h3>
          <p className="text-sm opacity-70">
            Filtra el consumo de energía por mes, año, día o tipo de día
          </p>
        </div>
      </div>

      {/* CAMPOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* MES */}
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium flex items-center gap-2">
            <Calendar size={14} className="text-yellow-600" />
            Mes
          </label>

          <div className="relative">
            <select
              className={`w-full p-3 pl-10 rounded-lg ${inputClase}`}
              value={mesSeleccionado}
              onChange={(e) =>
                setMesSeleccionado(
                  e.target.value === "todos"
                    ? "todos"
                    : Number(e.target.value)
                )
              }
            >
              <option value="todos">Todos los meses</option>
              {meses.map((mes, i) => (
                <option key={i} value={i}>
                  {mes}
                </option>
              ))}
            </select>

            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* AÑO */}
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium flex items-center gap-2">
            <Calendar size={14} className="text-yellow-600" />
            Año
          </label>

          <div className="relative">
            <select
              className={`w-full p-3 pl-10 rounded-lg ${inputClase}`}
              value={anioSeleccionado}
              onChange={(e) =>
                setAnioSeleccionado(Number(e.target.value))
              }
            >
              {aniosDisponibles.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* DÍA */}
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium flex items-center gap-2">
            <Hash size={14} className="text-yellow-600" />
            Día (opcional)
          </label>

          <div className="relative">
            <input
              type="number"
              min={1}
              max={31}
              placeholder="Ej: 15"
              className={`w-full p-3 pl-10 rounded-lg ${inputClase}`}
              value={filtroDia}
              onChange={(e) =>
                setFiltroDia(e.target.value)
              }
            />

            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* TIPO DE DÍA */}
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium flex items-center gap-2">
            <Tag size={14} className="text-yellow-600" />
            Tipo de día
          </label>

          <div className="relative">
            <select
              className={`w-full p-3 pl-10 rounded-lg ${inputClase}`}
              value={filtroTipoDia}
              onChange={(e) =>
                setFiltroTipoDia(e.target.value as any)
              }
            >
              <option value="todos">Todos</option>
              <option value="domingos">Domingos</option>
              <option value="festivos">Festivos</option>
              <option value="habiles">Hábiles</option>
            </select>

            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
