"use client";

import ComparativoEnergiaContenedores from "../../components/comparativoEnergia/ComparativoEnergiaContenedores";
import ComparativoEnergiaFiltros from "../../components/comparativoEnergia/ComparativoEnergiaFiltros";
import ComparativoEnergiaTabla from "../../components/comparativoEnergia/ComparativoEnergiaTabla";
import { useComparativoEnergia } from "../../hooks/useComparativoEnergia";

interface Props {
  modoNoche: boolean;
}

export default function ComparativoEnergia({ modoNoche }: Props) {
  const {
    meses,
    datosEnergia,
    datosFiltrados,
    sedesDB,
    nuevaFila,
    years,
    anio,
    setAnio,
    sedeSeleccionada,
    setSedeSeleccionada,
    tipoTotal,
    setTipoTotal,
    mostrarTotales,
    fondo,
    card,
    inputsRef,
    editarNuevaFila,
    editarFila,
    editarCelda,
    manejarTeclas,
    confirmarCelda,
    crearRegistro,
    guardarRegistro,
    actualizarSede,
    confirmarEliminarFila,
  } = useComparativoEnergia(modoNoche);

  const tablaProps = {
    modoNoche,
    meses,
    datosFiltrados,
    datosEnergia,
    nuevaFila,
    mostrarTotales,
    inputsRef,
    editarFila,
    editarCelda,
    editarNuevaFila,
    manejarTeclas,
    confirmarCelda,
    guardarRegistro,
    actualizarSede,
    confirmarEliminarFila,
    crearRegistro,
  };

  return (
    <div className={`min-h-screen p-8 ${fondo}`}>
      <div className="max-w-[1700px] mx-auto space-y-8">
        <div className="flex items-center gap-1">
          <div></div>
        </div>

        <ComparativoEnergiaContenedores
          card={card}
          datosEnergia={datosEnergia}
        />

        <ComparativoEnergiaFiltros
          modoNoche={modoNoche}
          card={card}
          anio={anio}
          setAnio={setAnio}
          years={years}
          tipoTotal={tipoTotal}
          setTipoTotal={setTipoTotal}
          sedeSeleccionada={sedeSeleccionada}
          setSedeSeleccionada={setSedeSeleccionada}
          sedesDB={sedesDB}
        />

        <div className={`rounded-xl overflow-auto ${card}`}>
          <ComparativoEnergiaTabla {...tablaProps} inicio={0} fin={4} />
        </div>

        <div className={`rounded-xl overflow-auto ${card}`}>
          <ComparativoEnergiaTabla {...tablaProps} inicio={4} fin={8} />
        </div>

        <div className={`rounded-xl overflow-auto ${card}`}>
          <ComparativoEnergiaTabla {...tablaProps} inicio={8} fin={12} />
        </div>
      </div>
    </div>
  );
}
