"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { getThemeClasses, formatFechaLocal, validarNumero } from "../components/lecturas/utils";
import { COLOR_ROJO, COLOR_VERDE } from "../components/lecturas/constants";

export function useLecturas(modoNoche: boolean) {
  const [lectura, setLectura] = useState("");
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState("");

  const colores = getThemeClasses(modoNoche);

  const handleLecturaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validarNumero(e.target.value);
    setLectura(value);
  };

  const guardarLectura = async () => {
    if (!bodegaSeleccionada || !lectura) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Selecciona la bodega e ingresa la lectura.",
        confirmButtonColor: COLOR_ROJO,
      });
      return;
    }

    const tipo = bodegaSeleccionada.includes("agua") ? "agua" : "energia";
    const fechaLocal = formatFechaLocal();

    try {
      Swal.fire({
        title: "Guardando lectura...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const resp = await fetch("/api/lecturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodega: bodegaSeleccionada,
          lectura: Number(lectura),
          tipo,
          fecha: fechaLocal,
        }),
      });

      if (!resp.ok) throw new Error();

      Swal.fire({
        icon: "success",
        title: "Lectura guardada",
        confirmButtonColor: COLOR_VERDE,
      });

      setLectura("");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        confirmButtonColor: COLOR_ROJO,
      });
    }
  };

  const esAgua = bodegaSeleccionada.includes("agua");

  return {
    lectura,
    setLectura,
    bodegaSeleccionada,
    setBodegaSeleccionada,
    colores,
    handleLecturaInput,
    guardarLectura,
    esAgua,
  };
}

export type UseLecturasReturn = ReturnType<typeof useLecturas>;
