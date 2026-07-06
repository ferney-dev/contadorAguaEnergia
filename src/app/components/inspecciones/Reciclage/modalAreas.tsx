"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { X, Plus, Pencil, Trash2, Check, MapPin, Search } from "lucide-react";

interface Area {
  id: number;
  nombre: string;
}

interface Props {
  mostrar: boolean;
  setMostrar: (v: boolean) => void;
  modoNoche: boolean;
  areas: Area[];
  setAreas: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ModalAreas({ mostrar, setMostrar, modoNoche, areas, setAreas }: Props) {
  const [nueva,        setNueva]        = useState("");
  const [busqueda,     setBusqueda]     = useState("");
  const [editandoId,   setEditandoId]   = useState<number | null>(null);
  const [editNombre,   setEditNombre]   = useState("");
  const [guardando,    setGuardando]    = useState(false);
  const inputNuevaRef  = useRef<HTMLInputElement>(null);
  const inputEditRef   = useRef<HTMLInputElement>(null);

  /* foco automático al abrir */
  useEffect(() => {
    if (mostrar) {
      setBusqueda("");
      setNueva("");
      setEditandoId(null);
      setTimeout(() => inputNuevaRef.current?.focus(), 150);
    }
  }, [mostrar]);

  /* foco al editar */
  useEffect(() => {
    if (editandoId !== null) {
      setTimeout(() => inputEditRef.current?.focus(), 80);
    }
  }, [editandoId]);

  /* filtro */
  const areasFiltradas = areas.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase().trim())
  );

  /* ── CREAR ── */
  const crearArea = async () => {
    const nombre = nueva.trim();
    if (!nombre) return;
    setGuardando(true);
    try {
      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error();
      const nueva_ = await res.json();
      setAreas((prev) => [...prev, nueva_]);
      setNueva("");
      inputNuevaRef.current?.focus();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: `"${nombre}" creada`, timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el área" });
    } finally {
      setGuardando(false);
    }
  };

  /* ── GUARDAR EDICIÓN ── */
  const guardarEdicion = async () => {
    const nombre = editNombre.trim();
    if (!nombre || editandoId === null) return;
    try {
      const res = await fetch("/api/areas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editandoId, nombre }),
      });
      if (!res.ok) throw new Error();
      setAreas((prev) => prev.map((a) => (a.id === editandoId ? { ...a, nombre } : a)));
      setEditandoId(null);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área actualizada", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el área" });
    }
  };

  /* ── ELIMINAR ── */
  const eliminarArea = async (area: Area) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${area.nombre}"?`,
      text: "Se borrarán todas las inspecciones asociadas a esta área.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await fetch(`/api/areas?id=${area.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAreas((prev) => prev.filter((a) => a.id !== area.id));
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área eliminada", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el área" });
    }
  };

  if (!mostrar) return null;

  /* ── paleta ── */
  const shell    = modoNoche ? "bg-[#161616] border border-white/10" : "bg-white border border-gray-200";
  const inputCls = modoNoche ? "bg-[#1f1f1f] border-white/10 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400";
  const itemBg   = modoNoche ? "bg-[#1e1e1e] border-[#2e2e2e] hover:bg-[#252525]" : "bg-white border-gray-200 hover:bg-gray-50";
  const txtMain  = modoNoche ? "text-white"   : "text-gray-800";
  const txtSub   = modoNoche ? "text-gray-400" : "text-gray-500";
  const footBg   = modoNoche ? "bg-[#111] border-white/10" : "bg-gray-50 border-gray-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setMostrar(false)}
    >
      <div
        className={`relative w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl ${shell}`}
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── HEADER ── */}
        <div className="bg-[#C40000] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Áreas de Residuos</h2>
              <p className="text-red-200 text-xs">{areas.length} área{areas.length !== 1 ? "s" : ""} registradas</p>
            </div>
          </div>
          <button
            onClick={() => setMostrar(false)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>

          {/* ── CREAR NUEVA ÁREA ── */}
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${txtSub}`}>
              Nueva área
            </p>
            <div className="flex gap-2">
              <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inputCls}`}>
                <Plus className="w-4 h-4 text-[#C40000] shrink-0" />
                <input
                  ref={inputNuevaRef}
                  value={nueva}
                  onChange={(e) => setNueva(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && crearArea()}
                  placeholder="Nombre del área..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
              <button
                onClick={crearArea}
                disabled={!nueva.trim() || guardando}
                className="px-4 py-2.5 rounded-2xl bg-[#C40000] hover:bg-red-700 text-white text-sm font-semibold
                  transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-red-500/30
                  active:scale-95 shrink-0"
              >
                {guardando ? "..." : "Crear"}
              </button>
            </div>
          </div>

          {/* ── BUSCADOR ── */}
          {areas.length > 4 && (
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border ${inputCls}`}>
              <Search className="w-4 h-4 opacity-50 shrink-0" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar área..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {busqueda && (
                <button onClick={() => setBusqueda("")} className="opacity-50 hover:opacity-100 transition">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* ── LISTA ── */}
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${txtSub}`}>
              {busqueda ? `Resultados (${areasFiltradas.length})` : "Áreas existentes"}
            </p>

            {areasFiltradas.length === 0 ? (
              <div className={`text-center py-8 rounded-2xl border ${itemBg}`}>
                <p className="text-3xl mb-2">🗺️</p>
                <p className={`text-sm ${txtSub}`}>
                  {busqueda ? "Sin resultados para tu búsqueda" : "Aún no hay áreas creadas"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {areasFiltradas.map((area) => (
                  <div
                    key={area.id}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl border transition ${itemBg}`}
                  >
                    {/* ícono */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                      ${modoNoche ? "bg-[#2a2a2a]" : "bg-[#fff3f3]"}`}>
                      <MapPin className="w-4 h-4 text-[#C40000]" />
                    </div>

                    {/* nombre o input edición */}
                    {editandoId === area.id ? (
                      <input
                        ref={inputEditRef}
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")  guardarEdicion();
                          if (e.key === "Escape") setEditandoId(null);
                        }}
                        className={`flex-1 rounded-xl px-3 py-1.5 text-sm border outline-none font-medium ${inputCls}`}
                      />
                    ) : (
                      <span className={`flex-1 text-sm font-medium truncate ${txtMain}`}>
                        {area.nombre}
                      </span>
                    )}

                    {/* acciones */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {editandoId === area.id ? (
                        <>
                          <button
                            onClick={guardarEdicion}
                            className="w-8 h-8 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition"
                            title="Guardar"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                              ${modoNoche ? "bg-[#2a2a2a] hover:bg-[#333] text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500"}`}
                            title="Cancelar"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditandoId(area.id); setEditNombre(area.nombre); }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                              ${modoNoche ? "bg-blue-900/30 hover:bg-blue-900/50 text-blue-400" : "bg-blue-50 hover:bg-blue-100 text-blue-500"}`}
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => eliminarArea(area)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition
                              ${modoNoche ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-500"}`}
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className={`px-5 py-4 border-t shrink-0 ${footBg}`}>
          <button
            onClick={() => setMostrar(false)}
            className={`w-full py-3 rounded-2xl border text-sm font-semibold transition
              ${modoNoche ? "bg-[#252525] border-white/10 text-gray-300 hover:bg-[#2e2e2e]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"}`}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
