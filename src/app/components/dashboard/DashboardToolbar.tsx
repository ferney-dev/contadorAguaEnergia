"use client";

import { useState } from "react";
import { exportarResumenGeneral } from "../../utils/exportadorResumenGeneral";
import { exportarResumenPDF }     from "../../utils/exportadorResumenPDF";

interface Props {
  modoNoche: boolean;
  anio: number;
  anioActual: number;
  setAnio: (value: number) => void;
  meses: string[];
  consumoAguaMensual: number[];
  consumoEnergiaMensual: number[];
  totalAguaAnual: number;
  totalEnergiaAnual: number;
  promedioAguaReal: number;
  promedioEnergiaReal: number;
  metaAgua: number;
  metaEnergia: number;
}

export default function DashboardToolbar({
  modoNoche,
  anio,
  anioActual,
  setAnio,
}: Props) {
  const [exportandoXlsx, setExportandoXlsx] = useState(false);
  const [exportandoPdf,  setExportandoPdf]  = useState(false);

  const handleExcel = async () => {
    setExportandoXlsx(true);
    try { await exportarResumenGeneral(anio); }
    finally { setExportandoXlsx(false); }
  };

  const handlePdf = async () => {
    setExportandoPdf(true);
    try { await exportarResumenPDF(anio); }
    finally { setExportandoPdf(false); }
  };

  return (
    <div
      className={`
        w-full flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-4 mb-8 p-4 rounded-xl
        border backdrop-blur-md
        ${modoNoche
          ? "bg-white/10 border-white/20 text-white"
          : "bg-gray-50 border-gray-200 text-black"}
      `}
    >
      {/* SELECTOR DE AÑO */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${modoNoche ? "text-gray-300" : "text-gray-700"}`}>
          Año en análisis
        </span>
        <select
          value={anio}
          onChange={(e) => setAnio(parseInt(e.target.value))}
          className={`
            px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer
            ${modoNoche ? "bg-[#151515] border-gray-100 text-white" : "bg-white border-gray-300 text-black"}
            focus:ring-2 focus:ring-red-500 outline-none
          `}
        >
          {Array.from({ length: 10 }, (_, i) => anioActual - 2 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ACCIONES */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Drive */}
        <button
          onClick={() => window.open("https://drive.google.com/drive/u/0/folders/1JJ3SAsGBkipUVOdvQMjJ4n3RxaMXIS5q", "_blank")}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
            bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2"
        >
          ☁️ Ir a Drive
        </button>

        {/* Reporte Excel completo */}
        <button
          onClick={handleExcel}
          disabled={exportandoXlsx}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
            bg-emerald-600 hover:bg-emerald-700
            disabled:opacity-60 disabled:cursor-wait
            text-white shadow-md flex items-center gap-2"
        >
          {exportandoXlsx ? "⏳ Generando Excel..." : "📊 Reporte Excel SGA"}
        </button>

        {/* Reporte PDF completo */}
        <button
          onClick={handlePdf}
          disabled={exportandoPdf}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
            bg-[#C40000] hover:bg-[#8B0000]
            disabled:opacity-60 disabled:cursor-wait
            text-white shadow-md flex items-center gap-2"
        >
          {exportandoPdf ? "⏳ Generando PDF..." : "📄 Reporte PDF SGA"}
        </button>

      </div>
    </div>
  );
}
