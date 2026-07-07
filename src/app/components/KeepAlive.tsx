"use client";

import { useEffect } from "react";

/**
 * Hace ping al backend de Render cada 8 minutos para evitar el cold start.
 * Render apaga los servicios gratuitos tras 15 min de inactividad.
 */
export default function KeepAlive() {
  useEffect(() => {
    const BACKEND = "https://contador-backend-6eyq.onrender.com";
    const INTERVALO_MS = 8 * 60 * 1000; // 8 minutos

    const ping = async () => {
      try {
        await fetch(`${BACKEND}/`, { method: "GET", signal: AbortSignal.timeout(5000) });
      } catch {
        // silencioso — si falla no importa, es solo un keep-alive
      }
    };

    // primer ping inmediato al cargar la app
    ping();

    const intervalo = setInterval(ping, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, []);

  return null; // sin UI
}
