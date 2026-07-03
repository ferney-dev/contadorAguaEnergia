"use client";

import { X, Trash2, Pencil, Check } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";

interface Area {
  id: number;
  nombre: string;
}

interface Props {
  abierto: boolean;
  onClose: () => void;
  areas: Area[];
  cargar: () => void;
  modoNoche?: boolean;
}

export default function ModalAreasTonner({ abierto, onClose, areas, cargar, modoNoche = false }: Props) {
  const [editandoId,   setEditandoId]   = useState<number | null>(null);
  const [nuevoNombre,  setNuevoNombre]  = useState("");

  if (!abierto) return null;

  // ── tokens de tema ──────────────────────────────────────────────────────────
  const shell    = modoNoche ? "bg-[#161616] border border-white/8"  : "bg-white border border-gray-100";
  const itemBg   = modoNoche ? "bg-[#1f1f1f] border-white/10"        : "bg-gray-50 border-gray-100";
  const itemText = modoNoche ? "text-gray-200"                        : "text-gray-800";
  const inputCls = modoNoche ? "bg-[#252525] border-white/10 text-white placeholder-gray-600" : "bg-white border-gray-200 text-gray-800";
  const footerBg = modoNoche ? "bg-[#111] border-white/8"            : "bg-gray-50 border-gray-100";
  const countCls = modoNoche ? "text-gray-500"                        : "text-gray-400";
  const closeBtnCls = modoNoche
    ? "bg-[#252525] border-white/10 text-gray-400 hover:bg-[#2e2e2e]"
    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100";
  const emptyText = modoNoche ? "text-gray-600" : "text-gray-400";

  /* ── ELIMINAR ───────────────────────────────────────────────────────────── */
  const eliminar = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar área?",
      text: "No se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C40000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (!confirmacion.isConfirmed) return;
    try {
      const res = await fetch(`/api/areas-tonners?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área eliminada", showConfirmButton: false, timer: 2000 });
      cargar();
    } catch {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error eliminando", showConfirmButton: false, timer: 2500 });
    }
  };

  /* ── EDITAR ─────────────────────────────────────────────────────────────── */
  const editar = async (id: number) => {
    if (!nuevoNombre.trim()) return;
    try {
      const res = await fetch("/api/areas-tonners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombre: nuevoNombre }),
      });
      if (!res.ok) throw new Error();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área actualizada", showConfirmButton: false, timer: 2000 });
      setEditandoId(null);
      setNuevoNombre("");
      cargar();
    } catch {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error actualizando", showConfirmButton: false, timer: 2500 });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:w-[440px] md:w-[520px] rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl ${shell}`}
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ─────────────────────────────────────────── */}
        <div className="bg-[#C40000] px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <img src="/img/logo.png" className="w-5 h-5 object-contain" alt="logo" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm leading-snug">Gestión de Áreas</p>
            <p className="text-white/60 text-xs mt-0.5">Edita y elimina áreas registradas</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── LISTA ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5" style={{ scrollbarWidth: "none" }}>
          {areas.length === 0 ? (
            <p className={`text-center text-sm py-8 ${emptyText}`}>No hay áreas registradas</p>
          ) : (
            areas.map((a) => (
              <div
                key={a.id}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl border transition hover:shadow-sm ${itemBg}`}
              >
                {/* INPUT o TEXTO */}
                {editandoId === a.id ? (
                  <input
                    autoFocus
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") editar(a.id); if (e.key === "Escape") { setEditandoId(null); setNuevoNombre(""); } }}
                    className={`flex-1 px-3 py-1.5 rounded-xl border text-sm outline-none transition ${inputCls}`}
                  />
                ) : (
                  <span className={`flex-1 text-sm font-medium truncate ${itemText}`}>{a.nombre}</span>
                )}

                {/* BOTONES */}
                <div className="flex gap-1.5 shrink-0">
                  {editandoId === a.id ? (
                    <button
                      onClick={() => editar(a.id)}
                      className="w-7 h-7 rounded-xl bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
                      title="Confirmar"
                    >
                      <Check size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditandoId(a.id); setNuevoNombre(a.nombre); }}
                      className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => eliminar(a.id)}
                    className="w-7 h-7 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-[#C40000] hover:text-white transition"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <div className={`px-4 py-3.5 border-t flex items-center justify-between shrink-0 ${footerBg}`}>
          <span className={`text-xs font-medium ${countCls}`}>
            {areas.length} {areas.length === 1 ? "área" : "áreas"} registradas
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-2xl border text-sm font-medium transition ${closeBtnCls}`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
