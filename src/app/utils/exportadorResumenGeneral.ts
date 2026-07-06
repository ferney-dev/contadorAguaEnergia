import * as XLSX from "xlsx-js-style";

/* ================================================================
   🎨  PALETA ENVIA – ROJO CORPORATIVO
================================================================ */
const ROJO      = "C40000";   // rojo Envia
const ROJO_OSC  = "8B0000";   // encabezados oscuros
const ROJO_CLAR = "FFE4E4";   // filas alternas claras
const BLANCO    = "FFFFFF";
const GRIS_CLR  = "F5F5F5";
const VERDE     = "DCFCE7";
const VERDE_F   = "16A34A";
const NARANJA   = "FEF3C7";
const NARANJA_F = "B45309";
const NEGRO     = "0F172A";
const GRIS_T    = "6B7280";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

/* ================================================================
   🔧  HELPERS DE ESTILO
================================================================ */
function borde(color = "DDDDDD") {
  const s = { style: "thin", color: { rgb: color } };
  return { top: s, bottom: s, left: s, right: s };
}

const TITLE = (bg = ROJO_OSC): XLSX.CellStyle => ({
  font: { bold: true, sz: 16, color: { rgb: BLANCO }, name: "Calibri" },
  fill: { fgColor: { rgb: bg } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borde(bg),
});

const SUBTITLE = (): XLSX.CellStyle => ({
  font: { bold: true, sz: 11, color: { rgb: BLANCO }, name: "Calibri" },
  fill: { fgColor: { rgb: ROJO } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borde(ROJO),
});

const HDR = (): XLSX.CellStyle => ({
  font: { bold: true, sz: 10, color: { rgb: BLANCO }, name: "Calibri" },
  fill: { fgColor: { rgb: ROJO } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borde(ROJO),
});

const CEL = (alt = false): XLSX.CellStyle => ({
  font: { sz: 10, color: { rgb: NEGRO }, name: "Calibri" },
  fill: { fgColor: { rgb: alt ? ROJO_CLAR : BLANCO } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borde(),
});

const CEL_IZQ = (alt = false): XLSX.CellStyle => ({
  ...CEL(alt),
  alignment: { horizontal: "left", vertical: "center", wrapText: true },
});

const TOTAL = (): XLSX.CellStyle => ({
  font: { bold: true, sz: 10, color: { rgb: BLANCO }, name: "Calibri" },
  fill: { fgColor: { rgb: ROJO_OSC } },
  alignment: { horizontal: "center", vertical: "center" },
  border: borde(ROJO_OSC),
});

const CUMPLE_SI = (): XLSX.CellStyle => ({
  font: { bold: true, sz: 10, color: { rgb: VERDE_F }, name: "Calibri" },
  fill: { fgColor: { rgb: VERDE } },
  alignment: { horizontal: "center", vertical: "center" },
  border: borde(),
});

const CUMPLE_NO = (): XLSX.CellStyle => ({
  font: { bold: true, sz: 10, color: { rgb: ROJO }, name: "Calibri" },
  fill: { fgColor: { rgb: ROJO_CLAR } },
  alignment: { horizontal: "center", vertical: "center" },
  border: borde(),
});

const KPI_LBL = (): XLSX.CellStyle => ({
  font: { bold: true, sz: 11, color: { rgb: NEGRO }, name: "Calibri" },
  fill: { fgColor: { rgb: NARANJA } },
  alignment: { horizontal: "left", vertical: "center" },
  border: borde(),
});

const KPI_VAL = (): XLSX.CellStyle => ({
  font: { sz: 11, color: { rgb: NEGRO }, name: "Calibri" },
  fill: { fgColor: { rgb: NARANJA } },
  alignment: { horizontal: "center", vertical: "center" },
  border: borde(),
});

/* ================================================================
   🔧  UTILIDADES
================================================================ */
function celda(ws: XLSX.WorkSheet, r: number, c: number, v: any, s: XLSX.CellStyle, t?: string) {
  const addr = XLSX.utils.encode_cell({ r, c });
  const tipo = t ?? (typeof v === "number" ? "n" : "s");
  ws[addr] = { t: tipo, v, s };
}

function merge(ws: XLSX.WorkSheet, rs: number, cs: number, re: number, ce: number) {
  if (!ws["!merges"]) ws["!merges"] = [];
  ws["!merges"].push({ s: { r: rs, c: cs }, e: { r: re, c: ce } });
}

function encabezadoHoja(
  ws: XLSX.WorkSheet,
  titulo: string,
  subtitulo: string,
  anio: number,
  colTotal: number,
): number {
  // Fila 0 – título grande con nombre empresa
  celda(ws, 0, 0, `ENVIA MENSAJERÍA Y TRANSPORTE  ·  ${titulo}`, TITLE(), "s");
  merge(ws, 0, 0, 0, colTotal);

  // Fila 1 – subtítulo + año
  celda(ws, 1, 0, `${subtitulo}  ·  Año ${anio}`, SUBTITLE(), "s");
  merge(ws, 1, 0, 1, colTotal);

  // Fila 2 – vacía separadora
  return 3; // próxima fila disponible
}

/* ================================================================
   INTERFAZ PÚBLICA
================================================================ */
export interface ResumenParams {
  anio: number;
  /* Agua */
  consumoAguaMensual: number[];
  metasAguaMensual: number[];
  /* Energía */
  consumoEnergiaMensual: number[];
  metasEnergiaMensual: number[];
  /* Comparativo agua  (datos raw de la API) */
  rawComparativoAgua: any[];
  rawSedesAgua: any[];
  /* Comparativo energía (datos raw de la API) */
  rawComparativoEnergia: any[];
  rawSedesEnergia: any[];
  /* Inspecciones */
  rawInspeccionesResiduos: any[];
  rawInspeccionesSanitarias: any[];
  rawInspeccionesEnergia: any[];
  rawAreasResiduos: any[];
  rawAreasSanitarias: any[];
  rawAreasEnergia: any[];
  /* Resmas */
  rawResmas: any[];
  rawAreasResmas: any[];
  /* Tonners */
  rawTonners: any[];
  rawAreasTonners: any[];
}

/* ================================================================
   📋  HOJA 1 – RESUMEN EJECUTIVO
================================================================ */
function hojaResumenEjecutivo(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio,
    consumoAguaMensual, metasAguaMensual,
    consumoEnergiaMensual, metasEnergiaMensual,
    rawTonners, rawResmas,
  } = params;

  let r = encabezadoHoja(ws, "RESUMEN EJECUTIVO SGA", "Indicadores generales del Sistema de Gestión Ambiental", anio, 4);

  // ── KPIs generales ──
  const totalAgua    = consumoAguaMensual.reduce((a, b) => a + b, 0);
  const totalEnergia = consumoEnergiaMensual.reduce((a, b) => a + b, 0);
  const metaAguaT    = metasAguaMensual.reduce((a, b) => a + b, 0);
  const metaEnergiaT = metasEnergiaMensual.reduce((a, b) => a + b, 0);

  const totalResmas  = (Array.isArray(rawResmas) ? rawResmas : [])
    .filter((x: any) => Number(x.anio) === anio)
    .reduce((s: number, x: any) => s + Number(x.cantidad || 0), 0);

  const tonnersFiltro = (Array.isArray(rawTonners) ? rawTonners : [])
    .filter((x: any) => new Date(x.fecha).getFullYear() === anio);
  const totalTonners = tonnersFiltro.reduce((s: number, x: any) => s + Number(x.cantidad || 0), 0);

  const kpis: [string, any, string][] = [
    ["Consumo total de agua (L)",       totalAgua,    "L"],
    ["Meta anual agua (L)",             metaAguaT,    "L"],
    ["% Cumplimiento agua",             metaAguaT > 0 ? totalAgua / metaAguaT : 0, "%"],
    ["Consumo total de energía (kWh)",  totalEnergia, "kWh"],
    ["Meta anual energía (kWh)",        metaEnergiaT, "kWh"],
    ["% Cumplimiento energía",          metaEnergiaT > 0 ? totalEnergia / metaEnergiaT : 0, "%"],
    ["Total resmas consumidas",         totalResmas,  "resmas"],
    ["Total tonners usados",            totalTonners, "unidades"],
  ];

  // Header de KPIs
  celda(ws, r, 0, "Indicador",    HDR(), "s");
  celda(ws, r, 1, "Valor",        HDR(), "s");
  celda(ws, r, 2, "Unidad",       HDR(), "s");
  merge(ws, r, 0, r, 0);
  r++;

  kpis.forEach(([lbl, val, unidad], i) => {
    const alt = i % 2 === 0;
    const esPorc = unidad === "%";
    const sVal: XLSX.CellStyle = {
      ...KPI_VAL(),
      ...(esPorc ? { numFmt: "0.0%" } : { numFmt: "0.00" }),
    };
    celda(ws, r, 0, lbl,   KPI_LBL(), "s");
    celda(ws, r, 1, val,   sVal,      "n");
    celda(ws, r, 2, unidad, KPI_VAL(), "s");
    r++;
  });

  r++; // separador

  // ── Tabla mensual consolidada ──
  celda(ws, r, 0, "Resumen mensual consolidado", TITLE(), "s");
  merge(ws, r, 0, r, 9);
  r++;

  const hdrs2 = ["Mes","Agua (L)","Meta Agua","Dif. Agua","% Agua","Energía (kWh)","Meta Energía","Dif. Energía","% Energía"];
  hdrs2.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  MESES.forEach((mes, i) => {
    const alt = i % 2 === 0;
    const agua  = consumoAguaMensual[i]    ?? 0;
    const mAgua = metasAguaMensual[i]      ?? 0;
    const ener  = consumoEnergiaMensual[i] ?? 0;
    const mEner = metasEnergiaMensual[i]   ?? 0;

    const difA = mAgua  - agua;
    const difE = mEner  - ener;
    const pA   = mAgua  > 0 ? agua  / mAgua  : 0;
    const pE   = mEner  > 0 ? ener  / mEner  : 0;

    const sPA: XLSX.CellStyle = { ...CEL(alt), numFmt: "0.0%", fill: { fgColor: { rgb: pA <= 1 ? VERDE : ROJO_CLAR } } };
    const sPE: XLSX.CellStyle = { ...CEL(alt), numFmt: "0.0%", fill: { fgColor: { rgb: pE <= 1 ? VERDE : ROJO_CLAR } } };

    celda(ws, r, 0, mes,  CEL_IZQ(alt), "s");
    celda(ws, r, 1, agua, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 2, mAgua,{ ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 3, difA, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 4, pA,   sPA, "n");
    celda(ws, r, 5, ener, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 6, mEner,{ ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 7, difE, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 8, pE,   sPE, "n");
    r++;
  });

  // Fila totales
  const tA = consumoAguaMensual.reduce((a, b) => a + b, 0);
  const tMA = metasAguaMensual.reduce((a, b) => a + b, 0);
  const tE = consumoEnergiaMensual.reduce((a, b) => a + b, 0);
  const tME = metasEnergiaMensual.reduce((a, b) => a + b, 0);
  const tPcA: XLSX.CellStyle = { ...TOTAL(), numFmt: "0.0%" };
  const tPcE: XLSX.CellStyle = { ...TOTAL(), numFmt: "0.0%" };

  celda(ws, r, 0, "TOTAL ANUAL",     TOTAL(), "s");
  celda(ws, r, 1, tA,  { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 2, tMA, { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 3, tMA - tA, { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 4, tMA > 0 ? tA / tMA : 0, tPcA, "n");
  celda(ws, r, 5, tE,  { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 6, tME, { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 7, tME - tE, { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 8, tME > 0 ? tE / tME : 0, tPcE, "n");

  ws["!cols"] = [
    { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
    { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 },
  ];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  const ref = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 8 } });
  ws["!ref"] = ref;
  return ws;
}

/* ================================================================
   📋  HOJA 2 – CONSUMO DE AGUA (mensual + meta)
================================================================ */
function hojaConsumoAgua(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, consumoAguaMensual, metasAguaMensual } = params;

  let r = encabezadoHoja(ws, "CONSUMO DE AGUA", "Detalle mensual – Litros consumidos", anio, 5);

  const hdrs = ["Mes", "Consumo Real (L)", "Meta Mensual (L)", "Diferencia (L)", "% Cumplimiento", "Estado"];
  hdrs.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  MESES.forEach((mes, i) => {
    const alt = i % 2 === 0;
    const real = consumoAguaMensual[i] ?? 0;
    const meta = metasAguaMensual[i]   ?? 0;
    const diff = meta - real;
    const pct  = meta > 0 ? real / meta : 0;
    const ok   = pct <= 1;
    const sPct: XLSX.CellStyle = {
      ...CEL(alt), numFmt: "0.0%",
      fill: { fgColor: { rgb: ok ? VERDE : ROJO_CLAR } },
      font: { bold: true, sz: 10, color: { rgb: ok ? VERDE_F : ROJO }, name: "Calibri" },
    };

    celda(ws, r, 0, mes,  CEL_IZQ(alt), "s");
    celda(ws, r, 1, real, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 2, meta, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 3, diff, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 4, pct,  sPct, "n");
    celda(ws, r, 5, ok ? "✔ DENTRO DE META" : "✖ EXCEDE META", ok ? CUMPLE_SI() : CUMPLE_NO(), "s");
    r++;
  });

  // Total
  const tot  = consumoAguaMensual.reduce((a, b) => a + b, 0);
  const totM = metasAguaMensual.reduce((a, b) => a + b, 0);
  celda(ws, r, 0, "TOTAL ANUAL",           TOTAL(), "s");
  celda(ws, r, 1, tot,                     { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 2, totM,                    { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 3, totM - tot,              { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 4, totM > 0 ? tot / totM : 0, { ...TOTAL(), numFmt: "0.0%" }, "n");
  celda(ws, r, 5, "",                      TOTAL(), "s");

  ws["!cols"] = [{ wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 22 }];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 5 } });
  return ws;
}

/* ================================================================
   📋  HOJA 3 – CONSUMO DE ENERGÍA
================================================================ */
function hojaConsumoEnergia(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, consumoEnergiaMensual, metasEnergiaMensual } = params;

  let r = encabezadoHoja(ws, "CONSUMO DE ENERGÍA", "Detalle mensual – kWh consumidos", anio, 5);

  const hdrs = ["Mes", "Consumo Real (kWh)", "Meta Mensual (kWh)", "Diferencia (kWh)", "% Cumplimiento", "Estado"];
  hdrs.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  MESES.forEach((mes, i) => {
    const alt  = i % 2 === 0;
    const real = consumoEnergiaMensual[i] ?? 0;
    const meta = metasEnergiaMensual[i]   ?? 0;
    const diff = meta - real;
    const pct  = meta > 0 ? real / meta : 0;
    const ok   = pct <= 1;
    const sPct: XLSX.CellStyle = {
      ...CEL(alt), numFmt: "0.0%",
      fill: { fgColor: { rgb: ok ? VERDE : ROJO_CLAR } },
      font: { bold: true, sz: 10, color: { rgb: ok ? VERDE_F : ROJO }, name: "Calibri" },
    };

    celda(ws, r, 0, mes,  CEL_IZQ(alt), "s");
    celda(ws, r, 1, real, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 2, meta, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 3, diff, { ...CEL(alt), numFmt: "0.00" }, "n");
    celda(ws, r, 4, pct,  sPct, "n");
    celda(ws, r, 5, ok ? "✔ DENTRO DE META" : "✖ EXCEDE META", ok ? CUMPLE_SI() : CUMPLE_NO(), "s");
    r++;
  });

  const tot  = consumoEnergiaMensual.reduce((a, b) => a + b, 0);
  const totM = metasEnergiaMensual.reduce((a, b) => a + b, 0);
  celda(ws, r, 0, "TOTAL ANUAL",              TOTAL(), "s");
  celda(ws, r, 1, tot,                        { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 2, totM,                       { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 3, totM - tot,                 { ...TOTAL(), numFmt: "0.00" }, "n");
  celda(ws, r, 4, totM > 0 ? tot / totM : 0, { ...TOTAL(), numFmt: "0.0%" }, "n");
  celda(ws, r, 5, "",                         TOTAL(), "s");

  ws["!cols"] = [{ wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 20 }, { wch: 18 }, { wch: 22 }];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 5 } });
  return ws;
}

/* ================================================================
   📋  HOJA 4 – COMPARATIVO AGUA (sedes)
================================================================ */
function hojaComparativoAgua(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawComparativoAgua, rawSedesAgua } = params;

  const sedesMap: Record<number, any> = {};
  (Array.isArray(rawSedesAgua) ? rawSedesAgua : []).forEach((s: any) => {
    sedesMap[s.id] = s;
  });

  // Filtrar por año
  const lista = (Array.isArray(rawComparativoAgua) ? rawComparativoAgua : [])
    .filter((x: any) => Number(x.anio) === anio);

  // Agrupar por sede
  const porSede: Record<number, number[]> = {};
  const porSedeValor: Record<number, number[]> = {};
  lista.forEach((x: any) => {
    const sid = Number(x.sede_id);
    const mi  = Number(x.mes) - 1;
    if (!porSede[sid])       porSede[sid]       = Array(12).fill(0);
    if (!porSedeValor[sid])  porSedeValor[sid]  = Array(12).fill(0);
    porSede[sid][mi]      += Number(x.m3_consumidos     || 0);
    porSedeValor[sid][mi] += Number(x.valor_consumo_agua || 0);
  });

  const numCols = 2 + 12 * 2 + 1; // nombre + ubicacion + 12*(m3+valor) + total
  let r = encabezadoHoja(ws, "COMPARATIVO AGUA – SEDES", "Consumo mensual m³ y valor por sede", anio, numCols - 1);

  // Sub-header meses
  celda(ws, r,     0, "Sede",      HDR(), "s");
  celda(ws, r,     1, "Ubicación", HDR(), "s");
  let c = 2;
  MESES.forEach(m => {
    celda(ws, r, c,     m,      HDR(), "s");
    celda(ws, r, c + 1, "Valor $", HDR(), "s");
    c += 2;
  });
  celda(ws, r, c, "Total m³", HDR(), "s");
  r++;

  const sedeIds = Object.keys(porSede).map(Number);
  sedeIds.forEach((sid, idx) => {
    const alt   = idx % 2 === 0;
    const sede  = sedesMap[sid];
    const nombre    = sede?.nombre    || `Sede ${sid}`;
    const ubicacion = sede?.ubicacion || "";
    const m3s   = porSede[sid];
    const vals  = porSedeValor[sid];
    const total = m3s.reduce((a, b) => a + b, 0);

    celda(ws, r, 0, nombre,    CEL_IZQ(alt), "s");
    celda(ws, r, 1, ubicacion, CEL_IZQ(alt), "s");
    let col = 2;
    m3s.forEach((m3, i) => {
      celda(ws, r, col,     m3,       { ...CEL(alt), numFmt: "0.00" }, "n");
      celda(ws, r, col + 1, vals[i],  { ...CEL(alt), numFmt: '"$"#,##0' }, "n");
      col += 2;
    });
    celda(ws, r, col, total, { ...TOTAL(), numFmt: "0.00" }, "n");
    r++;
  });

  // Fila totales
  celda(ws, r, 0, "TOTAL", TOTAL(), "s");
  celda(ws, r, 1, "",      TOTAL(), "s");
  let col2 = 2;
  MESES.forEach((_, i) => {
    const sumM3  = sedeIds.reduce((s, sid) => s + (porSede[sid]?.[i]      ?? 0), 0);
    const sumVal = sedeIds.reduce((s, sid) => s + (porSedeValor[sid]?.[i] ?? 0), 0);
    celda(ws, r, col2,     sumM3,  { ...TOTAL(), numFmt: "0.00" }, "n");
    celda(ws, r, col2 + 1, sumVal, { ...TOTAL(), numFmt: '"$"#,##0' }, "n");
    col2 += 2;
  });
  const totalGeneral = sedeIds.reduce((s, sid) => s + porSede[sid].reduce((a: number, b: number) => a + b, 0), 0);
  celda(ws, r, col2, totalGeneral, { ...TOTAL(), numFmt: "0.00" }, "n");

  ws["!cols"] = [{ wch: 22 }, { wch: 18 }, ...Array(24).fill({ wch: 12 }), { wch: 14 }];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: numCols - 1 } });
  return ws;
}

/* ================================================================
   📋  HOJA 5 – COMPARATIVO ENERGÍA (sedes)
================================================================ */
function hojaComparativoEnergia(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawComparativoEnergia, rawSedesEnergia } = params;

  const sedesMap: Record<number, any> = {};
  (Array.isArray(rawSedesEnergia) ? rawSedesEnergia : []).forEach((s: any) => {
    sedesMap[s.id] = s;
  });

  const lista = (Array.isArray(rawComparativoEnergia) ? rawComparativoEnergia : [])
    .filter((x: any) => Number(x.anio) === anio);

  const porSede: Record<number, number[]>  = {};
  const porSedeVal: Record<number, number[]> = {};
  lista.forEach((x: any) => {
    const sid = Number(x.sede_energia ?? x.sede_id);
    const mi  = Number(x.mes) - 1;
    if (!porSede[sid])     porSede[sid]     = Array(12).fill(0);
    if (!porSedeVal[sid])  porSedeVal[sid]  = Array(12).fill(0);
    porSede[sid][mi]    += Number(x.kw_consumidos          || 0);
    porSedeVal[sid][mi] += Number(x.valor_consumo_energia  || 0);
  });

  const numCols = 2 + 12 * 2 + 1;
  let r = encabezadoHoja(ws, "COMPARATIVO ENERGÍA – SEDES", "Consumo mensual kWh y valor por sede", anio, numCols - 1);

  celda(ws, r, 0, "Sede",      HDR(), "s");
  celda(ws, r, 1, "Ubicación", HDR(), "s");
  let c = 2;
  MESES.forEach(m => {
    celda(ws, r, c,     m,        HDR(), "s");
    celda(ws, r, c + 1, "Valor $", HDR(), "s");
    c += 2;
  });
  celda(ws, r, c, "Total kWh", HDR(), "s");
  r++;

  const sedeIds = Object.keys(porSede).map(Number);
  sedeIds.forEach((sid, idx) => {
    const alt       = idx % 2 === 0;
    const sede      = sedesMap[sid];
    const nombre    = sede?.nombre    || `Sede ${sid}`;
    const ubicacion = sede?.ubicacion || "";
    const kws  = porSede[sid];
    const vals = porSedeVal[sid];
    const total = kws.reduce((a, b) => a + b, 0);

    celda(ws, r, 0, nombre,    CEL_IZQ(alt), "s");
    celda(ws, r, 1, ubicacion, CEL_IZQ(alt), "s");
    let col = 2;
    kws.forEach((kw, i) => {
      celda(ws, r, col,     kw,       { ...CEL(alt), numFmt: "0.00" }, "n");
      celda(ws, r, col + 1, vals[i],  { ...CEL(alt), numFmt: '"$"#,##0' }, "n");
      col += 2;
    });
    celda(ws, r, col, total, { ...TOTAL(), numFmt: "0.00" }, "n");
    r++;
  });

  celda(ws, r, 0, "TOTAL", TOTAL(), "s");
  celda(ws, r, 1, "",      TOTAL(), "s");
  let col2 = 2;
  MESES.forEach((_, i) => {
    const sumKW  = sedeIds.reduce((s, sid) => s + (porSede[sid]?.[i]    ?? 0), 0);
    const sumVal = sedeIds.reduce((s, sid) => s + (porSedeVal[sid]?.[i] ?? 0), 0);
    celda(ws, r, col2,     sumKW,  { ...TOTAL(), numFmt: "0.00" }, "n");
    celda(ws, r, col2 + 1, sumVal, { ...TOTAL(), numFmt: '"$"#,##0' }, "n");
    col2 += 2;
  });
  const totalGeneral = sedeIds.reduce((s, sid) => s + porSede[sid].reduce((a: number, b: number) => a + b, 0), 0);
  celda(ws, r, col2, totalGeneral, { ...TOTAL(), numFmt: "0.00" }, "n");

  ws["!cols"] = [{ wch: 22 }, { wch: 18 }, ...Array(24).fill({ wch: 12 }), { wch: 14 }];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: numCols - 1 } });
  return ws;
}

/* ================================================================
   📋  HOJA 6 – INSPECCIONES RESIDUOS
================================================================ */
function hojaInspeccionesResiduos(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawInspeccionesResiduos, rawAreasResiduos } = params;

  const areasMap: Record<number, string> = {};
  (Array.isArray(rawAreasResiduos) ? rawAreasResiduos : []).forEach((a: any) => {
    areasMap[a.id] = a.nombre;
  });

  const lista = (Array.isArray(rawInspeccionesResiduos) ? rawInspeccionesResiduos : [])
    .filter((x: any) => new Date(x.fecha).getFullYear() === anio)
    .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  let r = encabezadoHoja(ws, "INSPECCIONES DE RESIDUOS", "Registro de inspecciones – Cumple / No Cumple", anio, 11);

  const hdrs = [
    "Fecha", "Área", "Responsable",
    "Reciclables C", "Reciclables NC",
    "Ordinarios C",  "Ordinarios NC",
    "Peligrosos C",  "Peligrosos NC",
    "Precintos C",   "Precintos NC",
    "Observación",
  ];
  hdrs.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  lista.forEach((x: any, i: number) => {
    const alt = i % 2 === 0;
    celda(ws, r, 0,  x.fecha,                              CEL(alt), "s");
    celda(ws, r, 1,  areasMap[x.area_id] || `Área ${x.area_id}`, CEL_IZQ(alt), "s");
    celda(ws, r, 2,  x.responsable || "",                  CEL_IZQ(alt), "s");
    celda(ws, r, 3,  Number(x.reciclables_c  ?? 0),        CEL(alt), "n");
    celda(ws, r, 4,  Number(x.reciclables_nc ?? 0),        x.reciclables_nc > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 5,  Number(x.ordinarios_c   ?? 0),        CEL(alt), "n");
    celda(ws, r, 6,  Number(x.ordinarios_nc  ?? 0),        x.ordinarios_nc  > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 7,  Number(x.peligrosos_c   ?? 0),        CEL(alt), "n");
    celda(ws, r, 8,  Number(x.peligrosos_nc  ?? 0),        x.peligrosos_nc  > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 9,  Number(x.presintos_c    ?? 0),        CEL(alt), "n");
    celda(ws, r, 10, Number(x.presintos_nc   ?? 0),        x.presintos_nc   > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 11, x.observacion || "",                  CEL_IZQ(alt), "s");
    r++;
  });

  if (lista.length === 0) {
    celda(ws, r, 0, "Sin registros para el año seleccionado", CEL(false), "s");
    merge(ws, r, 0, r, 11);
    r++;
  }

  ws["!cols"] = [
    { wch: 14 }, { wch: 20 }, { wch: 22 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 30 },
  ];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 11 } });
  return ws;
}

/* ================================================================
   📋  HOJA 7 – INSPECCIONES SANITARIAS
================================================================ */
function hojaInspeccionesSanitarias(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawInspeccionesSanitarias, rawAreasSanitarias } = params;

  const areasMap: Record<number, string> = {};
  (Array.isArray(rawAreasSanitarias) ? rawAreasSanitarias : []).forEach((a: any) => {
    areasMap[a.id] = a.nombre;
  });

  const lista = (Array.isArray(rawInspeccionesSanitarias) ? rawInspeccionesSanitarias : [])
    .filter((x: any) => {
      const f = new Date(x.fecha);
      return f.getFullYear() === anio || Number(x.anio) === anio;
    })
    .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  let r = encabezadoHoja(ws, "INSPECCIONES SANITARIAS", "Control de instalaciones sanitarias – Cumple / No Cumple", anio, 12);

  const hdrs = [
    "Fecha", "Semana", "Área", "Responsable",
    "Sanitarios C", "Sanitarios NC",
    "Orinales C",   "Orinales NC",
    "Duchas C",     "Duchas NC",
    "Lavamanos C",  "Lavamanos NC",
    "Llaves C",     "Llaves NC",
    "Observación",
  ];
  hdrs.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  lista.forEach((x: any, i: number) => {
    const alt = i % 2 === 0;
    celda(ws, r, 0,  x.fecha,                                    CEL(alt), "s");
    celda(ws, r, 1,  Number(x.semana ?? 0),                      CEL(alt), "n");
    celda(ws, r, 2,  areasMap[x.area_id] || `Área ${x.area_id}`, CEL_IZQ(alt), "s");
    celda(ws, r, 3,  x.responsable || "",                        CEL_IZQ(alt), "s");
    celda(ws, r, 4,  Number(x.sanitarios_c  ?? 0),               CEL(alt), "n");
    celda(ws, r, 5,  Number(x.sanitarios_nc ?? 0),               x.sanitarios_nc > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 6,  Number(x.orinales_c    ?? 0),               CEL(alt), "n");
    celda(ws, r, 7,  Number(x.orinales_nc   ?? 0),               x.orinales_nc   > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 8,  Number(x.duchas_c      ?? 0),               CEL(alt), "n");
    celda(ws, r, 9,  Number(x.duchas_nc     ?? 0),               x.duchas_nc     > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 10, Number(x.lavamanos_c   ?? 0),               CEL(alt), "n");
    celda(ws, r, 11, Number(x.lavamanos_nc  ?? 0),               x.lavamanos_nc  > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 12, Number(x.llaves_c      ?? 0),               CEL(alt), "n");
    celda(ws, r, 13, Number(x.llaves_nc     ?? 0),               x.llaves_nc     > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 14, x.observacion || "",                        CEL_IZQ(alt), "s");
    r++;
  });

  if (lista.length === 0) {
    celda(ws, r, 0, "Sin registros para el año seleccionado", CEL(false), "s");
    merge(ws, r, 0, r, 14);
    r++;
  }

  ws["!cols"] = [
    { wch: 14 }, { wch: 10 }, { wch: 20 }, { wch: 22 },
    ...Array(10).fill({ wch: 14 }),
    { wch: 30 },
  ];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 14 } });
  return ws;
}

/* ================================================================
   📋  HOJA 8 – INSPECCIONES ENERGÍA
================================================================ */
function hojaInspeccionesEnergia(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawInspeccionesEnergia, rawAreasEnergia } = params;

  const areasMap: Record<number, string> = {};
  (Array.isArray(rawAreasEnergia) ? rawAreasEnergia : []).forEach((a: any) => {
    areasMap[a.id] = a.nombre;
  });

  const lista = (Array.isArray(rawInspeccionesEnergia) ? rawInspeccionesEnergia : [])
    .filter((x: any) => new Date(x.fecha).getFullYear() === anio)
    .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  let r = encabezadoHoja(ws, "INSPECCIONES DE ENERGÍA", "Control de dispositivos eléctricos – Cumple / No Cumple", anio, 11);

  const hdrs = [
    "Fecha", "Área", "Responsable",
    "Bombillas C",   "Bombillas NC",
    "Reflectores C", "Reflectores NC",
    "Lámparas C",    "Lámparas NC",
    "Aires C",       "Aires NC",
    "Total", "Observación",
  ];
  hdrs.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  lista.forEach((x: any, i: number) => {
    const alt = i % 2 === 0;
    celda(ws, r, 0,  x.fecha,                                    CEL(alt), "s");
    celda(ws, r, 1,  areasMap[x.area_id] || `Área ${x.area_id}`, CEL_IZQ(alt), "s");
    celda(ws, r, 2,  x.responsable || "",                        CEL_IZQ(alt), "s");
    celda(ws, r, 3,  Number(x.bombillas_c    ?? 0),              CEL(alt), "n");
    celda(ws, r, 4,  Number(x.bombillas_nc   ?? 0),              x.bombillas_nc   > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 5,  Number(x.reflectores_c  ?? 0),              CEL(alt), "n");
    celda(ws, r, 6,  Number(x.reflectores_nc ?? 0),              x.reflectores_nc > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 7,  Number(x.lamparas_c     ?? 0),              CEL(alt), "n");
    celda(ws, r, 8,  Number(x.lamparas_nc    ?? 0),              x.lamparas_nc    > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 9,  Number(x.aires_c        ?? 0),              CEL(alt), "n");
    celda(ws, r, 10, Number(x.aires_nc       ?? 0),              x.aires_nc       > 0 ? CUMPLE_NO() : CEL(alt), "n");
    celda(ws, r, 11, Number(x.total          ?? 0),              TOTAL(), "n");
    celda(ws, r, 12, x.observacion || "",                        CEL_IZQ(alt), "s");
    r++;
  });

  if (lista.length === 0) {
    celda(ws, r, 0, "Sin registros para el año seleccionado", CEL(false), "s");
    merge(ws, r, 0, r, 12);
    r++;
  }

  ws["!cols"] = [
    { wch: 14 }, { wch: 20 }, { wch: 22 },
    ...Array(8).fill({ wch: 14 }),
    { wch: 12 }, { wch: 30 },
  ];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 12 } });
  return ws;
}

/* ================================================================
   📋  HOJA 9 – TONNERS
================================================================ */
function hojaTonners(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawTonners, rawAreasTonners } = params;

  const areasMap: Record<number, string> = {};
  (Array.isArray(rawAreasTonners) ? rawAreasTonners : []).forEach((a: any) => {
    areasMap[a.id] = a.nombre;
  });

  const lista = (Array.isArray(rawTonners) ? rawTonners : [])
    .filter((x: any) => new Date(x.fecha).getFullYear() === anio)
    .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  let r = encabezadoHoja(ws, "REGISTRO DE TONNERS", "Consumo de tonners por área y fecha", anio, 5);

  const hdrs = ["Fecha", "Área", "Responsable", "Modelo Tonner", "Modelo Impresora", "Cantidad"];
  hdrs.forEach((h, c) => celda(ws, r, c, h, HDR(), "s"));
  r++;

  let totalCant = 0;
  lista.forEach((x: any, i: number) => {
    const alt = i % 2 === 0;
    celda(ws, r, 0, x.fecha,                                       CEL(alt), "s");
    celda(ws, r, 1, areasMap[x.area_id] || `Área ${x.area_id}`,    CEL_IZQ(alt), "s");
    celda(ws, r, 2, x.responsable      || "",                      CEL_IZQ(alt), "s");
    celda(ws, r, 3, x.modelo_tonner    || "",                      CEL_IZQ(alt), "s");
    celda(ws, r, 4, x.modelo_impresora || "",                      CEL_IZQ(alt), "s");
    celda(ws, r, 5, Number(x.cantidad   ?? 0),                     CEL(alt), "n");
    totalCant += Number(x.cantidad ?? 0);
    r++;
  });

  if (lista.length === 0) {
    celda(ws, r, 0, "Sin registros para el año seleccionado", CEL(false), "s");
    merge(ws, r, 0, r, 5);
    r++;
  }

  celda(ws, r, 0, "TOTAL TONNERS", TOTAL(), "s");
  merge(ws, r, 0, r, 4);
  celda(ws, r, 5, totalCant, TOTAL(), "n");

  ws["!cols"] = [{ wch: 14 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 12 }];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 5 } });
  return ws;
}

/* ================================================================
   📋  HOJA 10 – RESMAS
================================================================ */
function hojaResmas(params: ResumenParams): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const { anio, rawResmas, rawAreasResmas } = params;

  const areasMap: Record<number, string> = {};
  (Array.isArray(rawAreasResmas) ? rawAreasResmas : []).forEach((a: any) => {
    areasMap[a.id] = a.nombre;
  });

  const lista = (Array.isArray(rawResmas) ? rawResmas : [])
    .filter((x: any) => Number(x.anio) === anio);

  // Agrupar por área
  const porArea: Record<number, number[]> = {};
  lista.forEach((x: any) => {
    const aid = Number(x.area_id);
    const mi  = Number(x.mes) - 1;
    if (!porArea[aid]) porArea[aid] = Array(12).fill(0);
    porArea[aid][mi] += Number(x.cantidad || 0);
  });

  let r = encabezadoHoja(ws, "REGISTRO DE RESMAS", "Consumo de papel por área – unidades mensuales", anio, 13);

  // Headers
  celda(ws, r, 0, "Área", HDR(), "s");
  MESES.forEach((m, i) => celda(ws, r, i + 1, m, HDR(), "s"));
  celda(ws, r, 13, "Total", HDR(), "s");
  r++;

  const areaIds = Object.keys(porArea).map(Number);
  const totalesPorMes: number[] = Array(12).fill(0);

  areaIds.forEach((aid, idx) => {
    const alt    = idx % 2 === 0;
    const nombre = areasMap[aid] || `Área ${aid}`;
    const meses  = porArea[aid];
    const total  = meses.reduce((a, b) => a + b, 0);

    celda(ws, r, 0, nombre, CEL_IZQ(alt), "s");
    meses.forEach((cant, i) => {
      celda(ws, r, i + 1, cant, CEL(alt), "n");
      totalesPorMes[i] += cant;
    });
    celda(ws, r, 13, total, TOTAL(), "n");
    r++;
  });

  if (areaIds.length === 0) {
    celda(ws, r, 0, "Sin registros para el año seleccionado", CEL(false), "s");
    merge(ws, r, 0, r, 13);
    r++;
  }

  // Fila totales
  celda(ws, r, 0, "TOTAL", TOTAL(), "s");
  totalesPorMes.forEach((t, i) => celda(ws, r, i + 1, t, TOTAL(), "n"));
  celda(ws, r, 13, totalesPorMes.reduce((a, b) => a + b, 0), TOTAL(), "n");

  ws["!cols"] = [{ wch: 24 }, ...Array(12).fill({ wch: 11 }), { wch: 12 }];
  ws["!rows"] = [{ hpt: 36 }, { hpt: 26 }, { hpt: 10 }];
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r, c: 13 } });
  return ws;
}

/* ================================================================
   🚀  FUNCIÓN PRINCIPAL – genera el workbook completo
================================================================ */
export async function exportarResumenGeneral(anio: number): Promise<void> {
  // Cargar todos los datos en paralelo
  const [
    rawAgua,
    rawEnergia,
    rawMetas,
    rawComparativoAgua,
    rawSedesAgua,
    rawComparativoEnergia,
    rawSedesEnergia,
    rawInspeccionesResiduos,
    rawAreasResiduos,
    rawInspeccionesSanitarias,
    rawAreasSanitarias,
    rawInspeccionesEnergia,
    rawAreasEnergia,
    rawTonners,
    rawAreasTonners,
    rawResmas,
    rawAreasResmas,
  ] = await Promise.all([
    fetch("/api/agua",                    { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/energia",                 { cache: "no-store" }).then(r => r.json()).catch(() => []),
    // metas: cargamos los 12 meses de agua y energía
    Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        Promise.all([
          fetch(`/api/metas?tipo=agua&anio=${anio}&mes=${i + 1}`,    { cache: "no-store" }).then(r => r.json()).catch(() => ({ meta: 0 })),
          fetch(`/api/metas?tipo=energia&anio=${anio}&mes=${i + 1}`, { cache: "no-store" }).then(r => r.json()).catch(() => ({ meta: 0 })),
        ])
      )
    ),
    fetch("/api/comparativoAgua",         { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/sedes",                   { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/comparativoEnergia",      { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/sedes_energia",           { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/inspecciones-residuos",   { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/areas-resmas",            { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/inspecciones-sanitarias", { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/areas-sanitarias",        { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/inspecciones-energia",    { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/areas-energia",           { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/tonners",                 { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/areas-tonners",           { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/resmas",                  { cache: "no-store" }).then(r => r.json()).catch(() => []),
    fetch("/api/areas-resmas",            { cache: "no-store" }).then(r => r.json()).catch(() => []),
  ]);

  // Procesar lecturas de agua
  const listaAgua = Array.isArray(rawAgua) ? rawAgua : (rawAgua?.data ?? []);
  const consumoAguaMensual = Array(12).fill(0);
  listaAgua.forEach((item: any) => {
    const fecha = new Date(item.fecha + "T00:00:00");
    if (fecha.getFullYear() !== anio) return;
    consumoAguaMensual[fecha.getMonth()] += Number(item.total_bodega1 || 0) + Number(item.total_bodega2 || 0);
  });

  // Procesar lecturas de energía
  const listaEnergia = Array.isArray(rawEnergia) ? rawEnergia : (rawEnergia?.data ?? []);
  const consumoEnergiaMensual = Array(12).fill(0);
  listaEnergia.forEach((item: any) => {
    const fecha = new Date(item.fecha + "T00:00:00");
    if (fecha.getFullYear() !== anio) return;
    consumoEnergiaMensual[fecha.getMonth()] += Number(item.total_bodega1 || 0) + Number(item.total_bodega2 || 0);
  });

  // Procesar metas (rawMetas es un array de 12 pares [agua, energia])
  const metasAguaMensual    = (rawMetas as any[]).map(([a]) => Number(a?.meta ?? 0));
  const metasEnergiaMensual = (rawMetas as any[]).map(([, e]) => Number(e?.meta ?? 0));

  // Normalizar listas (algunas APIs retornan { data: [] })
  const normalizar = (d: any) => Array.isArray(d) ? d : (d?.data ?? []);

  const params: ResumenParams = {
    anio,
    consumoAguaMensual,
    metasAguaMensual,
    consumoEnergiaMensual,
    metasEnergiaMensual,
    rawComparativoAgua:         normalizar(rawComparativoAgua),
    rawSedesAgua:               normalizar(rawSedesAgua),
    rawComparativoEnergia:      normalizar(rawComparativoEnergia),
    rawSedesEnergia:            normalizar(rawSedesEnergia),
    rawInspeccionesResiduos:    normalizar(rawInspeccionesResiduos),
    rawAreasResiduos:           normalizar(rawAreasResiduos),
    rawInspeccionesSanitarias:  normalizar(rawInspeccionesSanitarias),
    rawAreasSanitarias:         normalizar(rawAreasSanitarias),
    rawInspeccionesEnergia:     normalizar(rawInspeccionesEnergia),
    rawAreasEnergia:            normalizar(rawAreasEnergia),
    rawTonners:                 normalizar(rawTonners),
    rawAreasTonners:            normalizar(rawAreasTonners),
    rawResmas:                  normalizar(rawResmas),
    rawAreasResmas:             normalizar(rawAreasResmas),
  };

  // Construir workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, hojaResumenEjecutivo(params),      "📊 Resumen Ejecutivo");
  XLSX.utils.book_append_sheet(wb, hojaConsumoAgua(params),           "💧 Consumo Agua");
  XLSX.utils.book_append_sheet(wb, hojaConsumoEnergia(params),        "⚡ Consumo Energía");
  XLSX.utils.book_append_sheet(wb, hojaComparativoAgua(params),       "🚰 Comp. Agua Sedes");
  XLSX.utils.book_append_sheet(wb, hojaComparativoEnergia(params),    "🔌 Comp. Energía Sedes");
  XLSX.utils.book_append_sheet(wb, hojaInspeccionesResiduos(params),  "♻ Insp. Residuos");
  XLSX.utils.book_append_sheet(wb, hojaInspeccionesSanitarias(params),"🚿 Insp. Sanitarias");
  XLSX.utils.book_append_sheet(wb, hojaInspeccionesEnergia(params),   "💡 Insp. Energía");
  XLSX.utils.book_append_sheet(wb, hojaTonners(params),               "🖨 Tonners");
  XLSX.utils.book_append_sheet(wb, hojaResmas(params),                "📄 Resmas");

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `Reporte_SGA_ENVIA_${anio}_${fecha}.xlsx`);
}
