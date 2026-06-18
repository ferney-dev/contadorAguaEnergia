"use client";

import { Line, Bar } from "react-chartjs-2";
import { FileText, Printer, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textSoft: string;
  dataResmas: any;
  dataTonner: any;
  opcionesArea: any;
  opcionesBarras: any;
  totalResmas: number;
  totalTonner: number;
}

export default function DashboardGraficasResmasTonner({
  cardBg,
  cardBorder,
  textColor,
  textSoft,
  dataResmas,
  dataTonner,
  opcionesArea,
  opcionesBarras,
  totalResmas,
  totalTonner,
}: Props) {
  // Calcular estadísticas para resmas
  const resmasData = dataResmas.datasets[0].data;
  const resmasMax = Math.max(...resmasData);
  const resmasMin = Math.min(...resmasData.filter((v: number) => v > 0));
  const resmasAvg = resmasData.reduce((a: number, b: number) => a + b, 0) / 12;
  const resmasLastMonth = resmasData[resmasData.length - 1];
  const resmasPrevMonth = resmasData[resmasData.length - 2] || 0;
  const resmasTrend = resmasLastMonth > resmasPrevMonth ? "up" : resmasLastMonth < resmasPrevMonth ? "down" : "stable";

  // Calcular estadísticas para tonner
  const tonnerData = dataTonner.datasets[0].data;
  const tonnerMax = Math.max(...tonnerData);
  const tonnerMin = Math.min(...tonnerData.filter((v: number) => v > 0));
  const tonnerAvg = tonnerData.reduce((a: number, b: number) => a + b, 0) / 12;
  const tonnerLastMonth = tonnerData[tonnerData.length - 1];
  const tonnerPrevMonth = tonnerData[tonnerData.length - 2] || 0;
  const tonnerTrend = tonnerLastMonth > tonnerPrevMonth ? "up" : tonnerLastMonth < tonnerPrevMonth ? "down" : "stable";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      {/* RESMAS */}
      <div className={`p-6 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBg} ${cardBorder}`}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-500/10 shadow-[0_0_12px_rgba(34,197,94,0.4)]">
              <FileText size={20} className="text-green-500" />
            </div>
            <div>
              <h3 className={`font-semibold text-lg tracking-wide ${textColor}`}>
                Consumo de Resmas
              </h3>
              <p className="text-xs opacity-60">
                Control anual de uso de papel
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            resmasTrend === "up" ? "bg-red-500/10 text-red-500" :
            resmasTrend === "down" ? "bg-green-500/10 text-green-500" :
            "bg-gray-500/10 text-gray-500"
          }`}>
            {resmasTrend === "up" ? <TrendingUp size={14} /> :
             resmasTrend === "down" ? <TrendingDown size={14} /> :
             <Minus size={14} />}
          </div>
        </div>

        {/* TOTAL */}
        <div className="mb-6 text-center">
          <p className="text-4xl font-bold text-green-500 tracking-tight">
            {totalResmas.toLocaleString()}
          </p>
          <span className={`text-sm ${textSoft}`}>
            Total anual
          </span>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`p-3 rounded-xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs ${textSoft} mb-1`}>Promedio</p>
            <p className="text-lg font-bold text-green-500">{resmasAvg.toFixed(1)}</p>
          </div>
          <div className={`p-3 rounded-xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs ${textSoft} mb-1`}>Máximo</p>
            <p className="text-lg font-bold text-green-500">{resmasMax}</p>
          </div>
          <div className={`p-3 rounded-xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs ${textSoft} mb-1`}>Mínimo</p>
            <p className="text-lg font-bold text-green-500">{resmasMin || 0}</p>
          </div>
        </div>

        {/* TENDENCIA MES ACTUAL */}
        <div className={`mb-4 p-3 rounded-xl ${resmasTrend === "up" ? "bg-red-500/5 border-red-500/20" : resmasTrend === "down" ? "bg-green-500/5 border-green-500/20" : "bg-gray-500/5 border-gray-500/20"} border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {resmasTrend === "up" ? <ArrowUpRight size={16} className="text-red-500" /> :
               resmasTrend === "down" ? <ArrowDownRight size={16} className="text-green-500" /> :
               <Minus size={16} className="text-gray-500" />}
              <span className={`text-sm font-medium ${textColor}`}>
                Mes actual: {resmasLastMonth} resmas
              </span>
            </div>
            <span className={`text-xs font-semibold ${
              resmasTrend === "up" ? "text-red-500" :
              resmasTrend === "down" ? "text-green-500" :
              "text-gray-500"
            }`}>
              {resmasTrend === "up" ? `+${((resmasLastMonth - resmasPrevMonth) / resmasPrevMonth * 100).toFixed(1)}%` :
               resmasTrend === "down" ? `${((resmasLastMonth - resmasPrevMonth) / resmasPrevMonth * 100).toFixed(1)}%` :
               "0%"}
            </span>
          </div>
        </div>

        {/* GRAFICA */}
        <div className="mt-4">
          <Line data={dataResmas} options={opcionesArea} />
        </div>
      </div>

      {/* TONNER */}
      <div className={`p-6 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBg} ${cardBorder}`}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.4)]">
              <Printer size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className={`font-semibold text-lg tracking-wide ${textColor}`}>
                Consumo de Tonner
              </h3>
              <p className="text-xs opacity-60">
                Control de impresiones
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            tonnerTrend === "up" ? "bg-red-500/10 text-red-500" :
            tonnerTrend === "down" ? "bg-green-500/10 text-green-500" :
            "bg-gray-500/10 text-gray-500"
          }`}>
            {tonnerTrend === "up" ? <TrendingUp size={14} /> :
             tonnerTrend === "down" ? <TrendingDown size={14} /> :
             <Minus size={14} />}
          </div>
        </div>

        {/* TOTAL */}
        <div className="mb-6 text-center">
          <p className="text-4xl font-bold text-blue-500 tracking-tight">
            {totalTonner.toLocaleString()}
          </p>
          <span className={`text-sm ${textSoft}`}>
            Total anual
          </span>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`p-3 rounded-xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs ${textSoft} mb-1`}>Promedio</p>
            <p className="text-lg font-bold text-blue-500">{tonnerAvg.toFixed(1)}</p>
          </div>
          <div className={`p-3 rounded-xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs ${textSoft} mb-1`}>Máximo</p>
            <p className="text-lg font-bold text-blue-500">{tonnerMax}</p>
          </div>
          <div className={`p-3 rounded-xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs ${textSoft} mb-1`}>Mínimo</p>
            <p className="text-lg font-bold text-blue-500">{tonnerMin || 0}</p>
          </div>
        </div>

        {/* TENDENCIA MES ACTUAL */}
        <div className={`mb-4 p-3 rounded-xl ${tonnerTrend === "up" ? "bg-red-500/5 border-red-500/20" : tonnerTrend === "down" ? "bg-green-500/5 border-green-500/20" : "bg-gray-500/5 border-gray-500/20"} border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tonnerTrend === "up" ? <ArrowUpRight size={16} className="text-red-500" /> :
               tonnerTrend === "down" ? <ArrowDownRight size={16} className="text-green-500" /> :
               <Minus size={16} className="text-gray-500" />}
              <span className={`text-sm font-medium ${textColor}`}>
                Mes actual: {tonnerLastMonth} tonners
              </span>
            </div>
            <span className={`text-xs font-semibold ${
              tonnerTrend === "up" ? "text-red-500" :
              tonnerTrend === "down" ? "text-green-500" :
              "text-gray-500"
            }`}>
              {tonnerTrend === "up" ? `+${((tonnerLastMonth - tonnerPrevMonth) / tonnerPrevMonth * 100).toFixed(1)}%` :
               tonnerTrend === "down" ? `${((tonnerLastMonth - tonnerPrevMonth) / tonnerPrevMonth * 100).toFixed(1)}%` :
               "0%"}
            </span>
          </div>
        </div>

        {/* GRAFICA */}
        <div className="mt-4">
          <Bar data={dataTonner} options={opcionesBarras} />
        </div>
      </div>
    </div>
  );
}
