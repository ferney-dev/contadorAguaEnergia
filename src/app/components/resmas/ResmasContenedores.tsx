"use client";

import { BarChart3, Building2, Files } from "lucide-react";

interface Props {
  card: string;
  resumen: {
    totalAreas: number;
    totalRegistros: number;
    totalCantidad: number;
  };
  totalMesActual: number;
  nombreMesActual: string;
}

export default function ResmasContenedores({
  card,
  resumen,
  totalMesActual,
  nombreMesActual,
}: Props) {
  const items = [
    {
      label: "Áreas visibles",
      value: resumen.totalAreas,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/12",
      glow: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: `Total mes actual (${nombreMesActual})`,
      value: totalMesActual,
      icon: Files,
      color: "text-emerald-500",
      bg: "bg-emerald-500/12",
      glow: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Total general",
      value: resumen.totalCantidad,
      icon: BarChart3,
      color: "text-violet-500",
      bg: "bg-violet-500/12",
      glow: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`relative overflow-hidden rounded-[20px] border p-6 ${card} ${item.border}`}
          >
            {/* fondo decorativo */}
            <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${item.glow}`} />

            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
                  {item.label}
                </p>
                <p className={`text-4xl font-extrabold leading-none ${item.color}`}>
                  {item.value}
                </p>
              </div>
              <div className={`shrink-0 rounded-2xl p-3.5 ${item.bg}`}>
                <Icon className={item.color} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
