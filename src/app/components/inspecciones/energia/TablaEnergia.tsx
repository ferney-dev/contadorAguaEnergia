"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import MovilEnergia from "./modalEnergia";
import EnergiaContenedores from "./EnergiaContenedores";
import EnergiaFiltros from "./EnergiaFiltros";
import EnergiaTabla from "./EnergiaTabla";
import { CAMPOS, STORAGE_RESPONSABLE, STORAGE_MODO } from "./constants";
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

interface AreaEnergia {
  id: number;
  nombre: string;
}

interface InspeccionEnergia {
  id?: number;
  fecha: string;
  responsable: string;
  area_id: number;
  bombillas_c: number;
  bombillas_nc: number;
  reflectores_c: number;
  reflectores_nc: number;
  lamparas_c: number;
  lamparas_nc: number;
  aires_c: number;
  aires_nc: number;
  observacion?: string;
  total?: number;
}

type RegistroValores = {
  [filaKey: string]: { [campo: number]: { c?: string; nc?: string } };
};

type RegistroObservaciones = {
  [filaKey: string]: string;
};

interface Props {
  modoNoche?: boolean;
  dataBackend: AreaEnergia[];
}

export default function TablaEnergia({ modoNoche = false, dataBackend: dataInicial }: Props) {
  const [dataBackend, setDataBackend] = useState<AreaEnergia[]>(
    Array.isArray(dataInicial) ? dataInicial : []
  );
  const [valores, setValores] = useState<RegistroValores>({});
  const [observaciones, setObservaciones] = useState<RegistroObservaciones>({});
  const [fechaActual, setFechaActual] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modoNuevaInspeccion, setModoNuevaInspeccion] = useState(false);
  const [inspecciones, setInspecciones] = useState<InspeccionEnergia[]>([]);
  const [responsable, setResponsable] = useState("");
  const [fechaSesion, setFechaSesion] = useState(new Date().toISOString().split("T")[0]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoGrupo, setEditandoGrupo] = useState<string | null>(null);
  const [anioFiltro, setAnioFiltro] = useState(() => String(new Date().getFullYear()));
  const [mesFiltro, setMesFiltro] = useState(() =>
    String(new Date().getMonth() + 1).padStart(2, "0")
  );

  const estilos = getThemeClasses(modoNoche);

  // ─── Limpiar estado de fila ────────────────────────────────────────────────
  const limpiarEstadoFila = (filaKey: string) => {
    setValores((prev) => { const c = { ...prev }; delete c[filaKey]; return c; });
    setObservaciones((prev) => { const c = { ...prev }; delete c[filaKey]; return c; });
  };

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
    if (modoNuevaInspeccion || !responsable) return;
    const data = localStorage.getItem(getStorageKey(responsable));
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setValores(parsed.valores || {});
        setObservaciones(parsed.observaciones || {});
      } catch (e) {
        console.error("Error leyendo localStorage energía:", e);
      }
    } else {
      setValores({});
      setObservaciones({});
    }
  }, [modoNuevaInspeccion, responsable]);

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

        const [areasRes, inspeccionesRes] = await Promise.all([
          fetch("/api/areas-energia"),
          fetch("/api/inspecciones-energia"),
        ]);

        const areasData = await areasRes.json();
        const inspeccionesData = await inspeccionesRes.json();

        const areasFinal = Array.isArray(areasData) ? areasData : areasData?.data ?? [];
        const inspeccionesFinal = Array.isArray(inspeccionesData) ? inspeccionesData : inspeccionesData?.data ?? [];

        setDataBackend(areasFinal);
        setInspecciones(inspeccionesFinal);
      } catch (error) {
        console.error("Error inicializando energía:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!dataBackend.length || modoNuevaInspeccion || !responsable || editandoGrupo) return;

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
        1: { c: String(inspeccion.bombillas_c || ""), nc: String(inspeccion.bombillas_nc || "") },
        2: { c: String(inspeccion.reflectores_c || ""), nc: String(inspeccion.reflectores_nc || "") },
        3: { c: String(inspeccion.lamparas_c || ""), nc: String(inspeccion.lamparas_nc || "") },
        4: { c: String(inspeccion.aires_c || ""), nc: String(inspeccion.aires_nc || "") },
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
      if (item?.fecha) set.add(String(new Date(item.fecha).getFullYear()));
    });
    set.add(String(new Date().getFullYear()));
    return ["Todos", ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, [inspecciones]);

  const dataBackendFiltrada = useMemo(() => {
    return dataBackend.filter((fila) => {
      const nombre = String(fila?.nombre || "").toLowerCase();
      const texto = busqueda.toLowerCase().trim();
      const coincideBusqueda = !texto || nombre.includes(texto);
      const anio = obtenerAnio(fila);
      const mes = obtenerMes(fila);
      const coincideAnio = anioFiltro === "Todos" || anio === anioFiltro || anio === "Sin año";
      const coincideMes = mesFiltro === "Todos" || mes === mesFiltro || mes === "Sin mes";
      return coincideBusqueda && coincideAnio && coincideMes;
    });
  }, [dataBackend, busqueda, anioFiltro, mesFiltro]);

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
      .filter(([clave, registros]) => {
        const [anio] = clave.split("__");
        const coincideAnio = anioFiltro === "Todos" || anio === anioFiltro;
        if (!coincideAnio) return false;
        if (mesFiltro === "Todos") return true;
        return registros.some((r) => {
          const fecha = normalizarFecha(r.fecha);
          return String(new Date(fecha).getMonth() + 1).padStart(2, "0") === mesFiltro;
        });
      })
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [inspeccionesPorFecha, anioFiltro, mesFiltro]);

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
    const limpio = value.replace(/\D/g, "").slice(0, 3);
    setValores((prev) => ({
      ...prev,
      [filaKey]: { ...prev[filaKey], [campo]: { ...prev[filaKey]?.[campo], [tipo]: limpio } },
    }));
  };

  const handleObs = (filaKey: string, value: string) => {
    setObservaciones((prev) => ({ ...prev, [filaKey]: value }));
  };

  const obtenerValor = (filaKey: string, campo: number, tipo: "c" | "nc", registro: any) => {
    const valorLocal = valores?.[filaKey]?.[campo]?.[tipo];
    if (valorLocal !== undefined && valorLocal !== "") return Number(valorLocal);
    if (registro) {
      const campoDef = CAMPOS.find((c) => c.key === campo);
      if (!campoDef) return 0;
      return Number(registro?.[`${campoDef.db}_${tipo}`] || 0);
    }
    return 0;
  };

  const calcularTotalFila = (filaKey: string, registro: any) => {
    return CAMPOS.reduce((acc, campo) => {
      return acc + obtenerValor(filaKey, campo.key, "c", registro) + obtenerValor(filaKey, campo.key, "nc", registro);
    }, 0);
  };

  const guardarFila = async (filaKey: string, area: any, registro: any) => {
    try {
      if (!area?.id) return;
      if (!responsable) {
        Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Debes seleccionar un responsable", timer: 1500, showConfirmButton: false });
        return;
      }

      let registroSeguro = registro;
      if (registro && registro.responsable !== responsable) registroSeguro = null;

      const body = {
        id: registroSeguro?.id || null,
        fecha: fechaSesion,
        responsable,
        area_id: area.id,
        bombillas_c: obtenerValor(filaKey, 1, "c", registroSeguro),
        bombillas_nc: obtenerValor(filaKey, 1, "nc", registroSeguro),
        reflectores_c: obtenerValor(filaKey, 2, "c", registroSeguro),
        reflectores_nc: obtenerValor(filaKey, 2, "nc", registroSeguro),
        lamparas_c: obtenerValor(filaKey, 3, "c", registroSeguro),
        lamparas_nc: obtenerValor(filaKey, 3, "nc", registroSeguro),
        aires_c: obtenerValor(filaKey, 4, "c", registroSeguro),
        aires_nc: obtenerValor(filaKey, 4, "nc", registroSeguro),
        observacion: observaciones[filaKey] || registroSeguro?.observacion || "",
      };

      const total = calcularTotalFila(filaKey, registroSeguro);

      if (total === 0 && registroSeguro?.id) {
        const deleteRes = await fetch(`/api/inspecciones-energia?id=${registroSeguro.id}`, { method: "DELETE" });
        if (!deleteRes.ok) throw new Error(await deleteRes.text());
        limpiarEstadoFila(filaKey);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Registro eliminado", timer: 1200, showConfirmButton: false });
      } else if (total > 0) {
        const response = await fetch("/api/inspecciones-energia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(await response.text());
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: registroSeguro?.id ? "Registro actualizado" : "Registro creado", timer: 1200, showConfirmButton: false });
      }

      const res = await fetch("/api/inspecciones-energia");
      const data = await res.json();
      setInspecciones(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error guardando fila energía:", error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el registro" });
    }
  };

  const guardarTodo = async (responsableGrupo: string, fecha: string) => {
    try {
      if (!responsableGrupo) return;
      const promesas: Promise<any>[] = [];

      dataBackend.forEach((area: any) => {
        const filaKey = getFilaKey(fecha, responsableGrupo, area.id);
        const registro = inspecciones.find(
          (r) => r.area_id === area.id && r.responsable === responsableGrupo && normalizarFecha(r.fecha) === fecha
        );
        const body = {
          id: registro?.id || null,
          fecha,
          responsable: responsableGrupo,
          area_id: area.id,
          bombillas_c: Number(valores?.[filaKey]?.[1]?.c || 0),
          bombillas_nc: Number(valores?.[filaKey]?.[1]?.nc || 0),
          reflectores_c: Number(valores?.[filaKey]?.[2]?.c || 0),
          reflectores_nc: Number(valores?.[filaKey]?.[2]?.nc || 0),
          lamparas_c: Number(valores?.[filaKey]?.[3]?.c || 0),
          lamparas_nc: Number(valores?.[filaKey]?.[3]?.nc || 0),
          aires_c: Number(valores?.[filaKey]?.[4]?.c || 0),
          aires_nc: Number(valores?.[filaKey]?.[4]?.nc || 0),
          observacion: observaciones[filaKey] || "",
        };
        const total = body.bombillas_c + body.bombillas_nc + body.reflectores_c + body.reflectores_nc +
          body.lamparas_c + body.lamparas_nc + body.aires_c + body.aires_nc;

        if (total === 0) {
          if (registro?.id) promesas.push(fetch(`/api/inspecciones-energia?id=${registro.id}`, { method: "DELETE" }));
          limpiarEstadoFila(filaKey);
          return;
        }
        promesas.push(fetch("/api/inspecciones-energia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
      });

      await Promise.all(promesas);
      const res = await fetch("/api/inspecciones-energia");
      const data = await res.json();
      setInspecciones(Array.isArray(data) ? data : data?.data || []);
      Swal.fire({ icon: "success", title: "Guardado completo", timer: 1500, showConfirmButton: false });
      setEditandoGrupo(null);
    } catch (error) {
      console.error("Error guardando todo energía:", error);
      Swal.fire({ icon: "error", title: "Error al guardar", text: "No se pudieron guardar los cambios" });
    }
  };

  const eliminarInspeccionGrupo = async (responsableGrupo: string, fecha: string) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar inspección?",
        text: `Se eliminará toda la inspección de ${responsableGrupo}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });
      if (!confirm.isConfirmed) return;

      const res = await fetch("/api/inspecciones-energia", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responsable: responsableGrupo, fecha }),
      });
      if (!res.ok) throw new Error(await res.text());

      const dataRes = await fetch("/api/inspecciones-energia");
      const data = await dataRes.json();
      setInspecciones(Array.isArray(data) ? data : data?.data || []);
      Swal.fire({ icon: "success", title: "Inspección eliminada", timer: 1200, showConfirmButton: false });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error eliminando" });
    }
  };

  // ─── Props agrupadas ───────────────────────────────────────────────────────
  const contenedoresProps = { modoNoche, estilos, fechaActual, inspecciones, setMostrarModal, finalizarInspeccion };
  const filtrosProps = {
    modoNoche, estilos, busqueda, setBusqueda, anioFiltro, setAnioFiltro,
    mesFiltro, setMesFiltro, aniosDisponibles, inspeccionesFiltradas,
    fechaActual, responsable, setDataBackend, dataBackend,
  };
  const tablaProps = {
    modoNoche, dataBackendFiltrada, dataBackend, setDataBackend,
    inspeccionesFiltradas, valores, observaciones, fechaSesion,
    editandoGrupo, setEditandoGrupo, handleChange, handleObs,
    calcularTotalFila, guardarFila, guardarTodo, eliminarInspeccionGrupo, estilos,
  };

  return (
    <div className={`w-full rounded-3xl p-3 sm:p-4 md:p-6 ${estilos.tarjeta}`}>
      <div className="mb-5 flex flex-col gap-4">
        <div className="text-center">
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide ${estilos.titulo}`}>
            Gestión de Energía
          </h2>
          <p className={`mt-1 text-xs sm:text-sm ${estilos.subtitulo}`}>
            Control de inspecciones, filtros e historial en tiempo real
          </p>

          <EnergiaContenedores {...contenedoresProps} />
        </div>

        <EnergiaFiltros {...filtrosProps} />
      </div>

      <MovilEnergia
        modoNoche={modoNoche}
        dataBackend={dataBackend}
        setInspecciones={setInspecciones}
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />

      <EnergiaTabla {...tablaProps} />

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
