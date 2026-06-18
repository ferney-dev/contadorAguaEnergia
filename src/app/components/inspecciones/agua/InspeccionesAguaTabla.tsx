"use client";

import { useState } from "react";
import { Toilet, Droplets, ShowerHead, Waves, Wrench, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import type { UseInspeccionesAguaReturn } from "../../../hooks/useInspeccionesAgua";
import { CAMPOS } from "./constants";
import { getFilaKey, obtenerInicioSemana } from "./utils";

interface Props {
  modoNoche: boolean;
  dataBackendFiltrada: any[];
  valores: UseInspeccionesAguaReturn["valores"];
  observaciones: UseInspeccionesAguaReturn["observaciones"];
  responsable: string;
  fechaSesion: string;
  inspecciones: any[];
  estilos: UseInspeccionesAguaReturn["estilos"];
  handleChange: UseInspeccionesAguaReturn["handleChange"];
  handleObs: UseInspeccionesAguaReturn["handleObs"];
  obtenerValor: UseInspeccionesAguaReturn["obtenerValor"];
  calcularTotalFila: UseInspeccionesAguaReturn["calcularTotalFila"];
  guardarFila: UseInspeccionesAguaReturn["guardarFila"];
  dataBackend: any[];
  setDataBackend: React.Dispatch<React.SetStateAction<any[]>>;
}

const iconMap: Record<number, any> = {
  1: Toilet,
  2: Droplets,
  3: ShowerHead,
  4: Waves,
  5: Wrench,
};

export default function InspeccionesAguaTabla({
  modoNoche,
  dataBackendFiltrada,
  valores,
  observaciones,
  responsable,
  fechaSesion,
  inspecciones,
  estilos,
  handleChange,
  handleObs,
  obtenerValor,
  calcularTotalFila,
  guardarFila,
  dataBackend,
  setDataBackend,
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
      const res = await fetch("/api/areas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editandoAreaId,
          nombre,
        }),
      });

      if (!res.ok) throw new Error("Error actualizando área");

      setDataBackend((prev) =>
        prev.map((item) => (item.id === editandoAreaId ? { ...item, nombre } : item))
      );

      setEditandoAreaId(null);
      setNombreEditado("");
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área actualizada", timer: 1200, showConfirmButton: false });
    } catch (error) {
      console.error(error);
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
      const res = await fetch(`/api/areas?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando área");

      setDataBackend((prev) => prev.filter((item) => item.id !== id));
      setConfirmarEliminarId(null);
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Área eliminada", timer: 1200, showConfirmButton: false });
    } catch (error) {
      console.error(error);
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al eliminar", timer: 1200, showConfirmButton: false });
    }
  };

  return (
    <div className={`overflow-x-auto rounded-xl ${estilos.tarjeta}`}>
      <table className={`w-full text-xs border-collapse ${estilos.header}`}>
        <thead>
          <tr className={`text-center text-xs uppercase font-bold ${
            modoNoche ? "text-gray-300 bg-gradient-to-r from-[#222] to-[#2a2a2a]" : "text-gray-600 bg-gradient-to-r from-gray-100 to-gray-50"
          }`}>
            <th className={`px-4 py-4 border-b-2 font-semibold ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>
              📍 Área
            </th>
            {CAMPOS.map((campo) => {
              const Icon = iconMap[campo.key];
              return (
                <th
                  key={campo.key}
                  className={`px-4 py-4 border-b-2 font-semibold text-center ${modoNoche ? "border-[#444]" : "border-gray-300"}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon size={16} className={campo.color} />
                    {campo.nombre}
                  </div>
                </th>
              );
            })}
            <th className={`px-4 py-4 border-b-2 font-semibold text-center ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>
              Total
            </th>
            <th className={`px-4 py-4 border-b-2 font-semibold ${modoNoche ? "border-[#444]" : "border-gray-300"}`}>
              📝 Observaciones
            </th>
          </tr>
        </thead>
        <tbody>
          {dataBackendFiltrada.map((area) => {
            const filaKey = getFilaKey(fechaSesion, responsable, area.id);
            const semanaActual = obtenerInicioSemana(fechaSesion);
            const registro = inspecciones
              .filter(
                (i) =>
                  i.area_id === area.id &&
                  i.responsable === responsable &&
                  obtenerInicioSemana(i.fecha) === semanaActual
              )
              .slice(-1)[0];

            return (
              <tr key={area.id} className={`${estilos.fila} transition`}>
                <td className={`px-4 py-3 border ${estilos.linea} font-medium`}>
                  {editandoAreaId === area.id ? (
                    <div className="space-y-2">
                      <input
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") guardarEdicionArea();
                          if (e.key === "Escape") cancelarEdicionArea();
                        }}
                        className={`w-full text-center font-semibold rounded-lg px-2 py-1 text-xs ${
                          modoNoche ? "bg-[#222] text-white border border-white/10" : "bg-gray-50 text-gray-800 border border-gray-300"
                        }`}
                        placeholder="Nombre del área"
                      />
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={guardarEdicionArea}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            modoNoche ? "bg-green-700 text-white" : "bg-green-500 text-white"
                          }`}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelarEdicionArea}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            modoNoche ? "bg-gray-700 text-white" : "bg-gray-500 text-white"
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-semibold text-center px-2 py-1">
                        {area.nombre}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => iniciarEdicionArea(area)}
                          className={`p-1 rounded-lg transition ${
                            modoNoche ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          }`}
                          title="Editar área"
                        >
                          <Edit size={12} />
                        </button>
                        {confirmarEliminarId === area.id ? (
                          <>
                            <button
                              onClick={() => eliminarArea(area.id)}
                              className={`p-1 rounded-lg transition ${
                                modoNoche ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                              title="Confirmar eliminar"
                            >
                              <Trash2 size={12} />
                            </button>
                            <button
                              onClick={() => setConfirmarEliminarId(null)}
                              className={`p-1 rounded-lg transition ${
                                modoNoche ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmarEliminarId(area.id)}
                            className={`p-1 rounded-lg transition ${
                              modoNoche ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                            title="Eliminar área"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </td>
                {CAMPOS.map((campo) => (
                  <td
                    key={campo.key}
                    className={`px-2 py-2 border ${estilos.linea}`}
                  >
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          placeholder="C"
                          value={valores?.[filaKey]?.[campo.key]?.c || ""}
                          onChange={(e) =>
                            handleChange(filaKey, campo.key, "c", e.target.value)
                          }
                          onBlur={() => guardarFila(filaKey, area, registro)}
                          className={`w-full p-1 text-center rounded border text-xs transition ${
                            modoNoche
                              ? "bg-[#222] border-[#3a3a3a] text-white focus:border-green-500"
                              : "bg-white border-gray-200 text-gray-800 focus:border-green-500"
                          }`}
                        />
                        <div
                          className={`text-center text-[10px] font-semibold py-0.5 rounded border ${
                            modoNoche
                              ? "bg-green-900/20 text-green-300 border-green-800/40"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {obtenerValor(filaKey, campo.key, "c", registro)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          placeholder="NC"
                          value={valores?.[filaKey]?.[campo.key]?.nc || ""}
                          onChange={(e) =>
                            handleChange(filaKey, campo.key, "nc", e.target.value)
                          }
                          onBlur={() => guardarFila(filaKey, area, registro)}
                          className={`w-full p-1 text-center rounded border text-xs transition ${
                            modoNoche
                              ? "bg-[#222] border-[#3a3a3a] text-white focus:border-red-500"
                              : "bg-white border-gray-200 text-gray-800 focus:border-red-500"
                          }`}
                        />
                        <div
                          className={`text-center text-[10px] font-semibold py-0.5 rounded border ${
                            modoNoche
                              ? "bg-red-900/20 text-red-300 border-red-800/40"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {obtenerValor(filaKey, campo.key, "nc", registro)}
                        </div>
                      </div>
                    </div>
                  </td>
                ))}
                <td className={`px-3 py-3 border ${estilos.linea} text-center font-bold`}>
                  {calcularTotalFila(filaKey, registro)}
                </td>
                <td className={`px-3 py-2 border ${estilos.linea}`}>
                  <input
                    type="text"
                    value={observaciones[filaKey] || ""}
                    onChange={(e) => handleObs(filaKey, e.target.value)}
                    onBlur={() => guardarFila(filaKey, area, registro)}
                    placeholder="Obs..."
                    className={`w-full p-1 rounded border text-xs outline-none ${
                      modoNoche
                        ? "bg-[#222] border-[#3a3a3a] text-white focus:border-blue-500"
                        : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"
                    }`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
