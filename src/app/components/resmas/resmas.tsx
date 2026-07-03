"use client";

import ResmasContenedores from "./ResmasContenedores";
import ResmasFiltros from "./ResmasFiltros";
import ResmasTabla from "./ResmasTabla";
import { useResmas } from "../../hooks/useResmas";
import { Files, Loader2 } from "lucide-react";

interface Props {
  modoNoche: boolean;
}

export default function TablaResmasAvanzada({ modoNoche }: Props) {
  const {
    meses,
    filas,
    totalesPorMes,
    guardandoCelda,
    editandoAreaId,
    nombreEditado,
    confirmarEliminarId,
    inputEditarRef,
    busqueda,
    setBusqueda,
    anioSeleccionado,
    setAnioSeleccionado,
    aniosDisponibles,
    nuevaArea,
    setNuevaArea,
    cargando,
    errorGeneral,
    resumen,
    totalMesActual,
    nombreMesActual,
    fondo,
    card,
    crearArea,
    iniciarEdicionArea,
    cancelarEdicionArea,
    guardarEdicionArea,
    eliminarArea,
    setConfirmarEliminarId,
    setNombreEditado,
    manejarFlechas,
    manejarEnterCantidad,
    manejarCambioVisualCantidad,
    manejarBlurCantidad,
    comparar,
  } = useResmas(modoNoche);

  const tablaProps = {
    modoNoche,
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
  };

  return (
    <section className={`w-full rounded-[28px] p-4 md:p-8 ${fondo}`}>
      <div className="space-y-8">

      
        {/* ── TARJETAS DE RESUMEN ── */}
        <ResmasContenedores
          card={card}
          resumen={resumen}
          totalMesActual={totalMesActual}
          nombreMesActual={nombreMesActual}
        />

        {/* ── FILTROS ── */}
        <div className={`rounded-[24px] p-4 md:p-5 ${card}`}>
          <ResmasFiltros
            modoNoche={modoNoche}
            card={card}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            anioSeleccionado={anioSeleccionado}
            setAnioSeleccionado={setAnioSeleccionado}
            aniosDisponibles={aniosDisponibles}
            nuevaArea={nuevaArea}
            setNuevaArea={setNuevaArea}
            crearArea={crearArea}
          />
        </div>

        {/* ── ERROR ── */}
        {errorGeneral ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            {errorGeneral}
          </div>
        ) : null}

        {/* ── TABLAS ── */}
        <div className="space-y-8">

          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <h3 className={`text-sm font-bold uppercase tracking-widest ${modoNoche ? "text-gray-300" : "text-gray-600"}`}>
                Enero — Junio
              </h3>
            </div>
            <ResmasTabla {...tablaProps} inicio={0} fin={6} />
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-violet-500" />
              <h3 className={`text-sm font-bold uppercase tracking-widest ${modoNoche ? "text-gray-300" : "text-gray-600"}`}>
                Julio — Diciembre
              </h3>
            </div>
            <ResmasTabla {...tablaProps} inicio={6} fin={12} />
          </div>

        </div>

      </div>

      {/* ── LOADER FLOTANTE ── */}
      {cargando ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-full border border-white/10 bg-slate-900 p-3 text-white shadow-2xl">
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : null}
    </section>
  );
}
