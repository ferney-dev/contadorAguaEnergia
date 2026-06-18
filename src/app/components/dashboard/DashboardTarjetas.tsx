"use client";

import { FaWater, FaBolt, FaChartLine, FaClipboardList } from "react-icons/fa";

interface Props {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textSoft: string;
  modoNoche: boolean;
  totalAguaAnual: number;
  totalEnergiaAnual: number;
  promedioAguaReal: number;
  promedioEnergiaReal: number;
}

export default function DashboardTarjetas({
  cardBg,
  cardBorder,
  textColor,
  textSoft,
  modoNoche,
  totalAguaAnual,
  totalEnergiaAnual,
  promedioAguaReal,
  promedioEnergiaReal,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* AGUA */}
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder} min-h-[180px]`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-bold text-lg ${textColor}`}>Consumo Anual Agua</h3>
          <div className={`p-3 rounded-full ${modoNoche ? "bg-blue-900/40" : "bg-blue-100"}`}>
            <FaWater className="text-blue-400 text-xl" />
          </div>
        </div>
        <p className="text-3xl font-bold text-blue-400">
          {totalAguaAnual.toLocaleString()}
          L
        </p>
        <span className={`text-sm ${textSoft}`}>Total del año</span>
      </div>

      {/* ENERGÍA */}
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder} min-h-[180px]`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-bold text-lg ${textColor}`}>Consumo Anual Energia</h3>
          <div className={`p-3 rounded-full ${modoNoche ? "bg-yellow-900/40" : "bg-yellow-100"}`}>
            <FaBolt className="text-yellow-500 text-xl" />
          </div>
        </div>
        <p className="text-3xl font-bold text-yellow-500">
          {totalEnergiaAnual.toLocaleString()}
          kWh
        </p>
        <span className={`text-sm ${textSoft}`}>Total del año</span>
      </div>

      {/* PROMEDIO AGUA */}
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder} min-h-[180px]`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-bold text-lg ${textColor}`}>Promedio Diario Agua</h3>
          <div className={`p-3 rounded-full ${modoNoche ? "bg-green-900/40" : "bg-green-100"}`}>
            <FaChartLine className="text-blue-500 text-xl" />
          </div>
        </div>
        <p className="text-3xl font-bold text-blue-700">
          {promedioAguaReal}
        </p>
        <span className={`text-sm ${textSoft}`}>L / día</span>
      </div>

      {/* PROMEDIO ENERGÍA */}
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder} min-h-[180px]`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-bold text-lg ${textColor}`}>Promedio Diario Energía</h3>
          <div className={`p-3 rounded-full ${modoNoche ? "bg-red-900/40" : "bg-red-100"}`}>
            <FaClipboardList className="text-orange-500 text-xl" />
          </div>
        </div>
        <p className="text-3xl font-bold text-orange-500">
          {promedioEnergiaReal}
        </p>
        <span className={`text-sm ${textSoft}`}>kWh / día</span>
      </div>
    </div>
  );
}
