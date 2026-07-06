"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { X, Plus, Pencil, Trash2, Check, Building2, Search, MapPin, CreditCard } from "lucide-react";

interface Sede {
  id: number;
  nombre: string;
  ubicacion?: string;
  cuenta?: string;
}

interface Props {
  mostrar: boolean;
  setMostrar: (v: boolean) => void;
  modoNoche: boolean;
  sedes: Sede[];
  setSedes: React.Dispatch<React.SetStateAction<any[]>>;
  onSedesChange: () => void;
}

const sedeVacia = () => ({ nombre: "", ubicacion: "", cuenta: "" });

export default function ModalSedesEnergia({ mostrar, setMostrar, modoNoche, sedes, setSedes, onSedesChange }: Props) {
  const [nueva,      setNueva]      = useState(sedeVacia());
  const [busqueda,   setBusqueda]   = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editData,   setEditData]   = useState(sedeVacia());
  const [guardando,  setGuardando]  = useState(false);
  const [paso,       setPaso]       = useState<"lista" | "crear">("lista");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mostrar) { setBusqueda(""); setNueva(sedeVacia()); setEditandoId(null); setPaso("lista"); }
  }, [mostrar]);

  useEffect(() => {
    if (paso === "crear") setTimeout(() => inputRef.current?.focus(), 150);
  }, [paso]);

  const sedesFiltradas = sedes.filter((s) =>
    `${s.nombre} ${s.ubicacion ?? ""}`.toLowerCase().includes(busqueda.toLowerCase().trim())
  );

  /* ── CREAR ── */
  const crearSede = async () => {
    if (!nueva.nombre.trim()) return;
    setGuardando(true);
    try {
      const res = await fetch("/api/sedes_energia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const creada = data?.data ?? data;
      setSedes((prev) => [...prev, creada]);
      setNueva(sedeVacia());
      setPaso("lista");
      onSedesChange();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: `"${nueva.nombre}" creada`, timer: 1300, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear la sede" });
    } finally {
      setGuardando(false);
    }
  };

  /* ── GUARDAR EDICIÓN ── */
  const guardarEdicion = async () => {
    if (!editData.nombre.trim() || editandoId === null) return;
    try {
      const res = await fetch("/api/sedes_energia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editandoId, ...editData }),
      });
      if (!res.ok) throw new Error();
      setSedes((prev) => prev.map((s) => (s.id === editandoId ? { ...s, ...editData } : s)));
      setEditandoId(null);
      onSedesChange();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Sede actualizada", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar la sede" });
    }
  };

  /* ── ELIMINAR ── */
  const eliminarSede = async (sede: Sede) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${sede.nombre}"?`,
      text: "Se eliminarán todos los datos de consumo de energía de esta sede.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      await fetch(`/api/comparativoEnergia/por-sedes_energia/${sede.id}`, { method: "DELETE" }).catch(() => {});
      const res = await fetch(`/api/sedes_energia?id=${sede.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSedes((prev) => prev.filter((s) => s.id !== sede.id));
      onSedesChange();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Sede eliminada", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar la sede" });
    }
  };

  if (!mostrar) return null;

  const shell    = modoNoche ? "bg-[#161616] border border-white/10" : "bg-white border border-gray-200";
  const inputCls = modoNoche ? "bg-[#1f1f1f] border-white/10 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400";
  const itemBg   = modoNoche ? "bg-[#1e1e1e] border-[#2e2e2e] hover:bg-[#252525]" : "bg-white border-gray-200 hover:bg-yellow-50/50";
  const txtMain  = modoNoche ? "text-white"    : "text-gray-800";
  const txtSub   = modoNoche ? "text-gray-400" : "text-gray-500";
  const footBg   = modoNoche ? "bg-[#111] border-white/10" : "bg-gray-50 border-gray-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setMostrar(false)}
    >
      <div
        className={`relative w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl ${shell}`}
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER amarillo energía ── */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-400 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {paso === "crear" ? "Nueva Sede · Energía" : "Gestión de Sedes · Energía"}
              </h2>
              <p className="text-yellow-100 text-xs">{sedes.length} sede{sedes.length !== 1 ? "s" : ""} registradas</p>
            </div>
          </div>
          <button onClick={() => setMostrar(false)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
          {paso === "lista" ? (
            <>
              <button
                onClick={() => setPaso("crear")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                  bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold text-sm
                  shadow-md hover:shadow-yellow-400/30 hover:scale-[1.02] active:scale-95 transition"
              >
                <Plus size={16} /> Nueva sede / receptoría
              </button>

              {sedes.length > 3 && (
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inputCls}`}>
                  <Search className="w-4 h-4 opacity-50 shrink-0" />
                  <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar sede..."
                    className="flex-1 bg-transparent outline-none text-sm" />
                  {busqueda && <button onClick={() => setBusqueda("")} className="opacity-50 hover:opacity-100"><X size={14} /></button>}
                </div>
              )}

              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${txtSub}`}>
                  {busqueda ? `Resultados (${sedesFiltradas.length})` : "Sedes existentes"}
                </p>
                {sedesFiltradas.length === 0 ? (
                  <div className={`text-center py-8 rounded-2xl border ${itemBg}`}>
                    <p className="text-3xl mb-2">⚡</p>
                    <p className={`text-sm ${txtSub}`}>{busqueda ? "Sin resultados" : "Aún no hay sedes"}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sedesFiltradas.map((sede) => (
                      <div key={sede.id} className={`rounded-2xl border transition ${itemBg}`}>
                        {editandoId === sede.id ? (
                          <div className="p-3 space-y-2">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${inputCls}`}>
                              <Building2 className="w-4 h-4 text-yellow-400 shrink-0" />
                              <input value={editData.nombre} onChange={(e) => setEditData((p) => ({ ...p, nombre: e.target.value }))}
                                placeholder="Nombre" className="flex-1 bg-transparent outline-none text-sm" />
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${inputCls}`}>
                              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                              <input value={editData.ubicacion} onChange={(e) => setEditData((p) => ({ ...p, ubicacion: e.target.value }))}
                                placeholder="Ubicación" className="flex-1 bg-transparent outline-none text-sm" />
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${inputCls}`}>
                              <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                              <input value={editData.cuenta} onChange={(e) => setEditData((p) => ({ ...p, cuenta: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === "Enter") guardarEdicion(); if (e.key === "Escape") setEditandoId(null); }}
                                placeholder="Cuenta" className="flex-1 bg-transparent outline-none text-sm" />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={guardarEdicion}
                                className="flex-1 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition flex items-center justify-center gap-1">
                                <Check size={14} /> Guardar
                              </button>
                              <button onClick={() => setEditandoId(null)}
                                className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition
                                  ${modoNoche ? "bg-[#2a2a2a] border-[#333] text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 px-3 py-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${modoNoche ? "bg-[#2a2a2a]" : "bg-yellow-50"}`}>
                              <Building2 className="w-4 h-4 text-yellow-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${txtMain}`}>{sede.nombre}</p>
                              {(sede.ubicacion || sede.cuenta) && (
                                <p className={`text-xs truncate ${txtSub}`}>
                                  {sede.ubicacion}{sede.ubicacion && sede.cuenta ? " · " : ""}{sede.cuenta}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => { setEditandoId(sede.id); setEditData({ nombre: sede.nombre, ubicacion: sede.ubicacion ?? "", cuenta: sede.cuenta ?? "" }); }}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                                  ${modoNoche ? "bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400" : "bg-yellow-50 hover:bg-yellow-100 text-yellow-600"}`}>
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => eliminarSede(sede)}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                                  ${modoNoche ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-500"}`}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className={`text-[11px] font-bold uppercase tracking-widest ${txtSub}`}>Datos de la sede</p>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputCls}`}>
                <Building2 className="w-5 h-5 text-yellow-400 shrink-0" />
                <input ref={inputRef} value={nueva.nombre}
                  onChange={(e) => setNueva((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="Nombre de la sede o receptoría *"
                  className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputCls}`}>
                <MapPin className="w-5 h-5 text-orange-400 shrink-0" />
                <input value={nueva.ubicacion}
                  onChange={(e) => setNueva((p) => ({ ...p, ubicacion: e.target.value }))}
                  placeholder="Ubicación" className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${inputCls}`}>
                <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                <input value={nueva.cuenta}
                  onChange={(e) => setNueva((p) => ({ ...p, cuenta: e.target.value }))}
                  placeholder="Número de cuenta"
                  onKeyDown={(e) => e.key === "Enter" && crearSede()}
                  className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <div className={`rounded-2xl p-3 text-xs space-y-1 ${modoNoche ? "bg-[#1f1f1f] text-gray-400" : "bg-yellow-50 text-yellow-700"}`}>
                <p>💡 Ejemplos de nombres:</p>
                <p className="font-semibold">SEDE PPAL BODEGA 4 · RECEPTORIA EL CABLE · RECEPTORIA NORTE</p>
                <p className="mt-1 opacity-80">Los nombres con "SEDE PPAL" y "RECEPTORIA" se agrupan en los totales automáticos.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className={`px-5 py-4 border-t shrink-0 flex gap-3 ${footBg}`}>
          {paso === "crear" ? (
            <>
              <button onClick={() => setPaso("lista")}
                className={`flex-1 py-3 rounded-2xl border text-sm font-semibold transition
                  ${modoNoche ? "bg-[#252525] border-white/10 text-gray-300 hover:bg-[#2e2e2e]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
                ← Volver
              </button>
              <button onClick={crearSede} disabled={!nueva.nombre.trim() || guardando}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500
                  text-white text-sm font-semibold shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed">
                {guardando ? "Creando..." : "Crear sede"}
              </button>
            </>
          ) : (
            <button onClick={() => setMostrar(false)}
              className={`w-full py-3 rounded-2xl border text-sm font-semibold transition
                ${modoNoche ? "bg-[#252525] border-white/10 text-gray-300 hover:bg-[#2e2e2e]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
