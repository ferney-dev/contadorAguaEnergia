/** Recalcula consumos posteriores en BD cuando se agrega o corrige una lectura anterior. */
export async function recalcularConsumosAgua(fecha: string): Promise<boolean> {
  try {
    const res = await fetch("/api/agua/recalcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function recalcularConsumosEnergia(fecha: string): Promise<boolean> {
  try {
    const res = await fetch("/api/energia/recalcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
