"use client";

import LecturasForm from "./LecturasForm";
import { useLecturas } from "../../hooks/useLecturas";

interface Props {
  modoNoche: boolean;
}

export default function Lecturas({ modoNoche }: Props) {
  const {
    lectura,
    bodegaSeleccionada,
    colores,
    esAgua,
    handleLecturaInput,
    guardarLectura,
    setBodegaSeleccionada,
  } = useLecturas(modoNoche);

  return (
    <div
      className={`w-full h-[calc(100vh-90px)] flex items-start justify-center pt-6 px-4 ${colores.fondo}`}
    >
      {/* CONTENEDOR */}
      <div
        className={`w-full max-w-[390px] min-h-[500px] rounded-[28px] shadow-xl flex flex-col ${colores.celular}`}
      >
        {/* NOTCH */}
        <div className="h-5 flex justify-center items-center mt-2">
          <div className="w-20 h-1.5 bg-gray-400 rounded-full opacity-40"></div>
        </div>

        {/* CONTENIDO */}
        <LecturasForm
          lectura={lectura}
          bodegaSeleccionada={bodegaSeleccionada}
          colores={colores}
          esAgua={esAgua}
          handleLecturaInput={handleLecturaInput}
          guardarLectura={guardarLectura}
          setBodegaSeleccionada={setBodegaSeleccionada}
        />
      </div>
    </div>
  );
}