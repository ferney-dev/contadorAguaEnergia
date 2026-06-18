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
    modoNuevaInspeccion,
    inspecciones,
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
    dataBackendFiltrada,
    inspeccionesFiltradas,
    setBusqueda,
    setResponsable,
    setFechaSesion,
    setMostrarModal,
    setEditandoGrupo,
    setAnioFiltro,
    setMesFiltro,
    finalizarInspeccion,
    handleChange,
    handleObs,
    obtenerValor,
    calcularTotalFila,
    guardarFila,
    guardarTodo,
    eliminarInspeccionGrupo,
  } = useInspeccionesAgua(modoNoche);

  const tablaProps = {
    modoNoche,
    dataBackendFiltrada,
    valores,
    observaciones,
    responsable,
    fechaSesion,
    inspecciones,
    estilos,
    handleChange,
    handleObs,
    obtenerValor,
    calcularTotalFila,
    guardarFila,
    dataBackend,
    setDataBackend,
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
  };

  const contenedoresProps = {
    modoNoche,
    estilos,
    fechaActual,
    inspecciones,
    setMostrarModal,
    finalizarInspeccion,
  };

  return (
    <div className={`w-full rounded-3xl p-3 sm:p-4 md:p-6 ${estilos.tarjeta}`}>
      <div className="mb-5 flex flex-col gap-4">
        <div className="text-center">
          <h2
            className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide ${estilos.titulo}`}
          >
            Gestión de Sanitarios
          </h2>
          <p className={`mt-1 text-xs sm:text-sm ${estilos.subtitulo}`}>
            Control de inspecciones, filtros e historial en tiempo real
          </p>

          <InspeccionesAguaContenedores {...contenedoresProps} />
        </div>

        <InspeccionesAguaFiltros {...filtrosProps} />

        <InspeccionesAguaTabla {...tablaProps} />
      </div>

      <MovilAgua
        dataBackend={dataBackend}
        setInspecciones={() => {}}
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        modoNoche={modoNoche}
      />
    </div>
  );
}
