"use client";

import { useState } from "react";
import { Printer, Layers, Plus, Save, CalendarDays, Package, User, ScanLine,
         X, MapPin, RefreshCcw } from "lucide-react";
import TonnerContenedores from "./TonnerContenedores";
import TonnerFiltros from "./TonnerFiltros";
import TonnerTabla from "./TonnerTabla";
import ModalAreasTonner from "./ModalAreasTonner";
import { useTonner } from "../../hooks/useTonner";
import { getThemeClasses } from "./utils";
import type { Tonner } from "../../hooks/useTonner";

export default function TablaTonners({ modoNoche }: { modoNoche: boolean }) {
  const [mostrarModal,      setMostrarModal]      = useState(false);
  const [mostrarModalAreas, setMostrarModalAreas] = useState(false);

  const {
    areas, busqueda, setBusqueda, filtroArea, setFiltroArea,
    nuevaArea, setNuevaArea, editandoId, filtroAnio, setFiltroAnio,
    filtroMes, setFiltroMes, nuevo, setNuevo, crearArea,
    guardar: guardarHook, editar: editarHook, eliminar,
    limpiarFormulario: limpiarHook, filtrados,
    totalRegistros, totalCantidad, totalAreasConUso, cargar,
  } = useTonner(modoNoche);

  const { fondo, card, input, subCard } = getThemeClasses(modoNoche);

  const bg  = modoNoche ? "bg-[#0b0b0b]"                            : "bg-[#ffffff]";
  const txt = modoNoche ? "text-white"                               : "text-gray-800";
  const sub = modoNoche ? "text-gray-400"                            : "text-gray-500";
  const inp = modoNoche ? "bg-[#1e1e1e] border-white/10 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400";

  const editar = (t: Tonner) => {
    editarHook(t);
    setMostrarModal(true);
  };

  const guardar = async () => {
    await guardarHook();
    setMostrarModal(false);
  };

  const limpiar = () => {
    limpiarHook();
    setMostrarModal(false);
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${bg}`}>
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ══ HEADER ════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${txt}`}>
              🖨️ Inventario de Tonners
            </h1>
            <p className={`text-sm mt-0.5 ${sub}`}>Control y gestión de suministros de impresión</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMostrarModalAreas(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition
                hover:scale-105 active:scale-95
                ${modoNoche ? "bg-[#1e1e1e] border-white/10 text-gray-200 hover:bg-[#252525]" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
            >
              <Layers size={15} /> Áreas
            </button>
            <button
              onClick={() => { limpiarHook(); setMostrarModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500
                text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition hover:scale-105 active:scale-95"
            >
              <Plus size={15} /> Registrar tonner
            </button>
          </div>
        </div>

        {/* ══ KPIs ══════════════════════════════════════════════ */}
        <TonnerContenedores
          card={card} modoNoche={modoNoche}
          totalRegistros={totalRegistros}
          totalCantidad={totalCantidad}
          totalAreasConUso={totalAreasConUso}
        />

        {/* ══ CREAR ÁREA RÁPIDA ═════════════════════════════════ */}
        <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3
          ${modoNoche ? "bg-[#161616] border-white/8" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-500" />
            </div>
            <p className={`text-sm font-semibold ${txt}`}>Nueva área</p>
          </div>
          <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inp}`}>
            <Plus className="w-4 h-4 text-violet-400 shrink-0" />
            <input
              value={nuevaArea}
              onChange={(e) => setNuevaArea(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") crearArea(); }}
              placeholder="Nombre del área + Enter para crear"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <button
            onClick={crearArea}
            disabled={!nuevaArea.trim()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold
              shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Crear
          </button>
        </div>

        {/* ══ FILTROS ═══════════════════════════════════════════ */}
        <TonnerFiltros
          modoNoche={modoNoche} card={card} subCard={subCard}
          busqueda={busqueda} setBusqueda={setBusqueda}
          filtroArea={filtroArea} setFiltroArea={setFiltroArea}
          filtroAnio={filtroAnio} setFiltroAnio={setFiltroAnio}
          filtroMes={filtroMes} setFiltroMes={setFiltroMes}
          areas={areas} totalFiltrados={filtrados.length}
        />

        {/* ══ TABLA / TARJETAS ══════════════════════════════════ */}
        <TonnerTabla
          modoNoche={modoNoche} areas={areas}
          filtrados={filtrados} editar={editar} eliminar={eliminar}
        />
      </div>

      {/* ══ MODAL REGISTRAR/EDITAR ════════════════════════════ */}
      {mostrarModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={limpiar}
        >
          <div
            className={`relative w-full sm:max-w-2xl rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl
              ${modoNoche ? "bg-[#161616] border border-white/10" : "bg-white border border-gray-200"}`}
            style={{ maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header modal */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {editandoId ? "Editar tonner" : "Registrar tonner"}
                  </h2>
                  <p className="text-purple-200 text-xs">
                    {editandoId ? "Modifica los datos del registro" : "Completa los campos del nuevo tonner"}
                  </p>
                </div>
              </div>
              <button onClick={limpiar} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* body modal */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3" style={{ scrollbarWidth: "none" }}>

              {/* Área */}
              <Campo icono={<Layers className="w-5 h-5 text-violet-400" />} label="Área *" modoNoche={modoNoche}>
                <select
                  value={nuevo.area_id || ""}
                  onChange={(e) => setNuevo({ ...nuevo, area_id: Number(e.target.value) })}
                  className="flex-1 bg-transparent outline-none text-sm"
                >
                  <option value="">Seleccionar área</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </Campo>

              {/* Responsable */}
              <Campo icono={<User className="w-5 h-5 text-blue-400" />} label="Responsable *" modoNoche={modoNoche}>
                <input
                  value={nuevo.responsable}
                  onChange={(e) => setNuevo({ ...nuevo, responsable: e.target.value })}
                  placeholder="Nombre del responsable"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </Campo>

              {/* Modelo tonner */}
              <Campo icono={<ScanLine className="w-5 h-5 text-purple-400" />} label="Modelo tonner" modoNoche={modoNoche}>
                <input
                  value={nuevo.modelo_tonner}
                  onChange={(e) => setNuevo({ ...nuevo, modelo_tonner: e.target.value })}
                  placeholder="Ej: HP CF217A"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </Campo>

              {/* Modelo impresora */}
              <Campo icono={<Printer className="w-5 h-5 text-emerald-400" />} label="Modelo impresora" modoNoche={modoNoche}>
                <input
                  value={nuevo.modelo_impresora}
                  onChange={(e) => setNuevo({ ...nuevo, modelo_impresora: e.target.value })}
                  placeholder="Ej: HP LaserJet Pro M402"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </Campo>

              {/* Cantidad + Fecha en fila */}
              <div className="grid grid-cols-2 gap-3">
                <Campo icono={<Package className="w-5 h-5 text-amber-400" />} label="Cantidad" modoNoche={modoNoche}>
                  <input
                    type="number"
                    min="1"
                    value={nuevo.cantidad}
                    onChange={(e) => setNuevo({ ...nuevo, cantidad: Number(e.target.value) || 1 })}
                    className="flex-1 bg-transparent outline-none text-sm w-16"
                  />
                </Campo>

                <Campo icono={<CalendarDays className="w-5 h-5 text-cyan-400" />} label="Fecha" modoNoche={modoNoche}>
                  <input
                    type="date"
                    value={nuevo.fecha}
                    onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </Campo>
              </div>

            </div>

            {/* footer modal */}
            <div className={`px-5 py-4 border-t flex gap-3 shrink-0
              ${modoNoche ? "bg-[#111] border-white/8" : "bg-gray-50 border-gray-200"}`}>
              <button
                onClick={limpiar}
                className={`flex-1 py-3 rounded-2xl border text-sm font-semibold transition
                  ${modoNoche ? "bg-[#252525] border-white/10 text-gray-300 hover:bg-[#2e2e2e]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"}`}
              >
                <RefreshCcw className="inline w-4 h-4 mr-1" />
                {editandoId ? "Cancelar edición" : "Cancelar"}
              </button>
              <button
                onClick={guardar}
                className={`flex-1 py-3 rounded-2xl text-white text-sm font-bold shadow-lg transition
                  ${editandoId
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-amber-400/20 hover:from-amber-600 hover:to-amber-500"
                    : "bg-gradient-to-r from-violet-600 to-purple-500 shadow-violet-500/25 hover:from-violet-700 hover:to-purple-600"
                  }`}
              >
                <Save className="inline w-4 h-4 mr-1" />
                {editandoId ? "Actualizar" : "Guardar tonner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL ÁREAS ═══════════════════════════════════════ */}
      <ModalAreasTonner
        abierto={mostrarModalAreas}
        onClose={() => setMostrarModalAreas(false)}
        areas={areas}
        cargar={cargar}
        modoNoche={modoNoche}
      />
    </div>
  );
}

/* ── Campo reutilizable del formulario ── */
function Campo({ icono, label, modoNoche, children }: {
  icono: React.ReactNode;
  label: string;
  modoNoche: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition
        ${modoNoche ? "bg-[#1e1e1e] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`}>
        {icono}
        {children}
      </div>
    </div>
  );
}
