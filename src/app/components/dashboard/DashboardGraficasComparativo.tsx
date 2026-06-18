"use client";

import { Doughnut } from "react-chartjs-2";
import { FaTint, FaLightbulb } from "react-icons/fa";

interface Props {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textSoft: string;
  meses: string[];
  coloresMeses: string[];
  comparativoAgua: number[];
  comparativoEnergia: number[];
  valoresAgua: number[];
  valoresEnergia: number[];
  totalAguaComparativo: number;
  totalEnergiaComparativo: number;
}

export default function DashboardGraficasComparativo({
  cardBg,
  cardBorder,
  textColor,
  textSoft,
  meses,
  coloresMeses,
  comparativoAgua,
  comparativoEnergia,
  valoresAgua,
  valoresEnergia,
  totalAguaComparativo,
  totalEnergiaComparativo,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* AGUA */}
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${textColor}`}>
          <FaTint className="text-blue-500" />
          Comparativo de Agua por Mes PDS
        </h3>

        {/* LEYENDA DE MESES */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {meses.map((mes, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: coloresMeses[i] }}
              />
              <span style={{ color: textColor }}>
                {mes}
              </span>
            </div>
          ))}
        </div>

        {/* GRAFICA */}
        <div className="flex justify-center items-center h-[320px]">
          <div className="relative w-[320px] h-[320px]">
            <Doughnut
              data={{
                labels: meses,
                datasets: [
                  {
                    label: "Consumo Agua",
                    data: comparativoAgua.map(v => v || 0.0001),
                    backgroundColor: coloresMeses,
                    borderWidth: 3,
                    borderColor: "#ffffff",
                    hoverOffset: 15
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "55%",
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const i = context.dataIndex;
                        return [
                          `Mes: ${context.label}`,
                          `Consumo: ${comparativoAgua[i]} m³`,
                          `Valor: $${valoresAgua[i].toLocaleString()}`
                        ];
                      }
                    }
                  }
                }
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-blue-500">
                {totalAguaComparativo.toLocaleString()} m³
              </span>
              <span className="text-sm font-semibold text-gray-400">
                ${valoresAgua.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-500">
                Total consumo / total a pagar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ENERGIA */}
      <div className={`p-6 rounded-xl shadow-lg border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${textColor}`}>
          <FaLightbulb className="text-yellow-500" />
          Comparativo de Energía por Mes PDS
        </h3>

        {/* LEYENDA MESES */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {meses.map((mes, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: coloresMeses[i] }}
              />
              <span style={{ color: textColor }}>
                {mes}
              </span>
            </div>
          ))}
        </div>

        {/* GRAFICA */}
        <div className="flex justify-center items-center h-[320px]">
          <div className="relative w-[320px] h-[320px]">
            <Doughnut
              data={{
                labels: meses,
                datasets: [
                  {
                    label: "Consumo Energía",
                    data: comparativoEnergia.map(v => v || 0.0001),
                    backgroundColor: coloresMeses,
                    borderWidth: 3,
                    borderColor: "#ffffff",
                    hoverOffset: 15
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "55%",
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const i = context.dataIndex;
                        return [
                          `Mes: ${context.label}`,
                          `Consumo: ${comparativoEnergia[i]} kWh`,
                          `Valor: $${valoresEnergia[i].toLocaleString()}`
                        ];
                      }
                    }
                  }
                }
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-yellow-500">
                {totalEnergiaComparativo.toLocaleString()} kWh
              </span>
              <span className="text-sm font-semibold text-gray-400">
                ${valoresEnergia.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-500">
                Total consumo / total a pagar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
