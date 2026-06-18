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
    <section className={`w-full rounded-[28px] p-4 md:p-6 ${fondo}`}>
      <div className="space-y-6">

        {/* Encabezado + Resumen */}
        <div className={`rounded-[28px] p-4 md:p-5 ${card}`}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-3xl bg-blue-600/10 p-3 text-blue-500">
                <Files size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold md:text-2xl">
                  Gestión avanzada de resmas
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    modoNoche ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Consulta por año, busca áreas, crea nuevas dependencias y
                  guarda valores automáticamente al salir de la celda.
                </p>
              </div>
            </div>
          </div>

          <ResmasContenedores
            card={card}
            resumen={resumen}
            totalMesActual={totalMesActual}
            nombreMesActual={nombreMesActual}
          />
        </div>

        {/* Tarjeta independiente para filtros */}
        <div className={`rounded-[28px] p-4 md:p-5 ${card}`}>
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

        {/* Error */}
        {errorGeneral ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            {errorGeneral}
          </div>
        ) : null}

        {/* Tablas */}
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Meses 1 a 6
              </h3>
            </div>

            <ResmasTabla {...tablaProps} inicio={0} fin={6} />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Meses 7 a 12
              </h3>
            </div>

            <ResmasTabla {...tablaProps} inicio={6} fin={12} />
          </div>
        </div>

        {/* Loader */}
        {cargando ? (
          <div className="fixed bottom-5 right-5 z-50 rounded-full border border-white/10 bg-slate-900 p-3 text-white shadow-xl">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : null}
      </div>
    </section>
  );
}