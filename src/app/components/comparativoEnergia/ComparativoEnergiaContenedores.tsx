"use client";

import { Building2, DollarSign, Zap } from "lucide-react";
import { generarReciboEnergia } from "../../utils/reciboEnergia";
import type { FilaComparativo } from "../../hooks/useComparativoEnergia";

interface Props {
  card: string;
  datosEnergia: FilaComparativo[];
}

export default function ComparativoEnergiaContenedores({
  card,
  datosEnergia,
}: Props) {
  const consumoTotal = datosEnergia.reduce(
    (acc, d) =>
      acc + d.datos.reduce((a, b) => a + (Number(b.kWh) || 0), 0),
    0
  );

  const totalEnergia = datosEnergia.reduce(
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
            ⚡ Consumo total
          </p>

          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {consumoTotal} kWh
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg">
          <Zap size={30} />
        </div>

        <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500 opacity-20 rounded-full blur-2xl"></div>
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
          onClick={() => generarReciboEnergia(datosEnergia)}
          className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition"
        >
          📥 Descargar PDF
        </button>

        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-yellow-500 opacity-20 rounded-full blur-2xl"></div>
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
            💰 Total energía
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            ${totalEnergia.toLocaleString()}
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
          <DollarSign size={30} />
        </div>

        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-yellow-400 opacity-20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
