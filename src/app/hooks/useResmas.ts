"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FUTURE_YEARS, MESES, START_YEAR } from "../components/resmas/constants";
import { getThemeClasses } from "../components/resmas/utils";

export type Area = {
  id: number;
  nombre: string;
};

export type ResmaRegistro = {
  id?: number;
  area_id: number;
  anio: number;
  mes: number;
  cantidad: number;
};

export type ValorFila = {
  mes: number;
  cantidad: string;
  registroId?: number;
};

export type FilaTabla = {
  id: number;
  nombre: string;
  valores: ValorFila[];
};

export type NuevaFila = {
  nombre: string;
  ubicacion: string;
  cuenta: string;
};

const filaVacia = (): NuevaFila => ({
  nombre: "",
  ubicacion: "",
  cuenta: "",
});

export function useResmas(modoNoche: boolean) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [resmas, setResmas] = useState<ResmaRegistro[]>([]);
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [nuevaArea, setNuevaArea] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(new Date().getFullYear());
  const [cargando, setCargando] = useState(false);
  const [guardandoCelda, setGuardandoCelda] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [editandoAreaId, setEditandoAreaId] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<number | null>(null);
  const inputEditarRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - START_YEAR + 1 + FUTURE_YEARS },
    (_, i) => START_YEAR + i
  );

  const { fondo, card } = getThemeClasses(modoNoche);

  const toast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      background: "#ffffff",
      color: "#111",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-sm font-semibold",
      },
    });
  };

  const generarAnios = useCallback((): number[] => {
    const anios: number[] = [];
    for (let i = 2025; i <= 2031; i++) {
      anios.push(i);
    }
    return anios;
  }, []);

  const obtenerAniosDesdeRegistros = useCallback((registros: ResmaRegistro[]): number[] => {
    const anios = [
      ...new Set(
        registros
          .map((item) => Number(item?.anio))
          .filter((anio) => Number.isFinite(anio) && anio > 0)
      ),
    ].sort((a, b) => b - a);
    return anios;
  }, []);

  const refreshData = useCallback(
    async (anioActual = anioSeleccionado) => {
      setCargando(true);
      setErrorGeneral("");

      try {
        const [areasRes, resmasRes] = await Promise.all([
          fetch("/api/areas-resmas", { cache: "no-store" }),
          fetch(`/api/resmas?anio=${anioActual}`, { cache: "no-store" }),
        ]);

        if (!areasRes.ok) {
          throw new Error("No se pudieron consultar las áreas");
        }

        if (!resmasRes.ok) {
          throw new Error("No se pudieron consultar los datos de resmas");
        }

        const areasData = await areasRes.json();
        const resmasData = await resmasRes.json();

        const areasLimpias: Area[] = Array.isArray(areasData) ? areasData : [];
        const resmasLimpias: ResmaRegistro[] = Array.isArray(resmasData) ? resmasData : [];

        setAreas((prev) => {
          return areasLimpias.length ? areasLimpias : prev;
        });
        setResmas(resmasLimpias);

        const aniosBase = generarAnios();
        const aniosDB = obtenerAniosDesdeRegistros(resmasLimpias);

        const aniosFinales = [...new Set([...aniosBase, ...aniosDB, anioActual])].sort(
          (a, b) => b - a
        );

        setAniosDisponibles(aniosFinales);
      } catch (error) {
        console.error(error);
        setErrorGeneral("No fue posible cargar la información. Revisa las rutas del backend.");
        setAreas([]);
        setResmas([]);
        setAniosDisponibles(generarAnios());
      } finally {
        setCargando(false);
      }
    },
    [anioSeleccionado, generarAnios, obtenerAniosDesdeRegistros]
  );

  useEffect(() => {
    refreshData(anioSeleccionado);
  }, [anioSeleccionado, refreshData]);

  useEffect(() => {
    if (editandoAreaId && inputEditarRef.current) {
      inputEditarRef.current.focus();
      inputEditarRef.current.select();
    }
  }, [editandoAreaId]);

  const filas: FilaTabla[] = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return areas
      .filter((area) => String(area?.nombre || "").toLowerCase().includes(texto))
      .map((area) => {
        const valores = MESES.map((_, indice) => {
          const mes = indice + 1;
          const registro = resmas.find(
            (item) => Number(item?.area_id) === Number(area.id) && Number(item?.mes) === mes
          );

          return {
            mes,
            cantidad:
              registro && Number.isFinite(Number(registro.cantidad))
                ? String(registro.cantidad)
                : "",
            registroId: registro?.id,
          };
        });

        return {
          id: area.id,
          nombre: area.nombre,
          valores,
        };
      });
  }, [areas, resmas, busqueda]);

  const resumen = useMemo(() => {
    const totalAreas = filas.length;
    const totalRegistros = filas.reduce(
      (acc, fila) => acc + fila.valores.filter((valor) => valor.cantidad !== "").length,
      0
    );
    const totalCantidad = filas.reduce(
      (acc, fila) => acc + fila.valores.reduce((suma, v) => suma + Number(v.cantidad || 0), 0),
      0
    );

    return { totalAreas, totalRegistros, totalCantidad };
  }, [filas]);

  const crearArea = async () => {
    const nombre = nuevaArea.trim();
    if (!nombre) {
      toast("warning", "Escribe un nombre");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/areas-resmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) throw new Error("Error creando área");

      setNuevaArea("");
      await refreshData(anioSeleccionado);
      toast("success", "Área creada");
    } catch (error) {
      console.error(error);
      toast("error", "No se pudo crear");
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicionArea = (area: Area) => {
    setEditandoAreaId(area.id);
    setNombreEditado(area.nombre);
    setConfirmarEliminarId(null);
  };

  const cancelarEdicionArea = () => {
    setEditandoAreaId(null);
    setNombreEditado("");
  };

  const guardarEdicionArea = async () => {
    const nombre = nombreEditado.trim();
    if (!editandoAreaId || !nombre) return;

    setCargando(true);

    try {
      const res = await fetch("/api/areas-resmas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editandoAreaId,
          nombre,
        }),
      });

      if (!res.ok) throw new Error("Error actualizando área");

      setEditandoAreaId(null);
      setNombreEditado("");
      await refreshData(anioSeleccionado);
      toast("success", "Área actualizada");
    } catch (error) {
      console.error(error);
      toast("error", "Error al editar");
    } finally {
      setCargando(false);
    }
  };

  const eliminarArea = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar área?",
      text: "Se borrarán todos los datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    setCargando(true);

    try {
      const res = await fetch(`/api/areas-resmas?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando área");

      await refreshData(anioSeleccionado);
      toast("success", "Área eliminada");
    } catch (error) {
      console.error(error);
      toast("error", "Error al eliminar");
    } finally {
      setCargando(false);
    }
  };

  const eliminarDato = async (areaId: number, mes: number) => {
    try {
      const registro = resmas.find(
        (r) =>
          Number(r.area_id) === Number(areaId) &&
          Number(r.mes) === Number(mes)
      );

      if (!registro?.id) return;

      const res = await fetch(`/api/resmas?id=${registro.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando");

      setResmas((prev) =>
        prev.filter((r) => r.id !== registro.id)
      );

      toast("success", "Eliminado");
    } catch (error) {
      console.error(error);
      toast("error", "No se pudo eliminar");
    }
  };

  const guardarDato = async ({
    areaId,
    mes,
    cantidad,
  }: {
    areaId: number;
    mes: number;
    cantidad: number;
  }) => {
    const clave = `${areaId}-${mes}`;
    setGuardandoCelda(clave);

    try {
      const res = await fetch("/api/resmas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          area_id: areaId,
          anio: anioSeleccionado,
          mes,
          cantidad,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      setResmas((prev) => {
        const existe = prev.find(
          (r) =>
            Number(r.area_id) === Number(areaId) &&
            Number(r.mes) === Number(mes)
        );

        if (existe) {
          return prev.map((r) =>
            Number(r.area_id) === Number(areaId) &&
            Number(r.mes) === Number(mes)
              ? { ...r, cantidad }
              : r
          );
        }

        return [
          ...prev,
          {
            area_id: areaId,
            anio: anioSeleccionado,
            mes,
            cantidad,
          },
        ];
      });

      toast("success", "Guardado");
    } catch (error) {
      console.error(error);
      toast("error", "Error al guardar");
    } finally {
      setGuardandoCelda(null);
    }
  };

  const manejarFlechas = (
    e: React.KeyboardEvent<HTMLInputElement>,
    filaIndex: number,
    colIndex: number
  ) => {
    const key = e.key;

    const siguiente = (f: number, c: number) => {
      const id = `celda-${f}-${c}`;
      const el = document.getElementById(id);
      if (el) el.focus();
    };

    if (key === "ArrowRight") {
      e.preventDefault();
      siguiente(filaIndex, colIndex + 1);
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      siguiente(filaIndex, colIndex - 1);
    }

    if (key === "ArrowDown") {
      e.preventDefault();
      siguiente(filaIndex + 1, colIndex);
    }

    if (key === "ArrowUp") {
      e.preventDefault();
      siguiente(filaIndex - 1, colIndex);
    }
  };

  const manejarEnterCantidad = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    areaId: number,
    mes: number
  ) => {
    if (e.key !== "Enter") return;

    const valor = e.currentTarget.value.replace(/[^0-9]/g, "");
    const cantidad = Number(valor || 0);

    if (!valor || cantidad === 0) {
      await eliminarDato(areaId, mes);
      return;
    }

    await guardarDato({
      areaId,
      mes,
      cantidad,
    });
  };

  const manejarCambioVisualCantidad = (areaId: number, mes: number, valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "");

    setResmas((prev) => {
      const existente = prev.find(
        (item) => Number(item.area_id) === Number(areaId) && Number(item.mes) === Number(mes)
      );

      if (existente) {
        return prev.map((item) =>
          Number(item.area_id) === Number(areaId) && Number(item.mes) === Number(mes)
            ? { ...item, cantidad: Number(limpio || 0) }
            : item
        );
      }

      return [
        ...prev,
        {
          area_id: areaId,
          anio: anioSeleccionado,
          mes,
          cantidad: Number(limpio || 0),
        },
      ];
    });
  };

  const manejarBlurCantidad = async (areaId: number, mes: number, valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "");
    const cantidad = Number(limpio || 0);

    if (!limpio || cantidad === 0) {
      await eliminarDato(areaId, mes);
      return;
    }

    await guardarDato({
      areaId,
      mes,
      cantidad,
    });
  };

  const comparar = (valor: number, referencia: number) => {
    if (valor === referencia) return "=";
    if (valor < referencia) return "↑";
    return "↓";
  };

  const totalesPorMes = useMemo(() => {
    return MESES.map((_, index) => {
      const mes = index + 1;

      return filas.reduce((total, fila) => {
        const valor = fila.valores.find(v => v.mes === mes);
        return total + Number(valor?.cantidad || 0);
      }, 0);
    });
  }, [filas]);

  const mesActual = new Date().getMonth();
  const totalMesActual = useMemo(() => {
    return totalesPorMes[mesActual] || 0;
  }, [totalesPorMes]);
  const nombreMesActual = MESES[mesActual];

  return {
    meses: MESES,
    areas,
    resmas,
    aniosDisponibles,
    busqueda,
    setBusqueda,
    nuevaArea,
    setNuevaArea,
    anioSeleccionado,
    setAnioSeleccionado,
    cargando,
    guardandoCelda,
    errorGeneral,
    editandoAreaId,
    nombreEditado,
    setNombreEditado,
    confirmarEliminarId,
    setConfirmarEliminarId,
    inputEditarRef,
    years,
    filas,
    resumen,
    totalesPorMes,
    totalMesActual,
    nombreMesActual,
    fondo,
    card,
    crearArea,
    iniciarEdicionArea,
    cancelarEdicionArea,
    guardarEdicionArea,
    eliminarArea,
    eliminarDato,
    guardarDato,
    manejarFlechas,
    manejarEnterCantidad,
    manejarCambioVisualCantidad,
    manejarBlurCantidad,
    comparar,
    refreshData,
  };
}

export type UseResmasReturn = ReturnType<typeof useResmas>;
