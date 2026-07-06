
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================================================================
   PALETA ENVIA
================================================================ */
const R  = { r: 196, g:   0, b:   0 }; // rojo
const RD = { r: 139, g:   0, b:   0 }; // rojo oscuro
const W  = { r: 255, g: 255, b: 255 }; // blanco
const GH = { r: 245, g: 245, b: 245 }; // gris claro filas
const GT = { r:  80, g:  80, b:  80 }; // gris texto
const VF = { r:  22, g: 163, b:  74 }; // verde texto
const VB = { r: 220, g: 252, b: 231 }; // verde fondo
const RF = { r: 196, g:   0, b:   0 }; // rojo texto
const RB = { r: 254, g: 226, b: 226 }; // rojo fondo
const NK = { r:  15, g:  23, b:  42 }; // negro

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

/* ================================================================
   HELPERS
================================================================ */
type C = { r: number; g: number; b: number };

function tc(doc: jsPDF, c: C) { doc.setTextColor(c.r, c.g, c.b); }
function fc(doc: jsPDF, c: C) { doc.setFillColor(c.r, c.g, c.b); }
function dc(doc: jsPDF, c: C) { doc.setDrawColor(c.r, c.g, c.b); }

function s(v: any, def = ""): string {
  if (v === null || v === undefined) return def;
  return String(v);
}

function fmt(n: any, dec = 2): string {
  return Number(n || 0).toLocaleString("es-CO", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

function pct(n: number): string {
  return (Number(n || 0) * 100).toFixed(1) + "%";
}

async function cargarLogo(): Promise<string | null> {
  try {
    const res  = await fetch("/img/logo.png");
    const blob = await res.blob();
    return await new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

function norm(d: any): any[] {
  return Array.isArray(d) ? d : (d?.data ?? []);
}

/* ================================================================
   HEADER
================================================================ */
function header(doc: jsPDF, logo: string | null, titulo: string, anio: number) {
  const PW = doc.internal.pageSize.getWidth();

  fc(doc, RD);
  doc.rect(0, 0, PW, 28, "F");

  if (logo) doc.addImage(logo, "PNG", 10, 4, 20, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  tc(doc, W);
  doc.text("ENVIA MENSAJERIA Y TRANSPORTE", 35, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Sistema de Gestion Ambiental - SGA", 35, 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(String(anio), PW - 12, 16, { align: "right" });

  fc(doc, R);
  doc.rect(0, 28, PW, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  tc(doc, NK);
  doc.text(titulo, PW / 2, 41, { align: "center" });

  dc(doc, R);
  doc.setLineWidth(0.6);
  doc.line(15, 44, PW - 15, 44);
}

/* ================================================================
   FOOTER
================================================================ */
function footer(doc: jsPDF, pag: number, total: number) {
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();

  fc(doc, RD);
  doc.rect(0, PH - 11, PW, 11, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tc(doc, W);
  doc.text(
    "Documento generado automaticamente  -  ENVIA  -  Uso interno corporativo",
    PW / 2, PH - 4, { align: "center" }
  );
  doc.text("Pag " + pag + " / " + total, PW - 12, PH - 4, { align: "right" });
}

/* ================================================================
   SECCION (banda roja con texto)
================================================================ */
function seccion(doc: jsPDF, y: number, texto: string): number {
  const PW = doc.internal.pageSize.getWidth();
  fc(doc, R);
  doc.rect(10, y, PW - 20, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  tc(doc, W);
  doc.text(texto, 14, y + 5);
  return y + 10;
}

/* ================================================================
   BLOQUE KPI  (label / valor / subtexto / ok?)
   ok = undefined  →  fondo rojo oscuro, texto blanco
   ok = true       →  fondo verde claro, texto verde
   ok = false      →  fondo rojo claro, texto rojo
================================================================ */
function kpi(
  doc: jsPDF,
  x: number, y: number, bw: number, bh: number,
  label: string,
  valor: string,
  sub: string,
  ok?: boolean,
) {
  // fondo
  if (ok === undefined) fc(doc, RD);
  else if (ok)          fc(doc, VB);
  else                  fc(doc, RB);
  doc.roundedRect(x, y, bw, bh, 2, 2, "F");

  // etiqueta
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  if (ok === undefined) tc(doc, W); else tc(doc, GT);
  doc.text(s(label, "-"), x + 3, y + 5);

  // valor
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  if (ok === undefined)     tc(doc, W);
  else if (ok === true)     tc(doc, VF);
  else                      tc(doc, RF);
  doc.text(s(valor, "-"), x + 3, y + 12);

  // subtexto
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  if (ok === undefined) tc(doc, W); else tc(doc, GT);
  doc.text(s(sub, ""), x + 3, y + 17);
}

/* ================================================================
   TABLA (wrapper autoTable)
================================================================ */
function tabla(
  doc: jsPDF,
  startY: number,
  head: string[][],
  body: any[][],
  colWidths?: number[],
): number {
  autoTable(doc, {
    startY,
    head,
    body,
    styles: {
      fontSize: 7.5,
      halign: "center" as const,
      valign: "middle" as const,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [196, 0, 0] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] as [number, number, number],
    },
    columnStyles: colWidths
      ? Object.fromEntries(colWidths.map((cw, i) => [i, { cellWidth: cw }]))
      : {},
    margin: { left: 10, right: 10 },
  });
  return (doc as any).lastAutoTable?.finalY ?? startY + 20;
}

/* ================================================================
   FUNCIÓN PRINCIPAL EXPORTADA
================================================================ */
export async function exportarResumenPDF(anio: number): Promise<void> {
  const doc  = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const PW   = doc.internal.pageSize.getWidth();
  const PH   = doc.internal.pageSize.getHeight();
  const logo = await cargarLogo();

  /* ── 1. Obtener datos de las APIs ── */
  const [
    resAgua,
    resEnergia,
    resCompAgua,
    resCompEnergia,
    resSedesAgua,
    resSedesEnergia,
    resInspResiduos,
    resInspSanitarias,
    resInspEnergia,
    resAreasResiduos,
    resAreasSanitarias,
    resAreasEnergia,
    resResmas,
    resAreasResmas,
    resTonners,
    resAreasTonners,
    resMetas,
  ] = await Promise.all([
    fetch("/api/agua").then(r => r.json()).catch(() => []),
    fetch("/api/energia").then(r => r.json()).catch(() => []),
    fetch("/api/comparativoAgua").then(r => r.json()).catch(() => []),
    fetch("/api/comparativoEnergia").then(r => r.json()).catch(() => []),
    fetch("/api/sedes").then(r => r.json()).catch(() => []),
    fetch("/api/sedes_energia").then(r => r.json()).catch(() => []),
    fetch("/api/inspecciones-residuos").then(r => r.json()).catch(() => []),
    fetch("/api/inspecciones-sanitarias").then(r => r.json()).catch(() => []),
    fetch("/api/inspecciones-energia").then(r => r.json()).catch(() => []),
    fetch("/api/areas-resmas").then(r => r.json()).catch(() => []),
    fetch("/api/areas-sanitarias").then(r => r.json()).catch(() => []),
    fetch("/api/areas-energia").then(r => r.json()).catch(() => []),
    fetch("/api/resmas").then(r => r.json()).catch(() => []),
    fetch("/api/areas-resmas").then(r => r.json()).catch(() => []),
    fetch("/api/tonners").then(r => r.json()).catch(() => []),
    fetch("/api/areas-tonners").then(r => r.json()).catch(() => []),
    fetch("/api/metas").then(r => r.json()).catch(() => []),
  ]);

  const aguaData    = norm(resAgua).filter((x: any) => Number(x.anio) === anio);
  const energiaData = norm(resEnergia).filter((x: any) => Number(x.anio) === anio);
  const metasData   = norm(resMetas).filter((x: any) => Number(x.anio) === anio);

  /* ── Arrays mensuales (índice 0 = Enero) ── */
  const consumoAguaMensual     = Array(12).fill(0);
  const consumoEnergiaMensual  = Array(12).fill(0);
  const metasAguaMensual       = Array(12).fill(0);
  const metasEnergiaMensual    = Array(12).fill(0);

  aguaData.forEach((x: any) => {
    const mi = Number(x.mes) - 1;
    if (mi >= 0 && mi < 12) consumoAguaMensual[mi] += Number(x.consumo_m3 ?? x.consumo ?? 0);
  });
  energiaData.forEach((x: any) => {
    const mi = Number(x.mes) - 1;
    if (mi >= 0 && mi < 12) consumoEnergiaMensual[mi] += Number(x.consumo_kwh ?? x.consumo ?? 0);
  });
  metasData.forEach((x: any) => {
    const mi = Number(x.mes) - 1;
    if (mi >= 0 && mi < 12) {
      metasAguaMensual[mi]    += Number(x.meta_agua    ?? 0);
      metasEnergiaMensual[mi] += Number(x.meta_energia ?? 0);
    }
  });

  const totalAgua    = consumoAguaMensual.reduce((a, b) => a + b, 0);
  const totalEnergia = consumoEnergiaMensual.reduce((a, b) => a + b, 0);
  const metaAguaT    = metasAguaMensual.reduce((a, b) => a + b, 0);
  const metaEnergiaT = metasEnergiaMensual.reduce((a, b) => a + b, 0);

  /* ──────────────────────────────────────────
     PÁGINA 1 – PORTADA
  ────────────────────────────────────────── */
  // Fondo oscuro
  fc(doc, NK);
  doc.rect(0, 0, PW, PH, "F");

  // Banda roja superior
  fc(doc, RD);
  doc.rect(0, 0, PW, 40, "F");

  if (logo) doc.addImage(logo, "PNG", 20, 8, 28, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  tc(doc, W);
  doc.text("ENVIA MENSAJERÍA Y TRANSPORTE", PW / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Sistema de Gestión Ambiental  ·  SGA", PW / 2, 30, { align: "center" });

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  tc(doc, W);
  doc.text("REPORTE ANUAL SGA", PW / 2, PH / 2 - 15, { align: "center" });

  doc.setFontSize(20);
  tc(doc, { r: 255, g: 100, b: 100 });
  doc.text(String(anio), PW / 2, PH / 2 + 5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  tc(doc, { r: 180, g: 180, b: 180 });
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}`,
    PW / 2, PH / 2 + 20, { align: "center" }
  );

  // KPIs de portada
  const kpiY = PH - 65;
  kpi(doc, 15,          kpiY, 60, 25, "Consumo total agua",    fmt(totalAgua, 0) + " L",    `Meta: ${fmt(metaAguaT, 0)} L`,    metaAguaT > 0 ? totalAgua <= metaAguaT : undefined);
  kpi(doc, 85,          kpiY, 60, 25, "Consumo total energía", fmt(totalEnergia, 0) + " kWh", `Meta: ${fmt(metaEnergiaT, 0)} kWh`, metaEnergiaT > 0 ? totalEnergia <= metaEnergiaT : undefined);
  kpi(doc, 155,         kpiY, 60, 25, "% Cumpl. agua",         pct(metaAguaT > 0 ? totalAgua / metaAguaT : 0), "", metaAguaT > 0 ? totalAgua <= metaAguaT : undefined);
  kpi(doc, 225,         kpiY, 60, 25, "% Cumpl. energía",      pct(metaEnergiaT > 0 ? totalEnergia / metaEnergiaT : 0), "", metaEnergiaT > 0 ? totalEnergia <= metaEnergiaT : undefined);

  /* ──────────────────────────────────────────
     PÁGINA 2 – RESUMEN EJECUTIVO MENSUAL
  ────────────────────────────────────────── */
  doc.addPage();
  header(doc, logo, "RESUMEN EJECUTIVO MENSUAL", anio);

  let y = 50;
  y = seccion(doc, y, "AGUA – Consumo mensual vs. meta");
  y += 2;

  const hdrsAgua = [["Mes", "Consumo (L)", "Meta (L)", "Diferencia", "% Cumpl.", "Estado"]];
  const bodyAgua = MESES.map((mes, i) => {
    const real = consumoAguaMensual[i];
    const meta = metasAguaMensual[i];
    const diff = meta - real;
    const p    = meta > 0 ? (real / meta) * 100 : 0;
    return [mes, fmt(real), fmt(meta), fmt(diff), p.toFixed(1) + "%", real <= meta ? "✔ OK" : "✖ Excede"];
  });

  y = tabla(doc, y, hdrsAgua, bodyAgua, [28, 30, 30, 30, 24, 28]);

  y += 8;
  if (y > PH - 60) { doc.addPage(); header(doc, logo, "RESUMEN EJECUTIVO MENSUAL", anio); y = 50; }

  y = seccion(doc, y, "ENERGÍA – Consumo mensual vs. meta");
  y += 2;

  const hdrsEnergia = [["Mes", "Consumo (kWh)", "Meta (kWh)", "Diferencia", "% Cumpl.", "Estado"]];
  const bodyEnergia = MESES.map((mes, i) => {
    const real = consumoEnergiaMensual[i];
    const meta = metasEnergiaMensual[i];
    const diff = meta - real;
    const p    = meta > 0 ? (real / meta) * 100 : 0;
    return [mes, fmt(real), fmt(meta), fmt(diff), p.toFixed(1) + "%", real <= meta ? "✔ OK" : "✖ Excede"];
  });

  y = tabla(doc, y, hdrsEnergia, bodyEnergia, [28, 32, 32, 30, 24, 28]);

  /* ──────────────────────────────────────────
     PÁGINA 3 – COMPARATIVO AGUA POR SEDE
  ────────────────────────────────────────── */
  doc.addPage();
  header(doc, logo, "COMPARATIVO AGUA – SEDES", anio);
  y = 50;

  const sedesAguaMap: Record<number, string> = {};
  norm(resSedesAgua).forEach((s: any) => { sedesAguaMap[s.id] = s.nombre; });

  const compAguaAnio = norm(resCompAgua).filter((x: any) => Number(x.anio) === anio);
  const porSedeAgua: Record<string, number[]> = {};
  compAguaAnio.forEach((x: any) => {
    const nombre = sedesAguaMap[x.sede_id] || `Sede ${x.sede_id}`;
    if (!porSedeAgua[nombre]) porSedeAgua[nombre] = Array(12).fill(0);
    porSedeAgua[nombre][Number(x.mes) - 1] += Number(x.m3_consumidos ?? 0);
  });

  const sedeNombresAgua = Object.keys(porSedeAgua);
  if (sedeNombresAgua.length > 0) {
    y = seccion(doc, y, "Consumo de agua m³ por sede");
    y += 2;
    const hdrs3 = [["Sede", ...MESES.map(m => m.substring(0, 3)), "Total"]];
    const body3 = sedeNombresAgua.map(nombre => {
      const vals = porSedeAgua[nombre];
      const tot  = vals.reduce((a, b) => a + b, 0);
      return [nombre, ...vals.map(v => fmt(v, 1)), fmt(tot, 1)];
    });
    y = tabla(doc, y, hdrs3, body3);
  } else {
    doc.setFontSize(10); tc(doc, GT);
    doc.text("Sin datos de comparativo de agua para el año seleccionado.", 14, y + 10);
    y += 20;
  }

  /* ──────────────────────────────────────────
     PÁGINA 4 – COMPARATIVO ENERGÍA POR SEDE
  ────────────────────────────────────────── */
  doc.addPage();
  header(doc, logo, "COMPARATIVO ENERGÍA – SEDES", anio);
  y = 50;

  const sedesEnergiaMap: Record<number, string> = {};
  norm(resSedesEnergia).forEach((s: any) => { sedesEnergiaMap[s.id] = s.nombre; });

  const compEnergiaAnio = norm(resCompEnergia).filter((x: any) => Number(x.anio) === anio);
  const porSedeEnergia: Record<string, number[]> = {};
  compEnergiaAnio.forEach((x: any) => {
    const sid    = Number(x.sede_energia ?? x.sede_id);
    const nombre = sedesEnergiaMap[sid] || `Sede ${sid}`;
    if (!porSedeEnergia[nombre]) porSedeEnergia[nombre] = Array(12).fill(0);
    porSedeEnergia[nombre][Number(x.mes) - 1] += Number(x.kw_consumidos ?? 0);
  });

  const sedeNombresEnergia = Object.keys(porSedeEnergia);
  if (sedeNombresEnergia.length > 0) {
    y = seccion(doc, y, "Consumo de energía kWh por sede");
    y += 2;
    const hdrs4 = [["Sede", ...MESES.map(m => m.substring(0, 3)), "Total"]];
    const body4 = sedeNombresEnergia.map(nombre => {
      const vals = porSedeEnergia[nombre];
      const tot  = vals.reduce((a, b) => a + b, 0);
      return [nombre, ...vals.map(v => fmt(v, 1)), fmt(tot, 1)];
    });
    y = tabla(doc, y, hdrs4, body4);
  } else {
    doc.setFontSize(10); tc(doc, GT);
    doc.text("Sin datos de comparativo de energía para el año seleccionado.", 14, y + 10);
    y += 20;
  }

  /* ──────────────────────────────────────────
     PÁGINA 5 – INSPECCIONES
  ────────────────────────────────────────── */
  doc.addPage();
  header(doc, logo, "INSPECCIONES SGA", anio);
  y = 50;

  // Residuos
  const areasResMap: Record<number, string> = {};
  norm(resAreasResiduos).forEach((a: any) => { areasResMap[a.id] = a.nombre; });
  const inspRes = norm(resInspResiduos).filter((x: any) => new Date(x.fecha).getFullYear() === anio);

  y = seccion(doc, y, `Inspecciones de Residuos (${inspRes.length} registros)`);
  y += 2;
  if (inspRes.length > 0) {
    const hdrsRes = [["Fecha", "Área", "Responsable", "Recicl. C/NC", "Ordin. C/NC", "Pelig. C/NC", "Obs."]];
    const bodyRes = inspRes.map((x: any) => [
      s(x.fecha),
      areasResMap[x.area_id] || `Área ${x.area_id}`,
      s(x.responsable),
      `${x.reciclables_c ?? 0}/${x.reciclables_nc ?? 0}`,
      `${x.ordinarios_c ?? 0}/${x.ordinarios_nc ?? 0}`,
      `${x.peligrosos_c ?? 0}/${x.peligrosos_nc ?? 0}`,
      s(x.observacion).substring(0, 40),
    ]);
    y = tabla(doc, y, hdrsRes, bodyRes, [24, 30, 30, 22, 22, 22, 50]);
    y += 4;
  } else {
    doc.setFontSize(9); tc(doc, GT);
    doc.text("Sin registros.", 14, y + 6);
    y += 14;
  }

  // Si no hay espacio, nueva página
  if (y > PH - 70) { doc.addPage(); header(doc, logo, "INSPECCIONES SGA", anio); y = 50; }

  // Sanitarias
  const areasSanMap: Record<number, string> = {};
  norm(resAreasSanitarias).forEach((a: any) => { areasSanMap[a.id] = a.nombre; });
  const inspSan = norm(resInspSanitarias).filter((x: any) => {
    const f = new Date(x.fecha);
    return f.getFullYear() === anio || Number(x.anio) === anio;
  });

  y = seccion(doc, y, `Inspecciones Sanitarias (${inspSan.length} registros)`);
  y += 2;
  if (inspSan.length > 0) {
    const hdrsSan = [["Fecha", "Semana", "Área", "Responsable", "Sanit. C/NC", "Lavam. C/NC", "Llaves C/NC", "Obs."]];
    const bodySan = inspSan.map((x: any) => [
      s(x.fecha),
      s(x.semana),
      areasSanMap[x.area_id] || `Área ${x.area_id}`,
      s(x.responsable),
      `${x.sanitarios_c ?? 0}/${x.sanitarios_nc ?? 0}`,
      `${x.lavamanos_c ?? 0}/${x.lavamanos_nc ?? 0}`,
      `${x.llaves_c ?? 0}/${x.llaves_nc ?? 0}`,
      s(x.observacion).substring(0, 35),
    ]);
    y = tabla(doc, y, hdrsSan, bodySan, [22, 16, 28, 28, 20, 20, 20, 40]);
    y += 4;
  } else {
    doc.setFontSize(9); tc(doc, GT);
    doc.text("Sin registros.", 14, y + 6);
    y += 14;
  }

  // Energía inspecciones
  if (y > PH - 70) { doc.addPage(); header(doc, logo, "INSPECCIONES SGA", anio); y = 50; }

  const areasEnergiaMap: Record<number, string> = {};
  norm(resAreasEnergia).forEach((a: any) => { areasEnergiaMap[a.id] = a.nombre; });
  const inspEne = norm(resInspEnergia).filter((x: any) => new Date(x.fecha).getFullYear() === anio);

  y = seccion(doc, y, `Inspecciones de Energía (${inspEne.length} registros)`);
  y += 2;
  if (inspEne.length > 0) {
    const hdrsEne = [["Fecha", "Área", "Responsable", "Bombillas C/NC", "Reflect. C/NC", "Lámparas C/NC", "Aires C/NC", "Obs."]];
    const bodyEne = inspEne.map((x: any) => [
      s(x.fecha),
      areasEnergiaMap[x.area_id] || `Área ${x.area_id}`,
      s(x.responsable),
      `${x.bombillas_c ?? 0}/${x.bombillas_nc ?? 0}`,
      `${x.reflectores_c ?? 0}/${x.reflectores_nc ?? 0}`,
      `${x.lamparas_c ?? 0}/${x.lamparas_nc ?? 0}`,
      `${x.aires_c ?? 0}/${x.aires_nc ?? 0}`,
      s(x.observacion).substring(0, 35),
    ]);
    y = tabla(doc, y, hdrsEne, bodyEne, [22, 28, 28, 22, 20, 22, 18, 40]);
  } else {
    doc.setFontSize(9); tc(doc, GT);
    doc.text("Sin registros.", 14, y + 6);
  }

  /* ──────────────────────────────────────────
     PÁGINA 6 – RESMAS & TONNERS
  ────────────────────────────────────────── */
  doc.addPage();
  header(doc, logo, "RESMAS Y TONNERS", anio);
  y = 50;

  // Resmas
  const areasResmasMap: Record<number, string> = {};
  norm(resAreasResmas).forEach((a: any) => { areasResmasMap[a.id] = a.nombre; });
  const resmasAnio = norm(resResmas).filter((x: any) => Number(x.anio) === anio);

  y = seccion(doc, y, `Consumo de Resmas (${resmasAnio.length} registros)`);
  y += 2;
  if (resmasAnio.length > 0) {
    const hdrsR = [["Área", "Mes", "Año", "Cantidad", "Observación"]];
    const bodyR = resmasAnio.map((x: any) => [
      areasResmasMap[x.area_id] || `Área ${x.area_id}`,
      MESES[Number(x.mes) - 1] ?? s(x.mes),
      s(x.anio),
      s(x.cantidad),
      s(x.observacion).substring(0, 50),
    ]);
    y = tabla(doc, y, hdrsR, bodyR, [50, 28, 20, 22, 80]);
    y += 6;
  } else {
    doc.setFontSize(9); tc(doc, GT);
    doc.text("Sin registros.", 14, y + 6);
    y += 16;
  }

  if (y > PH - 60) { doc.addPage(); header(doc, logo, "RESMAS Y TONNERS", anio); y = 50; }

  // Tonners
  const areaTonnersMap: Record<number, string> = {};
  norm(resAreasTonners).forEach((a: any) => { areaTonnersMap[a.id] = a.nombre; });
  const tonnersAnio = norm(resTonners).filter((x: any) => new Date(x.fecha).getFullYear() === anio);

  y = seccion(doc, y, `Uso de Tonners (${tonnersAnio.length} registros)`);
  y += 2;
  if (tonnersAnio.length > 0) {
    const hdrsT = [["Fecha", "Área", "Tipo", "Marca", "Cantidad", "Observación"]];
    const bodyT = tonnersAnio.map((x: any) => [
      s(x.fecha),
      areaTonnersMap[x.area_id] || `Área ${x.area_id}`,
      s(x.tipo),
      s(x.marca),
      s(x.cantidad),
      s(x.observacion).substring(0, 50),
    ]);
    y = tabla(doc, y, hdrsT, bodyT, [24, 40, 24, 28, 18, 70]);
  } else {
    doc.setFontSize(9); tc(doc, GT);
    doc.text("Sin registros.", 14, y + 6);
  }

  /* ──────────────────────────────────────────
     FOOTERS en todas las páginas
  ────────────────────────────────────────── */
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    footer(doc, p, totalPages);
  }

  /* ──────────────────────────────────────────
     GUARDAR
  ────────────────────────────────────────── */
  doc.save(`Reporte_SGA_${anio}.pdf`);
}
