"use client";

import { Line } from "react-chartjs-2";
import { FaWater, FaBolt } from "react-icons/fa";

interface Props {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  dataAreaAgua: any;
  dataAreaEnergia: any;
  opcionesArea: any;
  metaAgua: number;
  metaEnergia: number;
}

export default function DashboardGraficasArea({
  cardBg,
  cardBorder,
  textColor,
  dataAreaAgua,
  dataAreaEnergia,
  opcionesArea,
  metaAgua,
  metaEnergia,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${textColor}`}>
          <FaWater className="text-blue-500" /> Total Meta de Agua
          <span className="ml-2 text-sm font-semibold text-blue-400">
            (Meta: {metaAgua || 0} L)
          </span>
        </h3>
        <Line data={dataAreaAgua} options={opcionesArea} />
      </div>

      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${textColor}`}>
          <FaBolt className="text-yellow-500" /> Total Meta de Energía
          <span className="ml-2 text-sm font-semibold text-yellow-400">
            (Meta: {metaEnergia || 0} kWh)
          </span>
        </h3>
        <Line data={dataAreaEnergia} options={opcionesArea} />
      </div>
    </div>
  );
}
