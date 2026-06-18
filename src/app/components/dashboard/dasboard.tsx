"use client";

import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { FC } from "react";
import { FaTint, FaBolt } from "react-icons/fa";
import DashboardToolbar from "./DashboardToolbar";
import DashboardTarjetas from "./DashboardTarjetas";
import DashboardGraficasBarras from "./DashboardGraficasBarras";
import DashboardGraficasArea from "./DashboardGraficasArea";
import DashboardGraficasComparativo from "./DashboardGraficasComparativo";
import DashboardGraficasResmasTonner from "./DashboardGraficasResmasTonner";
import { useDashboard } from "../../hooks/useDashboard";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  modoNoche: boolean;
}

const DashboardInicio: FC<Props> = ({ modoNoche }) => {
  const {
    anio,
    setAnio,
    anioActual,
    meses,
    consumoAguaMensual,
    consumoEnergiaMensual,
    totalAguaAnual,
    totalEnergiaAnual,
    promedioAguaReal,
    promedioEnergiaReal,
    metaAgua,
    metaEnergia,
    metasAguaMensual,
    metasEnergiaMensual,
    comparativoAgua,
    comparativoEnergia,
    resmasMensual,
    tonnerMensual,
    totalResmas,
    totalTonner,
    valoresAgua,
    valoresEnergia,
    totalAguaComparativo,
    totalEnergiaComparativo,
    cardBg,
    cardBorder,
    textColor,
    textSoft,
    fondo,
    opcionesArea,
    opcionesBarras,
    dataAgua,
    dataEnergia,
    dataAreaAgua,
    dataAreaEnergia,
    dataResmas,
    dataTonner,
    dataDiferenciaAguaMensual,
    dataDiferenciaEnergiaMensual,
    coloresMeses,
  } = useDashboard(modoNoche);

  return (
    <div className={`w-full min-h-screen p-6 ${fondo}`}>
      <DashboardToolbar
        modoNoche={modoNoche}
        anio={anio}
        anioActual={anioActual}
        setAnio={setAnio}
        meses={meses}
        consumoAguaMensual={consumoAguaMensual}
        consumoEnergiaMensual={consumoEnergiaMensual}
        totalAguaAnual={totalAguaAnual}
        totalEnergiaAnual={totalEnergiaAnual}
        promedioAguaReal={promedioAguaReal}
        promedioEnergiaReal={promedioEnergiaReal}
        metaAgua={metaAgua}
        metaEnergia={metaEnergia}
      />

      <DashboardTarjetas
        cardBg={cardBg}
        cardBorder={cardBorder}
        textColor={textColor}
        textSoft={textSoft}
        modoNoche={modoNoche}
        totalAguaAnual={totalAguaAnual}
        totalEnergiaAnual={totalEnergiaAnual}
        promedioAguaReal={promedioAguaReal}
        promedioEnergiaReal={promedioEnergiaReal}
      />

      <DashboardGraficasBarras
        cardBg={cardBg}
        cardBorder={cardBorder}
        textColor={textColor}
        textSoft={textSoft}
        modoNoche={modoNoche}
        dataAgua={dataAgua}
        dataEnergia={dataEnergia}
        opcionesBarras={opcionesBarras}
        metaAgua={metaAgua}
        metaEnergia={metaEnergia}
      />

      <DashboardGraficasArea
        cardBg={cardBg}
        cardBorder={cardBorder}
        textColor={textColor}
        dataAreaAgua={dataAreaAgua}
        dataAreaEnergia={dataAreaEnergia}
        opcionesArea={opcionesArea}
        metaAgua={metaAgua}
        metaEnergia={metaEnergia}
      />

      {/* === DIFERENCIA VS META · MENSUAL === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mt-10">
        {/* AGUA */}
        <div className={`p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
          <h4 className={`text-sm sm:text-base font-semibold mb-4 sm:mb-6 flex items-center gap-2 ${textSoft}`}>
            <FaTint className="text-blue-500 text-base sm:text-lg" />
            Diferencia vs Meta · Agua (Mensual)
          </h4>
          <div className="h-[320px] lg:h-[380px]">
            <Bar
              data={dataDiferenciaAguaMensual}
              options={{ ...opcionesBarras, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* ENERGÍA */}
        <div className={`p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
          <h4 className={`text-sm sm:text-base font-semibold mb-4 sm:mb-6 flex items-center gap-2 ${textSoft}`}>
            <FaBolt className="text-yellow-500 text-base sm:text-lg" />
            Diferencia vs Meta · Energía (Mensual)
          </h4>
          <div className="h-[320px] lg:h-[380px]">
            <Bar
              data={dataDiferenciaEnergiaMensual}
              options={{ ...opcionesBarras, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <DashboardGraficasComparativo
        cardBg={cardBg}
        cardBorder={cardBorder}
        textColor={textColor}
        textSoft={textSoft}
        meses={meses}
        coloresMeses={coloresMeses}
        comparativoAgua={comparativoAgua}
        comparativoEnergia={comparativoEnergia}
        valoresAgua={valoresAgua}
        valoresEnergia={valoresEnergia}
        totalAguaComparativo={totalAguaComparativo}
        totalEnergiaComparativo={totalEnergiaComparativo}
      />

      <DashboardGraficasResmasTonner
        cardBg={cardBg}
        cardBorder={cardBorder}
        textColor={textColor}
        textSoft={textSoft}
        dataResmas={dataResmas}
        dataTonner={dataTonner}
        opcionesArea={opcionesArea}
        opcionesBarras={opcionesBarras}
        totalResmas={totalResmas}
        totalTonner={totalTonner}
      />
    </div>
  );
};


export default DashboardInicio;