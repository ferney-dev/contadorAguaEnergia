"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Swal from "sweetalert2";
import { FUTURE_YEARS, MESES, START_YEAR } from "../components/comparativoEnergia/constants";
import { getThemeClasses, parseNumero } from "../components/comparativoEnergia/utils";

export type CeldaMes = {
  kWh: number | null;
  valor: number | null;
  cumple: boolean;
  registroId?: number | null;
};

export type FilaComparativo = {
  id?: number;
  sede_energia?: number;
  nombre: string;
  ubicacion: string;
  cuenta: string;
  anio?: number;
  tipo?: string;
  datos: CeldaMes[];
};

export type NuevaFila = {
  nombre: string;
  ubicacion: string;
  cuenta: string;
  datos: { kWh: number; valor: number; cumple: boolean }[];
};

const filaVacia = (): NuevaFila => ({
  nombre: "",
  ubicacion: "",
  cuenta: "",
  datos: Array.from({ length: 12 }, () => ({
    kWh: 0,
    valor: 0,
    cumple: true,
  })),
});

export function useComparativoEnergia(modoNoche: boolean) {
  const [datosEnergia, setDatosEnergia] = useState<FilaComparativo[]>([]);
  const currentYear = new Date().getFullYear();
  const [anio, setAnio] = useState(currentYear.toString());
  const [mes, setMes] = useState("");
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [mostrarTotales, setMostrarTotales] = useState(true);
  const [consumoMin, setConsumoMin] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const years = Array.from(
    { length: currentYear - START_YEAR + 1 + FUTURE_YEARS },
    (_, i) => START_YEAR + i
  );
  const inputsRef = useRef<(HTMLInputElement | HTMLSelectElement | null)[][]>(
    []
  );
  const datosRef = useRef<FilaComparativo[]>([]);
  const guardandoRef = useRef<string | null>(null);
  const [nuevaFila, setNuevaFila] = useState<NuevaFila>(filaVacia());
  const [sedesDB, setSedesDB] = useState<any[]>([]);
  const [tipoTotal, setTipoTotal] = useState("todos");

  const { fondo, card } = getThemeClasses(modoNoche);

  const editarNuevaFila = (campo: string, valor: any) => {
    setNuevaFila((prev) => ({ ...prev, [campo]: valor }));
  };

  const editarFila = (filaIndex: number, campo: string, valor: any) => {
    const nuevosDatos = [...datosEnergia];
    nuevosDatos[filaIndex] = {
      ...nuevosDatos[filaIndex],
      [campo]: valor,
    };
    setDatosEnergia(nuevosDatos);
  };

  const editarNuevaCelda = (mesIndex: number, campo: string, valor: any) => {
    const nuevosDatos = [...nuevaFila.datos];
    if (campo === "kWh") {
      nuevosDatos[mesIndex].kWh = Number(valor);
    }
    if (campo === "valor") {
      nuevosDatos[mesIndex].valor = Number(valor);
    }
    if (campo === "cumple") {
      nuevosDatos[mesIndex].cumple = valor === "true";
    }
    setNuevaFila({
      ...nuevaFila,
      datos: nuevosDatos,
    });
  };

  const cargarSedes = async () => {
    try {
      const res = await fetch("/api/sedes_energia");
      const data = await res.json();
      setSedesDB(data);
    } catch {
      console.log("Error cargando sedes");
    }
  };

  const cargarDatos = async () => {
    try {
      const [resComparativo, resSedes] = await Promise.all([
        fetch("/api/comparativoEnergia"),
        fetch("/api/sedes_energia"),
      ]);

      let data = await resComparativo.json();
      const sedes = await resSedes.json();

      if (!Array.isArray(data)) {
        console.error("Comparativo no es array:", data);
        data = [];
      }

      setSedesDB(sedes);

      const anioActual = Number(anio);

      const resultado = sedes.map((sede: any) => {
        const datosMeses = Array.from({ length: 12 }, (_, mesIndex) => {
          const encontrado = data.find(
            (d: any) =>
              d.sede_energia === sede.id &&
              Number(d.anio) === anioActual &&
              Number(d.mes) === mesIndex + 1
          );

          return {
            kWh: encontrado?.kw_consumidos ?? null,
            valor: encontrado?.valor_consumo_energia ?? null,
            cumple: encontrado?.cumple ?? true,
            registroId: encontrado?.id ?? null,
          };
        });

        return {
          id: sede.id,
          sede_energia: sede.id,
          nombre: sede.nombre,
          ubicacion: sede.ubicacion,
          cuenta: sede.cuenta,
          anio: anioActual,
          datos: datosMeses,
        };
      });

      setDatosEnergia(resultado);
    } catch (error) {
      console.error("Error cargando datos:", error);

      Swal.fire({
        icon: "error",
        title: "Error cargando datos",
      });
    }
  };

  useEffect(() => {
    cargarDatos();
    cargarSedes();
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [anio]);

  useEffect(() => {
    datosRef.current = datosEnergia;
  }, [datosEnergia]);

  const agregarFila = () => {
    const fila = {
      nombre: "NUEVA SEDE",
      ubicacion: "",
      cuenta: "",
      datos: Array.from({ length: 12 }, () => ({
        kWh: 0,
        valor: 0,
        cumple: true,
      })),
    };

    setDatosEnergia([...datosEnergia, fila]);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Fila agregada",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  const manejarTeclas = (
    e: KeyboardEvent,
    fila: number,
    col: number
  ) => {
    const totalFilas = inputsRef.current.length;
    const totalCols = inputsRef.current[0]?.length || 0;

    let nuevaFilaIdx = fila;
    let nuevaCol = col;

    switch (e.key) {
      case "ArrowRight":
        nuevaCol = col + 1;
        break;
      case "ArrowLeft":
        nuevaCol = col - 1;
        break;
      case "ArrowDown":
        nuevaFilaIdx = fila + 1;
        break;
      case "ArrowUp":
        nuevaFilaIdx = fila - 1;
        break;
      default:
        return;
    }

    e.preventDefault();

    if (
      nuevaFilaIdx >= 0 &&
      nuevaFilaIdx < totalFilas &&
      nuevaCol >= 0 &&
      nuevaCol < totalCols
    ) {
      inputsRef.current[nuevaFilaIdx][nuevaCol]?.focus();
    }
  };

  const editarCelda = (
    filaIndex: number,
    mesIndex: number,
    campo: string,
    valor: any
  ) => {
    setDatosEnergia((prev) =>
      prev.map((fila, i) => {
        if (i !== filaIndex) return fila;

        return {
          ...fila,
          datos: fila.datos.map((celda, j) => {
            if (j !== mesIndex) return celda;

            return {
              ...celda,
              [campo]:
                campo === "cumple"
                  ? valor === true || valor === "true"
                  : valor === ""
                    ? null
                    : valor,
            };
          }),
        };
      })
    );
  };

  const guardarRegistro = async (fila: FilaComparativo, mesIndex: number) => {
    const sedeId = Number(fila.sede_energia || fila.id);
    if (!sedeId) {
      Swal.fire({ icon: "warning", title: "Sede no válida" });
      return;
    }

    const clave = `${sedeId}-${anio}-${mesIndex}`;
    if (guardandoRef.current === clave) return;
    guardandoRef.current = clave;

    try {
      const mesData = fila.datos?.[mesIndex];
      if (!mesData) return;

      const kwh = parseNumero(mesData.kWh);
      const valor = parseNumero(mesData.valor);

      if (kwh === null && valor === null) {
        if (mesData.registroId) {
          const resDel = await fetch(
            `/api/comparativoEnergia?id=${mesData.registroId}`,
            { method: "DELETE" }
          );
          if (resDel.ok) {
            setDatosEnergia((prev) =>
              prev.map((f) =>
                f.sede_energia === fila.sede_energia || f.id === fila.sede_energia
                  ? {
                      ...f,
                      datos: f.datos.map((d, i) =>
                        i === mesIndex
                          ? {
                              kWh: null,
                              valor: null,
                              cumple: true,
                              registroId: null,
                            }
                          : d
                      ),
                    }
                  : f
              )
            );
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Registro eliminado",
              showConfirmButton: false,
              timer: 1200,
            });
          }
        }
        return;
      }

      const payload = {
        sede_energia: sedeId,
        anio: Number(anio),
        mes: mesIndex + 1,
        kw_consumidos: kwh,
        valor_consumo_energia: valor,
        cumple: Boolean(mesData.cumple),
      };

      const res = await fetch("/api/comparativoEnergia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        const detalle =
          result?.detail || result?.error || "No se pudo guardar el registro";
        throw new Error(
          typeof detalle === "string" ? detalle : JSON.stringify(detalle)
        );
      }

      const registroId = result?.data?.id ?? mesData.registroId ?? null;

      setDatosEnergia((prev) =>
        prev.map((f) =>
          f.sede_energia === fila.sede_energia || f.id === fila.sede_energia
            ? {
                ...f,
                datos: f.datos.map((d, i) =>
                  i === mesIndex
                    ? {
                        ...d,
                        kWh: payload.kw_consumidos,
                        valor: payload.valor_consumo_energia,
                        cumple: payload.cumple,
                        registroId,
                      }
                    : d
                ),
              }
            : f
        )
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Actualizado con éxito",
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error guardando datos",
        text:
          error instanceof Error
            ? error.message
            : "Revise que la sede exista y los valores sean válidos",
      });
    } finally {
      guardandoRef.current = null;
    }
  };

  const confirmarCelda = (filaIndex: number, mesIndex: number) => {
    const fila = datosRef.current[filaIndex];
    if (fila) void guardarRegistro(fila, mesIndex);
  };

  const datosFiltrados = datosEnergia.filter((d) => {
    const texto = busqueda.toLowerCase();

    const matchBusqueda =
      (d.nombre || "").toLowerCase().includes(texto) ||
      (d.ubicacion || "").toLowerCase().includes(texto);

    const matchAnio = anio === "" || Number(d.anio) === Number(anio);

    const matchSede =
      sedeSeleccionada === "" || d.nombre === sedeSeleccionada;

    let matchTipo = true;

    if (tipoTotal === "principal") {
      matchTipo = d.nombre?.toUpperCase().includes("SEDE PPAL") ?? false;
    }

    if (tipoTotal === "receptorias") {
      matchTipo = d.nombre?.toUpperCase().includes("RECEPTORIA") ?? false;
    }

    return matchBusqueda && matchAnio && matchSede && matchTipo;
  });

  const crearRegistro = async () => {
    try {
      let sede = sedesDB.find((s) => s.nombre === nuevaFila.nombre);

      if (!sede) {
        const res = await fetch("/api/sedes_energia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaFila),
        });

        const data = await res.json();
        sede = data.data;
      }

      const nueva: FilaComparativo = {
        ...nuevaFila,
        sede_energia: sede.id,
        anio: Number(anio),
        datos: nuevaFila.datos,
      };

      setDatosEnergia((prev) => [...prev, nueva]);
      setNuevaFila(filaVacia());

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Sede creada",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error creando sede",
      });
    }
  };

  const calcularTotales = (tipo: string, mesIdx: number): number => {
    return datosEnergia
      .filter((d) => d.tipo === tipo)
      .reduce((acc, d) => {
        if (!d.datos[mesIdx]) return acc;
        return acc + (d.datos[mesIdx].kWh || 0);
      }, 0);
  };

  const actualizarSede = async (fila: FilaComparativo) => {
    try {
      const res = await fetch("/api/sedes_energia", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fila.sede_energia || fila.id,
          nombre: fila.nombre,
          ubicacion: fila.ubicacion,
          cuenta: fila.cuenta,
        }),
      });

      if (!res.ok) throw new Error();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Sede actualizada",
        showConfirmButton: false,
        timer: 1000,
      });

      await cargarSedes();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error actualizando sede",
      });
    }
  };

  const confirmarEliminarFila = async (fila: FilaComparativo) => {
    const result = await Swal.fire({
      title: "¿Eliminar sede?",
      text: "Se eliminará la sede y sus datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`/api/comparativoEnergia/por-sedes_energia/${fila.sede_energia}`, {
          method: "DELETE",
        });

        const res = await fetch(`/api/sedes_energia?id=${fila.sede_energia}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error();

        setDatosEnergia((prev) =>
          prev.filter((f) => f.sede_energia !== fila.sede_energia)
        );

        setSedesDB((prev) => prev.filter((s) => s.id !== fila.sede_energia));

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Borrado con éxito",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
        });
      }
    }
  };

  const inicio = mes === "" ? 0 : Number(mes);
  const fin = mes === "" ? 12 : Number(mes) + 1;

  return {
    meses: MESES,
    datosEnergia,
    datosFiltrados,
    sedesDB,
    setSedesDB,
    nuevaFila,
    years,
    anio,
    setAnio,
    mes,
    setMes,
    sedeSeleccionada,
    setSedeSeleccionada,
    tipoTotal,
    setTipoTotal,
    busqueda,
    setBusqueda,
    consumoMin,
    setConsumoMin,
    mostrarTotales,
    setMostrarTotales,
    fondo,
    card,
    inputsRef,
    inicio,
    fin,
    editarNuevaFila,
    editarFila,
    editarNuevaCelda,
    editarCelda,
    agregarFila,
    manejarTeclas,
    confirmarCelda,
    crearRegistro,
    guardarRegistro,
    actualizarSede,
    confirmarEliminarFila,
    calcularTotales,
    cargarDatos,
    cargarSedes,
  };
}

export type UseComparativoEnergiaReturn = ReturnType<typeof useComparativoEnergia>;
