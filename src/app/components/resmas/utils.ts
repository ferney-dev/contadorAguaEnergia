export const parseNumero = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === "") return null;
  const str = String(valor).trim();
  if (str.endsWith(".")) {
    const n = Number(str.slice(0, -1).replace(/\./g, ""));
    return Number.isNaN(n) ? null : n;
  }
  const puntos = (str.match(/\./g) || []).length;
  if (puntos === 1) {
    const [entero, decimal] = str.split(".");
    const n = Number(`${entero.replace(/\./g, "")}.${decimal}`);
    return Number.isNaN(n) ? null : n;
  }
  const limpio = str.replace(/\./g, "").replace(/,/g, "");
  const n = Number(limpio);
  return Number.isNaN(n) ? null : n;
};

export const formatearNumeroInput = (valor: unknown) => {
  if (valor === null || valor === undefined || valor === "") return "";
  const numero = Number(String(valor).replace(/\./g, "").replace(/,/g, ""));
  if (isNaN(numero)) return "";
  return numero.toLocaleString("es-CO");
};

export const formatearDecimalInput = (valor: unknown) => {
  if (valor === null || valor === undefined || valor === "") return "";
  const str = String(valor).trim();
  if (str.includes(".")) {
    const [entero, ...rest] = str.split(".");
    const decimal = rest.join("").replace(/[^0-9]/g, "");
    const entNum = Number(entero.replace(/\./g, "") || "0");
    if (Number.isNaN(entNum)) return str;
    const entFmt = entNum.toLocaleString("es-CO");
    if (decimal === "" && str.endsWith(".")) return `${entFmt}.`;
    return `${entFmt}.${decimal}`;
  }
  return formatearNumeroInput(valor);
};

export const limpiarCantidad = (valor: string) => {
  let v = valor.replace(/[^0-9.,]/g, "").replace(",", ".");
  const dotIdx = v.indexOf(".");
  if (dotIdx === -1) return v.replace(/\./g, "");
  const entero = v.slice(0, dotIdx).replace(/\./g, "");
  const decimal = v.slice(dotIdx + 1).replace(/\./g, "");
  return v.endsWith(".") && decimal === ""
    ? `${entero}.`
    : `${entero}.${decimal}`;
};

export const limpiarNumero = (valor: string) => {
  return valor.replace(/\./g, "").replace(/[^0-9]/g, "");
};

export const getThemeClasses = (modoNoche: boolean) => ({
  fondo: modoNoche
    ? "bg-[#0f0f0f] text-white"
    : "bg-[#ffffff] text-gray-800",
  card: modoNoche
    ? "bg-[#1b1b1b] border border-gray-700"
    : "bg-white border border-gray-200 shadow",
});
