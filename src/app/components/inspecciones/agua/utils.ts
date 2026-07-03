export const normalizarFecha = (fecha: string) => {
  if (!fecha) return "";
  return fecha.split("T")[0];
};

export const obtenerInicioSemana = (fecha: string) => {
  if (!fecha) return "";
  const base = fecha.split("T")[0];
  const date = new Date(base);
  const diff = (date.getDay() + 6) % 7; // Lunes como inicio de semana
  date.setDate(date.getDate() - diff);
  return date.toISOString().split("T")[0];
};

export const obtenerSemana = (fecha: string) => {
  const d = new Date(fecha);
  const inicio = new Date(d.getFullYear(), 0, 1);
  const dias = Math.floor(
    (d.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.ceil((dias + inicio.getDay() + 1) / 7);
};

export const obtenerAnio = (fila: any) => {
  if (fila?.anio) return String(fila.anio);
  if (fila?.fecha) {
    const d = new Date(fila.fecha);
    if (!isNaN(d.getTime())) return String(d.getFullYear());
  }
  return "Sin año";
};

export const obtenerMes = (fila: any) => {
  if (fila?.mes) return String(fila.mes);
  if (fila?.fecha) {
    const d = new Date(fila.fecha);
    if (!isNaN(d.getTime())) {
      return String(d.getMonth() + 1).padStart(2, "0");
    }
  }
  return "Sin mes";
};

export const getStorageKey = (responsableValor: string) =>
  `sanitarios_${(responsableValor || "sin_responsable").trim()}`;

export const getFilaKey = (
  fecha: string,
  responsableFila: string,
  areaId: number | string
) => `${fecha}__${responsableFila}__${areaId}`;

export const getThemeClasses = (modoNoche: boolean) => ({
  fondo: modoNoche
    ? "bg-[#111111] text-white border border-[#2b2b2b]"
    : "bg-white text-gray-800 border border-gray-200",

  tarjeta: modoNoche
    ? "bg-[#181818] border border-[#2e2e2e] shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
    : "bg-white border border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.06)]",

  titulo: modoNoche ? "text-white" : "text-gray-800",
  subtitulo: modoNoche ? "text-gray-300" : "text-gray-500",

  input: modoNoche
    ? "bg-[#222] border border-[#3a3a3a] text-white placeholder:text-gray-400"
    : "bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400",

  inputSuave: modoNoche
    ? "bg-[#202020] border border-[#363636] text-white"
    : "bg-gray-50 border border-gray-200 text-gray-700",

  header: modoNoche
    ? "bg-[#161616] text-gray-200"
    : "bg-gray-50 text-gray-700",

  fila: modoNoche
    ? "bg-[#111111] hover:bg-[#1b1b1b]"
    : "bg-white hover:bg-gray-50",

  borde: modoNoche ? "border-[#303030]" : "border-gray-200",
  linea: modoNoche ? "border-[#3a3a3a]" : "border-gray-200",

  totalGeneral: modoNoche
    ? "bg-[#1a1a1a] text-gray-200"
    : "bg-[#f8fafc] text-gray-700",

  chip: modoNoche
    ? "bg-[#202020] text-gray-200 border border-[#353535]"
    : "bg-gray-100 text-gray-700 border border-gray-200",
});
