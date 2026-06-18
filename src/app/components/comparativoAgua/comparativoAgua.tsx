"use client";

import ComparativoAguaContenedores from "../../components/comparativoAgua/ComparativoAguaContenedores";
import ComparativoAguaFiltros from "../../components/comparativoAgua/ComparativoAguaFiltros";
import ComparativoAguaTabla from "../../components/comparativoAgua/ComparativoAguaTabla";
import { useComparativoAgua } from "../../hooks/useComparativoAgua";

interface Props {
  modoNoche: boolean;
}

export default function ComparativoAgua({ modoNoche }: Props) {
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
  } = useComparativoAgua(modoNoche);

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

        <ComparativoAguaContenedores
          card={card}
          datosEnergia={datosEnergia}
        />

        <ComparativoAguaFiltros
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
          <ComparativoAguaTabla {...tablaProps} inicio={0} fin={4} />
        </div>

        <div className={`rounded-xl overflow-auto ${card}`}>
          <ComparativoAguaTabla {...tablaProps} inicio={4} fin={8} />
        </div>

        <div className={`rounded-xl overflow-auto ${card}`}>
          <ComparativoAguaTabla {...tablaProps} inicio={8} fin={12} />
        </div>
      </div>
    </div>
  );
}
