"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import MovilReciclaje from "./modalReciclaje";
import ReciclajeContenedores from "./ReciclajeContenedores";
import ReciclajeFiltros from "./ReciclajeFiltros";
import ReciclajeTabla from "./ReciclajeTabla";
import { STORAGE_RESPONSABLE, STORAGE_MODO } from "./constants";
import {
  getThemeClasses,
  getStorageKey,
  getFilaKey,
  obtenerInicioSemana,
  obtenerSemana,
  obtenerAnio,
  obtenerMes,
  normalizarFecha,
} from "./utils";

type RegistroValores = {
  [fila: string]: { [campo: number]: { c?: string; nc?: string } };
};

type RegistroObservaciones = {
  [fila: string]: string;
};

interface Props {
  modoNoche?: boolean;
  dataBackend: any[];
}

export default function TablaReciclaje({ modoNoche = false, dataBackend: dataInicial }: Props) {
  const [dataBackend, setDataBackend] = useState<any[]>(
    Array.isArray(dataInicial) ? dataInicial : []
  );
  const [valores, setValores] = useState<RegistroValores>({});
  const [observaciones, setObservaciones] = useState<RegistroObservaciones>({});
  const [fechaActual, setFechaActual] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modoNuevaInspeccion, setModoNuevaInspeccion] = useState(false);
  const [inspecciones, setInspecciones] = useState<any[]>([]);
  const [responsable, setResponsable] = useState("");
  const [fechaSesion, setFechaSesion] = useState(new Date().toISOString().split("T")[0]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoGrupo, setEditandoGrupo] = useState<string | null>(null);
  const [anioFiltro, setAnioFiltro] = useState("Todos");
  const [mesFiltro, setMesFiltro] = useState("Todos");

  const estilos = getThemeClasses(modoNoche);

  // ─── Efectos ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_RESPONSABLE);
    if (guardado) setResponsable(guardado);
  }, []);

  useEffect(() => {
    if (!responsable) return;
    localStorage.setItem(getStorageKey(responsable), JSON.stringify({ valores, observaciones }));
  }, [valores, observaciones, responsable]);

  useEffect(() => {
    if (modoNuevaInspeccion) return;
    const key = getStorageKey(responsable);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      setValores(parsed.valores || {});
      setObservaciones(parsed.observaciones || {});
    }
  }, [modoNuevaInspeccion]);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_MODO) === "true") setModoNuevaInspeccion(true);
  }, []);

  useEffect(() => {
    const actualizarFecha = () => {
      const fecha = new Date().toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
    };
    actualizarFecha();
    const interval = setInterval(actualizarFecha, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const guardado = localStorage.getItem(STORAGE_RESPONSABLE);
        if (guardado) setResponsable(guardado);

        const key = getStorageKey(guardado || "");
        const dataLocal = localStorage.getItem(key);
        if (dataLocal) {
          const parsed = JSON.parse(dataLocal);
          setValores(parsed.valores || {});
          setObservaciones(parsed.observaciones || {});
        }

        const [areasRes, inspeccionesRes] = await Promise.all([
          fetch("/api/areas"),
          fetch("/api/inspecciones-residuos"),
        ]);

        const areas = await areasRes.json();
        const inspeccionesData = await inspeccionesRes.json();

        setDataBackend(Array.isArray(areas) ? areas : []);
        setInspecciones(Array.isArray(inspeccionesData) ? inspeccionesData : []);
      } catch (error) {
        console.error("Error inicializando residuos:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!dataBackend.length || modoNuevaInspeccion || editandoGrupo) return;

    const nuevosValores: RegistroValores = {};
    const nuevasObservaciones: RegistroObservaciones = {};

    dataBackend.forEach((area) => {
      const filaKey = getFilaKey(fechaSesion, responsable, area.id);
      const semanaActual = obtenerInicioSemana(fechaSesion);
      const inspeccion = inspecciones
        .filter(
          (i) =>
            i.area_id === area.id &&
            i.responsable === responsable &&
            obtenerInicioSemana(i.fecha) === semanaActual
        )
        .slice(-1)[0];

      if (!inspeccion) return;

      nuevosValores[filaKey] = {
        1: { c: String(inspeccion.reciclables_c || ""), nc: String(inspeccion.reciclables_nc || "") },
        2: { c: String(inspeccion.ordinarios_c || ""), nc: String(inspeccion.ordinarios_nc || "") },
        3: { c: String(inspeccion.peligrosos_c || ""), nc: String(inspeccion.peligrosos_nc || "") },
        4: { c: String(inspeccion.presintos_c || ""), nc: String(inspeccion.presintos_nc || "") },
      };
      nuevasObservaciones[filaKey] = inspeccion.observacion || "";
    });

    setValores((prev) => ({ ...nuevosValores, ...prev }));
    setObservaciones((prev) => ({ ...nuevasObservaciones, ...prev }));
  }, [dataBackend, inspecciones, responsable, fechaSesion, modoNuevaInspeccion, editandoGrupo]);

  // ─── Lógica de filtros y agrupaciones ─────────────────────────────────────
  const aniosDisponibles = useMemo(() => {
    const set = new Set<string>();
    inspecciones.forEach((item) => {
      if (item.fecha) set.add(String(new Date(item.fecha).getFullYear()));
    });
    return ["Todos", ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, [inspecciones]);

  const inspeccionesPorFecha = useMemo(() => {
    const grupos: Record<string, any[]> = {};
    inspecciones.forEach((item) => {
      const fecha = normalizarFecha(item.fecha);
      const resp = item.responsable || "sin-responsable";
      const semana = obtenerSemana(fecha);
      const anio = new Date(fecha).getFullYear();
      const clave = `${anio}__semana${semana}__${resp}`;
      if (!grupos[clave]) grupos[clave] = [];
      grupos[clave].push(item);
    });
    return grupos;
  }, [inspecciones]);

  const inspeccionesFiltradas = useMemo(() => {
    return Object.entries(inspeccionesPorFecha)
      .filter(([clave]) => {
        const [anio, semana] = clave.split("__");
        const anioMatch = anioFiltro === "Todos" || anio === anioFiltro;

        // Extraer mes de la semana para filtrar
        let mesMatch = true;
        if (mesFiltro !== "Todos") {
          const semanaNum = parseInt(semana.replace("semana", ""));
          // Aproximar el mes basado en el número de semana
          const mesAproximado = Math.floor((semanaNum - 1) / 4) + 1;
          mesMatch = String(mesAproximado).padStart(2, "0") === mesFiltro;
        }

        // Filtrar por responsable si está seleccionado
        const resp = clave.split("__")[2];
        const respMatch = !responsable || resp === responsable;

        return anioMatch && mesMatch && respMatch;
      })
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [inspeccionesPorFecha, anioFiltro, mesFiltro, responsable]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const finalizarInspeccion = async () => {
    setModoNuevaInspeccion(true);
    localStorage.setItem(STORAGE_MODO, "true");
    localStorage.removeItem(getStorageKey(responsable));
    setValores({});
    setObservaciones({});
    setInspecciones([]);
    setFechaSesion(new Date().toISOString().split("T")[0]);
    Swal.fire({ icon: "success", title: "Inspección finalizada", timer: 1500, showConfirmButton: false });
  };

  const handleChange = (filaKey: string, campo: number, tipo: "c" | "nc", value: string) => {
    const limpio = value.replace(/\D/g, "");
    setValores((prev) => ({
      ...prev,
      [filaKey]: { ...prev[filaKey], [campo]: { ...prev[filaKey]?.[campo], [tipo]: limpio } },
    }));
  };

  const handleObs = (filaKey: string, value: string) => {
    setObservaciones((prev) => ({ ...prev, [filaKey]: value }));
  };

  const handleBlur = async (filaKey: string, campo: number, tipo: "c" | "nc", value: string, areaId: number, responsableGrupo: string, fecha: string) => {
    const limpio = value.replace(/\D/g, "");
    const valor = Number(limpio || 0);

    try {
      const registro = inspecciones.find(
        (r) =>
          r.area_id === areaId &&
          r.responsable === responsableGrupo &&
          normalizarFecha(r.fecha) === fecha
      );

      const campoDB = campo === 1 ? "reciclables" : campo === 2 ? "ordinarios" : campo === 3 ? "peligrosos" : "presintos";
      const campoKey = `${campoDB}_${tipo}`;

      const body = {
        id: registro?.id || null,
        fecha,
        responsable: responsableGrupo,
        area_id: areaId,
        [campoKey]: valor,
      };

      const total = Object.entries(body)
        .filter(([k]) => k.endsWith("_c") || k.endsWith("_nc"))
        .reduce((acc, [, v]) => acc + Number(v || 0), 0);

      if (total > 0) {
        await fetch("/api/inspecciones-residuos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const res = await fetch("/api/inspecciones-residuos");
        const data = await res.json();
        setInspecciones(Array.isArray(data) ? data : []);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Dato guardado",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error al guardar",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const guardarTodo = async (responsableGrupo: string, fecha: string) => {
    try {
      if (!responsableGrupo) return;
      const promesas: Promise<any>[] = [];

      dataBackend.forEach((area: any) => {
        const filaKey = getFilaKey(fecha, responsableGrupo, area.id);
        const registro = inspecciones.find(
          (r) =>
            r.area_id === area.id &&
            r.responsable === responsableGrupo &&
            normalizarFecha(r.fecha) === fecha
        );
        const body = {
          id: registro?.id || null,
          fecha,
          responsable: responsableGrupo,
          area_id: area.id,
          reciclables_c: Number(valores?.[filaKey]?.[1]?.c || 0),
          reciclables_nc: Number(valores?.[filaKey]?.[1]?.nc || 0),
          ordinarios_c: Number(valores?.[filaKey]?.[2]?.c || 0),
          ordinarios_nc: Number(valores?.[filaKey]?.[2]?.nc || 0),
          peligrosos_c: Number(valores?.[filaKey]?.[3]?.c || 0),
          peligrosos_nc: Number(valores?.[filaKey]?.[3]?.nc || 0),
          presintos_c: Number(valores?.[filaKey]?.[4]?.c || 0),
          presintos_nc: Number(valores?.[filaKey]?.[4]?.nc || 0),
          observacion: observaciones[filaKey] || "",
        };
        const total =
          body.reciclables_c + body.reciclables_nc +
          body.ordinarios_c + body.ordinarios_nc +
          body.peligrosos_c + body.peligrosos_nc +
          body.presintos_c + body.presintos_nc;

        if (total > 0) {
          promesas.push(
            fetch("/api/inspecciones-residuos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
          );
        }
      });

      await Promise.all(promesas);
      const res = await fetch("/api/inspecciones-residuos");
      const data = await res.json();
      setInspecciones(Array.isArray(data) ? data : []);
      Swal.fire({ icon: "success", title: "Guardado completo", timer: 1500, showConfirmButton: false });
      setEditandoGrupo(null);
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error al guardar" });
    }
  };

  const eliminarInspeccionGrupo = async (responsableGrupo: string, fecha: string) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar inspección?",
        text: `Se eliminarán los registros de ${responsableGrupo}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
      });
      if (!confirm.isConfirmed) return;

      await fetch("/api/inspecciones-residuos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responsable: responsableGrupo, fecha }),
      });

      const res = await fetch("/api/inspecciones-residuos");
      const data = await res.json();
      setInspecciones(Array.isArray(data) ? data : []);
      Swal.fire({ icon: "success", title: "Inspección eliminada", timer: 1200, showConfirmButton: false });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error al eliminar" });
    }
  };

  // ─── Props agrupadas ───────────────────────────────────────────────────────
  const contenedoresProps = { modoNoche, estilos, fechaActual, inspecciones, valores, setMostrarModal, finalizarInspeccion };
  const filtrosProps = {
    modoNoche, estilos, busqueda, setBusqueda, anioFiltro, setAnioFiltro,
    mesFiltro, setMesFiltro, aniosDisponibles, inspeccionesFiltradas,
    fechaActual, responsable, setDataBackend, dataBackend,
  };
  const tablaProps = {
    modoNoche, dataBackend, setDataBackend, inspeccionesFiltradas,
    valores, observaciones, fechaSesion, editandoGrupo, setEditandoGrupo,
    handleChange, handleObs, handleBlur, guardarTodo, eliminarInspeccionGrupo, estilos,
    inspecciones,
  };

  return (
    <div className={`w-full rounded-3xl p-3 sm:p-4 md:p-6 ${estilos.tarjeta}`}>
      <div className="mb-5 flex flex-col gap-4">
        <div className="text-center">
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide ${estilos.titulo}`}>
            Gestión de Residuos
          </h2>
          <p className={`mt-1 text-xs sm:text-sm ${estilos.subtitulo}`}>
            Control de inspecciones, filtros e historial. Los datos se guardan automáticamente al salir de la celda.
          </p>

          <ReciclajeContenedores {...contenedoresProps} />
        </div>

        <ReciclajeFiltros {...filtrosProps} />
      </div>

      <MovilReciclaje
        modoNoche={modoNoche}
        dataBackend={dataBackend}
        setInspecciones={setInspecciones}
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />

      <ReciclajeTabla {...tablaProps} />

      {/* FOOTER */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className={`px-4 py-2 rounded-xl text-xs sm:text-sm ${estilos.chip}`}>
          Día actual: <span className="font-semibold">{fechaActual}</span>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs sm:text-sm ${estilos.chip}`}>
          Responsable:{" "}
          <span className="font-semibold">
            {responsable ? responsable : "Pendiente por asignar"}
          </span>
        </div>
      </div>
    </div>
  );
}
