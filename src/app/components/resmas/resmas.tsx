"use client";

import { Loader2 } from "lucide-react";
import ResmasContenedores from "./ResmasContenedores";
import ResmasFiltros from "./ResmasFiltros";
import ResmasTabla from "./ResmasTabla";
import { useResmas } from "../../hooks/useResmas";

interface Props {
  modoNoche: boolean;
}

export default function TablaResmasAvanzada({ modoNoche }: Props) {
  const {
    meses, filas, totalesPorMes, guardandoCelda,
    editandoAreaId, nombreEditado, confirmarEliminarId, inputEditarRef,
    busqueda, setBusqueda, anioSeleccionado, setAnioSeleccionado, aniosDisponibles,
    nuevaArea, setNuevaArea, cargando, errorGeneral, resumen,
    totalMesActual, nombreMesActual, fondo, card,
    crearArea, iniciarEdicionArea, cancelarEdicionArea, guardarEdicionArea,
    eliminarArea, setConfirmarEliminarId, setNombreEditado,
    manejarFlechas, manejarEnterCantidad, manejarCambioVisualCantidad, manejarBlurCantidad,
    comparar,
  } = useResmas(modoNoche);

  const bg  = modoNoche ? "bg-[#1f1f1f]" : "bg-[#f4f6fa]";
  const txt = modoNoche ? "text-white"   : "text-gray-800";
  const sub = modoNoche ? "text-gray-400": "text-gray-500";

  const tablaProps = {
    modoNoche, filas, totalesPorMes, guardandoCelda,
    editandoAreaId, nombreEditado, confirmarEliminarId, inputEditarRef,
    manejarFlechas, manejarEnterCantidad, manejarCambioVisualCantidad, manejarBlurCantidad,
    comparar, iniciarEdicionArea, cancelarEdicionArea, guardarEdicionArea,
    eliminarArea, setConfirmarEliminarId, setNombreEditado, cargando,
    // inicio/fin requeridos por Props pero no usados en la nueva vista
    inicio: 0,
    fin: 12,
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${bg}`}>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ══ HEADER ════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${txt}`}>
              📄 Inventario de Resmas
            </h1>
            <p className={`text-sm mt-0.5 ${sub}`}>
              Control de papel por área · {anioSeleccionado}
            </p>
          </div>
          {/* selector de año visible en header también */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold
            ${modoNoche ? "bg-[#161616] border-white/8 text-gray-200" : "bg-white border-gray-200 text-gray-700 shadow-sm"}`}>
            <span className="text-[#C40000]">📅</span>
            <select
              value={anioSeleccionado}
              onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
              className="bg-transparent outline-none"
            >
              {aniosDisponibles.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ══ KPIs ══════════════════════════════════════════════ */}
        <ResmasContenedores
          card={card} modoNoche={modoNoche}
          resumen={resumen}
          totalMesActual={totalMesActual}
          nombreMesActual={nombreMesActual}
        />

        {/* ══ FILTROS ═══════════════════════════════════════════ */}
        <div className={`rounded-2xl border p-4 ${modoNoche ? "bg-[#161616] border-white/8" : "bg-white border-gray-100 shadow-sm"}`}>
          <ResmasFiltros
            modoNoche={modoNoche} card={card}
            busqueda={busqueda} setBusqueda={setBusqueda}
            anioSeleccionado={anioSeleccionado} setAnioSeleccionado={setAnioSeleccionado}
            aniosDisponibles={aniosDisponibles}
            nuevaArea={nuevaArea} setNuevaArea={setNuevaArea}
            crearArea={crearArea}
          />
        </div>

        {/* ══ ERROR ═════════════════════════════════════════════ */}
        {errorGeneral && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            {errorGeneral}
          </div>
        )}

        {/* ══ TABLA (tarjetas) ══════════════════════════════════ */}
        <ResmasTabla {...tablaProps} />

      </div>

      {/* ── LOADER FLOTANTE ── */}
      {cargando && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#C40000] p-3 text-white shadow-2xl shadow-[#C40000]/40">
          <Loader2 className="animate-spin" size={22} />
        </div>
      )}
    </div>
  );
}
