import { Lightbulb, Sun, LampFloor, Wind } from "lucide-react";

export const MESES = [
  { value: "Todos", label: "Todos" },
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
] as const;

export const CAMPOS = [
  { key: 1, nombre: "Bombillas", db: "bombillas", icon: Lightbulb, color: "text-yellow-500" },
  { key: 2, nombre: "Reflectores", db: "reflectores", icon: Sun, color: "text-orange-500" },
  { key: 3, nombre: "Lámparas piso", db: "lamparas", icon: LampFloor, color: "text-purple-500" },
  { key: 4, nombre: "Aires", db: "aires", icon: Wind, color: "text-cyan-500" },
] as const;

export const STORAGE_RESPONSABLE = "responsable";
export const STORAGE_MODO = "modo_nueva_inspeccion_energia";
