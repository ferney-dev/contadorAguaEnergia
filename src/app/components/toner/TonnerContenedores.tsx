"use client";

import { FileText, Package, Layers } from "lucide-react";

interface Props {
  card: string;
  totalRegistros: number;
  totalCantidad: number;
  totalAreasConUso: number;
}

export default function TonnerContenedores({
  card,
  totalRegistros,
  totalCantidad,
  totalAreasConUso,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`rounded-2xl p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-70">Registros totales</p>
            <h3 className="text-3xl font-extrabold mt-1">{totalRegistros}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10">
            <FileText className="text-blue-500" size={28} />
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-70">Cantidad total</p>
            <h3 className="text-3xl font-extrabold mt-1">{totalCantidad}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-green-500/10">
            <Package className="text-green-500" size={28} />
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-70">Áreas con uso</p>
            <h3 className="text-3xl font-extrabold mt-1">{totalAreasConUso}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-red-500/10">
            <Layers className="text-red-500" size={28} />
          </div>
        </div>
      </div>
    </div>
  );
}
