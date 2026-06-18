"use client";

import { LecturasPorAnio, LecturaDia, obtenerColorConsumoAgua } from "./utils";

interface Props {
  modoNoche: boolean;
  mesesARenderizar: number[];
  meses: string[];
  anioSeleccionado: number;
  lecturas: LecturasPorAnio;
  obtenerDiasDelMes: (mes: number) => Array<{ dia: number; tipo: string }>;
  obtenerDiasFiltrados: (mes: number) => Array<{ dia: number; tipo: string }>;
  totalMes: (mes: number) => string;
  filtroDia: string;
  filtroTipoDia: "todos" | "domingos" | "festivos" | "habiles";
  handleChange: (mes: number, dia: number, campo: "bodega2" | "bodega4", valor: string) => void;
  navegarConFlechas: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  eliminarAgua: (mes: number, dia: number, bodega: 1 | 2) => void;
  guardarAguaEnBD: (mes: number, dia: number, data: LecturaDia) => void;
}

export default function ConsumoAguaTabla({
  modoNoche,
  mesesARenderizar,
  meses,
  anioSeleccionado,
  lecturas,
  obtenerDiasDelMes,
  obtenerDiasFiltrados,
  totalMes,
  filtroDia,
  filtroTipoDia,
  handleChange,
  navegarConFlechas,
  eliminarAgua,
  guardarAguaEnBD,
}: Props) {
  return (
    <>
      {mesesARenderizar.map((mes) => {
        const diasMes = obtenerDiasDelMes(mes);

        const diasFiltradosMes = diasMes.filter(({ dia, tipo }) => {
          if (filtroDia && Number(filtroDia) !== dia) return false;
          if (filtroTipoDia === "domingos" && tipo !== "D") return false;
          if (filtroTipoDia === "festivos" && tipo !== "F") return false;
          if (filtroTipoDia === "habiles" && tipo !== "H") return false;
          return true;
        });

        return (
          <div key={mes} className="space-y-6 mt-12">
            {/* ======================= PRIMERA TABLA (RESUMEN + CALENDARIO) ======================= */}
            <div
              className={`
                rounded-xl border overflow-hidden font-sans
                ${modoNoche ? "border-gray-700 bg-[#0d0d0d]" : "border-gray-300 bg-white"}
              `}
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* ===== TOTAL DEL MES ===== */}
                    <tr>
                      <td
                        colSpan={diasMes.length}
                        className={`
                          text-center font-semibold tracking-wide
                          text-sm md:text-base p-3
                          border-b
                          ${modoNoche
                            ? "bg-[#141414] border-gray-700 text-emerald-400"
                            : "bg-blue-50 border-gray-300 text-blue-700"
                          }
                        `}
                      >
                        {meses[mes]} {anioSeleccionado} · Total consumido:{" "}
                        <span className="font-bold">{totalMes(mes)} m³</span>
                      </td>
                    </tr>

                    {/* ===== FILA DÍAS ===== */}
                    <tr>
                      {diasMes.map(({ dia, tipo }) => {
                        const color =
                          tipo === "D"
                            ? modoNoche
                              ? "bg-[#1a1a1a] text-gray-300"
                              : "bg-violet-100 text-violet-800"
                            : tipo === "F"
                              ? modoNoche
                                ? "bg-[#1f1f1f] text-gray-300"
                                : "bg-rose-100 text-rose-800"
                              : modoNoche
                                ? "bg-[#121212] text-gray-200"
                                : "bg-gray-100 text-gray-800";

                        return (
                          <td
                            key={dia}
                            className={`
                              text-center text-xs font-semibold
                              p-2 border
                              ${modoNoche ? "border-gray-700" : "border-gray-300"}
                              ${color}
                            `}
                          >
                            {dia}
                          </td>
                        );
                      })}
                    </tr>

                    {/* ===== FILA CONSUMO POR DÍA ===== */}
                    <tr>
                      {diasMes.map(({ dia, tipo }) => {
                        const d = lecturas?.[anioSeleccionado]?.[mes]?.[dia];
                        const total = d ? d.total2 + d.total4 : 0;

                        const colorConsumo = obtenerColorConsumoAgua(total, modoNoche);

                        const colorBase =
                          tipo === "D"
                            ? modoNoche
                              ? "bg-[#161616] text-gray-300"
                              : "bg-violet-100 text-violet-900"
                            : tipo === "F"
                              ? modoNoche
                                ? "bg-[#1b1b1b] text-gray-300"
                                : "bg-rose-100 text-rose-900"
                              : modoNoche
                                ? "bg-[#0b0b0b] text-gray-200"
                                : "bg-white text-gray-800";

                        return (
                          <td
                            key={dia}
                            className={`
                              h-8 text-center text-xs font-medium
                              border
                              ${modoNoche ? "border-gray-700" : "border-gray-300"}
                              ${total > 0 ? colorConsumo : colorBase}
                            `}
                          >
                            {total > 0 ? total.toFixed(2) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ======================= SEGUNDA TABLA ======================= */}
            <div
              className={`
                overflow-x-auto rounded-xl
                border
                ${modoNoche
                  ? "border-[#2a2a2a] bg-[#0d0d0d]"
                  : "border-gray-300 bg-white"}
                font-sans
              `}
            >
              <table className="w-full text-sm border-collapse">
                {/* ===== HEADER ===== */}
                <thead
                  className={
                    modoNoche
                      ? "bg-[#141414] text-gray-200"
                      : "bg-blue-50 text-blue-800"
                  }
                >
                  <tr>
                    {[
                      "Día",
                      "Tipo",
                      "Bodega 2",
                      "Bodega 4",
                      "Total Bodega 2",
                      "Total Bodega 4",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`
                          p-3 text-center font-semibold
                          border
                          ${modoNoche ? "border-gray-700" : "border-gray-300"}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* ===== BODY ===== */}
                <tbody>
                  {diasFiltradosMes.map(({ dia, tipo }) => {
                    const esBloqueado = tipo === "D" || tipo === "F";

                    const d = lecturas[anioSeleccionado]?.[mes]?.[dia] ?? {
                      bodega2: "",
                      bodega4: "",
                      total2: 0,
                      total4: 0,
                    };

                    return (
                      <tr
                        key={dia}
                        className={
                          tipo === "F"
                            ? modoNoche
                              ? "bg-[#3a1f2b] hover:bg-[#4a2736]"
                              : "bg-rose-100 hover:bg-rose-200"
                            : modoNoche
                              ? "odd:bg-[#0f0f0f] even:bg-[#151515] hover:bg-[#1f1f1f]"
                              : "odd:bg-white even:bg-gray-50 hover:bg-blue-50"
                        }
                      >
                        {/* DÍA */}
                        <td
                          className={`border p-2 text-center ${modoNoche
                            ? "border-gray-700 text-gray-200"
                            : "border-gray-300 text-gray-800"
                          }`}
                        >
                          {dia}
                        </td>

                        {/* TIPO */}
                        <td
                          className={`border p-2 text-center font-semibold ${modoNoche
                            ? "border-gray-700 text-gray-200"
                            : "border-gray-300 text-gray-800"
                          }`}
                        >
                          {tipo}
                        </td>

                        {/* ===== BODEGA 2 ===== */}
                        <td className={`border p-2 ${modoNoche ? "border-gray-700" : "border-gray-300"}`}>
                          <input
                            value={d.bodega2 ?? ""}
                            disabled={esBloqueado}
                            data-mes={mes}
                            data-dia={dia}
                            data-campo="bodega2"
                            onChange={(e) =>
                              handleChange(mes, dia, "bodega2", e.target.value)
                            }
                            onKeyDown={(e) => {
                              navegarConFlechas(e);

                              if (e.key === "Enter") {
                                e.preventDefault();

                                const valor = d.bodega2?.trim();
                                if (!valor) {
                                  eliminarAgua(mes, dia, 1);
                                  return;
                                }

                                guardarAguaEnBD(
                                  mes,
                                  dia,
                                  lecturas[anioSeleccionado]?.[mes]?.[dia]
                                );
                              }
                            }}
                            onBlur={() => {
                              const valor = d.bodega2?.trim();
                              if (valor) {
                                guardarAguaEnBD(
                                  mes,
                                  dia,
                                  lecturas[anioSeleccionado]?.[mes]?.[dia]
                                );
                              }
                            }}
                            className={`
                              w-full p-1 text-center rounded border
                              ${esBloqueado
                                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                : modoNoche
                                  ? "bg-[#0b0b0b] text-gray-200 border-gray-600"
                                  : "bg-white text-gray-800 border-gray-300"
                              }
                              focus:ring-2 focus:ring-blue-400 outline-none
                            `}
                          />
                        </td>

                        {/* ===== BODEGA 4 ===== */}
                        <td className={`border p-2 ${modoNoche ? "border-gray-700" : "border-gray-300"}`}>
                          <input
                            value={d.bodega4 ?? ""}
                            disabled={esBloqueado}
                            data-mes={mes}
                            data-dia={dia}
                            data-campo="bodega4"
                            onChange={(e) =>
                              handleChange(mes, dia, "bodega4", e.target.value)
                            }
                            onKeyDown={(e) => {
                              navegarConFlechas(e);

                              if (e.key === "Enter") {
                                e.preventDefault();

                                const valor = d.bodega4?.trim();
                                if (!valor) {
                                  eliminarAgua(mes, dia, 2);
                                  return;
                                }

                                guardarAguaEnBD(
                                  mes,
                                  dia,
                                  lecturas[anioSeleccionado]?.[mes]?.[dia]
                                );
                              }
                            }}
                            onBlur={() => {
                              const valor = d.bodega4?.trim();
                              if (valor) {
                                guardarAguaEnBD(
                                  mes,
                                  dia,
                                  lecturas[anioSeleccionado]?.[mes]?.[dia]
                                );
                              }
                            }}
                            className={`
                              w-full p-1 text-center rounded border
                              ${esBloqueado
                                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                : modoNoche
                                  ? "bg-[#0b0b0b] text-gray-200 border-gray-600"
                                  : "bg-white text-gray-800 border-gray-300"
                              }
                              focus:ring-2 focus:ring-blue-400 outline-none
                            `}
                          />
                        </td>

                        {/* ===== TOTALES ===== */}
                        <td
                          className={`border p-2 text-center font-semibold ${modoNoche
                            ? "border-gray-700 text-emerald-400"
                            : "border-gray-300 text-blue-700"
                          }`}
                        >
                          {d.total2}
                        </td>

                        <td
                          className={`border p-2 text-center font-semibold ${modoNoche
                            ? "border-gray-700 text-emerald-400"
                            : "border-gray-300 text-blue-700"
                          }`}
                        >
                          {d.total4}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </>
  );
}
