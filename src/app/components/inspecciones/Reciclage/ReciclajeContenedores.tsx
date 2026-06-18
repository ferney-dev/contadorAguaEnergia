"use client";

import { CalendarDays, Plus } from "lucide-react";
import { CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { exportarResiduosPDF } from "@/app/utils/exportadorResiduosPDF";

interface Props {
  modoNoche: boolean;
  estilos: Record<string, string>;
  fechaActual: string;
  inspecciones: any[];
  valores: Record<string, Record<number, { c?: string; nc?: string }>>;
  setMostrarModal: (value: boolean) => void;
  finalizarInspeccion: () => void;
}

export default function ReciclajeContenedores({
  modoNoche,
  estilos,
  fechaActual,
  inspecciones,
  valores,
  setMostrarModal,
  finalizarInspeccion,
}: Props) {
  let totalC = 0;
  let totalNC = 0;

  // Calcular totales usando valores locales + inspecciones guardadas
  inspecciones.forEach((r) => {
    totalC +=
      Number(r.reciclables_c || 0) +
      Number(r.ordinarios_c || 0) +
      Number(r.peligrosos_c || 0) +
      Number(r.presintos_c || 0);
    totalNC +=
      Number(r.reciclables_nc || 0) +
      Number(r.ordinarios_nc || 0) +
      Number(r.peligrosos_nc || 0) +
      Number(r.presintos_nc || 0);
  });

  // Sumar valores locales que aún no están guardados
  Object.values(valores).forEach((campoValores) => {
    Object.values(campoValores).forEach((val) => {
      totalC += Number(val.c || 0);
      totalNC += Number(val.nc || 0);
    });
  });

  const totalGeneral = totalC + totalNC;

  const cards = [
    { titulo: "Cumplen", valor: totalC, icono: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { titulo: "No cumplen", valor: totalNC, icono: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { titulo: "Total", valor: totalGeneral, icono: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mt-3 max-w-xl mx-auto">
        {cards.map((c, i) => {
          const Icono = c.icono;
          return (
            <div
              key={i}
              className={`rounded-xl px-3 py-3 border shadow-sm transition-all duration-300
              hover:shadow-md hover:-translate-y-0.5 text-center
              ${modoNoche ? "bg-[#1a1a1a] border-[#2e2e2e]" : "bg-white border-gray-200"}`}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${estilos.inputSuave}`}>
          <CalendarDays size={18} />
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs opacity-80">Fecha de inspección</span>
            <span className="text-xs sm:text-sm font-semibold">{fechaActual}</span>
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
            Nueva inspección de residuos
          </button>

          <button
            onClick={() => exportarResiduosPDF(inspecciones)}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-sm font-semibold transition ${
              modoNoche
                ? "bg-gradient-to-r from-orange-700 to-orange-500 text-white shadow-md"
                : "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-sm"
            } hover:scale-105 active:scale-95`}
          >
            ♻️ Exportar PDF
          </button>
        </div>
      </div>
    </>
  );
}
