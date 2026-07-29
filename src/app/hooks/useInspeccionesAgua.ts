"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CAMPOS,
  MESES,
  STORAGE_MODO,
  STORAGE_RESPONSABLE,
} from "../components/inspecciones/agua/constants";
import {
  getFilaKey,
  getStorageKey,
  getThemeClasses,
  obtenerInicioSemana,
  obtenerSemana,
} from "../components/inspecciones/agua/utils";

export type RegistroValores = {
  [filaKey: string]: { [campo: number]: { c?: string; nc?: string } };
};

export type RegistroObservaciones = {
  [filaKey: string]: string;
};

export function useInspeccionesAgua(modoNoche: boolean) {
  const [dataBackend, setDataBackend] = useState<any[]>([]);
  const [valores, setValores] = useState<RegistroValores>({});
  const [observaciones, setObservaciones] = useState<RegistroObservaciones>({});
  const [fechaActual, setFechaActual] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modoNuevaInspeccion, setModoNuevaInspeccion] = useState(false);
  const [inspecciones, setInspecciones] = useState<any[]>([]);
  const [responsable, setResponsable] = useState("");
  const [fechaSesion, setFechaSesion] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoGrupo, setEditandoGrupo] = useState<string | null>(null);
  const [anioFiltro, setAnioFiltro] = useState(String(new Date().getFullYear()));
  const [mesFiltro, setMesFiltro] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );

  const estilos = getThemeClasses(modoNoche);

  const obtenerAnio = (fila: any) => {
    if (fila?.anio) return String(fila.anio);
    if (fila?.fecha) {
      const d = new Date(fila.fecha);
      if (!isNaN(d.getTime())) return String(d.getFullYear());
    }
    return "Sin año";
  };

  const obtenerMes = (fila: any) => {
    if (fila?.mes) return String(fila.mes);
    if (fila?.fecha) {
      const d = new Date(fila.fecha);
      if (!isNaN(d.getTime())) {
        return String(d.getMonth() + 1).padStart(2, "0");
      }
    }
    return "Sin mes";
  };

  const limpiarEstadoFila = (filaKey: string) => {
    setValores((prev) => {
      const copia = { ...prev };
      delete copia[filaKey];
      return copia;
    });

    setObservaciones((prev) => {
      const copia = { ...prev };
      delete copia[filaKey];
      return copia;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window === "undefined") return;
    const guardado = localStorage.getItem(STORAGE_RESPONSABLE);
    if (guardado) setResponsable(guardado);
  }, []);

  useEffect(() => {

    const data = { valores, observaciones };
    const key = getStorageKey(responsable);
    localStorage.setItem(key, JSON.stringify(data));
  }, [valores, observaciones, responsable]);

  useEffect(() => {
    if (modoNuevaInspeccion) return;
    if (!responsable) return;
    if (typeof window === "undefined") return;

    const key = getStorageKey(responsable);
    const data = localStorage.getItem(key);

    if (data) {
      try {
        const parsed = JSON.parse(data);
        setValores(parsed.valores || {});
        setObservaciones(parsed.observaciones || {});
      } catch (error) {
        console.error("Error leyendo localStorage:", error);
      }
    } else {
      setValores({});
      setObservaciones({});
    }
  }, [modoNuevaInspeccion, responsable]);

    if (typeof window === "undefined") return;
  useEffect(() => {
    const estado = localStorage.getItem(STORAGE_MODO);
    if (estado === "true") {
      setModoNuevaInspeccion(true);
    }
  }, []);

  useEffect(() => {
    const actualizarFecha = () => {
      const ahora = new Date();
      const fecha = ahora.toLocaleDateString("es-CO", {
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
          fetch("/api/areas-sanitarias"),
          fetch("/api/inspecciones-sanitarias"),
        ]);

        const areasData = await areasRes.json();
        const inspeccionesData = await inspeccionesRes.json();

        const areasFinal = Array.isArray(areasData)
          ? areasData
          : Array.isArray(areasData?.data)
          ? areasData.data
          : [];

        const inspeccionesFinal = Array.isArray(inspeccionesData)
          ? inspeccionesData
          : Array.isArray(inspeccionesData?.data)
          ? inspeccionesData.data
          : [];

        setDataBackend(Array.isArray(areasFinal) ? areasFinal : []);
        setInspecciones(Array.isArray(inspeccionesFinal) ? inspeccionesFinal : []);
      } catch (error) {
        console.error("Error inicializando sanitarios:", error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!dataBackend.length) return;
    if (modoNuevaInspeccion) return;
    if (!responsable) return;
    if (editandoGrupo) return;

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
        1: {
          c: String(inspeccion.sanitarios_c || ""),
          nc: String(inspeccion.sanitarios_nc || ""),
        },
        2: {
          c: String(inspeccion.orinales_c || ""),
          nc: String(inspeccion.orinales_nc || ""),
        },
        3: {
          c: String(inspeccion.duchas_c || ""),
          nc: String(inspeccion.duchas_nc || ""),
        },
        4: {
          c: String(inspeccion.lavamanos_c || ""),
          nc: String(inspeccion.lavamanos_nc || ""),
        },
        5: {
          c: String(inspeccion.llaves_c || ""),
          nc: String(inspeccion.llaves_nc || ""),
        },
      };

      nuevasObservaciones[filaKey] = inspeccion.observacion || "";
    });

    setValores((prev) => ({
      ...nuevosValores,
      ...prev,
    }));

    setObservaciones((prev) => ({
      ...nuevasObservaciones,
      ...prev,
    }));
  }, [dataBackend, inspecciones, responsable, fechaSesion, modoNuevaInspeccion, editandoGrupo]);

  const finalizarInspeccion = async () => {
    setModoNuevaInspeccion(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_MODO, "true");
      localStorage.removeItem(getStorageKey(responsable));
    }

    setValores({});
    setObservaciones({});
    setInspecciones([]);
    setFechaSesion(new Date().toISOString().split("T")[0]);

    Swal.fire({
      icon: "success",
      title: "Inspección finalizada",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const aniosDisponibles = useMemo(() => {
    const setAnios = new Set<string>();

    inspecciones.forEach((item) => {
      if (item?.fecha) {
        setAnios.add(String(new Date(item.fecha).getFullYear()));
      }
    });

    const anioActual = String(new Date().getFullYear());
    setAnios.add(anioActual);

    return ["Todos", ...Array.from(setAnios).sort((a, b) => Number(b) - Number(a))];
  }, [inspecciones]);

  const dataBackendFiltrada = useMemo(() => {
    return dataBackend.filter((fila) => {
      const nombre = String(fila?.nombre || "").toLowerCase();
      const textoBusqueda = busqueda.toLowerCase().trim();
      const coincideBusqueda = !textoBusqueda || nombre.includes(textoBusqueda);

      const anio = obtenerAnio(fila);
      const mes = obtenerMes(fila);

      const coincideAnio =
        anioFiltro === "Todos" || anio === anioFiltro || anio === "Sin año";
      const coincideMes =
        mesFiltro === "Todos" || mes === mesFiltro || mes === "Sin mes";

      return coincideBusqueda && coincideAnio && coincideMes;
    });
  }, [dataBackend, busqueda, anioFiltro, mesFiltro]);

  const inspeccionesPorFecha = useMemo(() => {
    const grupos: Record<string, any[]> = {};

    inspecciones.forEach((item) => {
      const fecha = obtenerInicioSemana(item.fecha);
      const responsableItem = item.responsable || "sin-responsable";
      const semana = obtenerSemana(fecha);
      const anio = new Date(fecha).getFullYear();

      const clave = `${anio}__semana${semana}__${responsableItem}`;

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
          const fecha = obtenerInicioSemana(r.fecha);
          const d = new Date(fecha);
          return String(d.getMonth() + 1).padStart(2, "0") === mesFiltro;
        });
      })
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [inspeccionesPorFecha, anioFiltro, mesFiltro]);

  const handleChange = (
    filaKey: string,
    campo: number,
    tipo: "c" | "nc",
    value: string
  ) => {
    const limpio = value.replace(/\D/g, "");

    setValores((prev) => ({
      ...prev,
      [filaKey]: {
        ...prev[filaKey],
        [campo]: {
          ...prev[filaKey]?.[campo],
          [tipo]: limpio,
        },
      },
    }));
  };

  const handleObs = (filaKey: string, value: string) => {
    setObservaciones((prev) => ({
      ...prev,
      [filaKey]: value,
    }));
  };

  const handleBlur = async (
    filaKey: string,
    campo: number,
    tipo: "c" | "nc",
    value: string,
    areaId: number,
    responsableGrupo: string,
    fecha: string
  ) => {
    const limpio = value.replace(/\D/g, "");
    const valor = Number(limpio || 0);

    try {
      const registro = inspecciones.find(
        (r) =>
          r.area_id === areaId &&
          r.responsable === responsableGrupo &&
          r.fecha?.split("T")[0] === fecha
      );

      const campoDef = CAMPOS.find((c) => c.key === campo);
      if (!campoDef) return;
      const campoKey = `${campoDef.db}_${tipo}`;

      const body = {
        id: registro?.id || null,
        fecha,
        responsable: responsableGrupo,
        area_id: areaId,
        [campoKey]: valor,
      };

      const allValues: Record<string, number> = {
        sanitarios_c: Number(registro?.sanitarios_c || 0),
        sanitarios_nc: Number(registro?.sanitarios_nc || 0),
        orinales_c: Number(registro?.orinales_c || 0),
        orinales_nc: Number(registro?.orinales_nc || 0),
        duchas_c: Number(registro?.duchas_c || 0),
        duchas_nc: Number(registro?.duchas_nc || 0),
        lavamanos_c: Number(registro?.lavamanos_c || 0),
        lavamanos_nc: Number(registro?.lavamanos_nc || 0),
        llaves_c: Number(registro?.llaves_c || 0),
        llaves_nc: Number(registro?.llaves_nc || 0),
      };
      allValues[campoKey] = valor;

      const total = Object.values(allValues).reduce((acc, v) => acc + v, 0);

      if (total > 0) {
        await fetch("/api/inspecciones-sanitarias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...allValues, ...body }),
        });

        const res = await fetch("/api/inspecciones-sanitarias");
        const data = await res.json();
        setInspecciones(Array.isArray(data) ? data : data?.data || []);

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
      console.error("Error en handleBlur sanitarios:", error);
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

  const obtenerValor = (
    filaKey: string,
    campo: number,
    tipo: "c" | "nc",
    registro: any
  ) => {
    const valorLocal = valores?.[filaKey]?.[campo]?.[tipo];

    if (valorLocal !== undefined && valorLocal !== "") {
      return Number(valorLocal);
    }

    if (registro) {
      const campoDef = CAMPOS.find((c) => c.key === campo);
      if (!campoDef) return 0;
      return Number(registro?.[`${campoDef.db}_${tipo}`] || 0);
    }

    return 0;
  };

  const calcularTotalFila = (filaKey: string, registro: any) => {
    return CAMPOS.reduce((acc, campo) => {
      const c = obtenerValor(filaKey, campo.key, "c", registro);
      const nc = obtenerValor(filaKey, campo.key, "nc", registro);
      return acc + c + nc;
    }, 0);
  };

  const guardarFila = async (filaKey: string, area: any, registro: any) => {
    try {
      if (!area?.id) return;

      const responsableFinal = responsable;

      if (!responsableFinal) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Debes seleccionar un responsable",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      let registroSeguro = registro;
      if (registro && registro.responsable !== responsableFinal) {
        registroSeguro = null;
      }

      const fechaNormal = fechaSesion;
      const semana = obtenerSemana(fechaNormal);
      const anio = new Date(fechaNormal).getFullYear();

      const body = {
        id: registroSeguro?.id ?? null,
        fecha: fechaSesion,
        responsable: responsableFinal,
        area_id: area.id,
        anio: anio,
        semana: semana,

        sanitarios_c: obtenerValor(filaKey, 1, "c", registroSeguro),
        sanitarios_nc: obtenerValor(filaKey, 1, "nc", registroSeguro),

        orinales_c: obtenerValor(filaKey, 2, "c", registroSeguro),
        orinales_nc: obtenerValor(filaKey, 2, "nc", registroSeguro),

        duchas_c: obtenerValor(filaKey, 3, "c", registroSeguro),
        duchas_nc: obtenerValor(filaKey, 3, "nc", registroSeguro),

        lavamanos_c: obtenerValor(filaKey, 4, "c", registroSeguro),
        lavamanos_nc: obtenerValor(filaKey, 4, "nc", registroSeguro),

        llaves_c: obtenerValor(filaKey, 5, "c", registroSeguro),
        llaves_nc: obtenerValor(filaKey, 5, "nc", registroSeguro),

        observacion: observaciones[filaKey] || registroSeguro?.observacion || "",
      };

      const total = calcularTotalFila(filaKey, registroSeguro);

      if (total === 0 && registroSeguro?.id) {
        const deleteRes = await fetch(
          `/api/inspecciones-sanitarias?id=${registroSeguro.id}`,
          { method: "DELETE" }
        );

        if (!deleteRes.ok) {
          const errorText = await deleteRes.text();
          throw new Error(errorText || "No se pudo eliminar");
        }

        limpiarEstadoFila(filaKey);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Registro eliminado",
          timer: 1200,
          showConfirmButton: false,
        });
      } else if (total > 0) {
        const method = "POST";
        const response = await fetch("/api/inspecciones-sanitarias", {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "No se pudo guardar");
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: registroSeguro?.id ? "Registro actualizado" : "Registro creado",
          timer: 1200,
          showConfirmButton: false,
        });
      }

      const res = await fetch("/api/inspecciones-sanitarias");
      const data = await res.json();
      const dataFinal = Array.isArray(data) ? data : data?.data || [];
      setInspecciones(dataFinal);
    } catch (error) {
      console.error("Error guardando fila sanitarios:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el registro",
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
            obtenerInicioSemana(r.fecha) === fecha
        );

        const body = {
          id: registro?.id || null,
          fecha,
          responsable: responsableGrupo,
          area_id: area.id,

          sanitarios_c: Number(valores?.[filaKey]?.[1]?.c || 0),
          sanitarios_nc: Number(valores?.[filaKey]?.[1]?.nc || 0),

          orinales_c: Number(valores?.[filaKey]?.[2]?.c || 0),
          orinales_nc: Number(valores?.[filaKey]?.[2]?.nc || 0),

          duchas_c: Number(valores?.[filaKey]?.[3]?.c || 0),
          duchas_nc: Number(valores?.[filaKey]?.[3]?.nc || 0),

          lavamanos_c: Number(valores?.[filaKey]?.[4]?.c || 0),
          lavamanos_nc: Number(valores?.[filaKey]?.[4]?.nc || 0),

          llaves_c: Number(valores?.[filaKey]?.[5]?.c || 0),
          llaves_nc: Number(valores?.[filaKey]?.[5]?.nc || 0),

          observacion: observaciones[filaKey] || "",
        };

        const total =
          body.sanitarios_c +
          body.sanitarios_nc +
          body.orinales_c +
          body.orinales_nc +
          body.duchas_c +
          body.duchas_nc +
          body.lavamanos_c +
          body.lavamanos_nc +
          body.llaves_c +
          body.llaves_nc;

        if (total === 0) {
          if (registro?.id) {
            promesas.push(
              fetch(`/api/inspecciones-sanitarias?id=${registro.id}`, {
                method: "DELETE",
              })
            );
          }
          limpiarEstadoFila(filaKey);
          return;
        }

        promesas.push(
          fetch("/api/inspecciones-sanitarias", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
        );
      });

      await Promise.all(promesas);

      const res = await fetch("/api/inspecciones-sanitarias");
      const data = await res.json();
      const dataFinal = Array.isArray(data) ? data : data?.data || [];
      setInspecciones(dataFinal);

      Swal.fire({
        icon: "success",
        title: "Guardado completo",
        timer: 1500,
        showConfirmButton: false,
      });

      setEditandoGrupo(null);
    } catch (error) {
      console.error("Error guardando todo sanitarios:", error);

      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No se pudieron guardar los cambios",
      });
    }
  };

  const eliminarInspeccionGrupo = async (
    responsableGrupo: string,
    fecha: string
  ) => {
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

      const res = await fetch("/api/inspecciones-sanitarias", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responsable: responsableGrupo,
          fecha: fecha,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const dataRes = await fetch("/api/inspecciones-sanitarias");
      const data = await dataRes.json();
      setInspecciones(Array.isArray(data) ? data : data?.data || []);

      Swal.fire({
        icon: "success",
        title: "Inspección eliminada",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error eliminando",
      });
    }
  };

  return {
    dataBackend,
    setDataBackend,
    valores,
    observaciones,
    fechaActual,
    busqueda,
    modoNuevaInspeccion,
    inspecciones,
    setInspecciones,
    responsable,
    fechaSesion,
    mostrarModal,
    editandoGrupo,
    anioFiltro,
    mesFiltro,
    estilos,
    CAMPOS,
    MESES,
    aniosDisponibles,
    dataBackendFiltrada,
    inspeccionesFiltradas,
    setBusqueda,
    setResponsable,
    setFechaSesion,
    setMostrarModal,
    setEditandoGrupo,
    setAnioFiltro,
    setMesFiltro,
    finalizarInspeccion,
    handleChange,
    handleObs,
    handleBlur,
    obtenerValor,
    calcularTotalFila,
    guardarFila,
    guardarTodo,
    eliminarInspeccionGrupo,
  };
}

export type UseInspeccionesAguaReturn = ReturnType<typeof useInspeccionesAgua>;
