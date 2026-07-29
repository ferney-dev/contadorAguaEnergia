"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import MovilReciclaje from "./modalReciclaje";
import ModalAreas from "./modalAreas";
import { STORAGE_RESPONSABLE } from "./constants";
import { getThemeClasses, normalizarFecha } from "./utils";

interface Props {
  modoNoche?: boolean;
  dataBackend: any[];
}

const MESES_LABEL: Record<string, string> = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo",  "06": "Junio",   "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

const CAMPOS_RESUMEN = [
  { label: "Reciclables", db: "reciclables", emoji: "♻️",  colorC: "bg-green-100 text-green-700", colorNC: "bg-red-100 text-red-700" },
  { label: "Ordinarios",  db: "ordinarios",  emoji: "🗑️",  colorC: "bg-green-100 text-green-700", colorNC: "bg-red-100 text-red-700" },
  { label: "Peligrosos",  db: "peligrosos",  emoji: "⚠️",  colorC: "bg-green-100 text-green-700", colorNC: "bg-red-100 text-red-700" },
  { label: "Precintos",   db: "presintos",   emoji: "🔒",  colorC: "bg-green-100 text-green-700", colorNC: "bg-red-100 text-red-700" },
];

export default function TablaReciclaje({ modoNoche = false, dataBackend: dataInicial }: Props) {
  const [dataBackend, setDataBackend]   = useState<any[]>(Array.isArray(dataInicial) ? dataInicial : []);
  const [inspecciones, setInspecciones] = useState<any[]>([]);
  const [mostrarModal,      setMostrarModal]      = useState(false);
  const [mostrarModalAreas, setMostrarModalAreas] = useState(false);
  const [responsable,  setResponsable]  = useState("");
  const [mesFiltro,    setMesFiltro]    = useState(() => String(new Date().getMonth() + 1).padStart(2, "0"));
  const [anioFiltro,   setAnioFiltro]   = useState(() => String(new Date().getFullYear()));

  const estilos = getThemeClasses(modoNoche);

  /* ── carga inicial ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const guardado = localStorage.getItem(STORAGE_RESPONSABLE);
    if (guardado) setResponsable(guardado);

    const init = async () => {
      try {
        const [areasRes, insRes] = await Promise.all([
          fetch("/api/areas"),
          fetch("/api/inspecciones-residuos"),
        ]);
        const areas = await areasRes.json();
        const ins   = await insRes.json();
        const areasList: any[] = Array.isArray(areas) ? areas : [];
        // enriquecer inspecciones con nombre_area
        const insList: any[] = (Array.isArray(ins) ? ins : []).map((r: any) => ({
          ...r,
          area_nombre: areasList.find((a) => a.id === r.area_id)?.nombre || `Área #${r.area_id}`,
        }));
        setDataBackend(areasList);
        setInspecciones(insList);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  /* ── años disponibles ── */
  const aniosDisponibles = useMemo(() => {
    const set = new Set<string>();
    inspecciones.forEach((i) => {
      if (i.fecha) set.add(String(new Date(i.fecha.split("T")[0] + "T12:00:00").getFullYear()));
    });
    set.add(String(new Date().getFullYear()));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [inspecciones]);

  /* ── filtrado por mes/año ── */
  const inspeccionesMes = useMemo(() => {
    return inspecciones.filter((r) => {
      if (!r.fecha) return false;
      const d = new Date(r.fecha.split("T")[0] + "T12:00:00");
      const mes  = String(d.getMonth() + 1).padStart(2, "0");
      const anio = String(d.getFullYear());
      return mes === mesFiltro && anio === anioFiltro;
    });
  }, [inspecciones, mesFiltro, anioFiltro]);

  /* ── agrupar por fecha ── */
  const grupos = useMemo(() => {
    const map: Record<string, any[]> = {};
    inspeccionesMes.forEach((r) => {
      const fecha = normalizarFecha(r.fecha);
      if (!map[fecha]) map[fecha] = [];
      map[fecha].push(r);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [inspeccionesMes]);

  /* ── totales del mes ── */
  const totalesMes = useMemo(() => {
    let cumple = 0, noCumple = 0;
    inspeccionesMes.forEach((r) => {
      cumple   += Number(r.reciclables_c||0)+Number(r.ordinarios_c||0)+Number(r.peligrosos_c||0)+Number(r.presintos_c||0);
      noCumple += Number(r.reciclables_nc||0)+Number(r.ordinarios_nc||0)+Number(r.peligrosos_nc||0)+Number(r.presintos_nc||0);
    });
    return { cumple, noCumple, total: cumple + noCumple };
  }, [inspeccionesMes]);

  /* ── eliminar grupo ── */
  const eliminarGrupo = async (fecha: string, resp: string) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar inspección?",
      text: `Fecha: ${fecha} · Responsable: ${resp}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      await fetch("/api/inspecciones-residuos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responsable: resp, fecha }),
      });
      const res  = await fetch("/api/inspecciones-residuos");
      const data = await res.json();
      setInspecciones(Array.isArray(data) ? data : []);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar" });
    }
  };

  /* ── colores modo ── */
  const bg    = modoNoche ? "bg-[#111]"       : "bg-[#f4f6fa]";
  const card  = modoNoche ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-white border-gray-200";
  const txt   = modoNoche ? "text-white"      : "text-gray-800";
  const sub   = modoNoche ? "text-gray-400"   : "text-gray-500";
  const inp   = modoNoche ? "bg-[#222] border-[#3a3a3a] text-white" : "bg-white border-gray-300 text-gray-800";
  const chip  = modoNoche ? "bg-[#252525] text-gray-300 border-[#333]" : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className={`w-full min-h-screen p-4 md:p-6 ${bg}`}>
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${txt}`}>
              ♻️ Gestión de Residuos
            </h1>
            <p className={`text-sm mt-0.5 ${sub}`}>
              Inspecciones semanales · {MESES_LABEL[mesFiltro]} {anioFiltro}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMostrarModalAreas(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition
                hover:scale-105 active:scale-95
                ${modoNoche
                  ? "bg-[#1e1e1e] border-[#3a3a3a] text-gray-200 hover:bg-[#2a2a2a]"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
            >
              🗺️ Áreas
            </button>
            <button
              onClick={() => setMostrarModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C40000] hover:bg-red-700
                text-white font-semibold text-sm shadow-lg hover:shadow-red-500/30 transition hover:scale-105 active:scale-95"
            >
              <span className="text-base">+</span> Nueva inspección
            </button>
          </div>
        </div>

        {/* ══ FILTROS ══════════════════════════════════════════ */}
        <div className={`rounded-2xl border p-4 flex flex-wrap gap-3 items-center ${card}`}>
          {/* Año */}
          <select
            value={anioFiltro}
            onChange={(e) => setAnioFiltro(e.target.value)}
            className={`rounded-xl px-3 py-2 text-sm border outline-none ${inp}`}
          >
            {aniosDisponibles.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Meses como chips */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(MESES_LABEL).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setMesFiltro(val)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                  ${mesFiltro === val
                    ? "bg-[#C40000] text-white border-[#C40000] shadow-md"
                    : `${chip} hover:border-[#C40000] hover:text-[#C40000]`
                  }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* ══ TARJETAS RESUMEN DEL MES ═══════════════════════ */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "✔ Cumplen",    valor: totalesMes.cumple,   bg: "bg-green-500", light: "bg-green-50 text-green-700 border-green-200" },
            { label: "✖ No cumplen", valor: totalesMes.noCumple, bg: "bg-red-500",   light: "bg-red-50 text-red-700 border-red-200" },
            { label: "Σ Total",      valor: totalesMes.total,    bg: "bg-blue-500",  light: "bg-blue-50 text-blue-700 border-blue-200" },
          ].map((c, i) => (
            <div key={i} className={`rounded-2xl border p-4 text-center shadow-sm ${modoNoche ? card : c.light}`}>
              <p className={`text-xs font-semibold mb-1 ${modoNoche ? sub : ""}`}>{c.label}</p>
              <p className={`text-3xl font-black ${modoNoche ? txt : ""}`}>{c.valor}</p>
              <div className={`mt-2 h-1 rounded-full ${c.bg} opacity-60 mx-auto w-10`} />
            </div>
          ))}
        </div>

        {/* ══ LISTA DE INSPECCIONES ════════════════════════════ */}
        {grupos.length === 0 ? (
          <div className={`rounded-2xl border p-10 text-center ${card}`}>
            <p className="text-4xl mb-3">📋</p>
            <p className={`font-semibold ${txt}`}>Sin inspecciones en {MESES_LABEL[mesFiltro]} {anioFiltro}</p>
            <p className={`text-sm mt-1 ${sub}`}>Pulsa "+ Nueva inspección" para registrar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grupos.map(([fecha, registros]) => (
              <TarjetaInspeccion
                key={fecha}
                fecha={fecha}
                registros={registros}
                modoNoche={modoNoche}
                card={card}
                txt={txt}
                sub={sub}
                onEliminar={eliminarGrupo}
              />
            ))}
          </div>
        )}

      </div>

      {/* ══ MODAL NUEVA INSPECCIÓN ══════════════════════════ */}
      <MovilReciclaje
        modoNoche={modoNoche}
        dataBackend={dataBackend}
        setInspecciones={(data) => {
          // enriquecer con nombre_area
          const lista = typeof data === "function" ? data(inspecciones) : data;
          const enriquecida = lista.map((r: any) => ({
            ...r,
            area_nombre: dataBackend.find((a) => a.id === r.area_id)?.nombre || `Área #${r.area_id}`,
          }));
          setInspecciones(enriquecida);
        }}
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />

      {/* ══ MODAL ÁREAS ══════════════════════════════════════ */}
      <ModalAreas
        mostrar={mostrarModalAreas}
        setMostrar={setMostrarModalAreas}
        modoNoche={modoNoche}
        areas={dataBackend}
        setAreas={setDataBackend}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TARJETA DE UNA INSPECCIÓN (fecha)
══════════════════════════════════════════════════════════ */
function TarjetaInspeccion({
  fecha, registros, modoNoche, card, txt, sub, onEliminar,
}: {
  fecha: string;
  registros: any[];
  modoNoche: boolean;
  card: string;
  txt: string;
  sub: string;
  onEliminar: (fecha: string, resp: string) => void;
}) {
  const [abierta, setAbierta] = useState(false);

  /* totales de esta fecha */
  let totalC = 0, totalNC = 0;
  registros.forEach((r) => {
    totalC  += Number(r.reciclables_c||0)+Number(r.ordinarios_c||0)+Number(r.peligrosos_c||0)+Number(r.presintos_c||0);
    totalNC += Number(r.reciclables_nc||0)+Number(r.ordinarios_nc||0)+Number(r.peligrosos_nc||0)+Number(r.presintos_nc||0);
  });
  const porcentaje = totalC + totalNC > 0 ? Math.round((totalC / (totalC + totalNC)) * 100) : 0;

  const responsable = registros[0]?.responsable || "Sin responsable";
  const fechaFmt = new Date(fecha + "T12:00:00").toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const barColor = porcentaje >= 80 ? "bg-green-500" : porcentaje >= 50 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${card}`}>

      {/* ── cabecera de la tarjeta ── */}
      <button
        onClick={() => setAbierta(!abierta)}
        className="w-full text-left p-4 flex items-start gap-4"
      >
        {/* icono */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl
          ${modoNoche ? "bg-[#2a2a2a]" : "bg-[#fff3f3]"}`}>
          ♻️
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-base capitalize ${txt}`}>{fechaFmt}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
              ${modoNoche ? "bg-[#252525] border-[#333] text-gray-300" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
              {registros.length} área{registros.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${sub}`}>👤 {responsable}</p>

          {/* barra de cumplimiento */}
          <div className="mt-2 flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${modoNoche ? "bg-[#2a2a2a]" : "bg-gray-100"}`}>
              <div
                className={`h-2 rounded-full transition-all ${barColor}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${porcentaje >= 80 ? "text-green-500" : porcentaje >= 50 ? "text-yellow-500" : "text-red-500"}`}>
              {porcentaje}%
            </span>
          </div>

          {/* chips rápidos */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">
              ✔ {totalC} cumplen
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-semibold">
              ✖ {totalNC} no cumplen
            </span>
          </div>
        </div>

        {/* flecha */}
        <span className={`text-lg transition-transform duration-200 ${abierta ? "rotate-180" : ""} ${sub}`}>⌄</span>
      </button>

      {/* ── detalle expandible ── */}
      {abierta && (
        <div className={`border-t px-4 pb-4 pt-3 space-y-4 ${modoNoche ? "border-[#2a2a2a]" : "border-gray-100"}`}>

          {/* resumen por categoría */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CAMPOS_RESUMEN.map((c) => {
              let cSum = 0, ncSum = 0;
              registros.forEach((r) => {
                cSum  += Number(r[`${c.db}_c`] ||0);
                ncSum += Number(r[`${c.db}_nc`]||0);
              });
              return (
                <div key={c.db} className={`rounded-xl p-3 border text-center ${modoNoche ? "bg-[#222] border-[#333]" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-lg mb-1">{c.emoji}</p>
                  <p className={`text-xs font-semibold mb-2 ${modoNoche ? "text-gray-300" : "text-gray-700"}`}>{c.label}</p>
                  <div className="flex gap-1 justify-center">
                    <span className="text-xs px-1.5 py-0.5 rounded-lg bg-green-100 text-green-700 font-bold">✔{cSum}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-lg bg-red-100 text-red-700 font-bold">✖{ncSum}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* filas por área */}
          <div className="space-y-2">
            <p className={`text-xs font-bold uppercase tracking-wider ${sub}`}>Áreas inspeccionadas</p>
            {registros.map((r, idx) => (
              <FilaArea key={idx} registro={r} modoNoche={modoNoche} />
            ))}
          </div>

          {/* botón eliminar */}
          <button
            onClick={() => onEliminar(fecha, responsable)}
            className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold
              transition shadow-sm hover:shadow-red-400/30 active:scale-95"
          >
            🗑️ Eliminar esta inspección
          </button>
        </div>
      )}
    </div>
  );
}

/* ── fila de un área dentro del detalle ── */
function FilaArea({ registro, modoNoche }: { registro: any; modoNoche: boolean }) {
  const nombre = registro.area_nombre || registro.nombre_area || `Área #${registro.area_id}`;
  const totalC  = Number(registro.reciclables_c||0)+Number(registro.ordinarios_c||0)+Number(registro.peligrosos_c||0)+Number(registro.presintos_c||0);
  const totalNC = Number(registro.reciclables_nc||0)+Number(registro.ordinarios_nc||0)+Number(registro.peligrosos_nc||0)+Number(registro.presintos_nc||0);

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border
      ${modoNoche ? "bg-[#1e1e1e] border-[#2e2e2e]" : "bg-white border-gray-200"}`}>
      <span className={`text-sm font-medium ${modoNoche ? "text-gray-200" : "text-gray-700"}`}>
        📍 {nombre}
      </span>
      <div className="flex gap-2">
        <span className="text-xs px-2 py-0.5 rounded-lg bg-green-100 text-green-700 font-bold border border-green-200">✔ {totalC}</span>
        <span className="text-xs px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-bold border border-red-200">✖ {totalNC}</span>
      </div>
    </div>
  );
}
