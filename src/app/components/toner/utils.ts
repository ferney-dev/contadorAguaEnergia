export const getThemeClasses = (modoNoche: boolean) => ({
  fondo: modoNoche
    ? "bg-[#0b0b0b] text-white"
    : "bg-[#ffffff] text-gray-900",
  card: modoNoche
    ? "bg-[#121212] border border-white/10 shadow-xl"
    : "bg-white border border-gray-200 shadow-md",
  input: modoNoche
    ? "bg-[#191919] border border-white/10 text-white placeholder:text-gray-400"
    : "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400",
  subCard: modoNoche
    ? "bg-[#161616] border border-white/10"
    : "bg-gray-50 border border-gray-200",
  headerTable: modoNoche
    ? "bg-white/5 text-white"
    : "bg-gray-100 text-gray-700",
});

export const hoy = () => new Date().toISOString().split("T")[0];
