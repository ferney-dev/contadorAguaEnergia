"use client";

import { exportarDashboardExcel } from "../../utils/exportadorgeneral";
import { exportarDashboardPDF } from "../../utils/exportadorDashboardPDF";

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
  meses,
  consumoAguaMensual,
  consumoEnergiaMensual,
  totalAguaAnual,
  totalEnergiaAnual,
  promedioAguaReal,
  promedioEnergiaReal,
  metaAgua,
  metaEnergia,
}: Props) {
  const handleExportarExcel = () => {
    exportarDashboardExcel({
      anio,
      meses,
      lecturasAgua: {},
      lecturasEnergia: {},
      totalAguaAnual,
      totalEnergiaAnual,
      promedioAguaReal,
      promedioEnergiaReal,
      metaAgua,
      metaEnergia,
    });
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
        <span
          className={`
        text-sm font-medium
        ${modoNoche ? "text-gray-300" : "text-gray-700"}
      `}
        >
          Año en análisis
        </span>

        <select
          value={anio}
          onChange={(e) => setAnio(parseInt(e.target.value))}
          className={`
        px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer
        ${modoNoche
                ? "bg-[#151515] border-gray-100 text-white"
                : "bg-white border-gray-300 text-black"}
        focus:ring-2 focus:ring-emerald-500 outline-none
      `}
        >
          {Array.from({ length: 10 }, (_, i) => anioActual - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* ACCIONES */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.open("https://drive.google.com/drive/u/0/folders/1JJ3SAsGBkipUVOdvQMjJ4n3RxaMXIS5q", "_blank")}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
  bg-blue-600 hover:bg-blue-700
  text-white shadow-md flex items-center gap-2"
        >
          ☁️ Ir a Drive
        </button>
        <button
          onClick={() =>
            exportarDashboardPDF({
              anio,
              meses,
              consumoAguaMensual,
              consumoEnergiaMensual,
              totalAguaAnual,
              totalEnergiaAnual,
              promedioAguaReal,
              promedioEnergiaReal,
              metaAgua,
              metaEnergia,
            })
          }
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
    bg-red-600 hover:bg-red-700
    text-white shadow-md flex items-center gap-2"
        >
          📄 Exportar PDF
        </button>

        <button
          onClick={handleExportarExcel}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
             bg-emerald-600 hover:bg-emerald-700
             text-white shadow-md flex items-center gap-2"
        >
          📊 Exportar a Excel
        </button>
      </div>
    </div>
  );
}
