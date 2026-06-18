export const getThemeClasses = (modoNoche: boolean) => ({
  fondo: modoNoche
    ? "bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]"
    : "bg-gradient-to-br from-[#ececec] to-[#f7f7f7]",
  celular: modoNoche
    ? "bg-[#181818] border border-gray-700"
    : "bg-white border border-gray-300",
  input: modoNoche
    ? "bg-[#242424] text-white border border-gray-600 focus:border-gray-500"
    : "bg-white text-black border border-gray-300 focus:border-gray-400",
  rojo: "bg-[#E30613] hover:bg-[#b8040f] text-white",
});

export const formatFechaLocal = () => {
  const hoy = new Date();
  return (
    hoy.getFullYear() +
    "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(hoy.getDate()).padStart(2, "0")
  );
};

export const validarNumero = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};
