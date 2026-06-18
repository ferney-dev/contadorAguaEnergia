import { Recycle, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";

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
  { key: 1, nombre: "Reciclables", db: "reciclables", icon: Recycle, color: "text-green-500" },
  { key: 2, nombre: "Ordinarios", db: "ordinarios", icon: Trash2, color: "text-gray-500" },
  { key: 3, nombre: "Peligrosos", db: "peligrosos", icon: AlertTriangle, color: "text-red-500" },
  { key: 4, nombre: "Presintos", db: "presintos", icon: ShieldCheck, color: "text-blue-500" },
] as const;

export const STORAGE_RESPONSABLE = "responsable";
export const STORAGE_MODO = "modo_nueva_inspeccion";
