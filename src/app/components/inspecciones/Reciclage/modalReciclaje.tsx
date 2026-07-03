"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Recycle, Trash2, AlertTriangle, Lock, User, MapPin, Calendar, X, ChevronDown } from "lucide-react";

type ValoresType = {
  [campo: number]: { c?: string; nc?: string };
};

interface Props {
  dataBackend: any[];
  setInspecciones: React.Dispatch<React.SetStateAction<any[]>>;
  mostrarModal: boolean;
  setMostrarModal: React.Dispatch<React.SetStateAction<boolean>>;
  modoNoche: boolean;
}

const CAMPOS = [
  { key: 1, label: "Reciclables",  icon: <Recycle       className="w-4 h-4 text-green-500"  />, color: "green"  },
  { key: 2, label: "Ordinarios",   icon: <Trash2        className="w-4 h-4 text-gray-400"   />, color: "gray"   },
  { key: 3, label: "Peligrosos",   icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />, color: "yellow" },
  { key: 4, label: "Precintos",    icon: <Lock          className="w-4 h-4 text-blue-500"   />, color: "blue"   },
];

export default function MovilReciclaje({ dataBackend = [], setInspecciones, mostrarModal, setMostrarModal, modoNoche }: Props) {
  const [responsable,        setResponsable]        = useState(() => localStorage.getItem("responsable") || "");
  const [areaId,             setAreaId]             = useState("");
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<number[]>([]);
  const [valores,            setValores]            = useState<ValoresType>({});
  const [observacion,        setObservacion]        = useState("");
  const [guardando,          setGuardando]          = useState(false);
  const [busquedaArea,       setBusquedaArea]       = useState("");
  const [mostrarLista,       setMostrarLista]       = useState(false);
  const [fechaSeleccionada,  setFechaSeleccionada]  = useState(() => new Date().toISOString().split("T")[0]);

  const areasFiltradas = dataBackend.filter((a: any) =>
    a.nombre.toLowerCase().includes(busquedaArea.toLowerCase())
  );

  useEffect(() => { localStorage.setItem("responsable", responsable); }, [responsable]);

  const handleChange = (campo: number, tipo: "c" | "nc", value: string) => {
    const limpio = value.replace(/\D/g, "");
    setValores((prev) => ({ ...prev, [campo]: { ...prev[campo], [tipo]: limpio } }));
  };

  const guardar = async () => {
    if (!areaId || !responsable || !fechaSeleccionada) {
      Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Faltan datos", timer: 1200, showConfirmButton: false });
      return;
    }
    const yaExiste = await fetch("/api/inspecciones-residuos")
      .then(r => r.json())
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        return lista.some((item: any) =>
          item.area_id === Number(areaId) &&
          item.responsable === responsable &&
          item.fecha.split("T")[0] === fechaSeleccionada
        );
      });
    if (yaExiste) {
      Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "⚠️ Ya existe inspección para esta fecha", timer: 1500, showConfirmButton: false });
      return;
    }
    if (guardando) return;
    setGuardando(true);
    try {
      await fetch("/api/inspecciones-residuos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fechaSeleccionada, responsable, area_id: Number(areaId),
          reciclables_c: Number(valores?.[1]?.c || 0), reciclables_nc: Number(valores?.[1]?.nc || 0),
          ordinarios_c:  Number(valores?.[2]?.c || 0), ordinarios_nc:  Number(valores?.[2]?.nc || 0),
          peligrosos_c:  Number(valores?.[3]?.c || 0), peligrosos_nc:  Number(valores?.[3]?.nc || 0),
          presintos_c:   Number(valores?.[4]?.c || 0), presintos_nc:   Number(valores?.[4]?.nc || 0),
          observacion,
        }),
      });
      const data = await fetch("/api/inspecciones-residuos").then(r => r.json());
      setInspecciones(Array.isArray(data) ? data : []);
      setValores({}); setObservacion(""); setAreaId(""); setBusquedaArea(""); setAreasSeleccionadas([]);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Guardado correctamente", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error al guardar" });
    } finally {
      setGuardando(false);
    }
  };

  if (!mostrarModal) return null;

  // ── Paleta de estilos según modo ──────────────────────────────────────────
  const shell    = modoNoche ? "bg-[#161616] border border-white/10 shadow-2xl" : "bg-white border border-gray-200 shadow-2xl";
  const inputRow = modoNoche ? "bg-[#1f1f1f] border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 shadow-sm";
  const cardBg   = modoNoche ? "bg-[#1f1f1f] border-white/10" : "bg-white border-gray-200 shadow-md";
  const cardLbl  = modoNoche ? "text-gray-300" : "text-gray-700";
  const secLabel = modoNoche ? "text-gray-500" : "text-gray-400";
  const sep      = modoNoche ? "border-white/10" : "border-gray-200";
  const footerBg = modoNoche ? "bg-[#111] border-white/10" : "bg-gray-50 border-gray-200";
  const cancelBtn= modoNoche ? "bg-[#252525] border-white/10 text-gray-400 hover:bg-[#2e2e2e]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm";
  const ddBg     = modoNoche ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-200 shadow-lg";
  const ddItem   = modoNoche ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50";
  const ddSel    = modoNoche ? "bg-[#C40000]/20 text-red-400" : "bg-red-50 text-red-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setMostrarModal(false)}
    >
      <div
        className={`relative w-full sm:w-[1200px] md:w-[1200px] rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden ${shell}`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER CENTRADO ────────────────────────────────── */}
        <div className="bg-[#C40000] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/img/logo.png" className="w-10 h-10 object-contain" alt="Logo" />
          </div>
          <h2 className="text-white font-bold text-xl tracking-wide">
            Gestión de Residuos
          </h2>
          <button
            onClick={() => setMostrarModal(false)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── BODY ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ scrollbarWidth: "none" }}>

          {/* Fecha */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputRow} transition`}>
            <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* Responsable */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputRow} transition`}>
            <User className="w-5 h-5 text-[#C40000] shrink-0" />
            <input
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              placeholder="Responsable"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* Área con dropdown mejorado */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputRow} transition cursor-pointer`}>
              <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                value={busquedaArea}
                onChange={(e) => { setBusquedaArea(e.target.value); setMostrarLista(true); }}
                onFocus={() => setMostrarLista(true)}
                onBlur={() => setTimeout(() => setMostrarLista(false), 200)}
                placeholder="Seleccionar área..."
                className="w-full bg-transparent outline-none text-sm"
              />
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
            {mostrarLista && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border z-50 max-h-48 overflow-y-auto ${ddBg}`} style={{ scrollbarWidth: "none" }}>
                {areasFiltradas.length > 0
                  ? areasFiltradas.map((a: any) => {
                      const sel = areasSeleccionadas.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (sel) { setAreasSeleccionadas(p => p.filter(id => id !== a.id)); }
                            else { setAreasSeleccionadas(p => [...p, a.id]); setAreaId(a.id); setBusquedaArea(a.nombre); }
                            setMostrarLista(false);
                          }}
                          className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition ${sel ? ddSel + " font-medium" : ddItem}`}
                        >
                          {a.nombre}
                          {sel && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C40000]/20 text-red-400 font-bold">✓</span>}
                        </div>
                      );
                    })
                  : <div className={`px-4 py-3 text-sm text-center ${secLabel}`}>Sin resultados</div>
                }
              </div>
            )}
          </div>

          {/* Categorías en tarjetas blancas con sombra */}
          <div className={`border-t pt-4 ${sep}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${secLabel}`}>Conteos por categoría</p>
            <div className="grid grid-cols-2 gap-3">
              {CAMPOS.map((c) => (
                <div key={c.key} className={`rounded-2xl border p-4 ${cardBg} transition hover:shadow-lg`}>
                  <div className="flex items-center gap-2 mb-3">
                    {c.icon}
                    <span className={`text-sm font-semibold ${cardLbl}`}>{c.label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        value={valores?.[c.key]?.c || ""}
                        onChange={(e) => handleChange(c.key, "c", e.target.value)}
                        placeholder="0"
                        className="w-full text-center rounded-xl border border-green-200 bg-green-50 text-green-700 font-bold text-sm py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-green-500 font-black pointer-events-none">✔</span>
                    </div>
                    <div className="relative">
                      <input
                        value={valores?.[c.key]?.nc || ""}
                        onChange={(e) => handleChange(c.key, "nc", e.target.value)}
                        placeholder="0"
                        className="w-full text-center rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-sm py-2 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-red-500 font-black pointer-events-none">✖</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Observaciones (opcional)..."
            rows={2}
            className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none resize-none transition ${inputRow}`}
            style={{ scrollbarWidth: "none" }}
          />
        </div>

        {/* ── FOOTER CON BOTONES MODERNOS ────────────────────── */}
        <div className={`px-5 py-4 border-t flex gap-3 shrink-0 ${footerBg}`}>
          <button
            onClick={() => setMostrarModal(false)}
            className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition ${cancelBtn}`}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex-1 py-3 rounded-2xl bg-[#C40000] hover:bg-red-700 text-white text-sm font-semibold shadow-lg hover:shadow-red-500/30 transition disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}