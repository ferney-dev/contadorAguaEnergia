import { RANGOS_AGUA, RANGOS_ENERGIA } from "./constants";

export const calcularConsumoMensual = (lecturas: any) => {
  const meses = Array(12).fill(0);

  Object.entries(lecturas).forEach(([mes, dias]: any) => {
    Object.values(dias).forEach((d: any) => {
      meses[Number(mes)] += (d.total2 || 0) + (d.total4 || 0);
    });
  });

  return meses.map(v => Number(v.toFixed(2)));
};

export const totalAnual = (lecturas: any) =>
  Object.values(lecturas).reduce((acc: number, dias: any) => {
    return (
      acc +
      Object.values(dias).reduce(
        (s: number, d: any) => s + d.total2 + d.total4,
        0
      )
    );
  }, 0);

export const obtenerColorAguaPorRango = (valor: number) => {
  if (valor <= RANGOS_AGUA.OPTIMO) return "#0000CC"; // azul
  if (valor <= RANGOS_AGUA.NORMAL) return "#3E6102 "; // verde
  if (valor <= RANGOS_AGUA.ALERTA) return "#facc15"; // amarillo
  return "#e61919ff"; // rojo
};

export const obtenerColorEnergiaPorRango = (valor: number) => {
  if (valor <= RANGOS_ENERGIA.OPTIMO) return "#0000CC"; // 🔵 Azul
  if (valor <= RANGOS_ENERGIA.NORMAL) return "#3E6102 "; // 🟢 Verde
  if (valor <= RANGOS_ENERGIA.ALERTA) return "#facc15"; // 🟡 Amarillo
  return "#e61919ff"; // 🔴 Rojo
};

export const promedioDiario = (lecturas: any) => {
  let total = 0;
  let dias = 0;

  Object.values(lecturas).forEach((mes: any) => {
    Object.values(mes).forEach((d: any) => {
      const t = d.total2 + d.total4;
      if (t > 0) {
        total += t;
        dias++;
      }
    });
  });

  return dias ? Number((total / dias).toFixed(2)) : 0;
};

export const getThemeClasses = (modoNoche: boolean) => ({
  cardBg: modoNoche ? "bg-[#1e1e1e]" : "bg-white",
  cardBorder: modoNoche ? "border-[#3a3a3a]" : "border-gray-200",
  textColor: modoNoche ? "#ffffff" : "#111827",
  textSoft: modoNoche ? "#d1d5db" : "#4b5563",
  fondo: modoNoche ? "bg-[#121212] text-white" : "bg-white text-black",
});
