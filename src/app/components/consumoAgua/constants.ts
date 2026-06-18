export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const FACTOR_CONVERSION = 10; // 10 unidades = 1 m³

export const UMBRAL_CONSUMO_ALTO = 2.36;

export const TIPO_DIA = {
  DOMINGO: "D" as const,
  FESTIVO: "F" as const,
  HABIL: "H" as const,
} as const;

export type TipoDia = typeof TIPO_DIA[keyof typeof TIPO_DIA];
