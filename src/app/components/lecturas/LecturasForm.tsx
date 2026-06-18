"use client";

import { Save, Droplets, Zap } from "lucide-react";
import { BODEGA_OPTIONS } from "./constants";

interface Props {
  lectura: string;
  bodegaSeleccionada: string;
  colores: any;
  esAgua: boolean;
  handleLecturaInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  guardarLectura: () => void;
  setBodegaSeleccionada: (value: string) => void;
}

export default function LecturasForm({
  lectura,
  bodegaSeleccionada,
  colores,
  esAgua,
  handleLecturaInput,
  guardarLectura,
  setBodegaSeleccionada,
}: Props) {
  return (
    <div className="px-5 py-5 flex flex-col gap-3">
      {/* TITULO */}
      <h1 className="text-lg font-bold text-center">
        Registro de Lectura
      </h1>

      {/* SELECT */}
      <div>
        <label className="text-xs font-semibold">
          Seleccionar Bodega
        </label>

        <select
          value={bodegaSeleccionada}
          onChange={(e) => setBodegaSeleccionada(e.target.value)}
          className={`w-full mt-1 p-2.5 rounded-lg outline-none ${colores.input}`}
        >
          <option value="">-- Seleccionar --</option>
          {BODEGA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ICONO */}
      <div className="flex justify-center py-1">
        {esAgua ? (
          <Droplets size={30} className="text-blue-500" />
        ) : (
          <Zap size={30} className="text-yellow-500" />
        )}
      </div>

      {/* INPUT */}
      <div className="flex flex-col gap-1">
        <input
          type="tel"
          placeholder="000000"
          value={lectura}
          onChange={handleLecturaInput}
          className={`w-full text-center text-3xl font-mono p-2.5 rounded-lg outline-none tracking-widest ${colores.input}`}
        />

        <p className="text-center text-[11px] opacity-60">
          Solo números permitidos
        </p>
      </div>

      {/* BOTON */}
      <button
        onClick={guardarLectura}
        disabled={!bodegaSeleccionada || !lectura}
        className={`mt-2 py-2.5 rounded-lg shadow-md text-sm flex justify-center items-center gap-2 ${colores.rojo} disabled:opacity-50`}
      >
        <Save size={18} />
        Guardar
      </button>
    </div>
  );
}
