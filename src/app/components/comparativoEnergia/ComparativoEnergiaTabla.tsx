"use client";

import React, { useState } from "react";
import { ChevronDown, Zap, DollarSign, CheckCircle, XCircle, CreditCard, MapPin, User } from "lucide-react";
import type { FilaComparativo, NuevaFila, UseComparativoEnergiaReturn } from "../../hooks/useComparativoEnergia";
import { formatearDecimalInput, formatearNumeroInput, limpiarKwh, limpiarNumero } from "./utils";

const MESES_LABEL = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

interface Props {
  modoNoche: boolean;
  inicio: number;
  fin: number;
  meses: readonly string[];
  datosFiltrados: FilaComparativo[];
  datosEnergia: FilaComparativo[];
  nuevaFila: NuevaFila;
  mostrarTotales: boolean;
  inputsRef: UseComparativoEnergiaReturn["inputsRef"];
  editarFila: UseComparativoEnergiaReturn["editarFila"];
  editarCelda: UseComparativoEnergiaReturn["editarCelda"];
  editarNuevaFila: UseComparativoEnergiaReturn["editarNuevaFila"];
  manejarTeclas: UseComparativoEnergiaReturn["manejarTeclas"];
  confirmarCelda: UseComparativoEnergiaReturn["confirmarCelda"];
  guardarRegistro: UseComparativoEnergiaReturn["guardarRegistro"];
  actualizarSede: UseComparativoEnergiaReturn["actualizarSede"];
  confirmarEliminarFila: UseComparativoEnergiaReturn["confirmarEliminarFila"];
  crearRegistro: UseComparativoEnergiaReturn["crearRegistro"];
  // control vista (manejado por el padre)
  vistaTabla?: boolean;
}

/* cumple automático: si kWh actual > anterior → no cumple */
function calcularCumpleAuto(datos: FilaComparativo["datos"], mesIdx: number): boolean {
  const actual = datos[mesIdx]?.kWh;
  if (actual === null || actual === undefined) return true;
  for (let i = mesIdx - 1; i >= 0; i--) {
    const anterior = datos[i]?.kWh;
    if (anterior !== null && anterior !== undefined && Number(anterior) > 0) {
      return Number(actual) <= Number(anterior);
    }
  }
  return true;
}

export default function ComparativoEnergiaTabla(props: Props) {
  const { vistaTabla = false } = props;

  if (vistaTabla) {
    // ── VISTA TABLA ORIGINAL (3 bloques × 4 meses) ──────────────
    return (
      <div className="space-y-6">
        <TablaOriginal {...props} inicio={0} fin={4} />
        <TablaOriginal {...props} inicio={4} fin={8} />
        <TablaOriginal {...props} inicio={8} fin={12} />
      </div>
    );
  }

  // ── VISTA TARJETAS ────────────────────────────────────────────
  return <VistaTarjetas {...props} />;
}

/* ══════════════════════════════════════════════════════════
   VISTA TARJETAS
══════════════════════════════════════════════════════════ */
function VistaTarjetas({ modoNoche, datosFiltrados, datosEnergia, editarCelda, confirmarCelda, guardarRegistro, confirmarEliminarFila }: Props) {
  const card  = modoNoche ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-white border-gray-200";
  const txt   = modoNoche ? "text-white"    : "text-gray-800";
  const sub   = modoNoche ? "text-gray-400" : "text-gray-500";
  const rowBg = modoNoche ? "hover:bg-[#222]" : "hover:bg-yellow-50/40";

  if (datosFiltrados.length === 0) {
    return (
      <div className={`rounded-2xl border p-10 text-center ${card}`}>
        <p className="text-4xl mb-3">⚡</p>
        <p className={`font-semibold ${txt}`}>Sin sedes para mostrar</p>
        <p className={`text-sm mt-1 ${sub}`}>Crea una sede con el botón "🏢 Sedes"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {datosFiltrados.map((fila, filaIndex) => (
        <TarjetaSede
          key={fila.sede_energia ?? filaIndex}
          fila={fila}
          filaIndex={filaIndex}
          modoNoche={modoNoche}
          card={card} txt={txt} sub={sub} rowBg={rowBg}
          editarCelda={editarCelda}
          confirmarCelda={confirmarCelda}
          guardarRegistro={guardarRegistro}
          confirmarEliminarFila={confirmarEliminarFila}
        />
      ))}
      <TotalesMes datosEnergia={datosEnergia} modoNoche={modoNoche} card={card} txt={txt} sub={sub} />
    </div>
  );
}

/* ── tarjeta individual ── */
function TarjetaSede({ fila, filaIndex, modoNoche, card, txt, sub, rowBg,
  editarCelda, confirmarCelda, guardarRegistro, confirmarEliminarFila }: {
  fila: FilaComparativo; filaIndex: number; modoNoche: boolean;
  card: string; txt: string; sub: string; rowBg: string;
  editarCelda: any; confirmarCelda: any; guardarRegistro: any; confirmarEliminarFila: any;
}) {
  const [abierta, setAbierta] = useState(false);

  const totalKwh   = fila.datos.reduce((a, d) => a + (Number(d?.kWh)   || 0), 0);
  const totalValor = fila.datos.reduce((a, d) => a + (Number(d?.valor)  || 0), 0);
  const mesesConDatos  = fila.datos.filter((d) => d?.kWh !== null && d?.kWh !== undefined && Number(d.kWh) > 0).length;
  const mesesCumplen   = fila.datos.filter((d) => (d?.kWh ?? 0) > 0 && d?.cumple === true).length;
  const porcentaje = mesesConDatos > 0 ? Math.round((mesesCumplen / mesesConDatos) * 100) : 0;
  const barColor   = porcentaje >= 80 ? "bg-green-500" : porcentaje >= 50 ? "bg-yellow-400" : "bg-red-500";

  const esPrincipal  = fila.nombre?.toUpperCase().includes("SEDE PPAL");
  const esReceptoria = fila.nombre?.toUpperCase().includes("RECEPTORIA");
  const badgeBg = esPrincipal
    ? (modoNoche ? "bg-yellow-900/30 text-yellow-300 border-yellow-800/40" : "bg-yellow-100 text-yellow-700 border-yellow-200")
    : esReceptoria
    ? (modoNoche ? "bg-orange-900/30 text-orange-300 border-orange-800/40" : "bg-orange-100 text-orange-700 border-orange-200")
    : (modoNoche ? "bg-[#252525] text-gray-300 border-[#333]" : "bg-gray-100 text-gray-600 border-gray-200");

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
      <button onClick={() => setAbierta(!abierta)} className="w-full text-left p-4 flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl ${modoNoche ? "bg-[#2a2a2a]" : "bg-yellow-50"}`}>⚡</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-base ${txt}`}>{fila.nombre}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badgeBg}`}>
              {esPrincipal ? "Sede principal" : esReceptoria ? "Receptoría" : "Sede"}
            </span>
          </div>
          {fila.ubicacion && <p className={`text-xs mt-0.5 ${sub}`}>📍 {fila.ubicacion}{fila.cuenta ? ` · 🪪 ${fila.cuenta}` : ""}</p>}
          <div className="mt-2 flex items-center gap-2">
            <div className={`flex-1 h-1.5 rounded-full ${modoNoche ? "bg-[#2a2a2a]" : "bg-gray-100"}`}>
              <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${porcentaje}%` }} />
            </div>
            <span className={`text-[11px] font-bold ${porcentaje >= 80 ? "text-green-500" : porcentaje >= 50 ? "text-yellow-500" : "text-red-500"}`}>{porcentaje}%</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${modoNoche ? "bg-yellow-900/20 text-yellow-300 border-yellow-800/30" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
              <Zap className="inline w-3 h-3 mr-0.5" />{totalKwh.toLocaleString("es-CO")} kWh
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${modoNoche ? "bg-green-900/20 text-green-300 border-green-800/30" : "bg-green-50 text-green-700 border-green-200"}`}>
              💰 ${totalValor.toLocaleString("es-CO")}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${modoNoche ? "bg-[#252525] text-gray-300 border-[#333]" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {mesesConDatos} mes{mesesConDatos !== 1 ? "es" : ""} con datos
            </span>
          </div>
        </div>
        <span className={`text-lg transition-transform duration-200 mt-1 ${abierta ? "rotate-180" : ""} ${sub}`}>⌄</span>
      </button>

      {abierta && (
        <div className={`border-t ${modoNoche ? "border-[#2a2a2a]" : "border-gray-100"}`}>
          <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase font-bold ${modoNoche ? "bg-[#222] text-gray-400" : "bg-yellow-50 text-yellow-700"}`}>
                  <th className={`px-4 py-2 text-left border-b ${modoNoche ? "border-[#2a2a2a]" : "border-yellow-100"}`}>Mes</th>
                  <th className={`px-4 py-2 text-center border-b ${modoNoche ? "border-[#2a2a2a]" : "border-yellow-100"}`}>
                    <span className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" />kWh</span>
                  </th>
                  <th className={`px-4 py-2 text-center border-b ${modoNoche ? "border-[#2a2a2a]" : "border-yellow-100"}`}>
                    <span className="flex items-center justify-center gap-1"><DollarSign className="w-3 h-3" />Valor</span>
                  </th>
                  <th className={`px-4 py-2 text-center border-b ${modoNoche ? "border-[#2a2a2a]" : "border-yellow-100"}`}>Cumple</th>
                </tr>
              </thead>
              <tbody>
                {fila.datos.map((d, mesIdx) => {
                  const cumpleAuto  = calcularCumpleAuto(fila.datos, mesIdx);
                  const cumpleReal  = d.kWh !== null && d.kWh !== undefined ? d.cumple : cumpleAuto;
                  const tieneDatos  = d.kWh !== null && d.kWh !== undefined && Number(d.kWh) > 0;
                  const mesAnterior = mesIdx > 0 ? fila.datos[mesIdx - 1]?.kWh : null;
                  const subioConsumo = tieneDatos && mesAnterior !== null && mesAnterior !== undefined && Number(d.kWh) > Number(mesAnterior);

                  return (
                    <tr key={mesIdx} className={`transition ${rowBg}`}>
                      <td className={`px-4 py-2.5 font-semibold border-b ${modoNoche ? "border-[#2a2a2a] text-gray-200" : "border-gray-100 text-gray-700"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${tieneDatos ? (cumpleReal ? "bg-green-500" : "bg-red-500") : (modoNoche ? "bg-[#333]" : "bg-gray-200")}`} />
                          {MESES_LABEL[mesIdx]}
                          {subioConsumo && <span className="text-[10px] text-red-500 font-bold">▲</span>}
                        </div>
                      </td>
                      <td className={`px-3 py-2 text-center border-b ${modoNoche ? "border-[#2a2a2a]" : "border-gray-100"}`}>
                        <input
                          value={formatearDecimalInput(d.kWh)}
                          placeholder="—" inputMode="decimal"
                          className={`w-24 text-center rounded-xl border text-sm outline-none transition px-2 py-1.5
                            ${modoNoche ? "bg-[#2a2a2a] border-[#3a3a3a] text-white" : "bg-gray-50 border-gray-200 text-gray-800"}
                            focus:border-yellow-400 focus:ring-1 focus:ring-yellow-200`}
                          onChange={(e) => {
                            const val = limpiarKwh(e.target.value);
                            editarCelda(filaIndex, mesIdx, "kWh", val);
                            const numVal = parseFloat(val) || 0;
                            let autoCumple = true;
                            for (let i = mesIdx - 1; i >= 0; i--) {
                              const ant = fila.datos[i]?.kWh;
                              if (ant !== null && ant !== undefined && Number(ant) > 0) { autoCumple = numVal <= Number(ant); break; }
                            }
                            editarCelda(filaIndex, mesIdx, "cumple", autoCumple);
                          }}
                          onBlur={() => confirmarCelda(filaIndex, mesIdx)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmarCelda(filaIndex, mesIdx); } }}
                        />
                      </td>
                      <td className={`px-3 py-2 text-center border-b ${modoNoche ? "border-[#2a2a2a]" : "border-gray-100"}`}>
                        <input
                          value={formatearNumeroInput(d.valor)}
                          placeholder="—" inputMode="numeric"
                          className={`w-28 text-center rounded-xl border text-sm outline-none transition px-2 py-1.5
                            ${modoNoche ? "bg-[#2a2a2a] border-[#3a3a3a] text-white" : "bg-gray-50 border-gray-200 text-gray-800"}
                            focus:border-green-400 focus:ring-1 focus:ring-green-200`}
                          onChange={(e) => editarCelda(filaIndex, mesIdx, "valor", limpiarNumero(e.target.value))}
                          onBlur={() => confirmarCelda(filaIndex, mesIdx)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmarCelda(filaIndex, mesIdx); } }}
                        />
                      </td>
                      <td className={`px-4 py-2 text-center border-b ${modoNoche ? "border-[#2a2a2a]" : "border-gray-100"}`}>
                        <button
                          onClick={() => {
                            const nuevo = !cumpleReal;
                            editarCelda(filaIndex, mesIdx, "cumple", nuevo);
                            guardarRegistro({ ...fila, datos: fila.datos.map((item, idx) => idx === mesIdx ? { ...item, cumple: nuevo } : item) }, mesIdx);
                          }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition hover:scale-110 active:scale-95 mx-auto ${!tieneDatos ? "opacity-30 cursor-default" : "cursor-pointer"}`}
                          disabled={!tieneDatos}
                        >
                          {cumpleReal ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {/* fila total sede */}
                <tr className={`font-bold text-sm ${modoNoche ? "bg-[#1f1f1f] text-gray-200" : "bg-yellow-50 text-yellow-800"}`}>
                  <td className="px-4 py-3">Total año</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${modoNoche ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-700"}`}>{totalKwh.toLocaleString("es-CO")} kWh</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${modoNoche ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"}`}>${totalValor.toLocaleString("es-CO")}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${porcentaje >= 80 ? (modoNoche ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700") : (modoNoche ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700")}`}>{mesesCumplen}/{mesesConDatos} cumplen</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4 pt-2">
            <button onClick={() => confirmarEliminarFila(fila)}
              className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition shadow-sm hover:shadow-red-400/30 active:scale-95">
              🗑️ Eliminar esta sede
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── totales resumen ── */
function TotalesMes({ datosEnergia, modoNoche, card, txt, sub }: { datosEnergia: FilaComparativo[]; modoNoche: boolean; card: string; txt: string; sub: string; }) {
  const sedesPpal   = datosEnergia.filter((d) => d.nombre?.toUpperCase().includes("SEDE PPAL"));
  const receptorias = datosEnergia.filter((d) => d.nombre?.toUpperCase().includes("RECEPTORIA"));
  if (sedesPpal.length === 0 && receptorias.length === 0) return null;
  const sumarKwh   = (lista: FilaComparativo[]) => lista.reduce((a, d) => a + d.datos.reduce((b, c) => b + (Number(c?.kWh)   || 0), 0), 0);
  const sumarValor = (lista: FilaComparativo[]) => lista.reduce((a, d) => a + d.datos.reduce((b, c) => b + (Number(c?.valor)  || 0), 0), 0);
  return (
    <div className={`rounded-2xl border overflow-hidden ${card}`}>
      <div className={`px-4 py-3 border-b font-bold text-sm flex items-center gap-2 ${modoNoche ? "bg-[#1f1f1f] border-[#2a2a2a] text-gray-200" : "bg-yellow-50 border-yellow-100 text-yellow-800"}`}>
        📊 Resumen anual por tipo
      </div>
      <div className="p-4 grid sm:grid-cols-2 gap-3">
        {sedesPpal.length > 0 && (
          <div className={`rounded-2xl p-4 border ${modoNoche ? "bg-[#1e1e1e] border-[#2e2e2e]" : "bg-yellow-50 border-yellow-100"}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${sub}`}>Sede Principal</p>
            <p className={`text-2xl font-black ${modoNoche ? "text-yellow-300" : "text-yellow-700"}`}>{sumarKwh(sedesPpal).toLocaleString("es-CO")} kWh</p>
            <p className={`text-sm font-semibold mt-1 ${modoNoche ? "text-green-400" : "text-green-700"}`}>${sumarValor(sedesPpal).toLocaleString("es-CO")}</p>
          </div>
        )}
        {receptorias.length > 0 && (
          <div className={`rounded-2xl p-4 border ${modoNoche ? "bg-[#1e1e1e] border-[#2e2e2e]" : "bg-orange-50 border-orange-100"}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${sub}`}>Receptorías ({receptorias.length})</p>
            <p className={`text-2xl font-black ${modoNoche ? "text-orange-300" : "text-orange-700"}`}>{sumarKwh(receptorias).toLocaleString("es-CO")} kWh</p>
            <p className={`text-sm font-semibold mt-1 ${modoNoche ? "text-green-400" : "text-green-700"}`}>${sumarValor(receptorias).toLocaleString("es-CO")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VISTA TABLA ORIGINAL (bloque de 4 meses)
══════════════════════════════════════════════════════════ */
function TablaOriginal({
  modoNoche, inicio, fin, meses, datosFiltrados, datosEnergia, nuevaFila,
  mostrarTotales, inputsRef, editarFila, editarCelda, editarNuevaFila,
  manejarTeclas, confirmarCelda, guardarRegistro, actualizarSede,
  confirmarEliminarFila, crearRegistro,
}: Props) {
  const borde = modoNoche ? "border-[#333]" : "border-gray-300";
  return (
    <div className={`overflow-x-auto rounded-xl shadow-sm border ${borde}`}>
      <table className={`w-full text-xs border-collapse table-auto ${modoNoche ? "text-white" : "text-gray-800"}`}>
        <thead>
          <tr>
            <th colSpan={3 + meses.slice(inicio, fin).length * 3}
              className={`p-4 text-center text-lg font-bold tracking-wide
              ${modoNoche ? "bg-[#111] text-yellow-400 border border-[#333]" : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border border-gray-300"}`}>
              REGISTRO CONSUMO DE ENERGÍA SEGÚN FACTURACIÓN
            </th>
          </tr>
          <tr className={`text-sm ${modoNoche ? "bg-[#1f1f1f] text-white" : "bg-gradient-to-r from-yellow-200 to-yellow-400 text-gray-800"}`}>
            <th rowSpan={2} className={`p-3 border ${borde} text-left`}><div className="flex items-center gap-2"><User size={16} /> Nombre</div></th>
            <th rowSpan={2} className={`p-3 border ${borde} text-left`}><div className="flex items-center gap-2"><MapPin size={16} /> Ubicación</div></th>
            <th rowSpan={2} className={`p-3 border ${borde} text-center`}><div className="flex items-center justify-center gap-2"><CreditCard size={16} /> Cuenta</div></th>
            {meses.slice(inicio, fin).map((mes, i) => (
              <th key={i} className={`border p-2 text-center font-semibold ${borde}`} colSpan={3}>{mes}</th>
            ))}
          </tr>
          <tr className={`${modoNoche ? "bg-[#2a2a2a]" : "bg-yellow-100"} text-xs`}>
            {meses.slice(inicio, fin).map((_, i) => (
              <React.Fragment key={i}>
                <th className={`border p-2 ${borde}`}><div className="flex justify-center gap-1 items-center"><Zap size={14} /> kWh</div></th>
                <th className={`border p-2 ${borde}`}><div className="flex justify-center gap-1 items-center"><DollarSign size={14} /> Valor</div></th>
                <th className={`border p-2 ${borde}`}><div className="flex justify-center gap-1 items-center"><ChevronDown size={14} /> C</div></th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.map((fila, i) => (
            <tr key={i} className={`transition ${modoNoche ? (i % 2 === 0 ? "bg-[#141414] hover:bg-[#1e1e1e]" : "bg-[#181818] hover:bg-[#222]") : (i % 2 === 0 ? "bg-white hover:bg-yellow-50" : "bg-gray-50 hover:bg-yellow-50")}`}>
              <td className={`border px-3 py-2 min-w-[200px] ${borde}`}>
                <div className="flex items-center justify-between group">
                  <input value={fila.nombre ?? ""} ref={(el) => { if (!inputsRef.current[i]) inputsRef.current[i] = []; inputsRef.current[i][0] = el; }}
                    onKeyDown={(e) => { manejarTeclas(e, i, 0); if (e.key === "Enter") actualizarSede(fila); }}
                    className={`w-full outline-none font-semibold text-sm ${modoNoche ? "bg-transparent text-white" : "bg-transparent text-gray-800"}`}
                    onChange={(e) => editarFila(i, "nombre", e.target.value)} />
                  <button onClick={() => confirmarEliminarFila(fila)} className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 text-xs ml-2" title="Eliminar">✕</button>
                </div>
              </td>
              <td className={`border px-3 py-2 min-w-[220px] ${borde}`}>
                <input value={fila.ubicacion ?? ""} ref={(el) => { if (!inputsRef.current[i]) inputsRef.current[i] = []; inputsRef.current[i][1] = el; }}
                  onKeyDown={(e) => { manejarTeclas(e, i, 1); if (e.key === "Enter") actualizarSede(fila); }}
                  className={`w-full outline-none text-sm ${modoNoche ? "bg-transparent text-white" : "bg-transparent text-gray-800"}`}
                  onChange={(e) => editarFila(i, "ubicacion", e.target.value)} />
              </td>
              <td className={`border px-3 py-2 text-center min-w-[120px] ${borde}`}>
                <input value={fila.cuenta ?? ""} ref={(el) => { if (!inputsRef.current[i]) inputsRef.current[i] = []; inputsRef.current[i][2] = el; }}
                  onKeyDown={(e) => { manejarTeclas(e, i, 2); if (e.key === "Enter") actualizarSede(fila); }}
                  className={`w-full outline-none text-center text-sm ${modoNoche ? "bg-transparent text-white" : "bg-transparent text-gray-800"}`}
                  onChange={(e) => editarFila(i, "cuenta", e.target.value)} />
              </td>
              {fila.datos.slice(inicio, fin).map((d, j) => {
                const colBase = 3 + j * 3;
                return (
                  <React.Fragment key={j}>
                    <td className={`border p-1 text-center ${borde}`}>
                      <input value={formatearDecimalInput(d.kWh)} placeholder="0" inputMode="decimal"
                        ref={(el) => { if (!inputsRef.current[i]) inputsRef.current[i] = []; inputsRef.current[i][colBase] = el; }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmarCelda(i, inicio + j); return; } manejarTeclas(e, i, colBase); }}
                        onBlur={() => confirmarCelda(i, inicio + j)}
                        className={`w-20 text-center rounded-md border text-sm outline-none transition ${modoNoche ? "bg-[#2a2a2a] border-[#444] text-white" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                        onChange={(e) => editarCelda(i, inicio + j, "kWh", limpiarKwh(e.target.value))} />
                    </td>
                    <td className={`border p-1 text-center ${borde}`}>
                      <input value={formatearNumeroInput(d.valor)} placeholder="0" inputMode="numeric"
                        ref={(el) => { if (!inputsRef.current[i]) inputsRef.current[i] = []; inputsRef.current[i][colBase + 1] = el; }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmarCelda(i, inicio + j); return; } manejarTeclas(e, i, colBase + 1); }}
                        onBlur={() => confirmarCelda(i, inicio + j)}
                        className={`w-24 text-center rounded-md border text-sm outline-none transition ${modoNoche ? "bg-[#2a2a2a] border-[#444] text-white" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                        onChange={(e) => editarCelda(i, inicio + j, "valor", limpiarNumero(e.target.value))} />
                    </td>
                    <td className={`border p-1 text-center ${borde}`}>
                      <select value={d.cumple ? "true" : "false"}
                        ref={(el) => { if (!inputsRef.current[i]) inputsRef.current[i] = []; inputsRef.current[i][colBase + 2] = el; }}
                        onKeyDown={(e) => manejarTeclas(e, i, colBase + 2)}
                        className={`text-lg font-bold cursor-pointer rounded-md px-1 ${d.cumple ? "text-green-500" : "text-red-500"} ${modoNoche ? "bg-[#1f1f1f]" : "bg-white"}`}
                        onChange={(e) => {
                          const nv = e.target.value === "true";
                          editarCelda(i, inicio + j, "cumple", nv);
                          guardarRegistro({ ...fila, datos: fila.datos.map((item, idx) => idx === inicio + j ? { ...item, cumple: nv } : item) }, inicio + j);
                        }}>
                        <option value="true">✔</option>
                        <option value="false">✖</option>
                      </select>
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
          {/* fila nueva sede */}
          <tr className={`${modoNoche ? "bg-[#202020]" : "bg-yellow-50"}`}>
            <td className="border border-gray-300 p-3">
              <input value={nuevaFila.nombre} placeholder="Nombre sede"
                className={`w-full rounded-md px-3 py-2 border ${modoNoche ? "bg-[#202020] border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-700"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                onChange={(e) => editarNuevaFila("nombre", e.target.value)} />
            </td>
            <td className="border border-gray-300 p-3">
              <input value={nuevaFila.ubicacion} placeholder="Ubicación"
                className={`w-full rounded-md px-3 py-2 border ${modoNoche ? "bg-[#202020] border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-700"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                onChange={(e) => editarNuevaFila("ubicacion", e.target.value)} />
            </td>
            <td className="border border-gray-300 p-3 text-center">
              <input value={nuevaFila.cuenta} placeholder="Cuenta"
                className={`w-full rounded-md px-3 py-2 text-center border ${modoNoche ? "bg-[#202020] border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-700"} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                onChange={(e) => editarNuevaFila("cuenta", e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") crearRegistro(); }} />
            </td>
          </tr>
          {/* totales sede principal */}
          {mostrarTotales && (
            <tr className={`font-bold ${modoNoche ? "bg-[#181818] text-white" : "bg-yellow-100 text-yellow-800"}`}>
              <td colSpan={3} className="border border-gray-300 p-3">TOTAL SEDE PRINCIPAL</td>
              {meses.slice(inicio, fin).map((_, i) => {
                const totalKwh   = datosEnergia.filter((d) => d.nombre?.toUpperCase().includes("SEDE PPAL")).reduce((acc, d) => acc + Number(d.datos?.[inicio + i]?.kWh || 0), 0);
                const totalValor = datosEnergia.filter((d) => d.nombre?.toUpperCase().includes("SEDE PPAL")).reduce((acc, d) => acc + Number(d.datos?.[inicio + i]?.valor || 0), 0);
                return (
                  <td key={i} colSpan={3} className="border border-gray-300 text-center p-3">
                    <table className={`w-full text-xs font-semibold border ${modoNoche ? "border-[#333]" : "border-gray-300"}`}><tbody><tr>
                      <td className={`border px-2 py-1 text-yellow-500 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}><div className="flex items-center justify-center gap-1"><Zap size={13} />{totalKwh} kWh</div></td>
                      <td className={`border px-2 py-1 text-green-500 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}><div className="flex items-center justify-center gap-1"><DollarSign size={13} />${totalValor.toLocaleString()}</div></td>
                    </tr></tbody></table>
                  </td>
                );
              })}
            </tr>
          )}
          {/* totales receptorías */}
          <tr className={`font-bold ${modoNoche ? "bg-[#202020] text-gray-200" : "bg-yellow-50 text-yellow-700"}`}>
            <td colSpan={3} className="border border-gray-300 p-3">TOTAL SOLO RECEPTORIAS</td>
            {meses.slice(inicio, fin).map((_, i) => {
              const totalKwh   = datosEnergia.filter((d) => d.nombre?.toUpperCase().includes("RECEPTORIA")).reduce((acc, d) => acc + Number(d.datos?.[inicio + i]?.kWh || 0), 0);
              const totalValor = datosEnergia.filter((d) => d.nombre?.toUpperCase().includes("RECEPTORIA")).reduce((acc, d) => acc + Number(d.datos?.[inicio + i]?.valor || 0), 0);
              return (
                <td key={i} colSpan={3} className="border border-gray-300 text-center p-3">
                  <table className={`w-full text-xs font-semibold border ${modoNoche ? "border-[#333]" : "border-gray-300"}`}><tbody><tr>
                    <td className={`border px-2 py-1 text-yellow-500 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}><div className="flex items-center justify-center gap-1"><Zap size={13} />{totalKwh} kWh</div></td>
                    <td className={`border px-2 py-1 text-green-500 text-center ${modoNoche ? "border-[#333]" : "border-gray-300"}`}><div className="flex items-center justify-center gap-1"><DollarSign size={13} />${totalValor.toLocaleString()}</div></td>
                  </tr></tbody></table>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
