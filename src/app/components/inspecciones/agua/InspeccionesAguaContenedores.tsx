"use client";

import { CalendarDays, Plus } from "lucide-react";
import { CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { exportarSanitariosPDF } from "@/app/utils/exportadorSanitariosPDF";

interface Props {
  modoNoche: boolean;
  estilos: {
    inputSuave: string;
  };
  fechaActual: string;
  inspecciones: any[];
  setMostrarModal: (value: boolean) => void;
  finalizarInspeccion: () => void;
  mesFiltro?: string;
  anioFiltro?: string;
}

export default function InspeccionesAguaContenedores({
  modoNoche,
  estilos,
  fechaActual,
  inspecciones,
  setMostrarModal,
  finalizarInspeccion,
  mesFiltro = "Todos",
  anioFiltro = "Todos",
}: Props) {
  let totalC = 0;
  let totalNC = 0;

  // Filtrar inspecciones por mes y año seleccionados (fecha como string para evitar problemas de zona horaria)
  const inspeccionesFiltradas = inspecciones.filter((r) => {
    if (!r.fecha) return false;
    const fechaStr = r.fecha.split("T")[0]; // "2025-06-15"
    const [anioR, mesR] = fechaStr.split("-");
    const anioCoincide = anioFiltro === "Todos" || anioR === anioFiltro;
    const mesCoincide  = mesFiltro  === "Todos" || mesR === mesFiltro;
    return anioCoincide && mesCoincide;
  });

  inspeccionesFiltradas.forEach((r) => {
    totalC +=
      Number(r.sanitarios_c || 0) +
      Number(r.orinales_c || 0) +
      Number(r.duchas_c || 0) +
      Number(r.lavamanos_c || 0) +
      Number(r.llaves_c || 0);

    totalNC +=
      Number(r.sanitarios_nc || 0) +
      Number(r.orinales_nc || 0) +
      Number(r.duchas_nc || 0) +
      Number(r.lavamanos_nc || 0) +
      Number(r.llaves_nc || 0);
  });

  const totalGeneral = totalC + totalNC;

  const cards = [
    {
      titulo: "Cumplen",
      valor: totalC,
      icono: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      titulo: "No cumplen",
      valor: totalNC,
      icono: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      titulo: "Total",
      valor: totalGeneral,
      icono: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mt-6 mb-2 max-w-xl mx-auto">
        {cards.map((c, i) => {
          const Icono = c.icono;

          return (
            <div
              key={i}
              className={`rounded-xl px-3 py-3 border shadow-sm transition-all duration-300 
              hover:shadow-md hover:-translate-y-0.5 text-center
              ${modoNoche 
                ? "bg-[#1a1a1a] border-[#2e2e2e]" 
                : "bg-white border-gray-200"
              }`}
            >
              <div className={`mx-auto w-fit p-2 rounded-lg ${c.bg}`}>
                <Icono className={`w-4 h-4 ${c.color}`} />
              </div>

              <p className={`text-[10px] mt-2 ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>
                {c.titulo}
              </p>

              <h3 className={`text-sm font-bold ${modoNoche ? "text-white" : "text-gray-800"}`}>
                {c.valor}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Indicador de período activo */}
      <p className={`text-[10px] text-center mb-4 ${modoNoche ? "text-gray-500" : "text-gray-400"}`}>
        {mesFiltro !== "Todos" || anioFiltro !== "Todos"
          ? `Mostrando: ${mesFiltro !== "Todos" ? `mes ${mesFiltro}` : "todos los meses"}${anioFiltro !== "Todos" ? ` · ${anioFiltro}` : ""}`
          : "Mostrando: todos los registros"
        }
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div
          className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${estilos.inputSuave}`}
        >
          <CalendarDays size={18} />
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs opacity-80">
              Fecha de inspección
            </span>
            <span className="text-xs sm:text-sm font-semibold">
              {fechaActual}
            </span>
          </div>
        </div>

        <div
          className={`rounded-2xl px-3 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${estilos.inputSuave}`}
        >
          <button
            onClick={() => setMostrarModal(true)}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-sm font-semibold transition ${
              modoNoche
                ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md"
                : "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-sm"
            } hover:scale-105 active:scale-95`}
          >
            <Plus size={16} />
            Nueva inspección sanitaria
          </button>

          <button
            onClick={() => exportarSanitariosPDF(inspecciones)}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-sm font-semibold transition ${
              modoNoche
                ? "bg-gradient-to-r from-orange-700 to-orange-500 text-white shadow-md"
                : "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-sm"
            } hover:scale-105 active:scale-95`}
          >
            🚿 Exportar PDF
          </button>
        </div>
      </div>
    </>
  );
}
