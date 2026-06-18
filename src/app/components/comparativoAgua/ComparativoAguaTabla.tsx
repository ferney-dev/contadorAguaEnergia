"use client";

import React from "react";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Droplets,
  MapPin,
  User,
} from "lucide-react";
import type {
  FilaComparativo,
  NuevaFila,
  UseComparativoAguaReturn,
} from "../../hooks/useComparativoAgua";
import {
  formatearDecimalInput,
  formatearNumeroInput,
  limpiarM3,
  limpiarNumero,
} from "../../components/comparativoAgua/utils";

interface Props {
  modoNoche: boolean;
  inicio: number;
  fin: number;
  meses: readonly string[];
  datosFiltrados: FilaComparativo[];
  datosEnergia: FilaComparativo[];
  nuevaFila: NuevaFila;
  mostrarTotales: boolean;
  inputsRef: UseComparativoAguaReturn["inputsRef"];
  editarFila: UseComparativoAguaReturn["editarFila"];
  editarCelda: UseComparativoAguaReturn["editarCelda"];
  editarNuevaFila: UseComparativoAguaReturn["editarNuevaFila"];
  manejarTeclas: UseComparativoAguaReturn["manejarTeclas"];
  confirmarCelda: UseComparativoAguaReturn["confirmarCelda"];
  guardarRegistro: UseComparativoAguaReturn["guardarRegistro"];
  actualizarSede: UseComparativoAguaReturn["actualizarSede"];
  confirmarEliminarFila: UseComparativoAguaReturn["confirmarEliminarFila"];
  crearRegistro: UseComparativoAguaReturn["crearRegistro"];
}

export default function ComparativoAguaTabla({
  modoNoche,
  inicio,
  fin,
  meses,
  datosFiltrados,
  datosEnergia,
  nuevaFila,
  mostrarTotales,
  inputsRef,
  editarFila,
  editarCelda,
  editarNuevaFila,
  manejarTeclas,
  confirmarCelda,
  guardarRegistro,
  actualizarSede,
  confirmarEliminarFila,
  crearRegistro,
}: Props) {
  return (
    <div
      className={`overflow-x-auto rounded-xl shadow-sm border 
${modoNoche ? "border-[#333]" : "border-gray-300"}`}
    >
      <table
        className={`w-full text-xs border-collapse table-auto
${modoNoche ? "text-white" : "text-gray-800"}`}
      >
        <thead>
          <tr>
            <th
              colSpan={3 + meses.slice(inicio, fin).length * 3}
              className={`p-4 text-center text-lg font-bold tracking-wide
    ${
      modoNoche
        ? "bg-[#111] text-cyan-400 border border-[#333]"
        : "bg-blue-400 text-white border border-gray-300"
    }
    `}
            >
              REGISTRO CONSUMO DE AGUA SEGÚN FACTURACIÓN
            </th>
          </tr>

          <tr
            className={`text-sm
${
  modoNoche
    ? "bg-[#1f1f1f] text-white"
    : "bg-blue-200 text-gray-800"
}`}
          >
            <th
              rowSpan={2}
              className={`p-3 border ${modoNoche ? "border-[#333]" : "border-gray-300"} text-left`}
            >
              <div className="flex items-center gap-2">
                <User size={16} /> Nombre
              </div>
            </th>

            <th
              rowSpan={2}
              className={`p-3 border ${modoNoche ? "border-[#333]" : "border-gray-300"} text-left`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} /> Ubicación
              </div>
            </th>

            <th
              rowSpan={2}
              className={`p-3 border ${modoNoche ? "border-[#333]" : "border-gray-300"} text-center`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard size={16} /> Cuenta
              </div>
            </th>

            {meses.slice(inicio, fin).map((mes, i) => (
              <th
                key={i}
                className={`border p-2 text-center font-semibold
${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                colSpan={3}
              >
                {mes}
              </th>
            ))}
          </tr>

          <tr
            className={`${modoNoche ? "bg-[#2a2a2a]" : "bg-blue-100"} text-xs`}
          >
            {meses.slice(inicio, fin).map((_, i) => (
              <React.Fragment key={i}>
                <th
                  className={`border p-2 ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                >
                  <div className="flex justify-center gap-1 items-center">
                    <Droplets size={14} /> M³
                  </div>
                </th>

                <th
                  className={`border p-2 ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                >
                  <div className="flex justify-center gap-1 items-center">
                    <DollarSign size={14} /> Valor
                  </div>
                </th>

                <th
                  className={`border p-2 ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                >
                  <div className="flex justify-center gap-1 items-center">
                    <CheckCircle size={14} /> C
                  </div>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {datosFiltrados.map((fila, i) => (
            <tr
              key={i}
              className={`transition
${
  modoNoche
    ? i % 2 === 0
      ? "bg-[#141414] hover:bg-[#1e1e1e]"
      : "bg-[#181818] hover:bg-[#222]"
    : i % 2 === 0
      ? "bg-white hover:bg-blue-50"
      : "bg-gray-50 hover:bg-blue-50"
}`}
            >
              <td
                className={`border px-3 py-2 min-w-[200px] 
${modoNoche ? "border-[#333]" : "border-gray-300"}`}
              >
                <div className="flex items-center justify-between group">
                  <input
                    value={fila.nombre ?? ""}
                    ref={(el) => {
                      if (!inputsRef.current[i]) inputsRef.current[i] = [];
                      inputsRef.current[i][0] = el;
                    }}
                    onKeyDown={(e) => {
                      manejarTeclas(e, i, 0);

                      if (e.key === "Enter") {
                        actualizarSede(fila);
                      }
                    }}
                    className={`w-full outline-none font-semibold text-sm ${
                      modoNoche
                        ? "bg-transparent text-white"
                        : "bg-transparent text-gray-800"
                    }`}
                    onChange={(e) => editarFila(i, "nombre", e.target.value)}
                  />

                  <button
                    onClick={() => confirmarEliminarFila(fila)}
                    className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 text-xs ml-2"
                    title="Eliminar fila"
                  >
                    ✕
                  </button>
                </div>
              </td>

              <td
                className={`border px-3 py-2 min-w-[220px] ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
              >
                <input
                  value={fila.ubicacion ?? ""}
                  ref={(el) => {
                    if (!inputsRef.current[i]) inputsRef.current[i] = [];
                    inputsRef.current[i][1] = el;
                  }}
                  onKeyDown={(e) => {
                    manejarTeclas(e, i, 1);

                    if (e.key === "Enter") {
                      actualizarSede(fila);
                    }
                  }}
                  className={`w-full outline-none text-sm ${
                    modoNoche
                      ? "bg-transparent text-white"
                      : "bg-transparent text-gray-800"
                  }`}
                  onChange={(e) =>
                    editarFila(i, "ubicacion", e.target.value)
                  }
                />
              </td>

              <td
                className={`border px-3 py-2 text-center min-w-[120px] ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
              >
                <input
                  value={fila.cuenta ?? ""}
                  ref={(el) => {
                    if (!inputsRef.current[i]) inputsRef.current[i] = [];
                    inputsRef.current[i][2] = el;
                  }}
                  onKeyDown={(e) => {
                    manejarTeclas(e, i, 2);

                    if (e.key === "Enter") {
                      actualizarSede(fila);
                    }
                  }}
                  className={`w-full outline-none text-center text-sm ${
                    modoNoche
                      ? "bg-transparent text-white"
                      : "bg-transparent text-gray-800"
                  }`}
                  onChange={(e) => editarFila(i, "cuenta", e.target.value)}
                />
              </td>

              {fila.datos.slice(inicio, fin).map((d, j) => {
                const colBase = 3 + j * 3;

                return (
                  <React.Fragment key={j}>
                    <td
                      className={`border p-1 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                    >
                      <input
                        value={formatearDecimalInput(d.M3)}
                        placeholder="0"
                        inputMode="decimal"
                        title="Enter para guardar"
                        ref={(el) => {
                          if (!inputsRef.current[i]) inputsRef.current[i] = [];
                          inputsRef.current[i][colBase] = el;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            confirmarCelda(i, inicio + j);
                            return;
                          }
                          manejarTeclas(e, i, colBase);
                        }}
                        onBlur={() => confirmarCelda(i, inicio + j)}
                        className={`w-20 text-center rounded-md border text-sm outline-none transition
      ${
        modoNoche
          ? "bg-[#2a2a2a] border-[#444] text-white"
          : "bg-gray-100 border-gray-300 text-gray-800"
      }`}
                        onChange={(e) => {
                          editarCelda(
                            i,
                            inicio + j,
                            "M3",
                            limpiarM3(e.target.value)
                          );
                        }}
                      />
                    </td>

                    <td
                      className={`border p-1 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                    >
                      <input
                        value={formatearNumeroInput(d.valor)}
                        placeholder="0"
                        inputMode="numeric"
                        title="Enter para guardar"
                        ref={(el) => {
                          if (!inputsRef.current[i]) inputsRef.current[i] = [];
                          inputsRef.current[i][colBase + 1] = el;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            confirmarCelda(i, inicio + j);
                            return;
                          }
                          manejarTeclas(e, i, colBase + 1);
                        }}
                        onBlur={() => confirmarCelda(i, inicio + j)}
                        className={`w-24 text-center rounded-md border text-sm outline-none transition
      ${
        modoNoche
          ? "bg-[#2a2a2a] border-[#444] text-white"
          : "bg-gray-100 border-gray-300 text-gray-800"
      }`}
                        onChange={(e) => {
                          const valorLimpio = limpiarNumero(e.target.value);
                          editarCelda(i, inicio + j, "valor", valorLimpio);
                        }}
                      />
                    </td>

                    <td
                      className={`border p-1 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                    >
                      <select
                        value={d.cumple ? "true" : "false"}
                        ref={(el) => {
                          if (!inputsRef.current[i]) inputsRef.current[i] = [];
                          inputsRef.current[i][colBase + 2] = el;
                        }}
                        onKeyDown={(e) => manejarTeclas(e, i, colBase + 2)}
                        className={`text-lg font-bold cursor-pointer rounded-md px-1
          ${d.cumple ? "text-green-500" : "text-red-500"}
          ${modoNoche ? "bg-[#1f1f1f]" : "bg-white"}`}
                        onChange={(e) => {
                          const nuevoValor = e.target.value === "true";

                          editarCelda(i, inicio + j, "cumple", nuevoValor);

                          guardarRegistro(
                            {
                              ...fila,
                              datos: fila.datos.map((item, idx) =>
                                idx === inicio + j
                                  ? { ...item, cumple: nuevoValor }
                                  : item
                              ),
                            },
                            inicio + j
                          );
                        }}
                      >
                        <option value="true">✔</option>
                        <option value="false">✖</option>
                      </select>
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}

          <tr
            className={`${
              modoNoche ? "bg-[#202020]" : "bg-blue-50"
            }`}
          >
            <td className="border border-gray-300 p-3">
              <input
                value={nuevaFila.nombre}
                placeholder="Nombre sede"
                className={`w-full rounded-md px-3 py-2 border ${
                  modoNoche
                    ? "bg-[#202020] border-gray-500 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                onChange={(e) => editarNuevaFila("nombre", e.target.value)}
              />
            </td>

            <td className="border border-gray-300 p-3">
              <input
                value={nuevaFila.ubicacion}
                placeholder="Ubicación"
                className={`w-full rounded-md px-3 py-2 border ${
                  modoNoche
                    ? "bg-[#202020] border-gray-500 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                onChange={(e) =>
                  editarNuevaFila("ubicacion", e.target.value)
                }
              />
            </td>

            <td className="border border-gray-300 p-3 text-center">
              <input
                value={nuevaFila.cuenta}
                placeholder="Cuenta"
                className={`w-full rounded-md px-3 py-2 text-center border ${
                  modoNoche
                    ? "bg-[#202020] border-gray-500 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                onChange={(e) => editarNuevaFila("cuenta", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    crearRegistro();
                  }
                }}
              />
            </td>
          </tr>

          {mostrarTotales && (
            <tr
              className={`font-bold ${
                modoNoche
                  ? "bg-[#181818] text-white"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              <td colSpan={3} className="border border-gray-300 p-3">
                TOTAL SEDE PRINCIPAL
              </td>

              {meses.slice(inicio, fin).map((_, i) => (
                <td
                  key={i}
                  colSpan={3}
                  className="border border-gray-300 text-center p-3"
                >
                  {(() => {
                    const totalM3 = datosEnergia
                      .filter((d) =>
                        d.nombre?.toUpperCase().includes("SEDE PPAL")
                      )
                      .reduce(
                        (acc, d) =>
                          acc + Number(d.datos?.[inicio + i]?.M3 || 0),
                        0
                      );

                    const totalValor = datosEnergia
                      .filter((d) =>
                        d.nombre?.toUpperCase().includes("SEDE PPAL")
                      )
                      .reduce(
                        (acc, d) =>
                          acc + Number(d.datos?.[inicio + i]?.valor || 0),
                        0
                      );

                    return (
                      <table
                        className={`w-full text-xs font-semibold border 
  ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                      >
                        <tbody>
                          <tr>
                            <td
                              className={`border px-2 py-1 text-blue-500 text-center 
        ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <Droplets size={13} />
                                {totalM3} m³
                              </div>
                            </td>

                            <td
                              className={`border px-2 py-1 text-green-500 text-center 
        ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <DollarSign size={13} />
                                ${totalValor.toLocaleString()}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  })()}
                </td>
              ))}
            </tr>
          )}

          <tr
            className={`font-bold ${
              modoNoche
                ? "bg-[#202020] text-gray-200"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <td colSpan={3} className="border border-gray-300 p-3">
              TOTAL SOLO RECEPTORIAS
            </td>

            {meses.slice(inicio, fin).map((_, i) => (
              <td
                key={i}
                colSpan={3}
                className="border border-gray-300 text-center p-3"
              >
                {(() => {
                  const totalM3 = datosEnergia
                    .filter((d) =>
                      d.nombre?.toUpperCase().includes("RECEPTORIA")
                    )
                    .reduce(
                      (acc, d) =>
                        acc + Number(d.datos?.[inicio + i]?.M3 || 0),
                      0
                    );

                  const totalValor = datosEnergia
                    .filter((d) =>
                      d.nombre?.toUpperCase().includes("RECEPTORIA")
                    )
                    .reduce(
                      (acc, d) =>
                        acc + Number(d.datos?.[inicio + i]?.valor || 0),
                      0
                    );

                  return (
                    <table
                      className={`w-full text-xs font-semibold border 
  ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                    >
                      <tbody>
                        <tr>
                          <td
                            className={`border px-2 py-1 text-blue-500 text-center 
        ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <Droplets size={13} />
                              {totalM3} m³
                            </div>
                          </td>

                          <td
                            className={`border px-2 py-1 text-green-500 text-center 
        ${modoNoche ? "border-[#333]" : "border-gray-300"}`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <DollarSign size={13} />
                              ${totalValor.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
