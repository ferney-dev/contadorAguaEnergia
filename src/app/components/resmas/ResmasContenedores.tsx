"use client";

import { BarChart3, Building2, Files, TrendingUp } from "lucide-react";

interface Props {
  card: string;
  modoNoche: boolean;
  resumen: { totalAreas: number; totalRegistros: number; totalCantidad: number };
  totalMesActual: number;
  nombreMesActual: string;
}

export default function ResmasContenedores({ modoNoche, resumen, totalMesActual, nombreMesActual }: Props) {
  const kpis = [
    {
      label: "Áreas registradas",
      valor: resumen.totalAreas,
      icono: Building2,
      bg: "bg-[#1f1f1f]",
      bgLight: "bg-gray-900/8",
      texto: "text-white",
      textoLight: "text-gray-800",
      glow: "from-[#1f1f1f] to-gray-700",
    },
    {
      label: `Resmas en ${nombreMesActual}`,
      valor: totalMesActual,
      icono: Files,
      bg: "bg-[#C40000]/15",
      bgLight: "bg-[#C40000]/10",
      texto: "text-red-400",
      textoLight: "text-[#C40000]",
      glow: "from-[#C40000] to-rose-400",
    },
    {
      label: "Total resmas año",
      valor: resumen.totalCantidad,
      icono: BarChart3,
      bg: "bg-[#1f1f1f]",
      bgLight: "bg-gray-900/8",
      texto: "text-white",
      textoLight: "text-gray-800",
      glow: "from-[#1f1f1f] to-gray-600",
    },
    {
      label: "Meses con datos",
      valor: resumen.totalRegistros,
      icono: TrendingUp,
      bg: "bg-[#C40000]/15",
      bgLight: "bg-[#C40000]/10",
      texto: "text-red-400",
      textoLight: "text-[#C40000]",
      glow: "from-[#C40000] to-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {kpis.map((k, i) => {
        const Icono = k.icono;
        return (
          <div key={i} className={`relative rounded-2xl p-4 md:p-5 overflow-hidden border transition hover:-translate-y-0.5 hover:shadow-lg
            ${modoNoche ? "bg-[#1f1f1f] border-white/8 shadow-black/30" : "bg-white border-gray-100 shadow-sm"}`}>
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${k.glow} opacity-10 blur-xl`} />
            <div className="flex items-start justify-between relative">
              <div>
                <p className={`text-xs font-medium mb-1 ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>{k.label}</p>
                <p className={`text-3xl font-black ${modoNoche ? "text-white" : "text-gray-800"}`}>{k.valor}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${modoNoche ? k.bg : k.bgLight}`}>
                <Icono className={`w-5 h-5 ${modoNoche ? k.texto : k.textoLight}`} />
              </div>
            </div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${k.glow} opacity-70`} />
          </div>
        );
      })}
    </div>
  );
}
