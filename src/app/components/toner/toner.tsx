"use client";

import { Printer, Layers, Plus, Save, CalendarDays, Package, User, ScanLine, RefreshCcw } from "lucide-react";
import TonnerContenedores from "./TonnerContenedores";
import TonnerFiltros from "./TonnerFiltros";
import TonnerTabla from "./TonnerTabla";
import { useTonner } from "../../hooks/useTonner";
import { getThemeClasses } from "./utils";
import ModalAreasTonner from "./ModalAreasTonner";

export default function TablaTonners({ modoNoche }: { modoNoche: boolean }) {
  const {
    areas,
    busqueda,
    setBusqueda,
    filtroArea,
    setFiltroArea,
    nuevaArea,
    setNuevaArea,
    mostrarModalAreas,
    setMostrarModalAreas,
    editandoId,
    filtroAnio,
    setFiltroAnio,
    filtroMes,
    setFiltroMes,
    nuevo,
    setNuevo,
    crearArea,
    guardar,
    editar,
    eliminar,
    limpiarFormulario,
    filtrados,
    totalRegistros,
    totalCantidad,
    totalAreasConUso,
  } = useTonner(modoNoche);

  const { fondo, card, input, subCard } = getThemeClasses(modoNoche);

  return (
    <div className={`p-4 sm:p-6 rounded-3xl ${fondo}`}>
      {/* HEADER PRINCIPAL */}
      <div
        className={`rounded-3xl p-5 sm:p-6 mb-6 ${card} bg-gradient-to-r ${modoNoche
          ? "from-[#161616] to-[#101010]"
          : "from-white to-gray-50"
          }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500/10 shadow-sm">
                <Printer className="text-red-500" size={28} />
              </div>
              Gestión de Tonners
            </h2>
            <p className="mt-2 text-sm sm:text-base opacity-70">
              Administra, registra, edita y controla el inventario de tonners de
              forma moderna y rápida.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setMostrarModalAreas(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md hover:scale-105 transition"
            >
              <Layers size={18} />
              Editar áreas
            </button>
          </div>
        </div>
      </div>

      {/* TARJETAS */}
      <TonnerContenedores
        card={card}
        totalRegistros={totalRegistros}
        totalCantidad={totalCantidad}
        totalAreasConUso={totalAreasConUso}
      />

      {/* GESTIÓN DE ÁREAS */}
      <div className={`p-5 sm:p-6 mb-6 rounded-3xl ${card}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Layers className="text-blue-500" />
              Gestión de áreas
            </h3>
            <p className="text-sm opacity-70 mt-1">
              Crea nuevas áreas y administra las existentes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <input
            value={nuevaArea}
            onChange={(e) => setNuevaArea(e.target.value)}
            placeholder="Escribe el nombre del área"
            className={`w-full p-4 rounded-2xl text-base outline-none transition ${input} focus:ring-2 focus:ring-blue-500`}
          />

          <button
            onClick={crearArea}
            className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition"
          >
            <Plus size={18} />
            Crear área
          </button>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className={`p-5 sm:p-6 mb-6 rounded-3xl ${card}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Package className="text-green-500" />
              {editandoId ? "Editar tonner" : "Registrar tonner"}
            </h3>
            <p className="text-sm opacity-70 mt-1">
              La fecha se guarda automáticamente, pero también puedes ajustarla si
              lo necesitas.
            </p>
          </div>

          {editandoId && (
            <button
              onClick={limpiarFormulario}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-500 text-white shadow-md hover:scale-105 transition"
            >
              <RefreshCcw size={18} />
              Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl ${subCard}`}>
            <label className="text-sm font-semibold opacity-80 flex items-center gap-2 mb-2">
              <Layers size={16} className="text-blue-500" />
              Área
            </label>
            <select
              value={nuevo.area_id || ""}
              className={`w-full p-3 rounded-2xl text-sm sm:text-base outline-none transition ${input} focus:ring-2 focus:ring-blue-500`}
              onChange={(e) =>
                setNuevo({ ...nuevo, area_id: Number(e.target.value) })
              }
            >
              <option value="">Seleccionar área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={`p-4 rounded-2xl ${subCard}`}>
            <label className="text-sm font-semibold opacity-80 flex items-center gap-2 mb-2">
              <User size={16} className="text-blue-500" />
              Responsable
            </label>
            <input
              value={nuevo.responsable}
              placeholder="Nombre del responsable"
              className={`w-full p-3 rounded-2xl text-sm sm:text-base outline-none transition ${input} focus:ring-2 focus:ring-blue-500`}
              onChange={(e) =>
                setNuevo({ ...nuevo, responsable: e.target.value })
              }
            />
          </div>

          <div className={`p-4 rounded-2xl ${subCard}`}>
            <label className="text-sm font-semibold opacity-80 flex items-center gap-2 mb-2">
              <ScanLine size={16} className="text-purple-500" />
              Modelo tonner
            </label>
            <input
              value={nuevo.modelo_tonner}
              placeholder="Modelo del tonner"
              className={`w-full p-3 rounded-2xl text-sm sm:text-base outline-none transition ${input} focus:ring-2 focus:ring-purple-500`}
              onChange={(e) =>
                setNuevo({ ...nuevo, modelo_tonner: e.target.value })
              }
            />
          </div>

          <div className={`p-4 rounded-2xl ${subCard}`}>
            <label className="text-sm font-semibold opacity-80 flex items-center gap-2 mb-2">
              <Printer size={16} className="text-green-500" />
              Modelo impresora
            </label>
            <input
              value={nuevo.modelo_impresora}
              placeholder="Ej: HP LaserJet Pro"
              className={`w-full p-3 rounded-2xl text-sm sm:text-base outline-none transition ${input} focus:ring-2 focus:ring-green-500`}
              onChange={(e) =>
                setNuevo({ ...nuevo, modelo_impresora: e.target.value })
              }
            />
          </div>

          <div className={`p-4 rounded-2xl ${subCard}`}>
            <label className="text-sm font-semibold opacity-80 flex items-center gap-2 mb-2">
              <Package size={16} className="text-amber-500" />
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={nuevo.cantidad}
              className={`w-full p-3 rounded-2xl text-sm sm:text-base outline-none transition ${input} focus:ring-2 focus:ring-amber-500`}
              onChange={(e) =>
                setNuevo({
                  ...nuevo,
                  cantidad: Number(e.target.value) || 1,
                })
              }
            />
          </div>

          <div className={`p-4 rounded-2xl ${subCard}`}>
            <label className="text-sm font-semibold opacity-80 flex items-center gap-2 mb-2">
              <CalendarDays size={16} className="text-blue-500" />
              Fecha del registro
            </label>

            <input
              type="date"
              value={nuevo.fecha}
              className={`w-full p-3 rounded-2xl outline-none ${input}`}
              onChange={(e) =>
                setNuevo({ ...nuevo, fecha: e.target.value })
              }
            />

            <p className="text-xs opacity-60 mt-1">
              Puedes cambiar la fecha manualmente
            </p>
          </div>

          <div className="flex items-end">
            <button
              onClick={guardar}
              className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-white font-bold shadow-lg transition hover:scale-[1.02] active:scale-95 ${editandoId
                ? "bg-gradient-to-r from-amber-500 to-amber-400"
                : "bg-gradient-to-r from-green-600 to-green-500"
                }`}
            >
              <Save size={18} />
              {editandoId ? "Actualizar tonner" : "Guardar tonner"}
            </button>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <TonnerFiltros
        modoNoche={modoNoche}
        card={card}
        subCard={subCard}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroArea={filtroArea}
        setFiltroArea={setFiltroArea}
        filtroAnio={filtroAnio}
        setFiltroAnio={setFiltroAnio}
        filtroMes={filtroMes}
        setFiltroMes={setFiltroMes}
        areas={areas}
      />

      {/* TABLA */}
      <TonnerTabla
        modoNoche={modoNoche}
        areas={areas}
        filtrados={filtrados}
        editar={editar}
        eliminar={eliminar}
      />

      <ModalAreasTonner
        abierto={mostrarModalAreas}
        onClose={() => setMostrarModalAreas(false)}
        areas={areas}
        cargar={() => {}}
      />
    </div>
  );
}