"use client";

import { useInspeccionesAgua } from "../../../hooks/useInspeccionesAgua";
import InspeccionesAguaTabla from "./InspeccionesAguaTabla";
import InspeccionesAguaFiltros from "./InspeccionesAguaFiltros";
import InspeccionesAguaContenedores from "./InspeccionesAguaContenedores";
import MovilAgua from "./modalAgua";

interface Props {
  modoNoche?: boolean;
  dataBackend: any[];
}

export default function TablaSanitarios({
  modoNoche = false,
  dataBackend: dataInicial,
}: Props) {
  const {
    dataBackend,
    setDataBackend,
    valores,
    observaciones,
    fechaActual,
    busqueda,
    inspecciones,
    setInspecciones,
    responsable,
    fechaSesion,
    mostrarModal,
    editandoGrupo,
    anioFiltro,
    mesFiltro,
    estilos,
    CAMPOS,
    MESES,
    aniosDisponibles,
    inspeccionesFiltradas,
    setBusqueda,
    setMostrarModal,
    setEditandoGrupo,
    setAnioFiltro,
    setMesFiltro,
    finalizarInspeccion,
    handleChange,
    handleObs,
    handleBlur,
    guardarTodo,
    eliminarInspeccionGrupo,
  } = useInspeccionesAgua(modoNoche);

  const contenedoresProps = {
    modoNoche,
    estilos,
    fechaActual,
    inspecciones,
    setMostrarModal,
    finalizarInspeccion,
  };

  const filtrosProps = {
    modoNoche,
    estilos,
    busqueda,
    setBusqueda,
    anioFiltro,
    setAnioFiltro,
    mesFiltro,
    setMesFiltro,
    aniosDisponibles,
    MESES,
    dataBackend,
    inspeccionesFiltradas,
    fechaActual,
    responsable,
    setDataBackend,
  };

  const tablaProps = {
    modoNoche,
    dataBackend,
    setDataBackend,
    inspeccionesFiltradas,
    valores,
    observaciones,
    fechaSesion,
    editandoGrupo,
    setEditandoGrupo,
    handleChange,
    handleObs,
    handleBlur,
    guardarTodo,
    eliminarInspeccionGrupo,
    estilos,
    inspecciones,
  };

  return (
    <div className={`w-full rounded-3xl p-3 sm:p-4 md:p-6 ${estilos.tarjeta}`}>
      <div className="mb-5 flex flex-col gap-4">
        <div className="text-center">
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide ${estilos.titulo}`}>
            Gestión de Sanitarios
          </h2>
          <p className={`mt-1 text-xs sm:text-sm ${estilos.subtitulo}`}>
            Control de inspecciones, filtros e historial. Los datos se guardan automáticamente al salir de la celda.
          </p>
          <InspeccionesAguaContenedores {...contenedoresProps} />
        </div>
        <InspeccionesAguaFiltros {...filtrosProps} />
      </div>

      <MovilAgua
        dataBackend={dataBackend}
        setInspecciones={setInspecciones}
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        modoNoche={modoNoche}
      />

      <InspeccionesAguaTabla {...tablaProps} />

      {/* FOOTER */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className={`px-4 py-2 rounded-xl text-xs sm:text-sm ${estilos.chip}`}>
          Día actual: <span className="font-semibold">{fechaActual}</span>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs sm:text-sm ${estilos.chip}`}>
          Responsable:{" "}
          <span className="font-semibold">
            {responsable ? responsable : "Pendiente por asignar"}
          </span>
        </div>
      </div>
    </div>
  );
}
