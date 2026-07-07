"use client";

import React, { useState } from "react";
import { Building2, Loader2, PencilLine, Trash2, X, Check,
         LayoutGrid, Table2 } from "lucide-react";
import type { FilaTabla, UseResmasReturn } from "../../hooks/useResmas";

const MESES_LABEL = [
  "Ene","Feb","Mar","Abr","May","Jun",
  "Jul","Ago","Sep","Oct","Nov","Dic",
];
const MESES_FULL = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

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

export default function ResmasTabla(props: Props) {
  /* ── default: tabla ── */
  const [vistaTabla, setVistaTabla] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);  const [filaModal, setFilaModal] = useState<FilaTabla | null>(null);

  const {
    modoNoche, filas, totalesPorMes, guardandoCelda,
    editandoAreaId, nombreEditado, confirmarEliminarId, inputEditarRef,
    manejarFlechas, manejarEnterCantidad, manejarCambioVisualCantidad, manejarBlurCantidad,
    comparar, iniciarEdicionArea, cancelarEdicionArea, guardarEdicionArea,
    eliminarArea, setConfirmarEliminarId, setNombreEditado, cargando,
  } = props;

  const card = modoNoche ? "bg-[#1f1f1f] border-white/8" : "bg-white border-gray-100 shadow-sm";
  const txt  = modoNoche ? "text-white"    : "text-gray-800";
  const sub  = modoNoche ? "text-gray-400" : "text-gray-500";
  const inp  = modoNoche ? "bg-[#2a2a2a] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-800";
  const totalGeneral = totalesPorMes.reduce((a, b) => a + b, 0);

  /* ── barra de toggle ── */
  const barraToggle = (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#C40000]" />
        <p className={`text-sm font-bold ${txt}`}>
          {vistaTabla ? "Vista tabla" : "Vista tarjetas"} · {filas.length} área{filas.length !== 1 ? "s" : ""}
        </p>
      </div>
      <button
        onClick={() => setVistaTabla(!vistaTabla)}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold transition
          hover:scale-105 active:scale-95
          ${vistaTabla
            ? (modoNoche ? "bg-[#1e1e1e] border-white/10 text-gray-300 hover:bg-[#252525]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50")
            : (modoNoche ? "bg-[#C40000]/20 border-[#C40000]/40 text-red-300" : "bg-[#C40000]/10 border-[#C40000]/30 text-[#C40000]")
          }`}
      >
        {vistaTabla
          ? <><LayoutGrid size={14} /> Ver tarjetas</>
          : <><Table2 size={14} /> Ver tabla</>
        }
      </button>
    </div>
  );

  if (filas.length === 0) {
    return (
      <>
        {barraToggle}
        <div className={`rounded-2xl border p-12 text-center ${card}`}>
          <p className="text-5xl mb-3">📄</p>
          <p className={`font-semibold text-lg ${txt}`}>Sin áreas registradas</p>
          <p className={`text-sm mt-1 ${sub}`}>Crea un área usando el campo de arriba</p>
        </div>
      </>
    );
  }

  /* ════════════════════════════════════════════════
     VISTA TABLA — original con rojo corporativo
  ════════════════════════════════════════════════ */
  if (vistaTabla) {
    const borde = modoNoche ? "border-white/10" : "border-gray-200";
    const hdr   = modoNoche ? "bg-[#1a1a1a] text-gray-300" : "bg-gray-50 text-gray-600";
    const filaBg = (i: number) => modoNoche
      ? (i % 2 === 0 ? "bg-[#161616] hover:bg-[#1f1f1f]" : "bg-[#1a1a1a] hover:bg-[#222]")
      : (i % 2 === 0 ? "bg-white hover:bg-red-50/30" : "bg-gray-50/50 hover:bg-red-50/30");

    return (
      <>
        {barraToggle}

        {/* Enero–Junio */}
        <TablaBloque
          titulo="Enero — Junio" colorPunto="bg-indigo-500"
          modoNoche={modoNoche} filas={filas} totalesPorMes={totalesPorMes}
          guardandoCelda={guardandoCelda} editandoAreaId={editandoAreaId}
          nombreEditado={nombreEditado} confirmarEliminarId={confirmarEliminarId}
          inputEditarRef={inputEditarRef}
          manejarFlechas={manejarFlechas} manejarEnterCantidad={manejarEnterCantidad}
          manejarCambioVisualCantidad={manejarCambioVisualCantidad}
          manejarBlurCantidad={manejarBlurCantidad} comparar={comparar}
          iniciarEdicionArea={iniciarEdicionArea} cancelarEdicionArea={cancelarEdicionArea}
          guardarEdicionArea={guardarEdicionArea} eliminarArea={eliminarArea}
          setConfirmarEliminarId={setConfirmarEliminarId} setNombreEditado={setNombreEditado}
          cargando={cargando} inicio={0} fin={6}
        />

        {/* Julio–Diciembre */}
        <TablaBloque
          titulo="Julio — Diciembre" colorPunto="bg-violet-500"
          modoNoche={modoNoche} filas={filas} totalesPorMes={totalesPorMes}
          guardandoCelda={guardandoCelda} editandoAreaId={editandoAreaId}
          nombreEditado={nombreEditado} confirmarEliminarId={confirmarEliminarId}
          inputEditarRef={inputEditarRef}
          manejarFlechas={manejarFlechas} manejarEnterCantidad={manejarEnterCantidad}
          manejarCambioVisualCantidad={manejarCambioVisualCantidad}
          manejarBlurCantidad={manejarBlurCantidad} comparar={comparar}
          iniciarEdicionArea={iniciarEdicionArea} cancelarEdicionArea={cancelarEdicionArea}
          guardarEdicionArea={guardarEdicionArea} eliminarArea={eliminarArea}
          setConfirmarEliminarId={setConfirmarEliminarId} setNombreEditado={setNombreEditado}
          cargando={cargando} inicio={6} fin={12}
        />
      </>
    );
  }

  /* ════════════════════════════════════════════════
     VISTA TARJETAS — nueva
  ════════════════════════════════════════════════ */
  return (
    <>
      {barraToggle}

      {/* resumen mensual */}
      <div className={`rounded-2xl border p-4 mb-4 ${card}`}>
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${sub}`}>Resumen mensual</p>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {totalesPorMes.map((total, i) => (
            <div key={i} className="text-center">
              <p className={`text-[10px] font-semibold mb-1 ${sub}`}>{MESES_LABEL[i]}</p>
              <div className={`rounded-xl py-1.5 text-xs font-bold
                ${total > 0
                  ? (modoNoche ? "bg-indigo-900/20 text-indigo-300" : "bg-indigo-50 text-indigo-700")
                  : (modoNoche ? "bg-[#1e1e1e] text-gray-600" : "bg-gray-100 text-gray-400")
                }`}>
                {total || "—"}
              </div>
            </div>
          ))}
        </div>
        <p className={`text-xs mt-3 font-semibold ${modoNoche ? "text-indigo-400" : "text-indigo-600"}`}>
          Total anual: <span className="font-black">{totalGeneral}</span> resmas
        </p>
      </div>

      {/* tarjetas */}
      <div className="space-y-3">
        {filas.map((fila, filaIndex) => (
          <TarjetaArea
            key={fila.id}
            fila={fila} filaIndex={filaIndex}
            modoNoche={modoNoche} card={card} txt={txt} sub={sub} inp={inp}
            guardandoCelda={guardandoCelda} editandoAreaId={editandoAreaId}
            nombreEditado={nombreEditado} confirmarEliminarId={confirmarEliminarId}
            inputEditarRef={inputEditarRef}
            manejarFlechas={manejarFlechas}
            manejarEnterCantidad={manejarEnterCantidad}
            manejarCambioVisualCantidad={manejarCambioVisualCantidad}
            manejarBlurCantidad={manejarBlurCantidad}
            comparar={comparar}
            iniciarEdicionArea={iniciarEdicionArea}
            cancelarEdicionArea={cancelarEdicionArea}
            guardarEdicionArea={guardarEdicionArea}
            eliminarArea={eliminarArea}
            setConfirmarEliminarId={setConfirmarEliminarId}
            setNombreEditado={setNombreEditado}
            cargando={cargando}
            onAbrirModal={() => { setFilaModal(fila); setModalAbierto(true); }}
          />
        ))}
      </div>

      {/* modal ingreso */}
      {modalAbierto && filaModal && (
        <ModalIngreso
          fila={filaModal} modoNoche={modoNoche}
          guardandoCelda={guardandoCelda}
          manejarCambioVisualCantidad={manejarCambioVisualCantidad}
          manejarBlurCantidad={manejarBlurCantidad}
          manejarEnterCantidad={manejarEnterCantidad}
          onClose={() => { setModalAbierto(false); setFilaModal(null); }}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   BLOQUE DE TABLA ORIGINAL (rojo corporativo)
══════════════════════════════════════════════════════════ */
function TablaBloque({
  titulo, colorPunto, modoNoche, filas, totalesPorMes, guardandoCelda,
  editandoAreaId, nombreEditado, confirmarEliminarId, inputEditarRef,
  manejarFlechas, manejarEnterCantidad, manejarCambioVisualCantidad, manejarBlurCantidad,
  comparar, iniciarEdicionArea, cancelarEdicionArea, guardarEdicionArea,
  eliminarArea, setConfirmarEliminarId, setNombreEditado, cargando, inicio, fin,
}: any) {
  const borde  = modoNoche ? "border-white/10" : "border-gray-200";
  const fondoS = modoNoche ? "bg-[#161616]"    : "bg-white";
  const inp    = modoNoche ? "bg-[#1e1e1e] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-800";
  const sub    = modoNoche ? "text-gray-400" : "text-gray-500";

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-3">
        <span className={`w-3 h-3 rounded-full ${colorPunto}`} />
        <h3 className={`text-sm font-bold uppercase tracking-widest ${sub}`}>{titulo}</h3>
      </div>

      <div className={`overflow-x-auto rounded-2xl border shadow-sm ${modoNoche ? "bg-[#161616] border-white/8" : "bg-white border-gray-200"}`}
        style={{ scrollbarWidth: "none" }}>
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3 flex items-center justify-between">
          <span className="text-white font-bold text-sm">📄 Resmas · {titulo}</span>
          <span className="text-indigo-200 text-xs">{filas.length} área{filas.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="min-w-[900px]">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className={`sticky left-0 z-20 min-w-[260px] border px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${borde}
                  ${modoNoche ? "bg-[#1a1a1a] text-gray-300" : "bg-gray-50 text-gray-600"}`}>Área</th>
                {MESES_FULL.slice(inicio, fin).map((mes) => (
                  <React.Fragment key={mes}>
                    <th className={`min-w-[90px] border px-3 py-3 text-center text-xs font-bold uppercase tracking-wider ${borde}
                      ${modoNoche ? "bg-[#1a1a1a] text-gray-300" : "bg-gray-50 text-gray-600"}`}>{mes}</th>
                    <th className={`min-w-[50px] border px-2 py-3 text-center text-xs font-bold text-indigo-500 ${borde}
                      ${modoNoche ? "bg-[#1a1a1a]" : "bg-gray-50"}`}>±</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila: FilaTabla, filaIndex: number) => (
                <tr key={fila.id} className={`transition
                  ${filaIndex % 2 === 0
                    ? (modoNoche ? "bg-[#161616] hover:bg-[#1f1f1f]" : "bg-white hover:bg-red-50/20")
                    : (modoNoche ? "bg-[#1a1a1a] hover:bg-[#222]"   : "bg-gray-50/40 hover:bg-red-50/20")}`}>
                  <td className={`sticky left-0 z-10 border px-4 py-3 align-middle ${borde} ${fondoS}`}>
                    {editandoAreaId === fila.id ? (
                      <div className="flex items-center gap-2">
                        <input ref={inputEditarRef} value={nombreEditado}
                          onChange={(e) => setNombreEditado(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") guardarEdicionArea(); if (e.key === "Escape") cancelarEdicionArea(); }}
                          className={`flex-1 rounded-xl px-3 py-1.5 text-sm border outline-none ${inp}`} />
                        <button onClick={guardarEdicionArea} disabled={cargando}
                          className="w-7 h-7 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"><Check size={13} /></button>
                        <button onClick={cancelarEdicionArea}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center ${modoNoche ? "bg-[#2a2a2a] text-gray-400" : "bg-gray-100 text-gray-500"}`}><X size={13} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 group">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#C40000] shrink-0" />
                          <span className={`text-sm font-semibold ${modoNoche ? "text-white" : "text-gray-800"}`}>{fila.nombre}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => iniciarEdicionArea({ id: fila.id, nombre: fila.nombre })}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition
                              ${modoNoche ? "bg-amber-900/20 text-amber-400 hover:bg-amber-500 hover:text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}><PencilLine size={11} /></button>
                          {confirmarEliminarId === fila.id ? (
                            <>
                              <button onClick={() => eliminarArea(fila.id)}
                                className="w-6 h-6 rounded-lg bg-[#C40000] text-white flex items-center justify-center"><Check size={11} /></button>
                              <button onClick={() => setConfirmarEliminarId(null)}
                                className={`w-6 h-6 rounded-lg flex items-center justify-center ${modoNoche ? "bg-[#2a2a2a] text-gray-400" : "bg-gray-100 text-gray-500"}`}><X size={11} /></button>
                            </>
                          ) : (
                            <button onClick={() => setConfirmarEliminarId(fila.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition
                                ${modoNoche ? "bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"}`}><Trash2 size={11} /></button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  {fila.valores.slice(inicio, fin).map((valor: any) => {
                    const clave   = `${fila.id}-${valor.mes}`;
                    const guardando = guardandoCelda === clave;
                    const tieneDato = Number(valor.cantidad) > 0;
                    return (
                      <React.Fragment key={clave}>
                        <td className={`border p-1.5 ${borde}`}>
                          <div className="relative">
                            <input id={`celda-${filaIndex}-${valor.mes}`} inputMode="numeric"
                              value={valor.cantidad}
                              onChange={(e) => manejarCambioVisualCantidad(fila.id, valor.mes, e.target.value)}
                              onBlur={(e) => manejarBlurCantidad(fila.id, valor.mes, e.target.value)}
                              onKeyDown={(e) => { manejarEnterCantidad(e, fila.id, valor.mes); manejarFlechas(e, filaIndex, valor.mes); }}
                              placeholder="0"
                              className={`w-full text-center rounded-xl border text-sm font-bold outline-none py-1.5 transition
                                ${tieneDato
                                  ? (modoNoche ? "bg-indigo-500/15 border-indigo-400/30 text-indigo-300" : "bg-indigo-50 border-indigo-300 text-indigo-700")
                                  : inp}
                                focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300/20`} />
                            {guardando && <Loader2 size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />}
                          </div>
                        </td>
                        <td className={`border px-1 py-1.5 text-center ${borde}`}>
                          {(() => {
                            const actual   = Number(valor.cantidad || 0);
                            const anterior = fila.valores[valor.mes - 2]?.cantidad ? Number(fila.valores[valor.mes - 2].cantidad) : 0;
                            const res      = comparar(actual, anterior || actual);
                            return <span className={`text-base font-bold ${res === "=" ? "text-gray-400" : res === "↑" ? "text-emerald-500" : "text-rose-500"}`}>{res}</span>;
                          })()}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
              {/* totales */}
              <tr className="font-bold">
                <td className={`sticky left-0 z-10 border px-4 py-2.5 text-xs uppercase font-black ${borde}
                  ${modoNoche ? "bg-slate-700/20 text-slate-300" : "bg-slate-100 text-slate-700"}`}>Total mes</td>
                {totalesPorMes.slice(inicio, fin).map((total: number, i: number) => (
                  <React.Fragment key={i}>
                    <td className={`border px-2 py-2.5 text-center text-sm font-black ${borde}
                      ${modoNoche ? "bg-indigo-900/15 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`}>{total || "—"}</td>
                    <td className={`border ${borde} ${modoNoche ? "bg-slate-900/10" : "bg-slate-50"}`} />
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TARJETA DE ÁREA
══════════════════════════════════════════════════════════ */
function TarjetaArea({
  fila, filaIndex, modoNoche, card, txt, sub, inp, guardandoCelda,
  editandoAreaId, nombreEditado, confirmarEliminarId, inputEditarRef,
  manejarEnterCantidad, manejarCambioVisualCantidad, manejarBlurCantidad,
  comparar, iniciarEdicionArea, cancelarEdicionArea, guardarEdicionArea,
  eliminarArea, setConfirmarEliminarId, setNombreEditado, cargando, onAbrirModal,
}: any) {
  const [expandida, setExpandida] = useState(false);

  const totalArea = fila.valores.reduce((a: number, v: any) => a + Number(v.cantidad || 0), 0);
  const mesesConDatos = fila.valores.filter((v: any) => Number(v.cantidad) > 0).length;

  return (
    <div className={`rounded-2xl border overflow-hidden transition ${card}`}>

      {/* ── cabecera ── */}
      <div className="p-4 flex items-center gap-3">
        {/* ícono */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${modoNoche ? "bg-indigo-500/10" : "bg-indigo-500/10"}`}>
          <Building2 className="w-5 h-5 text-indigo-500" />
        </div>

        {/* nombre / edición */}
        <div className="flex-1 min-w-0">
          {editandoAreaId === fila.id ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputEditarRef}
                value={nombreEditado}
                onChange={(e) => setNombreEditado(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") guardarEdicionArea();
                  if (e.key === "Escape") cancelarEdicionArea();
                }}
                className={`flex-1 rounded-xl px-3 py-1.5 text-sm border outline-none ${inp}`}
                placeholder="Nombre del área"
              />
              <button onClick={guardarEdicionArea} disabled={cargando}
                className="w-8 h-8 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition">
                <Check size={14} />
              </button>
              <button onClick={cancelarEdicionArea}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                  ${modoNoche ? "bg-[#2a2a2a] text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <p className={`font-bold text-sm ${txt}`}>{fila.nombre}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className={`text-xs ${sub}`}>{mesesConDatos} mes{mesesConDatos !== 1 ? "es" : ""} con datos</span>
                {totalArea > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold
                    ${modoNoche ? "bg-indigo-900/20 text-indigo-300 border-indigo-700/30" : "bg-indigo-100 text-indigo-700 border-indigo-200"}`}>
                    {totalArea} resmas
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* acciones rápidas */}
        {editandoAreaId !== fila.id && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* BOTÓN REGISTRAR */}
            <button
              onClick={onAbrirModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-white text-xs font-semibold transition shadow-sm shadow-indigo-500/20 hover:scale-105 active:scale-95"
            >
              📄 Registrar
            </button>

            {/* editar área */}
            <button
              onClick={() => iniciarEdicionArea({ id: fila.id, nombre: fila.nombre })}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                ${modoNoche ? "bg-amber-900/20 text-amber-400 hover:bg-amber-500 hover:text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}
              title="Editar nombre"
            >
              <PencilLine size={14} />
            </button>

            {/* eliminar área */}
            {confirmarEliminarId === fila.id ? (
              <>
                <button onClick={() => eliminarArea(fila.id)}
                  className="w-8 h-8 rounded-xl bg-[#C40000] hover:bg-red-700 text-white flex items-center justify-center transition" title="Confirmar">
                  <Check size={14} />
                </button>
                <button onClick={() => setConfirmarEliminarId(null)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                    ${modoNoche ? "bg-[#2a2a2a] text-gray-400" : "bg-gray-100 text-gray-500"}`} title="Cancelar">
                  <X size={14} />
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmarEliminarId(fila.id)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                  ${modoNoche ? "bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"}`}
                title="Eliminar área">
                <Trash2 size={14} />
              </button>
            )}

            {/* expandir meses */}
            <button
              onClick={() => setExpandida(!expandida)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition text-lg
                ${modoNoche ? "bg-[#222] text-gray-400" : "bg-gray-100 text-gray-500"}`}
              title={expandida ? "Ocultar meses" : "Ver meses"}
            >
              {expandida ? "⌃" : "⌄"}
            </button>
          </div>
        )}
      </div>

      {/* ── meses expandibles ── */}
      {expandida && (
        <div className={`border-t px-4 pb-4 pt-3 ${modoNoche ? "border-white/8" : "border-gray-100"}`}>
          <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${sub}`}>Cantidad por mes</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {fila.valores.map((valor: any, mesIdx: number) => {
              const clave = `${fila.id}-${valor.mes}`;
              const guardando = guardandoCelda === clave;
              const tieneDato = Number(valor.cantidad) > 0;

              return (
                <div key={clave} className="text-center">
                  <p className={`text-[10px] font-semibold mb-1 ${sub}`}>{MESES_LABEL[mesIdx]}</p>
                  <div className="relative">
                    <input
                      id={`celda-${filaIndex}-${valor.mes}`}
                      inputMode="numeric"
                      value={valor.cantidad}
                      onChange={(e) => manejarCambioVisualCantidad(fila.id, valor.mes, e.target.value)}
                      onBlur={(e) => manejarBlurCantidad(fila.id, valor.mes, e.target.value)}
                      onKeyDown={(e) => manejarEnterCantidad(e, fila.id, valor.mes)}
                      placeholder="0"
                      className={`w-full text-center rounded-xl border text-sm font-bold outline-none transition py-2
                        ${tieneDato
                          ? (modoNoche ? "bg-indigo-500/15 border-indigo-400/30 text-indigo-300" : "bg-indigo-50 border-indigo-300 text-indigo-700")
                          : (modoNoche ? "bg-[#1e1e1e] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-800")
                        }
                        focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300/20`}
                    />
                    {guardando && (
                      <Loader2 size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className={`text-xs mt-3 ${sub}`}>
            Tip: escribe el número y presiona <kbd className={`px-1.5 py-0.5 rounded text-[10px] ${modoNoche ? "bg-[#2a2a2a] text-gray-300" : "bg-gray-200 text-gray-600"}`}>Enter</kbd> para guardar, o usa el botón 📄 Registrar para ingresar fácilmente desde el celular.
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL DE INGRESO (celular-friendly)
══════════════════════════════════════════════════════════ */
function ModalIngreso({ fila, modoNoche, guardandoCelda, manejarCambioVisualCantidad, manejarBlurCantidad, manejarEnterCantidad, onClose }: {
  fila: FilaTabla;
  modoNoche: boolean;
  guardandoCelda: string | null;
  manejarCambioVisualCantidad: any;
  manejarBlurCantidad: any;
  manejarEnterCantidad: any;
  onClose: () => void;
}) {
  const shell = modoNoche ? "bg-[#161616] border border-white/10" : "bg-white border border-gray-200";
  const inp   = modoNoche ? "bg-[#1e1e1e] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-800";
  const sub   = modoNoche ? "text-gray-400" : "text-gray-500";
  const txt   = modoNoche ? "text-white"    : "text-gray-800";
  const footBg = modoNoche ? "bg-[#111] border-white/8" : "bg-gray-50 border-gray-200";

  const totalArea = fila.valores.reduce((a, v) => a + Number(v.cantidad || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl ${shell}`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">{fila.nombre}</h2>
              <p className="text-indigo-200 text-xs">
                {totalArea > 0 ? `${totalArea} resmas registradas` : "Sin registros este año"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "none" }}>
          <p className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${sub}`}>
            Ingresa la cantidad de resmas por mes
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fila.valores.map((valor, mesIdx) => {
              const clave = `${fila.id}-${valor.mes}`;
              const guardando = guardandoCelda === clave;
              const tieneDato = Number(valor.cantidad) > 0;

              return (
                <div key={clave} className={`rounded-2xl border p-3 ${modoNoche ? "bg-[#1e1e1e] border-white/8" : "bg-gray-50 border-gray-200"}`}>
                  {/* nombre del mes */}
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs font-bold ${txt}`}>{MESES_FULL[mesIdx]}</p>
                    {tieneDato && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    )}
                  </div>

                  {/* input */}
                  <div className="relative">
                    <input
                      inputMode="numeric"
                      value={valor.cantidad}
                      onChange={(e) => manejarCambioVisualCantidad(fila.id, valor.mes, e.target.value)}
                      onBlur={(e) => manejarBlurCantidad(fila.id, valor.mes, e.target.value)}
                      onKeyDown={(e) => manejarEnterCantidad(e, fila.id, valor.mes)}
                      placeholder="0"
                      className={`w-full text-center rounded-xl border text-lg font-black outline-none py-2.5 transition
                        ${tieneDato
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : inp
                        }
                        focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300/20`}
                    />
                    {guardando && (
                      <Loader2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 rounded-2xl p-3 text-xs ${modoNoche ? "bg-[#1f1f1f] text-gray-400" : "bg-indigo-50 text-indigo-600/70"}`}>
            💡 Escribe la cantidad y presiona <strong>Enter</strong> o toca otro campo para guardar automáticamente. El punto rojo indica que el mes tiene datos.
          </div>
        </div>

        {/* footer */}
        <div className={`px-5 py-4 border-t shrink-0 ${footBg}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-semibold ${sub}`}>Total registrado este año</p>
            <p className="text-lg font-black text-indigo-600">{totalArea} resmas</p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-white font-semibold text-sm transition shadow-lg shadow-indigo-500/20"
          >
            Listo ✓
          </button>
        </div>
      </div>
    </div>
  );
}
