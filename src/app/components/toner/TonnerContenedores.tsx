"use client";

import { FileText, Package, Layers, TrendingUp } from "lucide-react";

interface Props {
  card: string;
  modoNoche: boolean;
  totalRegistros: number;
  totalCantidad: number;
  totalAreasConUso: number;
}

export default function TonnerContenedores({ modoNoche, totalRegistros, totalCantidad, totalAreasConUso }: Props) {
  const kpis = [
    {
      label: "Registros totales",
      valor: totalRegistros,
      icono: FileText,
      desde: "from-violet-600",
      hasta: "to-purple-500",
      glow: "shadow-violet-500/30",
      texto: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Tonners en stock",
      valor: totalCantidad,
      icono: Package,
      desde: "from-emerald-600",
      hasta: "to-green-400",
      glow: "shadow-emerald-500/30",
      texto: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Áreas activas",
      valor: totalAreasConUso,
      icono: Layers,
      desde: "from-blue-600",
      hasta: "to-cyan-400",
      glow: "shadow-blue-500/30",
      texto: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Promedio por área",
      valor: totalAreasConUso > 0 ? (totalCantidad / totalAreasConUso).toFixed(1) : 0,
      icono: TrendingUp,
      desde: "from-orange-600",
      hasta: "to-amber-400",
      glow: "shadow-orange-500/30",
      texto: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {kpis.map((k, i) => {
        const Icono = k.icono;
        return (
          <div
            key={i}
            className={`relative rounded-2xl p-4 md:p-5 overflow-hidden border transition hover:-translate-y-0.5 hover:shadow-lg ${k.glow}
              ${modoNoche ? "bg-[#161616] border-white/8" : "bg-white border-gray-100 shadow-sm"}`}
          >
            {/* fondo decorativo */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${k.desde} ${k.hasta} opacity-10 blur-xl`} />

            <div className="flex items-start justify-between relative">
              <div>
                <p className={`text-xs font-medium mb-1 ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>{k.label}</p>
                <p className={`text-3xl font-black ${modoNoche ? "text-white" : "text-gray-800"}`}>{k.valor}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${k.bg}`}>
                <Icono className={`w-5 h-5 ${k.texto}`} />
              </div>
            </div>

            {/* barra inferior degradada */}
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${k.desde} ${k.hasta} opacity-60`} />
          </div>
        );
      })}
    </div>
  );
}
