"use client";

import { Bar } from "react-chartjs-2";
import { FaTint, FaLightbulb } from "react-icons/fa";

interface Props {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textSoft: string;
  modoNoche: boolean;
  dataAgua: any;
  dataEnergia: any;
  opcionesBarras: any;
  metaAgua: number;
  metaEnergia: number;
}

export default function DashboardGraficasBarras({
  cardBg,
  cardBorder,
  textColor,
  textSoft,
  modoNoche,
  dataAgua,
  dataEnergia,
  opcionesBarras,
  metaAgua,
  metaEnergia,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${textColor}`}>
          <FaTint className="text-blue-500" />
          Consumo mensual de Agua
          <span className="ml-2 text-sm font-semibold text-blue-400">
            (Meta: {metaAgua || 0} L)
          </span>
        </h3>

        {/* LEYENDA SEMÁFORO */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-10 h-3 rounded bg-[#0000CC]"></div>
            <span className={textColor}>Óptimo (0 - 54)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-3 rounded bg-[#3E6102]"></div>
            <span className={textColor}>Normal (55 - 59)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-3 rounded bg-[#facc15]"></div>
            <span className={textColor}>Alerta (60 - 64)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-3 rounded bg-[#ef4444]"></div>
            <span className={textColor}>Crítico (65+)</span>
          </div>
        </div>

        <Bar data={dataAgua} options={opcionesBarras} />
      </div>

      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${textColor}`}>
          <FaLightbulb className="text-yellow-500" />
          Consumo mensual de Energía
          <span className="ml-2 text-sm font-semibold text-yellow-400">
            (Meta: {metaEnergia || 0} kWh)
          </span>
        </h3>

        {/* LEYENDA SEMÁFORO ENERGÍA */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 rounded-full bg-[#0000CC]"></div>
            <span className={textColor}>Óptimo (0-1514)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 rounded-full bg-[#3E6102]"></div>
            <span className={textColor}>Normal (1515-1683)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 rounded-full bg-[#facc15]"></div>
            <span className={textColor}>Alerta (1684-1852)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 rounded-full bg-[#ef4444]"></div>
            <span className={textColor}>Crítico (1853+)</span>
          </div>
        </div>

        <Bar data={dataEnergia} options={opcionesBarras} />
      </div>
    </div>
  );
}
