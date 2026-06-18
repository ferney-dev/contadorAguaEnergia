"use client";

import { useState, useEffect } from "react";
import { MESES, COLORES, COLORES_MESES } from "../components/dashboard/constants";
import { calcularConsumoMensual, totalAnual, promedioDiario, obtenerColorAguaPorRango, obtenerColorEnergiaPorRango, getThemeClasses } from "../components/dashboard/utils";

export function useDashboard(modoNoche: boolean) {
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [lecturasAgua, setLecturasAgua] = useState({});
  const [lecturasEnergia, setLecturasEnergia] = useState({});
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);
  const [metaAgua, setMetaAgua] = useState(0);
  const [metaEnergia, setMetaEnergia] = useState(0);
  const [metaMensualAgua, setMetaMensualAgua] = useState(0);
  const [metaMensualEnergia, setMetaMensualEnergia] = useState(0);
  const [metasAguaMensual, setMetasAguaMensual] = useState<number[]>(Array(12).fill(0));
  const [metasEnergiaMensual, setMetasEnergiaMensual] = useState<number[]>(Array(12).fill(0));
  const [comparativoEnergia, setComparativoEnergia] = useState<number[]>(Array(12).fill(0));
  const [comparativoAgua, setComparativoAgua] = useState<number[]>(Array(12).fill(0));
  const [resmasMensual, setResmasMensual] = useState<number[]>(Array(12).fill(0));
  const [tonnerMensual, setTonnerMensual] = useState<number[]>(Array(12).fill(0));
  const [valoresAgua, setValoresAgua] = useState<number[]>(Array(12).fill(0));
  const [valoresEnergia, setValoresEnergia] = useState<number[]>(Array(12).fill(0));

  const consumoEnergiaMensual = calcularConsumoMensual(lecturasEnergia);
  const totalEnergiaAnual = totalAnual(lecturasEnergia);
  const promedioEnergiaReal = promedioDiario(lecturasEnergia);
  const consumoAguaMensual = calcularConsumoMensual(lecturasAgua);
  const totalAguaAnual = totalAnual(lecturasAgua);
  const promedioAguaReal = promedioDiario(lecturasAgua);
  const totalResmas = resmasMensual.reduce((a, b) => a + b, 0);
  const totalTonner = tonnerMensual.reduce((a, b) => a + b, 0);
  const anioActual = new Date().getFullYear();
  const totalAguaComparativo = comparativoAgua.reduce((a, b) => a + b, 0);
  const totalEnergiaComparativo = comparativoEnergia.reduce((a, b) => a + b, 0);

  const { cardBg, cardBorder, textColor, textSoft, fondo } = getThemeClasses(modoNoche);

  const opcionesArea = {
    responsive: true,
    plugins: {
      legend: { labels: { color: textColor } },
      tooltip: {
        backgroundColor: modoNoche ? "#1e1e1e" : "#ffffff",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: modoNoche ? "#3a3a3a" : "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: textSoft }, grid: { display: false } },
      y: { ticks: { color: textSoft }, grid: { color: modoNoche ? "#2a2a2a" : "#e5e7eb" } },
    }
  };

  const opcionesBarras = {
    responsive: true,
    plugins: {
      legend: { labels: { color: textColor } },
      tooltip: {
        backgroundColor: modoNoche ? "#1e1e1e" : "#ffffff",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: modoNoche ? "#3a3a3a" : "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: textSoft }, grid: { display: false } },
      y: { ticks: { color: textSoft }, grid: { color: modoNoche ? "#2a2a2a" : "#e5e7eb" } },
    },
  };

  const dataAgua = {
    labels: MESES,
    datasets: [
      {
        label: "Consumo Agua (L)",
        data: consumoAguaMensual,
        backgroundColor: consumoAguaMensual.map((valor) => obtenerColorAguaPorRango(valor)),
        borderRadius: 10,
      },
    ],
  };

  const dataEnergia = {
    labels: MESES,
    datasets: [
      {
        label: "Consumo Energía (kWh)",
        data: consumoEnergiaMensual,
        backgroundColor: consumoEnergiaMensual.map((valor) => obtenerColorEnergiaPorRango(valor)),
        borderRadius: 10,
      },
    ],
  };

  const dataAreaAgua = {
    labels: MESES,
    datasets: [
      {
        label: "Consumo Agua (L)",
        data: consumoAguaMensual,
        borderColor: COLORES.agua,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          const ultimoValor = consumoAguaMensual.findLast(v => v > 0) || 0;
          let color = obtenerColorAguaPorRango(ultimoValor);
          gradient.addColorStop(0, color + "80");
          gradient.addColorStop(1, color + "05");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: consumoAguaMensual.map((v) => obtenerColorAguaPorRango(v)),
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Meta Agua",
        data: metasAguaMensual,
        borderColor: "#64748b",
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 3,
        pointBackgroundColor: "#64748b",
        fill: false,
      },
    ],
  };

  const dataAreaEnergia = {
    labels: MESES,
    datasets: [
      {
        label: "Consumo Energía (kWh)",
        data: consumoEnergiaMensual,
        borderColor: COLORES.energia,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          const ultimoValor = consumoEnergiaMensual.findLast(v => v > 0) || 0;
          let color = obtenerColorEnergiaPorRango(ultimoValor);
          gradient.addColorStop(0, color + "80");
          gradient.addColorStop(1, color + "05");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: consumoEnergiaMensual.map((v) => obtenerColorEnergiaPorRango(v)),
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Meta Energía",
        data: metasEnergiaMensual,
        borderColor: "#64748b",
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 3,
        pointBackgroundColor: "#64748b",
        fill: false,
      },
    ],
  };

  const dataResmas = {
    labels: MESES,
    datasets: [
      {
        label: "Consumo de papel (resmas)",
        data: resmasMensual,
        borderColor: "#22c55e",
        borderWidth: 3,
        fill: true,
        tension: 0.5,
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return;
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(34,197,94,0.6)");
          gradient.addColorStop(1, "rgba(34,197,94,0.05)");
          return gradient;
        },
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        segment: {
          borderColor: (ctx: any) => {
            return ctx.p0.parsed.y > ctx.p1.parsed.y ? "#16a34a" : "#22c55e";
          }
        }
      },
    ],
  };

  const dataTonner = {
    labels: MESES,
    datasets: [
      {
        label: "Uso de tonner",
        data: tonnerMensual,
        borderRadius: 12,
        borderSkipped: false,
        backgroundColor: tonnerMensual.map((v) => {
          if (v <= 10) return "#3b82f6";
          if (v <= 20) return "#22c55e";
          if (v <= 30) return "#facc15";
          return "#ef4444";
        }),
        borderColor: "#1d4ed8",
        borderWidth: 2,
        hoverBackgroundColor: "#60a5fa",
      },
    ],
  };

  const dataDiferenciaAguaMensual = {
    labels: MESES,
    datasets: [
      {
        label: "Meta mensual",
        data: metasAguaMensual,
        backgroundColor: modoNoche ? "#334155" : "#e5e7eb",
        borderRadius: 6,
        barThickness: 14,
      },
      {
        label: "Consumo real",
        data: consumoAguaMensual,
        backgroundColor: consumoAguaMensual.map((v) => obtenerColorAguaPorRango(v)),
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  const dataDiferenciaEnergiaMensual = {
    labels: MESES,
    datasets: [
      {
        label: "Meta mensual (kWh)",
        data: metasEnergiaMensual,
        backgroundColor: modoNoche ? "#334155" : "#e5e7eb",
        borderRadius: 6,
        barThickness: 14,
      },
      {
        label: "Consumo real (kWh)",
        data: consumoEnergiaMensual,
        backgroundColor: consumoEnergiaMensual.map((v) => obtenerColorEnergiaPorRango(v)),
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  useEffect(() => {
    const cargarComparativoEnergia = async () => {
      try {
        const res = await fetch("/api/comparativoEnergia/");
        const data = await res.json();
        const mesesEnergia = new Array(12).fill(0);
        const valoresEnergiaTemp = new Array(12).fill(0);
        const lista = Array.isArray(data) ? data : data?.data ?? [];
        lista.forEach((item: any) => {
          if (Number(item.anio) === Number(anio)) {
            const mesIndex = Number(item.mes) - 1;
            if (mesIndex >= 0 && mesIndex < 12) {
              mesesEnergia[mesIndex] += Number(item.kw_consumidos || 0);
              valoresEnergiaTemp[mesIndex] += Number(item.valor_consumo_energia || 0);
            }
          }
        });
        setComparativoEnergia(mesesEnergia);
        setValoresEnergia(valoresEnergiaTemp);
      } catch (error) {
        console.error("Error cargando comparativo energia", error);
      }
    };
    cargarComparativoEnergia();
  }, [anio]);

  useEffect(() => {
    const cargarComparativoAgua = async () => {
      try {
        const res = await fetch("/api/comparativoAgua/");
        const data = await res.json();
        const mesesAgua = new Array(12).fill(0);
        const valoresAguaTemp = new Array(12).fill(0);
        const lista = Array.isArray(data) ? data : data?.data ?? [];
        lista.forEach((item: any) => {
          if (Number(item.anio) === Number(anio)) {
            const mesIndex = Number(item.mes) - 1;
            if (mesIndex >= 0 && mesIndex < 12) {
              mesesAgua[mesIndex] += Number(item.m3_consumidos || 0);
              valoresAguaTemp[mesIndex] += Number(item.valor_consumo_agua || 0);
            }
          }
        });
        setComparativoAgua(mesesAgua);
        setValoresAgua(valoresAguaTemp);
      } catch (error) {
        console.error("Error cargando comparativo agua", error);
      }
    };
    cargarComparativoAgua();
  }, [anio]);

  useEffect(() => {
    const cargarEnergia = async () => {
      try {
        const res = await fetch("/api/energia", { cache: "no-store" });
        const data = await res.json();
        const estructurado: any = {};
        const aniosSet = new Set<number>();
        const lista = Array.isArray(data) ? data : data?.data ?? [];
        lista.forEach((item: any) => {
          const fecha = new Date(item.fecha + "T00:00:00");
          const year = fecha.getFullYear();
          aniosSet.add(year);
          if (year !== anio) return;
          const mes = fecha.getMonth();
          const dia = fecha.getDate();
          if (!estructurado[mes]) estructurado[mes] = {};
          estructurado[mes][dia] = {
            total2: item.total_bodega1,
            total4: item.total_bodega2,
          };
        });
        setLecturasEnergia(estructurado);
        setAniosDisponibles((prev) =>
          Array.from(new Set([...prev, ...Array.from(aniosSet)])).sort()
        );
      } catch (error) {
        console.error("Error cargando energía", error);
      }
    };
    cargarEnergia();
  }, [anio]);

  useEffect(() => {
    const cargarMetasMensuales = async () => {
      const agua: number[] = [];
      const energia: number[] = [];
      const fetchMeta = async (url: string): Promise<number> => {
        try {
          const res = await fetch(url, { cache: "no-store" });
          const text = await res.text();
          if (!text || !text.trim()) return 0;
          const data = JSON.parse(text);
          return Number(data?.meta ?? 0);
        } catch {
          return 0;
        }
      };
      const [aguaResults, energiaResults] = await Promise.all([
        Promise.all(
          Array.from({ length: 12 }, (_, i) =>
            fetchMeta(`/api/metas?tipo=agua&anio=${anio}&mes=${i + 1}`)
          )
        ),
        Promise.all(
          Array.from({ length: 12 }, (_, i) =>
            fetchMeta(`/api/metas?tipo=energia&anio=${anio}&mes=${i + 1}`)
          )
        ),
      ]);
      setMetasAguaMensual(aguaResults);
      setMetasEnergiaMensual(energiaResults);
      const mesActual = new Date().getMonth();
      setMetaAgua(aguaResults[mesActual] ?? 0);
      setMetaEnergia(energiaResults[mesActual] ?? 0);
    };
    cargarMetasMensuales();
  }, [anio]);

  useEffect(() => {
    const cargarAgua = async () => {
      try {
        const res = await fetch("/api/agua", { cache: "no-store" });
        const data = await res.json();
        const estructurado: any = {};
        const aniosSet = new Set<number>();
        const lista = Array.isArray(data) ? data : data?.data ?? [];
        lista.forEach((item: any) => {
          const fecha = new Date(item.fecha + "T00:00:00");
          const year = fecha.getFullYear();
          aniosSet.add(year);
          if (year !== anio) return;
          const mes = fecha.getMonth();
          const dia = fecha.getDate();
          if (!estructurado[mes]) estructurado[mes] = {};
          estructurado[mes][dia] = {
            total2: item.total_bodega1,
            total4: item.total_bodega2,
          };
        });
        setAniosDisponibles((prev) =>
          Array.from(new Set([...prev, ...Array.from(aniosSet)])).sort()
        );
        setLecturasAgua(estructurado);
      } catch (error) {
        console.error("Error cargando agua", error);
      }
    };
    cargarAgua();
  }, [anio]);

  useEffect(() => {
    const cargarResmas = async () => {
      try {
        const res = await fetch("/api/resmas");
        const data = await res.json();
        const meses = Array(12).fill(0);
        const lista = Array.isArray(data) ? data : data?.data ?? [];
        lista.forEach((item: any) => {
          if (Number(item.anio) === Number(anio)) {
            const mesIndex = Number(item.mes) - 1;
            meses[mesIndex] += Number(item.cantidad || 0);
          }
        });
        setResmasMensual(meses);
      } catch (error) {
        console.error("Error resmas", error);
      }
    };

    const cargarTonner = async () => {
      try {
        const res = await fetch("/api/tonners");
        const data = await res.json();
        const meses = Array(12).fill(0);
        const lista = Array.isArray(data) ? data : data?.data ?? [];
        lista.forEach((item: any) => {
          const fecha = new Date(item.fecha);
          if (fecha.getFullYear() === anio) {
            const mesIndex = fecha.getMonth();
            meses[mesIndex] += Number(item.cantidad || 0);
          }
        });
        setTonnerMensual(meses);
      } catch (error) {
        console.error("Error tonner", error);
      }
    };

    cargarResmas();
    cargarTonner();
  }, [anio]);

  return {
    anio,
    setAnio,
    anioActual,
    meses: MESES,
    consumoAguaMensual,
    consumoEnergiaMensual,
    totalAguaAnual,
    totalEnergiaAnual,
    promedioAguaReal,
    promedioEnergiaReal,
    metaAgua,
    metaEnergia,
    metasAguaMensual,
    metasEnergiaMensual,
    comparativoAgua,
    comparativoEnergia,
    resmasMensual,
    tonnerMensual,
    totalResmas,
    totalTonner,
    valoresAgua,
    valoresEnergia,
    totalAguaComparativo,
    totalEnergiaComparativo,
    cardBg,
    cardBorder,
    textColor,
    textSoft,
    fondo,
    opcionesArea,
    opcionesBarras,
    dataAgua,
    dataEnergia,
    dataAreaAgua,
    dataAreaEnergia,
    dataResmas,
    dataTonner,
    dataDiferenciaAguaMensual,
    dataDiferenciaEnergiaMensual,
    coloresMeses: COLORES_MESES,
  };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
