"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Edit, Trash2 } from "lucide-react";
import { CAMPOS } from "./constants";
import { getFilaKey, normalizarFecha } from "./utils";
import { Toilet, Droplets, ShowerHead, Waves, Wrench } from "lucide-react";

const iconMap: Record<number, any> = {
  1: Toilet,
  2: Droplets,
  3: ShowerHead,
  4: Waves,
  5: Wrench,
};

interface Props {
  modoNoche: boolean;
  dataBackend: any[];
  setDataBackend: React.Dispatch<React.SetStateAction<any[]>>;
  inspeccionesFiltradas: [string, any[]][];
  valores: Record<string, Record<number, { c?: string; nc?: string }>>;
  observaciones: Record<string, string>;
  fechaSesion: string;
  editandoGrupo: string | null;
  setEditandoGrupo: (value: string | null) => void;
  handleChange: (filaKey: string, campo: number, tipo: "c" | "nc", value: string) => void;
  handleObs: (filaKey: string, value: string) => void;
  handleBlur: (filaKey: string, campo: number, tipo: "c" | "nc", value: string, areaId: number, responsableGrupo: string, fecha: string) => void;
  guardarTodo: (responsableGrupo: string, fecha: string) => void;
  eliminarInspeccionGrupo: (responsableGrupo: string, fecha: string) => void;
  estilos: Record<string, string>;
  inspecciones: any[];
}

export default function InspeccionesAguaTabla({
  modoNoche,
  dataBackend,
  setDataBackend,
  inspeccionesFiltradas,
  valores,
  observaciones,
  fechaSesion,
  editandoGrupo,
  setEditandoGrupo,
  handleChange,
  handleObs,
  handleBlur,
  guardarTodo,
  eliminarInspeccionGrupo,
  estilos,
  inspecciones,
}: Props) {
  const [editandoAreaId, setEditandoAreaId] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<number | null>(null);

  const iniciarEdicionArea = (area: any) => {
    setEditandoAreaId(area.id);
    setNombreEditado(area.nombre);
    setConfirmarEliminarId(null);
  };

  const cancelarEdicionArea = () => {
    setEditandoAreaId(null);
    setNombreEditado("");
  };

  const guardarEdicionArea = async () => {
    const nombre = nombreEditado.trim();
    if (!editandoAreaId || !nombre) return;
    try {
      const res = await fetch("/api/areas-sanitarias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editandoAreaId, nombre }),
      });
      if (!res.ok) throw new Error("Error actualizando área");
      setDataBackend((prev) => prev.map((item) => (item.id === editandoAreaId ? { ...item, nombre } : item)));
      setEditandoAreaId(null);
      setNombreEditado("");
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área actualizada", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al editar", timer: 1200, showConfirmButton: false });
    }
  };

  const eliminarArea = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar área?",
      text: "Se borrarán todos los datos asociados",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await fetch(`/api/areas-sanitarias?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando área");
      setDataBackend((prev) => prev.filter((item) => item.id !== id));
      setConfirmarEliminarId(null);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área eliminada", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al eliminar", timer: 1200, showConfirmButton: false });
    }
  };

  return (
    <div className={`lg:block p-4 rounded-2xl ${modoNoche ? "bg-[#0f0f0f]" : "bg-gray-100"}`}>
      {inspeccionesFiltradas.map(([clave, registros]) => {
        const [anio, semana, responsableGrupo] = clave.split("__");
        const fechaGrupo = registros[0]?.fecha?.split("T")[0];

        return (
          <div
            key={clave}
            className={`mb-10 rounded-2xl p-5 shadow-sm ${
              modoNoche ? "bg-[#161616] border border-[#2a2a2a]" : "bg-white border border-gray-200"
            }`}
          >
            {/* CABECERA DEL GRUPO */}
            <div className={`mb-6 rounded-2xl p-5 border-2 ${
              modoNoche ? "bg-gradient-to-r from-[#1a1a1a] to-[#222] border-[#333]" : "bg-gradient-to-r from-white to-gray-50 border-gray-200"
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${modoNoche ? "bg-blue-600/20" : "bg-blue-100"}`}>
                      <span className="text-xl">🚿</span>
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${modoNoche ? "text-white" : "text-gray-800"}`}>
                        Inspección Semana {semana.replace("semana", "")}
                      </h2>
                      <p className={`text-sm ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>Año {anio}</p>
                    </div>
                  </div>
                  {registros.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${modoNoche ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"}`}>
                        📅 {new Date(registros[0].fecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${modoNoche ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                        📊 {registros.length} áreas
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${modoNoche ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
                        👤 {responsableGrupo || registros[0]?.responsable || "Sin responsable"}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => eliminarInspeccionGrupo(responsableGrupo, fechaGrupo)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${
                    modoNoche ? "bg-red-600 text-white hover:bg-red-700 shadow-red-900/30" : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
                  }`}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className={`overflow-auto rounded-2xl border-2 ${modoNoche ? "bg-[#1a1a1a] border-[#333]" : "bg-white border-gray-200"}`}>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className={`text-center text-xs uppercase font-bold ${
                    modoNoche ? "text-gray-300 bg-gradient-to-r from-[#222] to-[#2a2a2a]" : "text-gray-600 bg-gradient-to-r from-gray-100 to-gray-50"
                  }`}>
                    <th className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>📍 Área / Puesto</th>
                    {CAMPOS.map((c) => {
                      const Icon = iconMap[c.key];
                      return (
                        <th key={c.key} className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>
                          <div className="flex flex-col items-center gap-1">
                            <Icon className={`w-6 h-6 ${c.color}`} />
                            <span>{c.nombre}</span>
                          </div>
                        </th>
                      );
                    })}
                    <th className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>📝 Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {dataBackend.map((area: any) => {
                    const filaKey = getFilaKey(fechaGrupo, responsableGrupo, area.id);
                    const registro = registros.find(
                      (r) => r.area_id === area.id && r.responsable === responsableGrupo && r.fecha?.split("T")[0] === fechaGrupo
                    );

                    return (
                      <tr key={filaKey} className={`transition ${modoNoche ? "bg-[#181818] hover:bg-[#1f1f1f]" : "bg-white hover:bg-gray-50"}`}>
                        {/* NOMBRE ÁREA */}
                        <td className={`p-3 border ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                          {editandoAreaId === area.id ? (
                            <div className="space-y-2">
                              <input
                                value={nombreEditado}
                                onChange={(e) => setNombreEditado(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") guardarEdicionArea();
                                  if (e.key === "Escape") cancelarEdicionArea();
                                }}
                                className={`w-full text-center font-semibold rounded-xl px-3 py-2 ${
                                  modoNoche ? "bg-[#222] text-white border border-white/10" : "bg-gray-50 text-gray-800 border border-gray-300"
                                }`}
                                placeholder="Nombre del área"
                              />
                              <div className="flex gap-2 justify-center">
                                <button onClick={guardarEdicionArea} className={`px-3 py-1 rounded-lg text-xs font-semibold ${modoNoche ? "bg-green-700 text-white" : "bg-green-500 text-white"}`}>Guardar</button>
                                <button onClick={cancelarEdicionArea} className={`px-3 py-1 rounded-lg text-xs font-semibold ${modoNoche ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}>Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="font-semibold text-center px-3 py-2">{area.nombre || ""}</div>
                              <div className="flex gap-2 justify-center">
                                <button onClick={() => iniciarEdicionArea(area)} className={`p-1.5 rounded-lg transition ${modoNoche ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`} title="Editar área">
                                  <Edit size={14} />
                                </button>
                                {confirmarEliminarId === area.id ? (
                                  <>
                                    <button onClick={() => eliminarArea(area.id)} className={`p-1.5 rounded-lg transition ${modoNoche ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"}`} title="Confirmar eliminar"><Trash2 size={14} /></button>
                                    <button onClick={() => setConfirmarEliminarId(null)} className={`p-1.5 rounded-lg transition ${modoNoche ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} title="Cancelar">✕</button>
                                  </>
                                ) : (
                                  <button onClick={() => setConfirmarEliminarId(area.id)} className={`p-1.5 rounded-lg transition ${modoNoche ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"}`} title="Eliminar área"><Trash2 size={14} /></button>
                                )}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* CAMPOS */}
                        {CAMPOS.map((c) => {
                          const cVal = Number(valores?.[filaKey]?.[c.key]?.c ?? registro?.[`${c.db}_c`] ?? 0);
                          const ncVal = Number(valores?.[filaKey]?.[c.key]?.nc ?? registro?.[`${c.db}_nc`] ?? 0);
                          const total = cVal + ncVal;

                          return (
                            <td key={c.key} className={`p-2 border ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                              <div className={`rounded-xl p-2 ${modoNoche ? "bg-[#202020]" : "bg-gray-50"}`}>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <input
                                      value={valores?.[filaKey]?.[c.key]?.c !== undefined ? valores[filaKey][c.key].c : registro ? String(registro[`${c.db}_c`] || "") : ""}
                                      onChange={(e) => handleChange(filaKey, c.key, "c", e.target.value)}
                                      onBlur={(e) => handleBlur(filaKey, c.key, "c", e.target.value, area.id, responsableGrupo, fechaGrupo)}
                                      placeholder="0"
                                      className={`w-full text-center rounded-lg py-1 border font-semibold transition ${modoNoche ? "bg-[#111] text-white border-[#2f2f2f]" : "bg-white text-gray-700 border-gray-200"}`}
                                    />
                                    <div className={`text-center text-xs font-semibold py-1 rounded-lg border ${modoNoche ? "bg-green-900/20 text-green-300 border-green-800/40" : "bg-green-50 text-green-700 border-green-200"}`}>{cVal}</div>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <input
                                      value={valores?.[filaKey]?.[c.key]?.nc !== undefined ? valores[filaKey][c.key].nc : registro ? String(registro[`${c.db}_nc`] || "") : ""}
                                      onChange={(e) => handleChange(filaKey, c.key, "nc", e.target.value)}
                                      onBlur={(e) => handleBlur(filaKey, c.key, "nc", e.target.value, area.id, responsableGrupo, fechaGrupo)}
                                      placeholder="0"
                                      className={`w-full text-center rounded-lg py-1 border font-semibold transition ${modoNoche ? "bg-[#111] text-white border-[#2f2f2f]" : "bg-white text-gray-700 border-gray-200"}`}
                                    />
                                    <div className={`text-center text-xs font-semibold py-1 rounded-lg border ${modoNoche ? "bg-red-900/20 text-red-300 border-red-800/40" : "bg-red-50 text-red-700 border-red-200"}`}>{ncVal}</div>
                                  </div>
                                </div>
                                <div className={`mt-2 text-center text-xs font-semibold py-1 rounded-lg border ${modoNoche ? "bg-blue-900/20 text-blue-300 border-blue-800/40" : "bg-blue-50 text-blue-700 border-blue-200"}`}>Total: {total}</div>
                              </div>
                            </td>
                          );
                        })}

                        {/* OBSERVACIONES */}
                        <td className={`p-3 border ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={observaciones[filaKey] !== undefined ? observaciones[filaKey] : registro?.observacion || ""}
                              onChange={(e) => handleObs(filaKey, e.target.value)}
                              placeholder="Escribe una observación..."
                              className={`w-full p-2 rounded-xl border transition ${modoNoche ? "bg-[#222] text-white border-[#2f2f2f]" : "bg-gray-50 text-gray-800 border-gray-200"}`}
                            />
                            <div className={`text-center text-sm font-semibold py-2 rounded-xl border ${modoNoche ? "bg-green-900/20 text-green-300 border-green-800/40" : "bg-green-50 text-green-700 border-green-200"}`}>
                              Total: {registro?.total || 0}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TABLA RESUMEN */}
            <div className={`mt-8 overflow-auto rounded-2xl border-2 ${modoNoche ? "bg-[#1a1a1a] border-[#333]" : "bg-white border-gray-200"}`}>
              <div className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>
                <h3 className={`text-lg font-bold ${modoNoche ? "text-white" : "text-gray-800"}`}>📊 Resumen de la Inspección</h3>
                <p className={`text-sm mt-1 ${modoNoche ? "text-gray-400" : "text-gray-500"}`}>Totales por categoría sanitaria</p>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className={`text-center text-xs uppercase font-bold ${modoNoche ? "bg-gradient-to-r from-red-900 to-red-700" : "bg-gradient-to-r from-red-600 to-red-500"} text-white`}>
                    <th className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-red-400"}`}>Tipo</th>
                    <th className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-red-400"}`}>✔ Cumple</th>
                    <th className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-red-400"}`}>✖ No cumple</th>
                    <th className={`p-4 border-b-2 ${modoNoche ? "border-[#444]" : "border-red-400"}`}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPOS.map((c) => {
                    let totalC = 0;
                    let totalNC = 0;
                    registros.forEach((r) => {
                      totalC += Number(r[`${c.db}_c`] || 0);
                      totalNC += Number(r[`${c.db}_nc`] || 0);
                    });
                    const Icon = iconMap[c.key];
                    return (
                      <tr key={c.key} className={`${modoNoche ? "bg-[#181818] hover:bg-[#1f1f1f]" : "bg-white hover:bg-gray-50"} transition`}>
                        <td className={`p-4 border font-semibold ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${c.color}`} />
                            {c.nombre}
                          </div>
                        </td>
                        <td className={`p-4 border text-center ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                          <span className={`inline-block px-3 py-1 rounded-lg font-semibold ${modoNoche ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"}`}>{totalC}</span>
                        </td>
                        <td className={`p-4 border text-center ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                          <span className={`inline-block px-3 py-1 rounded-lg font-semibold ${modoNoche ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"}`}>{totalNC}</span>
                        </td>
                        <td className={`p-4 border text-center ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                          <span className={`inline-block px-3 py-1 rounded-lg font-bold ${modoNoche ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"}`}>{totalC + totalNC}</span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* TOTAL GENERAL */}
                  <tr className={`font-bold ${modoNoche ? "bg-gradient-to-r from-[#222] to-[#2a2a2a]" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
                    <td className={`p-4 border ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>📊 TOTAL GENERAL</td>
                    <td className={`p-4 border text-center ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                      <span className={`inline-block px-3 py-1 rounded-lg font-bold ${modoNoche ? "bg-green-900/40 text-green-300" : "bg-green-200 text-green-800"}`}>
                        {registros.reduce((acc, r) => acc + Number(r.sanitarios_c || 0) + Number(r.orinales_c || 0) + Number(r.duchas_c || 0) + Number(r.lavamanos_c || 0) + Number(r.llaves_c || 0), 0)}
                      </span>
                    </td>
                    <td className={`p-4 border text-center ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                      <span className={`inline-block px-3 py-1 rounded-lg font-bold ${modoNoche ? "bg-red-900/40 text-red-300" : "bg-red-200 text-red-800"}`}>
                        {registros.reduce((acc, r) => acc + Number(r.sanitarios_nc || 0) + Number(r.orinales_nc || 0) + Number(r.duchas_nc || 0) + Number(r.lavamanos_nc || 0) + Number(r.llaves_nc || 0), 0)}
                      </span>
                    </td>
                    <td className={`p-4 border text-center ${modoNoche ? "border-[#353535]" : "border-gray-200"}`}>
                      <span className={`inline-block px-3 py-1 rounded-lg font-bold ${modoNoche ? "bg-blue-900/40 text-blue-300" : "bg-blue-200 text-blue-800"}`}>
                        {registros.reduce((acc, r) => acc + Number(r.total || 0), 0)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
