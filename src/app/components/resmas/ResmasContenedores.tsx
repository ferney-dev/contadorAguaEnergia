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
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* ÁREAS */}
      <div className={`relative overflow-hidden rounded-3xl p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Áreas visibles
            </p>
            <p className="mt-2 text-3xl font-extrabold text-blue-500">
              {resumen.totalAreas}
            </p>
          </div>

          <div className="rounded-2xl bg-blue-500/15 p-3">
            <Building2 className="text-blue-500" size={22} />
          </div>
        </div>

        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl" />
      </div>

      {/* REGISTROS */}
      <div className={`relative overflow-hidden rounded-3xl p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Total mes actual ({nombreMesActual})
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-500">
              {totalMesActual}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-500/15 p-3">
            <Files className="text-emerald-500" size={22} />
          </div>
        </div>

        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />
      </div>

      {/* TOTAL */}
      <div className={`relative overflow-hidden rounded-3xl p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Total general
            </p>
            <p className="mt-2 text-3xl font-extrabold text-violet-500">
              {resumen.totalCantidad}
            </p>
          </div>

          <div className="rounded-2xl bg-violet-500/15 p-3">
            <BarChart3 className="text-violet-500" size={22} />
          </div>
        </div>

        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl" />
      </div>
    </div>
  );
}
