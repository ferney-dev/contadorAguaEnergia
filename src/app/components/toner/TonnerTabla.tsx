"use client";

import React from "react";
import { Layers, User, ScanLine, Printer, Package, CalendarDays, FileText, RefreshCcw, Settings, Pencil, Trash2 } from "lucide-react";
import type { Tonner, Area, UseTonnerReturn } from "../../hooks/useTonner";

interface Props {
  modoNoche: boolean;
  areas: Area[];
  filtrados: Tonner[];
  editar: UseTonnerReturn["editar"];
  eliminar: UseTonnerReturn["eliminar"];
}

export default function TonnerTabla({
  modoNoche,
  areas,
  filtrados,
  editar,
  eliminar,
}: Props) {
  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl border ${modoNoche ? "border-[#333]" : "border-gray-200"} bg-[#121212] ${modoNoche ? "bg-[#121212]" : "bg-white"}`}>
      {/* HEADER ROJO */}
      <div className="px-6 py-5 bg-[#C40000] text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-3 tracking-wide">
              <Printer size={22} />
              Inventario de Tonners
            </h3>
            <p className="text-xs opacity-80 mt-1">
              Control y gestión de suministros de impresión
            </p>
          </div>
          <span className="text-sm bg-white/20 px-4 py-1 rounded-full font-semibold backdrop-blur-sm">
            {filtrados.length} registros
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          {/* HEADER */}
          <thead>
            <tr
              className={`uppercase tracking-wider text-xs 
        ${modoNoche
                    ? "bg-[#1a1a1a] text-gray-300 border-b border-white/10"
                    : "bg-gray-100 text-gray-700 border-b border-gray-200"}`}
            >
              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-red-500" />
                  <span>Área</span>
                </div>
              </th>

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-blue-500" />
                  <span>Responsable</span>
                </div>
              </th>

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                  <ScanLine size={16} className="text-purple-500" />
                  <span>Tonner</span>
                </div>
              </th>

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-green-500" />
                  <span>Impresora</span>
                </div>
              </th>

              <th className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Package size={16} className="text-amber-500" />
                  <span>Cantidad</span>
                </div>
              </th>

              <th className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CalendarDays size={16} className="text-cyan-500" />
                  <span>Fecha</span>
                </div>
              </th>

              <th className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <FileText size={16} className="text-emerald-500" />
                  <span>Creado</span>
                </div>
              </th>

              <th className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCcw size={16} className="text-yellow-500" />
                  <span>Editado</span>
                </div>
              </th>

              <th className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Settings size={16} className="text-gray-500" />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-sm opacity-60"
                >
                  🚫 No se encontraron registros de tonners
                </td>
              </tr>
            ) : (
              filtrados.map((t, index) => (
                <tr
                  key={t.id}
                  className={`transition border-b
              ${modoNoche
                        ? "border-white/10 hover:bg-[#1f1f1f]"
                        : "border-gray-200 hover:bg-red-50"}
              
              ${index % 2 === 0
                        ? (modoNoche ? "bg-[#121212]" : "bg-white")
                        : (modoNoche ? "bg-[#161616]" : "bg-gray-50")}
            `}
                >
                  {/* ÁREA */}
                  <td className="px-5 py-4 font-semibold">
                    {areas.find((a) => a.id === t.area_id)?.nombre || "-"}
                  </td>

                  {/* RESPONSABLE */}
                  <td className="px-5 py-4">
                    {t.responsable || "-"}
                  </td>

                  {/* TONNER */}
                  <td className="px-5 py-4">
                    {t.modelo_tonner || "-"}
                  </td>

                  {/* IMPRESORA */}
                  <td className="px-5 py-4">
                    {t.modelo_impresora || "-"}
                  </td>

                  {/* CANTIDAD */}
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full font-bold
                  ${modoNoche
                            ? "bg-green-500/20 text-green-400"
                            : "bg-green-500/10 text-green-600"}`}
                    >
                      {t.cantidad}
                    </span>
                  </td>

                  {/* FECHA */}
                  <td className="px-5 py-4 text-center">
                    {t.fecha || "-"}
                  </td>

                  {/* CREATED */}
                  <td className="px-5 py-4 text-center text-xs">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : "-"}
                  </td>

                  {/* UPDATED */}
                  <td className="px-5 py-4 text-center text-xs">
                    {t.updated_at ? (
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        {new Date(t.updated_at).toLocaleString()}
                      </span>
                    ) : "-"}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* EDITAR */}
                      <button
                        onClick={() => editar(t)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition
                    ${modoNoche
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                              : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-white"}`}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => eliminar(t.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition
                    ${modoNoche
                              ? "bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white"
                              : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"}`}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className={`px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between
  ${modoNoche
              ? "bg-[#121212] border-t border-white/10 text-gray-300"
              : "bg-gray-100 border-t border-gray-200 text-gray-700"}`}
      >
        {/* TOTAL REGISTROS */}
        <span className="text-sm flex items-center gap-2">
          📊 Total mostrado:
          <strong className={`${modoNoche ? "text-white" : "text-gray-900"}`}>
            {filtrados.length}
          </strong>
          registros
        </span>

        {/* TOTAL CANTIDAD */}
        <span className="text-sm flex items-center gap-2">
          📦 Cantidad acumulada:
          <strong className={`${modoNoche ? "text-red-400" : "text-red-600"} text-base`}>
            {filtrados.reduce((a, b) => a + (b.cantidad || 0), 0)}
          </strong>
        </span>
      </div>
    </div>
  );
}
