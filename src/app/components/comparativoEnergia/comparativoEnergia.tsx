"use client";

import { useState } from "react";
import ComparativoEnergiaContenedores from "./ComparativoEnergiaContenedores";
import ComparativoEnergiaTabla from "./ComparativoEnergiaTabla";
import ModalSedesEnergia from "./modalSedesEnergia";
import { useComparativoEnergia } from "../../hooks/useComparativoEnergia";
import { LayoutGrid, Table2 } from "lucide-react";

interface Props {
  modoNoche: boolean;
}

export default function ComparativoEnergia({ modoNoche }: Props) {
  const {
    meses,
    datosEnergia,
    datosFiltrados,
    sedesDB,
    setSedesDB,
    nuevaFila,
    years,
    anio,
    setAnio,
    sedeSeleccionada,
    setSedeSeleccionada,
    tipoTotal,
    setTipoTotal,
    busqueda,
    setBusqueda,
    mostrarTotales,
    fondo,
    card,
    inputsRef,
    editarNuevaFila,
    editarFila,
    editarCelda,
    manejarTeclas,
    confirmarCelda,
    crearRegistro,
    guardarRegistro,
    actualizarSede,
    confirmarEliminarFila,
    cargarDatos,
    cargarSedes,
  } = useComparativoEnergia(modoNoche);

  const [mostrarModalSedes, setMostrarModalSedes] = useState(false);
  const [vistaTabla,        setVistaTabla]        = useState(false);

  const bg   = modoNoche ? "bg-[#111]"                              : "bg-[#f4f6fa]";
  const txt  = modoNoche ? "text-white"                             : "text-gray-800";
  const sub  = modoNoche ? "text-gray-400"                          : "text-gray-500";
  const inp  = modoNoche ? "bg-[#222] border-[#3a3a3a] text-white"  : "bg-white border-gray-300 text-gray-800";
  const chip = modoNoche ? "bg-[#252525] text-gray-300 border-[#333]" : "bg-gray-100 text-gray-600 border-gray-200";
  const cardCls = modoNoche ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-white border-gray-200";

  const tablaProps = {
    modoNoche, meses, datosFiltrados, datosEnergia, nuevaFila, mostrarTotales,
    inputsRef, editarFila, editarCelda, editarNuevaFila, manejarTeclas,
    confirmarCelda, guardarRegistro, actualizarSede, confirmarEliminarFila,
    crearRegistro, inicio: 0, fin: 12, vistaTabla,
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${bg}`}>
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ══ HEADER ════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${txt}`}>
              ⚡ Comparativo de Energía
            </h1>
            <p className={`text-sm mt-0.5 ${sub}`}>
              Consumo según facturación · {anio || "Todos los años"}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* toggle vista */}
            <button
              onClick={() => setVistaTabla(!vistaTabla)}
              title={vistaTabla ? "Ver tarjetas" : "Ver tabla completa"}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition
                hover:scale-105 active:scale-95
                ${vistaTabla
                  ? (modoNoche ? "bg-yellow-900/30 border-yellow-700 text-yellow-300" : "bg-yellow-100 border-yellow-400 text-yellow-700")
                  : (modoNoche ? "bg-[#1e1e1e] border-[#3a3a3a] text-gray-200 hover:bg-[#2a2a2a]" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm")}`}
            >
              {vistaTabla
                ? <><LayoutGrid size={15} /> Tarjetas</>
                : <><Table2 size={15} /> Ver tabla</>
              }
            </button>

            <button
              onClick={() => setMostrarModalSedes(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition
                hover:scale-105 active:scale-95
                ${modoNoche
                  ? "bg-[#1e1e1e] border-[#3a3a3a] text-gray-200 hover:bg-[#2a2a2a]"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
            >
              🏢 Sedes
            </button>
          </div>
        </div>

        {/* ══ KPIs ══════════════════════════════════════════════ */}
        <ComparativoEnergiaContenedores card={cardCls} datosEnergia={datosEnergia} />

        {/* ══ FILTROS ═══════════════════════════════════════════ */}
        <div className={`rounded-2xl border p-4 space-y-3 ${cardCls}`}>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className={`rounded-xl px-3 py-2 text-sm border outline-none ${inp}`}
            >
              <option value="">Todos los años</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
            {[
              { val: "todos",       lbl: "Todas" },
              { val: "principal",   lbl: "Sede principal" },
              { val: "receptorias", lbl: "Receptorías" },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setTipoTotal(t.val)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                  ${tipoTotal === t.val
                    ? "bg-yellow-400 text-white border-yellow-400 shadow-md"
                    : `${chip} hover:border-yellow-400 hover:text-yellow-600`
                  }`}
              >
                {t.lbl}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔍 Buscar sede..."
              className={`flex-1 min-w-[180px] rounded-xl px-3 py-2 text-sm border outline-none ${inp}`}
            />
            <select
              value={sedeSeleccionada}
              onChange={(e) => setSedeSeleccionada(e.target.value)}
              className={`rounded-xl px-3 py-2 text-sm border outline-none ${inp}`}
            >
              <option value="">Todas las sedes</option>
              {Array.isArray(sedesDB) && sedesDB.map((s: any) => (
                <option key={s.id} value={s.nombre}>{s.nombre}</option>
              ))}
            </select>
          </div>
          <p className={`text-xs ${sub}`}>
            Mostrando <span className="font-bold">{datosFiltrados.length}</span> de {datosEnergia.length} sede{datosEnergia.length !== 1 ? "s" : ""}
            {vistaTabla && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Vista tabla activa</span>}
          </p>
        </div>

        {/* ══ CONTENIDO ════════════════════════════════════════ */}
        <ComparativoEnergiaTabla {...tablaProps} />

      </div>

      {/* ══ MODAL SEDES ══════════════════════════════════════ */}
      <ModalSedesEnergia
        mostrar={mostrarModalSedes}
        setMostrar={setMostrarModalSedes}
        modoNoche={modoNoche}
        sedes={sedesDB}
        setSedes={setSedesDB}
        onSedesChange={cargarDatos}
      />
    </div>
  );
}
