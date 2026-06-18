"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { obtenerFestivosColombia } from "../utils/festivosColombia";
import { exportarConsumoAguaExcel } from "../utils/exportarConsumoAguaExcel";
import { recalcularConsumosAgua } from "../utils/recalcularConsumos";
import {
  LecturasPorAnio,
  LecturaDia,
  AguaDBItem,
  formatearFechaLocal,
  obtenerDiasDelMes,
  obtenerPromedioMes,
  obtenerDiaHabilAnterior,
  obtenerUltimaLecturaGlobal,
  obtenerRegistroBD,
  obtenerDiasFiltrados,
  recalcularDiasSiguientes,
  limpiarNumero,
  totalMes,
  totalDia,
} from "../components/consumoAgua/utils";
import {
  MESES,
  FACTOR_CONVERSION,
  UMBRAL_CONSUMO_ALTO,
} from "../components/consumoAgua/constants";

export function useConsumoAgua(modoNoche: boolean) {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  /* ================= ESTADOS ================= */
  const [lecturas, setLecturas] = useState<LecturasPorAnio>({});
  const [existeMeta, setExisteMeta] = useState(false);
  const [cacheMetas, setCacheMetas] = useState<Record<string, number>>({});
  const [metaMensual, setMetaMensual] = useState<number | null>(null);
  const [ultimaMetaValida, setUltimaMetaValida] = useState<number | null>(null);
  const [mesSeleccionado, setMesSeleccionado] = useState<number | "todos">(mesActual);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState(anioActual);
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroTipoDia, setFiltroTipoDia] = useState<"todos" | "domingos" | "festivos" | "habiles">("todos");
  const [aguaDB, setAguaDB] = useState<AguaDBItem[]>([]);

  /* ================= ESTILOS ================= */
  const colores = {
    fondo: modoNoche ? "bg-[#121212] text-white" : "bg-[#ffffff] text-black",
    tarjeta: "bg-white border border-gray-200 shadow-sm",
    tarjetaDark: "bg-[#1a1a1a] border border-[#333]",
    tabla: modoNoche
      ? "bg-[#1a1a1a] border-gray-600 text-white"
      : "bg-white border-gray-300 text-black",
  };

  const tarjetaClase = modoNoche
    ? "bg-[#1a1a1a] border border-[#333] text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
    : "bg-white border border-gray-200 text-black shadow-sm";

  const buscadorClase = modoNoche
    ? "bg-[#1a1a1a] border border-[#333] text-white"
    : "bg-white border border-gray-200 text-black";

  const inputClase = modoNoche
    ? "bg-[#2a2a2a] border border-[#444] text-white placeholder-gray-400"
    : "bg-gray-100 border border-gray-300 text-black";

  const tablaBase = modoNoche
    ? "bg-[#1f1f1f] border-[#3a3a3a] text-gray-100"
    : "bg-white border-gray-300 text-gray-800";

  const celdaBase = modoNoche
    ? "bg-[#2a2a2a] border-[#3a3a3a]"
    : "bg-gray-50 border-gray-300";
  const celdaVacia = modoNoche ? "bg-[#252525]" : "bg-gray-100";

  const totalDias =
    typeof mesSeleccionado === "number"
      ? new Date(anioSeleccionado, mesSeleccionado + 1, 0).getDate()
      : 31;

  const fechaColombia = new Date().toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const coloresDias = {
    D: modoNoche
      ? "bg-[#1a1a1a] text-violet-300"
      : "bg-violet-100 text-violet-800",
    F: modoNoche
      ? "bg-[#1f1f1f] text-rose-300"
      : "bg-rose-100 text-rose-800",
    H: modoNoche
      ? "bg-[#121212] text-gray-300"
      : "bg-gray-100 text-gray-800",
  };

  const obtenerColorConsumoAgua = (valor: number) => {
    if (valor > UMBRAL_CONSUMO_ALTO) {
      return modoNoche ? "bg-red-950 text-red-300" : "bg-red-300 text-red-900";
    }

    if (valor > 0) {
      return modoNoche
        ? "bg-emerald-900 text-emerald-200"
        : "bg-emerald-200 text-emerald-900";
    }

    return "";
  };

  const mesesARenderizar = mesSeleccionado === "todos" ? MESES.map((_, i) => i) : [mesSeleccionado];

  const festivos = obtenerFestivosColombia(anioSeleccionado);

  /* ================= LÓGICA ================= */

  const navegarConFlechas = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      return;
    }

    e.preventDefault();

    const input = e.currentTarget;

    const dia = Number(input.dataset.dia);
    const mes = Number(input.dataset.mes);
    const campo = input.dataset.campo as "bodega2" | "bodega4";

    let nuevoDia = dia;
    let nuevoCampo = campo;

    if (key === "ArrowUp") nuevoDia = dia - 1;
    if (key === "ArrowDown") nuevoDia = dia + 1;

    if (key === "ArrowLeft") {
      if (campo === "bodega4") nuevoCampo = "bodega2";
    }

    if (key === "ArrowRight") {
      if (campo === "bodega2") nuevoCampo = "bodega4";
    }

    // 🔒 Buscar el siguiente input válido
    const selector = `input[data-mes="${mes}"][data-dia="${nuevoDia}"][data-campo="${nuevoCampo}"]`;
    const siguiente = document.querySelector<HTMLInputElement>(selector);

    if (siguiente && !siguiente.disabled) {
      siguiente.focus();
      siguiente.select();
    }
  };

  const handleChange = (
    mes: number,
    dia: number,
    campo: "bodega2" | "bodega4",
    valor: string
  ) => {
    // ⛔ Bloquear domingos y festivos
    const diasMes = obtenerDiasDelMes(mes, anioSeleccionado, festivos);
    const diaInfo = diasMes.find((d) => d.dia === dia);

    if (diaInfo?.tipo === "D" || diaInfo?.tipo === "F") {
      return;
    }

    // 🔧 FIX: Permitir valores vacíos y números válidos
    let limpio = valor;
    if (valor !== "") {
      limpio = limpiarNumero(valor);
    }

    let datoActualizado: LecturaDia | null = null;

    setLecturas((prev) => {
      const anioData = prev[anioSeleccionado] || {};
      const mesData: Record<number, LecturaDia> = {
        ...(anioData[mes] || {}),
      };

      const actual: LecturaDia = mesData[dia] || {
        bodega2: "",
        bodega4: "",
        total2: 0,
        total4: 0,
      };

      // 🔎 Buscar lectura anterior válida
      let anterior = obtenerDiaHabilAnterior(mes, dia, mesData, anioSeleccionado, festivos);

      if (!anterior) {
        anterior = obtenerUltimaLecturaGlobal(anioSeleccionado, mes, prev);
      }

      // 🧮 Calcular el día actual (evita negativos)
      const nuevoDia: LecturaDia = {
        ...actual,
        [campo]: limpio,
        total2:
          campo === "bodega2" && anterior?.bodega2
            ? Math.max(
                0,
                (Number(limpio) - Number(anterior.bodega2)) / FACTOR_CONVERSION
              )
            : actual.total2,
        total4:
          campo === "bodega4" && anterior?.bodega4
            ? Math.max(
                0,
                (Number(limpio) - Number(anterior.bodega4)) / FACTOR_CONVERSION
              )
            : actual.total4,
      };

      // 📝 Guardar el día actual
      mesData[dia] = nuevoDia;

      // 🔁 Recalcular días siguientes
      recalcularDiasSiguientes(mes, dia, mesData, anioSeleccionado, festivos);

      // 👉 guardar referencia para autosave
      datoActualizado = nuevoDia;

      return {
        ...prev,
        [anioSeleccionado]: {
          ...anioData,
          [mes]: mesData,
        },
      };
    });

    // 💾 AUTOSAVE (FUERA del setState)
    if (datoActualizado) {
      guardarAutomatico(mes, dia, datoActualizado);
    }
  };

  const guardarAutomatico = (mes: number, dia: number, data: LecturaDia) => {
    const b2Str = data.bodega2 || "";
    const b4Str = data.bodega4 || "";

    if (b2Str === "" && b4Str === "") {
      return;
    }

    const existente = obtenerRegistroBD(mes, dia, anioSeleccionado, aguaDB);
    const fecha = formatearFechaLocal(new Date(anioSeleccionado, mes, dia));

    const payload = {
      fecha,
      bodega1: b2Str !== "" ? Number(b2Str) : existente?.bodega1 ?? 0,
      bodega2: b4Str !== "" ? Number(b4Str) : existente?.bodega2 ?? 0,
      total_bodega1: b2Str !== "" ? data.total2 || 0 : existente?.total_bodega1 ?? 0,
      total_bodega2: b4Str !== "" ? data.total4 || 0 : existente?.total_bodega2 ?? 0,
    };

    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/agua", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          toast.fire({ icon: "error", title: "Error al guardar consumo" });
          return;
        }

        const result = await res.json();

        if (result?.deleted) {
          toast.fire({ icon: "info", title: "Registro eliminado" });
          return;
        }

        await recalcularConsumosAgua(fecha);
        await recargarAguaDB();
      } catch {
        toast.fire({ icon: "error", title: "Error al guardar consumo" });
      }
    }, 600);

    setAutoSaveTimeout(timeout);
  };

  async function guardarAguaEnBD(mes: number, dia: number, data: LecturaDia) {
    if (!data) return;
    if (!data.bodega2 && !data.bodega4) return;

    const fechaConsumo = new Date(anioSeleccionado, mes, dia)
      .toISOString()
      .split("T")[0];

    const payload = {
      fecha: fechaConsumo,
      bodega1: Number(data.bodega2),
      bodega2: Number(data.bodega4),
      total_bodega1: data.total2,
      total_bodega2: data.total4,
    };

    try {
      await fetch("/api/agua", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await recalcularConsumosAgua(fechaConsumo);
      await recargarAguaDB();

      toast.fire({
        icon: "success",
        title: "Consumo guardado",
      });
    } catch {
      toast.fire({
        icon: "error",
        title: "Error al guardar consumo",
      });
    }
  }

  async function eliminarAgua(mes: number, dia: number, bodega: 1 | 2) {
    const fecha = new Date(anioSeleccionado, mes, dia)
      .toISOString()
      .split("T")[0];

    try {
      const res = await fetch(`/api/agua?fecha=${fecha}&bodega=${bodega}`, {
        method: "DELETE",
      });

      const data = await res.json();

      // 🔄 Actualizar estado local
      setLecturas((prev) => {
        const copia = structuredClone(prev);

        const diaData = copia?.[anioSeleccionado]?.[mes]?.[dia];

        if (!diaData) return copia;

        if (bodega === 1) {
          diaData.bodega2 = "";
          diaData.total2 = 0;
        }

        if (bodega === 2) {
          diaData.bodega4 = "";
          diaData.total4 = 0;
        }

        // ❌ Si ambas quedaron en cero → borrar día completo
        if (!diaData.bodega2 && !diaData.bodega4) {
          delete copia[anioSeleccionado][mes][dia];
        }

        return copia;
      });

      toast.fire({
        icon: data?.deleted === "all" ? "success" : "success",
        title:
          data?.deleted === "all"
            ? "Registro eliminado completamente"
            : "Bodega eliminada",
      });
    } catch {
      toast.fire({
        icon: "error",
        title: "Error eliminando consumo de agua",
      });
    }
  }

  async function guardarMetaMensual() {
    if (mesSeleccionado === "todos") return;

    const res = await fetch("/api/metas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: "agua",
        anio: anioSeleccionado,
        mes: mesSeleccionado + 1,
        meta: metaMensual,
      }),
    });

    const data = await res.json();

    // ✅ NUNCA undefined
    setMetaMensual(typeof data?.meta === "number" ? data.meta : 0);

    toast.fire({
      icon: "success",
      title: "Meta actualizada",
    });
  }

  async function eliminarMetaMensualAgua() {
    if (mesSeleccionado === "todos") return;

    try {
      await fetch(
        `/api/metas?tipo=agua&anio=${anioSeleccionado}&mes=${mesSeleccionado + 1}`,
        { method: "DELETE" }
      );

      setMetaMensual(null);
      setUltimaMetaValida(null);
      setExisteMeta(false);

      toast.fire({
        icon: "success",
        title: "Meta de agua eliminada",
      });
    } catch {
      toast.fire({
        icon: "error",
        title: "Error al eliminar la meta de agua",
      });
    }
  }

  const confirmarYGuardarMeta = async () => {
    if (metaMensual === null || metaMensual <= 0) {
      toast.fire({
        icon: "warning",
        title: "Ingresa una meta válida",
      });
      return;
    }

    const confirmado = await Swal.fire({
      title: existeMeta ? "¿Editar meta mensual?" : "¿Crear meta mensual?",
      text: existeMeta
        ? "Esta acción actualizará la meta existente"
        : "Se creará una nueva meta para este mes",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: existeMeta ? "Actualizar" : "Crear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
    });

    if (!confirmado.isConfirmed) return;

    await guardarMetaMensual();

    toast.fire({
      icon: "success",
      title: existeMeta ? "Meta actualizada" : "Meta creada",
    });

    setExisteMeta(true); // 🔒 desde ahora existe
  };

  const recargarAguaDB = async () => {
    const res = await fetch("/api/agua", { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data)) setAguaDB(data);
  };

  const handleExportarExcel = () => {
    exportarConsumoAguaExcel({
      lecturas,
      anio: anioSeleccionado,
      metaMensual: metaMensual ?? ultimaMetaValida ?? 0, // ✅ BLINDAJE
      fechaExportacion: fechaColombia.replace(/\//g, "-"),
    });
  };

  const resumenDias = (() => {
    if (mesSeleccionado === "todos") {
      return { D: 0, F: 0, H: 0 };
    }

    const diasMes = obtenerDiasDelMes(mesSeleccionado, anioSeleccionado, festivos);

    return diasMes.reduce(
      (acc, d) => {
        acc[d.tipo]++;
        return acc;
      },
      { D: 0, F: 0, H: 0 } as Record<"D" | "F" | "H", number>
    );
  })();

  const resumenConsumo = (() => {
    if (mesSeleccionado === "todos") {
      return { estable: 0, critico: 0 };
    }

    const lecturasMes = lecturas?.[anioSeleccionado]?.[mesSeleccionado] ?? {};

    let estable = 0;
    let critico = 0;

    Object.values(lecturasMes).forEach((d) => {
      const total = d.total2 + d.total4;

      if (total > UMBRAL_CONSUMO_ALTO) {
        critico++;
      } else if (total > 0) {
        estable++;
      }
    });

    return { estable, critico };
  })();

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (mesSeleccionado === "todos") return;

    setMetaMensual(null);
    setExisteMeta(false);

    fetch(
      `/api/metas?tipo=agua&anio=${anioSeleccionado}&mes=${mesSeleccionado + 1}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.meta === "number") {
          setMetaMensual(data.meta);
          setUltimaMetaValida(data.meta);
          setExisteMeta(true); // ✅ EXISTE → EDITAR
        } else {
          setMetaMensual(null);
          setExisteMeta(false); // ❌ NO EXISTE → CREAR
        }
      });
  }, [anioSeleccionado, mesSeleccionado]);

  useEffect(() => {
    fetch("/api/agua", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setAguaDB(data);
      })
      .catch(() => {
        toast.fire({
          icon: "error",
          title: "Error cargando consumo de agua",
        });
      });
  }, []);

  useEffect(() => {
    if (!aguaDB.length) return;

    const nuevasLecturas: any = {};

    // 🔧 MANEJAR MÚLTIPLES REGISTROS POR FECHA (Toma el más reciente en lugar de sumar)
    aguaDB.forEach((item) => {
      const fecha = new Date(item.fecha + "T00:00:00"); // Asegurar zona horaria local

      const anio = fecha.getFullYear();
      const mes = fecha.getMonth();
      const dia = fecha.getDate();

      if (!nuevasLecturas[anio]) nuevasLecturas[anio] = {};
      if (!nuevasLecturas[anio][mes]) nuevasLecturas[anio][mes] = {};

      // Siempre sobreescribimos con el registro más nuevo de la lista (que viene ordenada por fecha ASC, pero el último del mismo día es el más reciente)
      nuevasLecturas[anio][mes][dia] = {
        bodega2: String(item.bodega1 || ""),
        bodega4: String(item.bodega2 || ""),
        total2: item.total_bodega1 || 0,
        total4: item.total_bodega2 || 0,
      };
    });

    setLecturas(nuevasLecturas);
  }, [aguaDB]);

  useEffect(() => {
    if (!aguaDB.length) return;

    const anioActual = new Date().getFullYear();
    const anioFuturo = anioActual + 9;

    // 🔹 Años existentes en BD
    const aniosBD = aguaDB.map((item) =>
      new Date(item.fecha + "T00:00:00").getFullYear()
    );

    // 🔹 Año inicial dinámico
    const anioInicio = Math.min(...aniosBD, anioActual);

    // 🔹 Rango automático
    const aniosAutomaticos = Array.from(
      { length: anioFuturo - anioInicio + 1 },
      (_, i) => anioInicio + i
    );

    const aniosFinales = Array.from(
      new Set([...aniosBD, ...aniosAutomaticos])
    ).sort((a, b) => b - a);

    setAniosDisponibles(aniosFinales);

    // 🔒 Blindaje
    if (!aniosFinales.includes(anioSeleccionado)) {
      setAnioSeleccionado(aniosFinales[0]);
    }
  }, [aguaDB]);

  return {
    // State
    lecturas,
    setLecturas,
    existeMeta,
    setExisteMeta,
    cacheMetas,
    setCacheMetas,
    metaMensual,
    setMetaMensual,
    ultimaMetaValida,
    setUltimaMetaValida,
    mesSeleccionado,
    setMesSeleccionado,
    autoSaveTimeout,
    setAutoSaveTimeout,
    aniosDisponibles,
    setAniosDisponibles,
    anioSeleccionado,
    setAnioSeleccionado,
    filtroDia,
    setFiltroDia,
    filtroTipoDia,
    setFiltroTipoDia,
    aguaDB,
    setAguaDB,
    
    // Styles
    colores,
    tarjetaClase,
    buscadorClase,
    inputClase,
    tablaBase,
    celdaBase,
    celdaVacia,
    totalDias,
    fechaColombia,
    coloresDias,
    obtenerColorConsumoAgua,
    mesesARenderizar,
    festivos,
    
    // Functions
    navegarConFlechas,
    handleChange,
    guardarAutomatico,
    guardarAguaEnBD,
    eliminarAgua,
    guardarMetaMensual,
    eliminarMetaMensualAgua,
    confirmarYGuardarMeta,
    recargarAguaDB,
    handleExportarExcel,
    
    // Computed
    resumenDias,
    resumenConsumo,
    obtenerPromedioMes: (mes: number) => obtenerPromedioMes(mes, anioSeleccionado, lecturas),
    obtenerDiasDelMes: (mes: number) => obtenerDiasDelMes(mes, anioSeleccionado, festivos),
    obtenerDiasFiltrados: (mes: number) => obtenerDiasFiltrados(mes, anioSeleccionado, festivos, filtroDia, filtroTipoDia),
    totalMes: (mes: number) => totalMes(mes, anioSeleccionado, lecturas, festivos),
    totalDia: (mes: number, dia: number) => totalDia(mes, dia, anioSeleccionado, lecturas),
    
    // Constants
    MESES,
    meses: MESES,
    FACTOR_CONVERSION,
    UMBRAL_CONSUMO_ALTO,
    hoy,
    mesActual,
    anioActual,
  };
}

export type UseConsumoAguaReturn = ReturnType<typeof useConsumoAgua>;
