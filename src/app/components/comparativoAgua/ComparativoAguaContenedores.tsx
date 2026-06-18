"use client";

import { Building2, DollarSign, Droplets } from "lucide-react";
import { generarReciboPDF } from "../../utils/recibo";
import type { FilaComparativo } from "../../hooks/useComparativoAgua";

interface Props {
  card: string;
  datosEnergia: FilaComparativo[];
}

export default function ComparativoAguaContenedores({
  card,
  datosEnergia,
}: Props) {
  const consumoTotal = datosEnergia.reduce(
    (acc, d) =>
      acc + d.datos.reduce((a, b) => a + (Number(b.M3) || 0), 0),
    0
  );

  const totalAgua = datosEnergia.reduce(
    (acc, d) =>
      acc + d.datos.reduce((a, b) => a + (Number(b.valor) || 0), 0),
    0
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        className={`p-6 rounded-2xl flex items-center justify-between relative overflow-hidden
${card} shadow-lg hover:scale-[1.02] transition`}
      >
        <div>
          <p className="text-sm opacity-70 flex items-center gap-2">
            💧 Consumo total
          </p>

          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            {consumoTotal} m³
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
          <Droplets size={30} />
        </div>

        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div
        className={`p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden
${card} shadow-lg hover:scale-[1.02] transition`}
      >
        <div>
          <p className="text-sm opacity-70 flex items-center gap-2">
            📄 Comparativo general
          </p>

          <p className="text-xs opacity-60 mt-1">
            Exporta un resumen completo en PDF
          </p>
        </div>

        <button
          onClick={() => generarReciboPDF(datosEnergia)}
          className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition"
        >
          📥 Descargar PDF
        </button>

        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500 opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div
        className={`p-6 rounded-2xl flex items-center justify-between relative overflow-hidden
${card} shadow-lg hover:scale-[1.02] transition`}
      >
        <div>
          <p className="text-sm opacity-70 flex items-center gap-2">
            🏢 Sedes activas
          </p>

          <h2 className="text-3xl font-bold text-emerald-500 mt-2">
            {datosEnergia.length}
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg">
          <Building2 size={30} />
        </div>

        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-green-500 opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div
        className={`p-6 rounded-2xl flex items-center justify-between relative overflow-hidden
${card} shadow-lg hover:scale-[1.02] transition`}
      >
        <div>
          <p className="text-sm opacity-70 flex items-center gap-2">
            💰 Total agua
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            ${totalAgua.toLocaleString()}
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
          <DollarSign size={30} />
        </div>

        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
