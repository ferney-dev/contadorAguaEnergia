"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { hoy } from "../components/toner/utils";

export type Area = {
  id: number;
  nombre: string;
};

export type Tonner = {
  id?: number;
  area_id: number;
  responsable: string;
  modelo_tonner: string;
  modelo_impresora: string;
  cantidad: number;
  fecha: string;
  created_at?: string;
  updated_at?: string;
};

export type NuevoTonner = {
  area_id: number;
  responsable: string;
  modelo_tonner: string;
  modelo_impresora: string;
  cantidad: number;
  fecha: string;
};

const tonnerVacio = (): NuevoTonner => ({
  area_id: 0,
  responsable: "",
  modelo_tonner: "",
  modelo_impresora: "",
  cantidad: 1,
  fecha: hoy(),
});

export function useTonner(modoNoche: boolean) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [tonners, setTonners] = useState<Tonner[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [nuevaArea, setNuevaArea] = useState("");
  const [mostrarModalAreas, setMostrarModalAreas] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  const [nuevo, setNuevo] = useState<NuevoTonner>(tonnerVacio());

  const toast = (
    icon: "success" | "error" | "warning" | "info",
    title: string
  ) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
      background: modoNoche ? "#121212" : "#ffffff",
      color: modoNoche ? "#ffffff" : "#111827",
      customClass: {
        popup: "rounded-2xl shadow-xl text-sm",
      },
    });
  };

  const limpiarFormulario = () => {
    setNuevo(tonnerVacio());
    setEditandoId(null);
  };

  const cargar = async () => {
    try {
      const [resAreas, resTonners] = await Promise.all([
        fetch("/api/areas-tonners"),
        fetch("/api/tonners"),
      ]);

      const dataAreas = await resAreas.json();
      const dataTonners = await resTonners.json();

      setAreas(Array.isArray(dataAreas) ? dataAreas : []);
      setTonners(Array.isArray(dataTonners) ? dataTonners : []);
    } catch (error) {
      console.error(error);
      toast("error", "Error cargando datos");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const crearArea = async () => {
    if (!nuevaArea.trim()) {
      return toast("warning", "Escribe un nombre para el área");
    }

    try {
      const res = await fetch("/api/areas-tonners", {
        method: "POST",
        body: JSON.stringify({ nombre: nuevaArea.trim() }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        return toast("error", data?.error || "No se pudo crear el área");
      }

      setNuevaArea("");
      await cargar();
      toast("success", "Área creada correctamente");
    } catch (error) {
      console.error(error);
      toast("error", "Error de conexión al crear área");
    }
  };

  const guardar = async () => {
    if (!nuevo.area_id) {
      return toast("warning", "Selecciona un área");
    }

    if (!nuevo.responsable.trim()) {
      return toast("warning", "Escribe el responsable");
    }

    try {
      const body = {
        ...nuevo,
        responsable: nuevo.responsable.trim(),
        modelo_tonner: nuevo.modelo_tonner.trim(),
        modelo_impresora: nuevo.modelo_impresora.trim(),
        fecha: nuevo.fecha || hoy(),
      };

      const res = await fetch("/api/tonners", {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editandoId ? { ...body, id: editandoId } : body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return toast("error", data?.error || "Error guardando");
      }

      await cargar();
      limpiarFormulario();

      toast(
        "success",
        editandoId
          ? "Tonner actualizado correctamente"
          : "Tonner creado correctamente"
      );

    } catch (error) {
      console.error(error);
      toast("error", "Error de conexión");
    }
  };

  const editar = (t: Tonner) => {
    setEditandoId(t.id || null);
    setNuevo({
      area_id: t.area_id,
      responsable: t.responsable || "",
      modelo_tonner: t.modelo_tonner || "",
      modelo_impresora: t.modelo_impresora || "",
      cantidad: t.cantidad || 1,
      fecha: t.fecha || hoy(),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminar = async (id?: number) => {
    if (!id) return;

    const confirmacion = await Swal.fire({
      title: "¿Eliminar tonner?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      background: modoNoche ? "#121212" : "#ffffff",
      color: modoNoche ? "#ffffff" : "#111827",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        confirmButton: "rounded-xl px-4 py-2",
        cancelButton: "rounded-xl px-4 py-2",
      },
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const res = await fetch(`/api/tonners?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return toast("error", data?.error || "No se pudo eliminar");
      }

      if (editandoId === id) {
        limpiarFormulario();
      }

      await cargar();
      toast("success", "Tonner eliminado correctamente");
    } catch (error) {
      console.error(error);
      toast("error", "Error de conexión al eliminar");
    }
  };

  const filtrados = tonners.filter((t) => {
    const nombreArea = areas.find((a) => a.id === t.area_id)?.nombre || "";
    const q = busqueda.toLowerCase();

    const anio = t.fecha?.split("-")[0];
    const mes = t.fecha?.split("-")[1];

    const cumpleBusqueda =
      (t.modelo_impresora || "").toLowerCase().includes(q) ||
      (t.responsable || "").toLowerCase().includes(q) ||
      nombreArea.toLowerCase().includes(q);

    const cumpleArea = filtroArea ? String(t.area_id) === filtroArea : true;
    const cumpleAnio = filtroAnio ? anio === filtroAnio : true;
    const cumpleMes = filtroMes ? mes === filtroMes : true;

    return cumpleBusqueda && cumpleArea && cumpleAnio && cumpleMes;
  });

  const totalRegistros = tonners.length;
  const totalCantidad = tonners.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const totalAreasConUso = new Set(tonners.map((t) => t.area_id)).size;

  return {
    areas,
    tonners,
    busqueda,
    setBusqueda,
    filtroArea,
    setFiltroArea,
    nuevaArea,
    setNuevaArea,
    mostrarModalAreas,
    setMostrarModalAreas,
    editandoId,
    filtroAnio,
    setFiltroAnio,
    filtroMes,
    setFiltroMes,
    nuevo,
    setNuevo,
    crearArea,
    guardar,
    editar,
    eliminar,
    limpiarFormulario,
    cargar,
    filtrados,
    totalRegistros,
    totalCantidad,
    totalAreasConUso,
  };
}

export type UseTonnerReturn = ReturnType<typeof useTonner>;
