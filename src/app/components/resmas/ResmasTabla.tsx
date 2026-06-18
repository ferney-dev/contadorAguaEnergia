"use client";

import React from "react";
import { Building2, Loader2, PencilLine, Save, Trash2, XCircle } from "lucide-react";
import type { FilaTabla, UseResmasReturn } from "../../hooks/useResmas";

interface Props {
  modoNoche: boolean;
  inicio: number;
  fin: number;
  filas: FilaTabla[];
  totalesPorMes: number[];
  guardandoCelda: string | null;
  editandoAreaId: number | null;
  nombreEditado: string;
  confirmarEliminarId: number | null;
  inputEditarRef: React.RefObject<HTMLInputElement | null>;
  manejarFlechas: UseResmasReturn["manejarFlechas"];
  manejarEnterCantidad: UseResmasReturn["manejarEnterCantidad"];
  manejarCambioVisualCantidad: UseResmasReturn["manejarCambioVisualCantidad"];
  manejarBlurCantidad: UseResmasReturn["manejarBlurCantidad"];
  comparar: UseResmasReturn["comparar"];
  iniciarEdicionArea: UseResmasReturn["iniciarEdicionArea"];
  cancelarEdicionArea: UseResmasReturn["cancelarEdicionArea"];
  guardarEdicionArea: UseResmasReturn["guardarEdicionArea"];
  eliminarArea: UseResmasReturn["eliminarArea"];
  setConfirmarEliminarId: UseResmasReturn["setConfirmarEliminarId"];
  setNombreEditado: UseResmasReturn["setNombreEditado"];
  cargando: boolean;
}

export default function ResmasTabla({
  modoNoche,
  inicio,
  fin,
  filas,
  totalesPorMes,
  guardandoCelda,
  editandoAreaId,
  nombreEditado,
  confirmarEliminarId,
  inputEditarRef,
  manejarFlechas,
  manejarEnterCantidad,
  manejarCambioVisualCantidad,
  manejarBlurCantidad,
  comparar,
  iniciarEdicionArea,
  cancelarEdicionArea,
  guardarEdicionArea,
  eliminarArea,
  setConfirmarEliminarId,
  setNombreEditado,
  cargando,
}: Props) {
  const estilos = {
    tarjeta: modoNoche
      ? "bg-[#121212] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      : "bg-white border border-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.06)]",
    input: modoNoche
      ? "bg-[#121212] border border-white/10 text-white placeholder:text-gray-400"
      : "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400",
    headerTabla: modoNoche
      ? "bg-[#141414]"
      : "bg-gray-100",
    bordeTabla: modoNoche
      ? "border-white/10"
      : "border-gray-200",
    textoSecundario: modoNoche
      ? "text-gray-400"
      : "text-gray-500",
    hoverFila: modoNoche
      ? "hover:bg-white/5"
      : "hover:bg-gray-50",
    fondoSticky: modoNoche
      ? "bg-[#121212]"
      : "bg-white",
  };

  return (
    <div
      className={`overflow-x-auto rounded-3xl ${estilos.tarjeta} touch-pan-x scroll-smooth`}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x mandatory",
      }}
    >
      <div className="min-w-[900px] sm:min-w-[1100px] lg:min-w-[1280px] p-2 sm:p-3 md:p-4">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className={estilos.headerTabla}>
              <th
                className={`sticky left-0 z-20 min-w-[320px] rounded-l-2xl border px-4 py-4 text-left text-sm font-semibold ${estilos.bordeTabla} ${estilos.headerTabla}`}
              >
                Área / Gestión rápida
              </th>

              {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].slice(inicio, fin).map((mes) => (
                <React.Fragment key={mes}>
                  <th
                    className={`min-w-[110px] border px-3 py-4 text-center text-sm font-semibold ${estilos.bordeTabla} ${estilos.headerTabla}`}
                  >
                    {mes}
                  </th>
                  <th
                    className={`min-w-[58px] border px-2 py-4 text-center text-sm font-bold text-blue-500 ${estilos.bordeTabla} ${estilos.headerTabla}`}
                  >
                   Comp
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td
                  colSpan={1 + (fin - inicio) * 2}
                  className={`border px-4 py-10 text-center ${estilos.bordeTabla} ${estilos.textoSecundario}`}
                >
                  No hay áreas para mostrar con el filtro actual.
                </td>
              </tr>
            ) : (
              filas.map((fila, filaIndex) => (
                <tr key={fila.id} className={`${estilos.hoverFila} transition`}>
                  <td
                    className={`sticky left-0 z-10 border px-4 py-3 align-top ${estilos.bordeTabla} ${estilos.fondoSticky}`}
                  >
                    {editandoAreaId === fila.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            ref={inputEditarRef}
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") guardarEdicionArea();
                              if (e.key === "Escape") cancelarEdicionArea();
                            }}
                            className={`w-full rounded-2xl px-3 py-2.5 outline-none ${estilos.input}`}
                            placeholder="Nombre del área"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={guardarEdicionArea}
                            disabled={cargando}
                            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600"
                          >
                            <Save size={14} /> Guardar
                          </button>

                          <button
                            onClick={cancelarEdicionArea}
                            className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600"
                          >
                            <XCircle size={14} /> Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="rounded-2xl bg-blue-500/10 p-2 text-blue-500">
                                <Building2 size={18} />
                              </div>
                              <div>
                                <p className="truncate text-sm font-semibold">{fila.nombre}</p>
                                <p className={`text-xs ${estilos.textoSecundario}`}>
                                  Enter para editar, Enter para guardar datos
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              iniciarEdicionArea({ id: fila.id, nombre: fila.nombre })
                            }
                            className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600"
                          >
                            <PencilLine size={14} /> Editar
                          </button>

                          {confirmarEliminarId === fila.id ? (
                            <>
                              <button
                                onClick={() => eliminarArea(fila.id)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600"
                              >
                                <Trash2 size={14} /> Confirmar borrar
                              </button>

                              <button
                                onClick={() => setConfirmarEliminarId(null)}
                                className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold ${modoNoche ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"}`}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setConfirmarEliminarId(fila.id)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600"
                            >
                              <Trash2 size={14} /> Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>

                  {fila.valores.slice(inicio, fin).map((valor) => {
                    const clave = `${fila.id}-${valor.mes}`;
                    const guardando = guardandoCelda === clave;

                    return (
                      <React.Fragment key={clave}>
                        <td className={`border px-2 py-2 align-middle ${estilos.bordeTabla}`}>
                          <div className="relative">
                            <input
                              id={`celda-${filaIndex}-${valor.mes}`}
                              inputMode="numeric"
                              value={valor.cantidad}
                              onChange={(e) =>
                                manejarCambioVisualCantidad(
                                  fila.id,
                                  valor.mes,
                                  e.target.value
                                )
                              }
                              onBlur={(e) =>
                                manejarBlurCantidad(
                                  fila.id,
                                  valor.mes,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                manejarEnterCantidad(e, fila.id, valor.mes);
                                manejarFlechas(e, filaIndex, valor.mes);
                              }}
                              placeholder="0"
                              className={`w-full rounded-xl px-3 py-2 text-center text-sm font-bold outline-none ${estilos.input}`}
                            />
                            {guardando ? (
                              <Loader2
                                size={14}
                                className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
                              />
                            ) : null}
                          </div>
                        </td>

                       <td className={`border px-2 py-2 text-center align-middle ${estilos.bordeTabla}`}>
  {(() => {
    const valorActual = Number(valor.cantidad || 0);

    const valorAnterior =
      fila.valores[valor.mes - 2]?.cantidad
        ? Number(fila.valores[valor.mes - 2].cantidad)
        : 0;

    const referencia = valorAnterior || valorActual;

    const resultado = comparar(valorActual, referencia);

    return (
      <span
        className={`text-lg font-bold ${
          resultado === "="
            ? "text-gray-500"
            : resultado === "↑"
            ? "text-emerald-500"
            : "text-rose-500"
        }`}
      >
        {resultado}
      </span>
    );
  })()}
</td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))
            )}

            <tr className="bg-blue-500/10 font-bold">
  <td
    className={`sticky left-0 z-10 border px-4 py-3 ${estilos.bordeTabla} ${estilos.fondoSticky}`}
  >
    TOTAL MES
  </td>

  {totalesPorMes.slice(inicio, fin).map((total, i) => (
    <React.Fragment key={i}>
      <td
        className={`border px-2 py-2 text-center text-blue-600 font-extrabold ${estilos.bordeTabla}`}
      >
        {total}
      </td>

      {/* columna comparación vacía */}
      <td className={`border ${estilos.bordeTabla}`} />
    </React.Fragment>
  ))}
</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
