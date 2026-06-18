"use client";

import ConsumoAguaTarjetas from "./ConsumoAguaTarjetas";
import ConsumoAguaFiltros from "./ConsumoAguaFiltros";
import ConsumoAguaTabla from "./ConsumoAguaTabla";
import { useConsumoAgua } from "../../hooks/useConsumoAgua";

interface Props {
  modoNoche: boolean;
}

export default function ConsumoAgua({ modoNoche }: Props) {
  const {
    tarjetaClase,
    buscadorClase,
    inputClase,
    metaMensual,
    existeMeta,
    setMetaMensual,
    eliminarMetaMensualAgua,
    confirmarYGuardarMeta,
    mesSeleccionado,
    setMesSeleccionado,
    meses,
    anioSeleccionado,
    setAnioSeleccionado,
    aniosDisponibles,
    filtroDia,
    setFiltroDia,
    filtroTipoDia,
    setFiltroTipoDia,
    fechaColombia,
    obtenerPromedioMes,
    obtenerDiasDelMes,
    obtenerDiasFiltrados,
    totalMes,
    coloresDias,
    handleExportarExcel,
    mesesARenderizar,
    lecturas,
    handleChange,
    navegarConFlechas,
    eliminarAgua,
    guardarAguaEnBD,
    UMBRAL_CONSUMO_ALTO,
    resumenDias,
    colores,
  } = useConsumoAgua(modoNoche);

  return (
    <div className={`w-full min-h-screen p-6 ${colores.fondo}`}>
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        <ConsumoAguaTarjetas
          tarjetaClase={tarjetaClase}
          metaMensual={metaMensual}
          existeMeta={existeMeta}
          setMetaMensual={setMetaMensual}
          eliminarMetaMensualAgua={eliminarMetaMensualAgua}
          confirmarYGuardarMeta={confirmarYGuardarMeta}
          mesSeleccionado={mesSeleccionado}
          meses={meses}
          anioSeleccionado={anioSeleccionado}
          fechaColombia={fechaColombia}
          obtenerPromedioMes={obtenerPromedioMes}
          modoNoche={modoNoche}
          UMBRAL_CONSUMO_ALTO={UMBRAL_CONSUMO_ALTO}
          resumenDias={resumenDias}
          coloresDias={coloresDias}
          handleExportarExcel={handleExportarExcel}
        />

        <ConsumoAguaFiltros
          buscadorClase={buscadorClase}
          inputClase={inputClase}
          mesSeleccionado={mesSeleccionado}
          setMesSeleccionado={setMesSeleccionado}
          meses={meses}
          anioSeleccionado={anioSeleccionado}
          setAnioSeleccionado={setAnioSeleccionado}
          aniosDisponibles={aniosDisponibles}
          filtroDia={filtroDia}
          setFiltroDia={setFiltroDia}
          filtroTipoDia={filtroTipoDia}
          setFiltroTipoDia={setFiltroTipoDia}
        />

        <ConsumoAguaTabla
          modoNoche={modoNoche}
          mesesARenderizar={mesesARenderizar}
          meses={meses}
          anioSeleccionado={anioSeleccionado}
          lecturas={lecturas}
          obtenerDiasDelMes={obtenerDiasDelMes}
          obtenerDiasFiltrados={obtenerDiasFiltrados}
          totalMes={totalMes}
          filtroDia={filtroDia}
          filtroTipoDia={filtroTipoDia}
          handleChange={handleChange}
          navegarConFlechas={navegarConFlechas}
          eliminarAgua={eliminarAgua}
          guardarAguaEnBD={guardarAguaEnBD}
        />
      </div>
    </div>
  );
}
