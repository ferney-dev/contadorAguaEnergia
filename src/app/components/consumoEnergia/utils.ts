import { UMBRAL_CONSUMO_ALTO } from "./constants";

export interface LecturaDia {
  bodega2: string;
  bodega4: string;
  total2: number;
  total4: number;
}

export interface EnergiaDBItem {
  id: number;
  fecha: string;
  bodega1: number;
  bodega2: number;
  total_bodega1: number;
  total_bodega2: number;
  sumatoria: number;
  created_at: string;
  updated_at: string;
}

export type LecturasPorAnio = Record<
  number,
  Record<number, Record<number, LecturaDia>>
>;

export type TipoDia = "D" | "F" | "H";

export const getThemeClasses = (modoNoche: boolean) => ({
  fondo: modoNoche ? "bg-[#121212] text-white" : "bg-[#ffffff] text-black",
  tarjeta: "bg-white border border-gray-200 shadow-sm",
  tarjetaDark: "bg-[#1a1a1a] border border-[#333]",
  tabla: modoNoche
    ? "bg-[#1a1a1a] border-gray-600 text-white"
    : "bg-white border-gray-300 text-black",
});

export const getTarjetaClase = (modoNoche: boolean) =>
  modoNoche
    ? "bg-[#1a1a1a] border border-[#333] text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
    : "bg-white border border-gray-200 text-black shadow-sm";

export const getBuscadorClase = (modoNoche: boolean) =>
  modoNoche
    ? "bg-[#1a1a1a] border border-[#333] text-white"
    : "bg-white border border-gray-200 text-black";

export const getInputClase = (modoNoche: boolean) =>
  modoNoche
    ? "bg-[#2a2a2a] border border-[#444] text-white placeholder-gray-400"
    : "bg-gray-100 border border-gray-300 text-black";

export const getTablaBase = (modoNoche: boolean) =>
  modoNoche
    ? "bg-[#1f1f1f] border-[#3a3a3a] text-gray-100"
    : "bg-white border-gray-300 text-gray-800";

export const getCeldaBase = (modoNoche: boolean) =>
  modoNoche ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-gray-50 border-gray-300";

export const getCeldaVacia = (modoNoche: boolean) =>
  modoNoche ? "bg-[#252525]" : "bg-gray-100";

export const getColoresDias = (modoNoche: boolean) => ({
  D: modoNoche
    ? "bg-[#1a1a1a] text-violet-300"
    : "bg-violet-100 text-violet-800",
  F: modoNoche
    ? "bg-[#1f1f1f] text-rose-300"
    : "bg-rose-100 text-rose-800",
  H: modoNoche
    ? "bg-[#121212] text-gray-300"
    : "bg-gray-100 text-gray-800",
});

export const obtenerColorConsumoDia = (valor: number, modoNoche: boolean) => {
  if (valor > UMBRAL_CONSUMO_ALTO) {
    return modoNoche
      ? "bg-red-950 text-red-300"
      : "bg-red-300 text-red-900";
  }

  if (valor > 0) {
    return modoNoche
      ? "bg-emerald-900 text-emerald-200"
      : "bg-emerald-200 text-emerald-900";
  }

  return "";
};

export const formatearFechaLocal = (fecha: Date) => {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const obtenerDiasDelMes = (
  mes: number,
  anioSeleccionado: number,
  festivos: string[]
) => {
  const totalDiasMes = new Date(anioSeleccionado, mes + 1, 0).getDate();
  return Array.from({ length: totalDiasMes }, (_, i) => {
    const dia = i + 1;
    const fecha = new Date(anioSeleccionado, mes, dia);
    const tipo: TipoDia =
      fecha.getDay() === 0
        ? "D"
        : festivos.includes(formatearFechaLocal(fecha))
          ? "F"
          : "H";

    return { dia, tipo };
  });
};

export const obtenerDiaHabilAnterior = (
  mes: number,
  diaActual: number,
  lecturasMes: Record<number, LecturaDia>,
  anioSeleccionado: number,
  festivos: string[]
) => {
  const diasMes = obtenerDiasDelMes(mes, anioSeleccionado, festivos);
  for (let d = diaActual - 1; d >= 1; d--) {
    const info = diasMes.find((x) => x.dia === d);

    if (info?.tipo === "H" && lecturasMes[d]) {
      return lecturasMes[d];
    }
  }
  return null;
};

export const obtenerUltimaLecturaMesAnterior = (
  mes: number,
  lecturas: Record<number, Record<number, LecturaDia>>
) => {
  if (mes === 0) return null;

  const mesAnterior = mes - 1;
  const lecturasMesAnterior = lecturas[mesAnterior];
  if (!lecturasMesAnterior) return null;

  const diasOrdenados = Object.keys(lecturasMesAnterior)
    .map(Number)
    .sort((a, b) => b - a);

  for (const dia of diasOrdenados) {
    const lectura = lecturasMesAnterior[dia];

    const b2 = Number(lectura?.bodega2);
    const b4 = Number(lectura?.bodega4);

    if (!isNaN(b2) && !isNaN(b4) && (b2 > 0 || b4 > 0)) {
      return lectura;
    }
  }

  return null;
};

export const obtenerUltimaLecturaGlobal = (
  anio: number,
  mes: number,
  lecturas: LecturasPorAnio
): LecturaDia | null => {
  for (let y = anio; y >= 0; y--) {
    const meses = lecturas[y];
    if (!meses) continue;

    const mesInicio = y === anio ? mes - 1 : 11;

    for (let m = mesInicio; m >= 0; m--) {
      const lecturasMes = meses[m];
      if (!lecturasMes) continue;

      const diasOrdenados = Object.keys(lecturasMes)
        .map(Number)
        .sort((a, b) => b - a);

      for (const d of diasOrdenados) {
        const lectura = lecturasMes[d];
        const b2 = Number(lectura?.bodega2);
        const b4 = Number(lectura?.bodega4);

        if (!isNaN(b2) && !isNaN(b4) && (b2 > 0 || b4 > 0)) {
          return lectura;
        }
      }
    }
  }

  return null;
};

export const obtenerRegistroBD = (
  mes: number,
  dia: number,
  anioSeleccionado: number,
  energiaDB: EnergiaDBItem[]
) => {
  const fechaStr = formatearFechaLocal(new Date(anioSeleccionado, mes, dia));
  return energiaDB.find((item) => {
    const f = new Date(item.fecha + "T00:00:00");
    return formatearFechaLocal(f) === fechaStr;
  });
};

export const obtenerDiasFiltrados = (
  mes: number,
  anioSeleccionado: number,
  festivos: string[],
  filtroDia: string,
  filtroTipoDia: "todos" | "domingos" | "festivos" | "habiles"
) => {
  const diasMes = obtenerDiasDelMes(mes, anioSeleccionado, festivos);

  return diasMes.filter(({ dia, tipo }) => {
    if (filtroDia && Number(filtroDia) !== dia) return false;
    if (filtroTipoDia === "domingos" && tipo !== "D") return false;
    if (filtroTipoDia === "festivos" && tipo !== "F") return false;
    if (filtroTipoDia === "habiles" && tipo !== "H") return false;
    return true;
  });
};

export const recalcularDiasSiguientes = (
  mes: number,
  diaInicial: number,
  lecturasMes: Record<number, LecturaDia>,
  anioSeleccionado: number,
  festivos: string[]
) => {
  const diasMes = obtenerDiasDelMes(mes, anioSeleccionado, festivos);

  let lecturaAnterior: LecturaDia | null = lecturasMes[diaInicial];

  diasMes.forEach(({ dia, tipo }) => {
    if (dia <= diaInicial) return;
    if (tipo !== "H") return;

    const actual = lecturasMes[dia];
    if (!actual || !lecturaAnterior) return;

    actual.total2 =
      actual.bodega2 && lecturaAnterior.bodega2
        ? Math.max(0, Number(actual.bodega2) - Number(lecturaAnterior.bodega2))
        : 0;

    actual.total4 =
      actual.bodega4 && lecturaAnterior.bodega4
        ? Math.max(0, Number(actual.bodega4) - Number(lecturaAnterior.bodega4))
        : 0;

    lecturaAnterior = actual;
  });
};

export const limpiarNumero = (v: string) => v.replace(/\D/g, "").slice(0, 6);

export const calcularTotal = (actual: number, anterior: number) =>
  actual - anterior;

export const totalMes = (
  mes: number,
  anioSeleccionado: number,
  lecturas: LecturasPorAnio,
  festivos: string[]
) => {
  const lecturasMes = lecturas?.[anioSeleccionado]?.[mes] ?? {};

  return obtenerDiasDelMes(mes, anioSeleccionado, festivos)
    .reduce((acc, { dia }) => {
      const d = lecturasMes[dia];
      return d ? acc + d.total2 + d.total4 : acc;
    }, 0)
    .toFixed(2);
};

export const totalDia = (
  mes: number,
  dia: number,
  anioSeleccionado: number,
  lecturas: LecturasPorAnio
) => {
  const d = lecturas?.[anioSeleccionado]?.[mes]?.[dia];

  if (!d) return "";
  const total = d.total2 + d.total4;
  return total > 0 ? total.toFixed(2) : "";
};

export const obtenerPromedioMes = (
  mes: number,
  anioSeleccionado: number,
  lecturas: LecturasPorAnio
) => {
  const lecturasMes = lecturas?.[anioSeleccionado]?.[mes] ?? {};

  const consumos = Object.values(lecturasMes)
    .map((d) => d.total2 + d.total4)
    .filter((v) => v > 0);

  if (!consumos.length) return 0;

  return consumos.reduce((a, b) => a + b, 0) / consumos.length;
};
