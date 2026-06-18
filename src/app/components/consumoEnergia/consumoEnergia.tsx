"use client";

import ConsumoEnergiaTarjetas from "./ConsumoEnergiaTarjetas";
import ConsumoEnergiaFiltros from "./ConsumoEnergiaFiltros";
import ConsumoEnergiaTabla from "./ConsumoEnergiaTabla";
import { useConsumoEnergia } from "../../hooks/useConsumoEnergia";

interface Props {
  modoNoche: boolean;
}

export default function ConsumoEnergia({ modoNoche }: Props) {
  const {
    tarjetaClase,
    buscadorClase,
    inputClase,
    metaMensual,
    existeMeta,
    setMetaMensual,
    eliminarMetaMensual,
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
    eliminarBodega,
    guardarEnergiaEnBD,
    UMBRAL_CONSUMO_ALTO,
    resumenDias,
    colores,
  } = useConsumoEnergia(modoNoche);

  return (
    <div className={`w-full min-h-screen p-6 ${colores.fondo}`}>
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        <ConsumoEnergiaTarjetas
          tarjetaClase={tarjetaClase}
          metaMensual={metaMensual}
          existeMeta={existeMeta}
          setMetaMensual={setMetaMensual}
          eliminarMetaMensual={eliminarMetaMensual}
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

        <ConsumoEnergiaFiltros
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

        <ConsumoEnergiaTabla
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
          eliminarBodega={eliminarBodega}
          guardarEnergiaEnBD={guardarEnergiaEnBD}
        />
      </div>
    </div>
  );
}
