"use client";

import { Zap, CalendarDays, Info, Download } from "lucide-react";

interface Props {
  tarjetaClase: string;
  metaMensual: number | null;
  existeMeta: boolean;
  setMetaMensual: (value: number | null) => void;
  eliminarMetaMensual: () => void;
  confirmarYGuardarMeta: () => void;
  mesSeleccionado: number | "todos";
  meses: string[];
  anioSeleccionado: number;
  fechaColombia: string;
  obtenerPromedioMes: (mes: number) => number;
  modoNoche: boolean;
  UMBRAL_CONSUMO_ALTO: number;
  resumenDias: { D: number; F: number; H: number };
  coloresDias: { D: string; F: string; H: string };
  handleExportarExcel: () => void;
}

export default function ConsumoEnergiaTarjetas({
  tarjetaClase,
  metaMensual,
  existeMeta,
  setMetaMensual,
  eliminarMetaMensual,
  confirmarYGuardarMeta,
  mesSeleccionado,
  meses,
  anioSeleccionado,
  fechaColombia,
  obtenerPromedioMes,
  modoNoche,
  UMBRAL_CONSUMO_ALTO,
  resumenDias,
  coloresDias,
  handleExportarExcel,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      {/* ================= META MENSUAL ENERGÍA ================= */}
      <div className={`p-6 rounded-xl ${tarjetaClase}`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-semibold opacity-80">
            Meta mensual de energía
          </h4>
          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
            <Zap size={30} />
          </div>
        </div>

        <input
          type="number"
          value={metaMensual ?? ""}
          placeholder={existeMeta ? "Editar meta…" : "Crear meta…"}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "") {
              setMetaMensual(null); // 🔑 CLAVE
            } else {
              setMetaMensual(Number(value));
            }
          }}

          onKeyDown={(e) => {
            if (e.key !== "Enter") return;

            e.preventDefault();

            // 🔴 VACÍO → ELIMINAR META
            if (metaMensual === null || metaMensual === undefined) {
              if (existeMeta) {
                eliminarMetaMensual();
              }
              return;
            }

            // 🟡 0 o negativo → NO PERMITIDO
            if (metaMensual <= 0) {
              return;
            }

            // 🟢 CREAR / EDITAR
            confirmarYGuardarMeta();
          }}

          className="
            w-full text-3xl font-bold text-yellow-600 tracking-tight
            bg-transparent outline-none text-center
          "
        />
        <p className="text-xs mt-1 opacity-60 text-center">
          {existeMeta
            ? "Editando meta existente del mes"
            : "No hay meta definida, crea una nueva"}
        </p>

        <p className="text-xs mt-1 opacity-60 text-center">
          Consumo objetivo del mes (kWh)
        </p>
      </div>

      {/* ================= MES + FECHA ================= */}
      <div className={`p-6 rounded-xl ${tarjetaClase}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold opacity-80">
            Mes en seguimiento
          </h4>
          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
            <CalendarDays size={30} />
          </div>
        </div>

        <p className="text-xl font-bold text-yellow-600">
          {mesSeleccionado === "todos"
            ? "Todos los meses"
            : meses[typeof mesSeleccionado === "number" ? mesSeleccionado : 0]}{" "}
          {anioSeleccionado}
        </p>

        <p className="text-sm opacity-60 mt-1 capitalize">
          {fechaColombia}
        </p>
      </div>

      {/* Promedio actual mensual energía */}
      <div className={`p-6 rounded-xl ${tarjetaClase} relative overflow-hidden`}>
        {/* efecto glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <h4 className="text-sm font-semibold opacity-80">
            Promedio actual mensual
          </h4>

          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 shadow-sm">
            <Zap size={30} />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-3xl font-extrabold text-yellow-500 tracking-tight">
            {mesSeleccionado === "todos"
              ? "—"
              : `${obtenerPromedioMes(typeof mesSeleccionado === "number" ? mesSeleccionado : 0).toFixed(2)} kWh`}
          </p>

          <p className="text-xs mt-2 opacity-70">
            {mesSeleccionado === "todos"
              ? "Selecciona un mes para ver el promedio"
              : `Promedio diario de consumo en ${meses[typeof mesSeleccionado === "number" ? mesSeleccionado : 0]} ${anioSeleccionado}`}
          </p>

          {mesSeleccionado !== "todos" && typeof mesSeleccionado === "number" && (
            <div className="mt-4">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  obtenerPromedioMes(mesSeleccionado) > UMBRAL_CONSUMO_ALTO
                    ? modoNoche
                      ? "bg-red-950 text-red-300 border border-red-800"
                      : "bg-red-100 text-red-700 border border-red-200"
                    : modoNoche
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-80"></span>
                {obtenerPromedioMes(mesSeleccionado) > UMBRAL_CONSUMO_ALTO
                  ? "Consumo promedio alto"
                  : "Consumo promedio estable"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CLASIFICACIÓN DE DÍAS ================= */}
      <div className={`p-5 rounded-xl ${tarjetaClase}`}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold opacity-80">
            Clasificación de días
          </h4>
          <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-600">
            <Info size={16} />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-md ${coloresDias.D}`}
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              Domingos (D)
            </div>
            <span className="text-sm font-semibold">
              {resumenDias.D}
            </span>
          </div>

          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-md ${coloresDias.F}`}
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Festivos (F)
            </div>
            <span className="text-sm font-semibold">
              {resumenDias.F}
            </span>
          </div>

          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-md ${coloresDias.H}`}
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              Hábiles (H)
            </div>
            <span className="text-sm font-semibold">
              {resumenDias.H}
            </span>
          </div>
        </div>

        {mesSeleccionado === "todos" && (
          <p className="text-[11px] mt-2 opacity-60 text-center">
            Selecciona un mes para ver el resumen
          </p>
        )}
      </div>

      {/* ================= EXPORTAR ENERGÍA ================= */}
      <div className={`p-6 rounded-xl ${tarjetaClase}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-80">
            Exportar energía
          </h4>
          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
            <Download size={30} />
          </div>
        </div>

        <button
          onClick={handleExportarExcel}
          className="
            w-full py-3 px-4 rounded-xl
            bg-gradient-to-r from-yellow-400 to-amber-500
            hover:from-yellow-500 hover:to-amber-600
            active:scale-[0.98]
            text-white font-semibold tracking-wide
            flex items-center justify-center gap-2
            transition-all duration-200
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
          "
        >
          <Download size={18} />
          <span>Exportar Datos</span>
        </button>
      </div>
    </div>
  );
}
