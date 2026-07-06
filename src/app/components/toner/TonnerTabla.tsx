"use client";

import React, { useState } from "react";
import { Printer, Layers, User, ScanLine, Package, CalendarDays, Pencil, Trash2,
         LayoutGrid, Table2, FileText, RefreshCcw, Settings } from "lucide-react";
import type { Tonner, Area, UseTonnerReturn } from "../../hooks/useTonner";

interface Props {
  modoNoche: boolean;
  areas: Area[];
  filtrados: Tonner[];
  editar: UseTonnerReturn["editar"];
  eliminar: UseTonnerReturn["eliminar"];
}

/* ── colores de cantidad ── */
function chipCantidad(n: number, modoNoche: boolean) {
  if (n >= 3) return modoNoche ? "bg-orange-900/30 text-orange-300 border-orange-700/40" : "bg-orange-100 text-orange-700 border-orange-200";
  if (n === 2) return modoNoche ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/40" : "bg-emerald-100 text-emerald-700 border-emerald-200";
  return modoNoche ? "bg-blue-900/30 text-blue-300 border-blue-700/40" : "bg-blue-100 text-blue-700 border-blue-200";
}

/* ── badge de área ── */
const AREA_COLORS = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
];
const AREA_COLORS_DARK = [
  "bg-violet-900/30 text-violet-300 border-violet-700/40",
  "bg-cyan-900/30 text-cyan-300 border-cyan-700/40",
  "bg-rose-900/30 text-rose-300 border-rose-700/40",
  "bg-amber-900/30 text-amber-300 border-amber-700/40",
  "bg-teal-900/30 text-teal-300 border-teal-700/40",
  "bg-indigo-900/30 text-indigo-300 border-indigo-700/40",
];

function areaColor(areaId: number, modoNoche: boolean) {
  const idx = areaId % 6;
  return modoNoche ? AREA_COLORS_DARK[idx] : AREA_COLORS[idx];
}

function fechaCorta(fecha: string) {
  if (!fecha) return "—";
  const [anio, mes, dia] = fecha.split("-");
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${dia} ${meses[Number(mes) - 1]} ${anio}`;
}

export default function TonnerTabla({ modoNoche, areas, filtrados, editar, eliminar }: Props) {
  const [vistaTabla, setVistaTabla] = useState(false);

  const card = modoNoche ? "bg-[#161616] border-white/8" : "bg-white border-gray-100 shadow-sm";
  const txt  = modoNoche ? "text-white"    : "text-gray-800";
  const sub  = modoNoche ? "text-gray-400" : "text-gray-500";
  const totalCantidad = filtrados.reduce((a, b) => a + (b.cantidad || 0), 0);

  return (
    <div className="space-y-4">

      {/* ── barra superior ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Printer className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <p className={`text-sm font-bold ${txt}`}>Inventario</p>
            <p className={`text-xs ${sub}`}>{filtrados.length} registros · {totalCantidad} tonners</p>
          </div>
        </div>

        {/* toggle vista */}
        <button
          onClick={() => setVistaTabla(!vistaTabla)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold transition
            hover:scale-105 active:scale-95
            ${vistaTabla
              ? (modoNoche ? "bg-violet-900/30 border-violet-700 text-violet-300" : "bg-violet-100 border-violet-400 text-violet-700")
              : (modoNoche ? "bg-[#1e1e1e] border-white/10 text-gray-300 hover:bg-[#252525]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50")
            }`}
        >
          {vistaTabla ? <><LayoutGrid size={14} /> Tarjetas</> : <><Table2 size={14} /> Ver tabla</>}
        </button>
      </div>

      {/* ── ESTADO VACÍO ── */}
      {filtrados.length === 0 && (
        <div className={`rounded-2xl border p-12 text-center ${card}`}>
          <p className="text-5xl mb-3">🖨️</p>
          <p className={`font-semibold text-lg ${txt}`}>Sin registros</p>
          <p className={`text-sm mt-1 ${sub}`}>Crea un tonner con el botón "Registrar tonner"</p>
        </div>
      )}

      {/* ── VISTA TARJETAS ── */}
      {!vistaTabla && filtrados.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtrados.map((t) => {
            const areaNombre = areas.find((a) => a.id === t.area_id)?.nombre || "Sin área";
            return (
              <div
                key={t.id}
                className={`rounded-2xl border flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${card}`}
              >
                {/* cabecera */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0
                    ${modoNoche ? "bg-[#222]" : "bg-violet-50"}`}>
                    <Printer className="w-5 h-5 text-violet-500" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold truncate max-w-[120px] ${areaColor(t.area_id, modoNoche)}`}>
                    {areaNombre}
                  </span>
                </div>

                {/* modelo impresora — título principal */}
                <p className={`text-sm font-bold leading-tight line-clamp-2 ${txt}`}>
                  {t.modelo_impresora || "Sin modelo"}
                </p>

                {/* tonner */}
                <div className={`flex items-center gap-1.5 text-xs ${sub}`}>
                  <ScanLine className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  <span className="truncate">{t.modelo_tonner || "—"}</span>
                </div>

                {/* responsable */}
                <div className={`flex items-center gap-1.5 text-xs ${sub}`}>
                  <User className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                  <span className="truncate">{t.responsable || "—"}</span>
                </div>

                {/* chips: cantidad + fecha */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-bold ${chipCantidad(t.cantidad, modoNoche)}`}>
                    <Package className="w-3 h-3" />
                    {t.cantidad}
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${sub}`}>
                    <CalendarDays className="w-3 h-3" />
                    {fechaCorta(t.fecha)}
                  </span>
                </div>

                {/* acciones */}
                <div className="flex gap-2 mt-auto pt-2 border-t border-dashed
                  ${modoNoche ? 'border-white/10' : 'border-gray-100'}">
                  <button
                    onClick={() => editar(t)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold transition
                      ${modoNoche ? "bg-amber-900/20 text-amber-400 hover:bg-amber-500 hover:text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}
                  >
                    <Pencil size={12} /> Editar
                  </button>
                  <button
                    onClick={() => eliminar(t.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold transition
                      ${modoNoche ? "bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"}`}
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VISTA TABLA ── */}
      {vistaTabla && filtrados.length > 0 && (
        <div className={`rounded-2xl border overflow-hidden ${card}`}>
          {/* header tabla */}
          <div className="px-5 py-4 bg-gradient-to-r from-violet-600 to-purple-500 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Printer size={18} />
              <span className="font-bold text-sm">Inventario de Tonners</span>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full text-white font-semibold">
              {filtrados.length} registros
            </span>
          </div>

          <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <table className="w-full text-xs">
              <thead>
                <tr className={`uppercase tracking-wider font-bold ${modoNoche ? "bg-[#1a1a1a] text-gray-400 border-b border-white/8" : "bg-gray-50 text-gray-500 border-b border-gray-200"}`}>
                  {[
                    { icon: <Layers size={13} className="text-violet-500" />, label: "Área" },
                    { icon: <User size={13} className="text-blue-500" />, label: "Responsable" },
                    { icon: <ScanLine size={13} className="text-purple-500" />, label: "Tonner" },
                    { icon: <Printer size={13} className="text-emerald-500" />, label: "Impresora" },
                    { icon: <Package size={13} className="text-amber-500" />, label: "Qty" },
                    { icon: <CalendarDays size={13} className="text-cyan-500" />, label: "Fecha" },
                    { icon: <FileText size={13} className="text-gray-400" />, label: "Creado" },
                    { icon: <RefreshCcw size={13} className="text-yellow-500" />, label: "Editado" },
                    { icon: <Settings size={13} className="text-gray-400" />, label: "Acciones" },
                  ].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1.5">{h.icon}{h.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t, i) => {
                  const areaNombre = areas.find((a) => a.id === t.area_id)?.nombre || "-";
                  return (
                    <tr key={t.id} className={`border-b transition
                      ${modoNoche ? "border-white/5 hover:bg-white/3" : "border-gray-100 hover:bg-violet-50/40"}
                      ${i % 2 === 0 ? (modoNoche ? "bg-[#161616]" : "bg-white") : (modoNoche ? "bg-[#1a1a1a]" : "bg-gray-50/50")}`}>
                      <td className="px-4 py-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${areaColor(t.area_id, modoNoche)}`}>{areaNombre}</span>
                      </td>
                      <td className={`px-4 py-3 ${sub}`}>{t.responsable || "—"}</td>
                      <td className={`px-4 py-3 font-medium ${txt}`}>{t.modelo_tonner || "—"}</td>
                      <td className={`px-4 py-3 ${sub}`}>{t.modelo_impresora || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${chipCantidad(t.cantidad, modoNoche)}`}>{t.cantidad}</span>
                      </td>
                      <td className={`px-4 py-3 ${sub}`}>{fechaCorta(t.fecha)}</td>
                      <td className={`px-4 py-3 text-[10px] ${sub}`}>{t.created_at ? new Date(t.created_at).toLocaleDateString("es-CO") : "—"}</td>
                      <td className="px-4 py-3 text-[10px]">
                        {t.updated_at
                          ? <span className={`px-2 py-0.5 rounded-full ${modoNoche ? "bg-amber-900/20 text-amber-400" : "bg-amber-100 text-amber-700"}`}>{new Date(t.updated_at).toLocaleDateString("es-CO")}</span>
                          : <span className={sub}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => editar(t)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition
                              ${modoNoche ? "bg-amber-900/20 text-amber-400 hover:bg-amber-500 hover:text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}>
                            <Pencil size={11} /> Editar
                          </button>
                          <button onClick={() => eliminar(t.id)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition
                              ${modoNoche ? "bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"}`}>
                            <Trash2 size={11} /> Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* footer tabla */}
          <div className={`px-5 py-3 flex items-center justify-between text-xs font-medium
            ${modoNoche ? "bg-[#111] border-t border-white/8 text-gray-400" : "bg-gray-50 border-t border-gray-200 text-gray-500"}`}>
            <span>📊 {filtrados.length} registros mostrados</span>
            <span>📦 <strong className={modoNoche ? "text-violet-300" : "text-violet-600"}>{totalCantidad}</strong> tonners en total</span>
          </div>
        </div>
      )}
    </div>
  );
}
