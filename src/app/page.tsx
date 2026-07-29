"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import {
  Home,
  Droplet,
  Zap,
  BookOpen,
  Sun,
  Moon,
  Menu,
  Plug,
  Recycle,
  Layers,
  ClipboardList,
  Printer
} from "lucide-react";

import Image from "next/image";
import { FaFaucet } from "react-icons/fa";

import DashboardInicio from "./components/dashboard/dasboard";
import ConsumoAgua from "./components/consumoAgua/consumoAgua";
import ConsumoEnergia from "./components/consumoEnergia/consumoEnergia";
import Lecturas from "./components/lecturas/lecturas";
import ComparativoAgua from "./components/comparativoAgua/comparativoAgua";
import ComparativoEnergia from "./components/comparativoEnergia/comparativoEnergia";
import Inspecciones from "./components/inspecciones/inspecciones";
import Resmas from "./components/resmas/resmas";
import Tonner from "./components/toner/toner";
import BotonesScroll from "./components/BotonSubir";

const IDS_VISTAS = [
  "inicio",
  "agua",
  "energía",
  "lecturas",
  "comparativoagua",
  "comparativoenergia",
  "inspecciones",
  "resmas",
  "tonner",
];

function leerVistaDesdeUrl(): string {
  if (typeof window === "undefined") return "inicio";

  const vista = new URLSearchParams(window.location.search).get("vista");

  return vista && IDS_VISTAS.includes(vista) ? vista : "inicio";
}

function actualizarUrlVista(vista: string, reemplazar = false) {
  const url = new URL(window.location.href);

  if (vista === "inicio") {
    url.searchParams.delete("vista");
  } else {
    url.searchParams.set("vista", vista);
  }

  const destino = `${url.pathname}${url.search}`;

  if (reemplazar) {
    window.history.replaceState({ vista }, "", destino);
  } else {
    window.history.pushState({ vista }, "", destino);
  }
}

export default function MenuPrincipal() {

  /* ================= ESTADOS ================= */

  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [esMovil, setEsMovil] = useState(false);
  const [vistaActual, setVistaActual] = useState("inicio");
  const [modoNoche, setModoNoche] = useState(false);
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());

  const mainRef = useRef<HTMLElement>(null);

  const navegarVista = useCallback((id: string) => {
    setVistaActual(id);
    actualizarUrlVista(id);
  }, []);

  /* ================= RESTAURAR VISTA DESDE URL ================= */

  useLayoutEffect(() => {
    setVistaActual(leerVistaDesdeUrl());

    const onPopState = () => {
      setVistaActual(leerVistaDesdeUrl());
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* ================= DETECTAR MÓVIL ================= */

  useEffect(() => {

    const verificarTamano = () => {
      setEsMovil(window.innerWidth < 768);
    };

    verificarTamano();
    window.addEventListener("resize", verificarTamano);

    return () => window.removeEventListener("resize", verificarTamano);

  }, []);

  /* ================= ACTUALIZAR AÑO ================= */

  useEffect(() => {

    const intervalo = setInterval(() => {

      const anioSistema = new Date().getFullYear();

      setAnioActual(prev =>
        prev !== anioSistema ? anioSistema : prev
      );

    }, 3600000);

    return () => clearInterval(intervalo);

  }, []);

  /* ================= MODO NOCHE ================= */

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("modoNoche") === "true") {
      setModoNoche(true);
    }
  }, []);

  const toggleModoNoche = () => {
    const nuevo = !modoNoche;
    setModoNoche(nuevo);
    if (typeof window !== "undefined") {
      localStorage.setItem("modoNoche", nuevo.toString());
    }
  };

  /* ================= COLORES ================= */

  const colores = {

    header: modoNoche
      ? "bg-[#1e1e1e] text-white"
      : "bg-[#C40000] text-white",

    sidebar: modoNoche
      ? "bg-[#2a2a2a] text-white"
      : "bg-[#1f1f1f] text-white",

    sidebarHover: modoNoche
      ? "hover:bg-[#3a3a3a]"
      : "hover:bg-[#2f2f2f]",

    sidebarActivo: modoNoche
      ? "bg-[#3a3a3a] shadow-inner"
      : "bg-[#3a3a3a] shadow-inner border-l-4 border-red-600",

    contenido: modoNoche
      ? "bg-[#121212] text-white"
      : "bg-[#f5f5f5] text-black",

  };

  /* ================= MENÚ ================= */

  const opciones = [

    { id: "inicio", nombre: "Inicio", icono: <Home style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "agua", nombre: "Agua", icono: <Droplet style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "energía", nombre: "Energía", icono: <Zap style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "lecturas", nombre: "Lecturas", icono: <BookOpen style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "comparativoagua", nombre: "Comparativo ", icono: <FaFaucet style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "comparativoenergia", nombre: "Comparativo ", icono: <Plug style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "inspecciones", nombre: "Inspecciones ", icono: <Recycle style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "resmas", nombre: "Resmas ", icono: <Layers style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },

    { id: "tonner", nombre: "Tonners ", icono: <Printer style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, flexShrink: 0 }} /> },
  ];
  /* ================= TITULOS ================= */

  const obtenerTitulo = () => {

    if (vistaActual === "agua") {
      return {
        titulo: "Consumo de agua",
        icono: <Droplet size={28} />,
      };
    }

    if (vistaActual === "energía") {
      return {
        titulo: "Consumo de energía",
        icono: <Zap size={28} />,
      };
    }
    if (vistaActual === "lecturas") {
      return {
        titulo: "Registrar lecturas",
        icono: <BookOpen size={28} />,
      };
    }

    if (vistaActual === "comparativoagua") {
      return {
        titulo: "Comparativo agua",
        icono: <FaFaucet size={28} />,
      };
    }

    if (vistaActual === "comparativoenergia") {
      return {
        titulo: "Comparativo energía",
        icono: <Plug size={28} />,
      };
    }

     if (vistaActual === "inspecciones") {
      return {
        titulo: "Registrar Inspecciones",
        icono: <Recycle size={28} />,
      };
    }
      if (vistaActual === "resmas") {
      return {
        titulo: "Registrar Resmas",
        icono: <ClipboardList   size={28} />,
      };
    }
    if (vistaActual === "tonner") {
      return {
        titulo: "Registrar Tonners",
        icono: <Printer   size={28} />,
      };
    }

    return {
      titulo: `Monitoreo de SGA ${anioActual}`,
      icono: null,
    };

  };

  const tituloActual = obtenerTitulo();

  const handleClickOpcion = () => {
    if (esMovil) setSidebarAbierto(false);
  };

  /* ================= RENDER ================= */

  return (

    <div className={`w-full flex flex-col h-screen overflow-hidden ${colores.contenido}`}>

      {/* HEADER */}

      <header className={`w-full flex items-center justify-between px-4 md:px-6 py-4 shadow-lg ${colores.header}`}>

        <div className="flex items-center gap-3">

          <Image
            src="/img/logo.png"
            alt="Envia logo"
            width={60}
            height={40}
          />

          <button
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className={`p-2 md:p-3 rounded transition ${modoNoche ? "hover:bg-[#333]" : "hover:bg-[#c10510]"}`}
          >
            <Menu size={30} />
          </button>

        </div>

      <h1 className="
  text-lg md:text-3xl font-extrabold tracking-wide
  flex items-center gap-2
  justify-start md:justify-center
  text-left md:text-center
  flex-1
">
          {tituloActual.icono}
          {tituloActual.titulo}
        </h1>

        <button
          onClick={toggleModoNoche}
          className={`p-2 md:p-3 rounded transition ${modoNoche ? "hover:bg-[#333]" : "hover:bg-[#c10510]"}`}
        >
          {modoNoche ? <Sun size={30} /> : <Moon size={30} />}
        </button>

      </header>

      {/* CONTENEDOR */}

      <div className="flex w-full flex-1 overflow-hidden relative">

        {/* SIDEBAR */}

        <aside
          className={`
            absolute md:static top-0 left-0 h-full z-40
            transition-all duration-300 pt-20 md:pt-10
            overflow-y-auto scrollbar-hide
            ${colores.sidebar}
            ${
              esMovil
                ? sidebarAbierto
                  ? "translate-x-0 shadow-xl"
                  : "-translate-x-full"
                : ""
            }
          `}
          style={{
            width: esMovil
              ? 224
              : sidebarAbierto
              ? 240
              : 80,
          }}
        >

          <nav className="flex flex-col space-y-8 px-2">

            {opciones.map((op, i) => {

              const activa = vistaActual === op.id;

              return (

                <button
                  key={i}
                  onClick={() => {
                    navegarVista(op.id);
                    handleClickOpcion();
                  }}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition
                    ${sidebarAbierto ? "justify-start" : "justify-center"}
                    ${activa ? colores.sidebarActivo : colores.sidebarHover}
                  `}
                >

                  <div style={{ width: 40, minWidth: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {op.icono}
                  </div>

                  {sidebarAbierto && (
                    <span className="ml-4 text-lg font-medium">
                      {op.nombre}
                    </span>
                  )}

                </button>

              );

            })}

          </nav>

        </aside>

        {/* CONTENIDO */}

        <main ref={mainRef} className={`flex-1 overflow-y-auto p-5 md:p-10 ${colores.contenido}`}>

          {vistaActual === "inicio" && <DashboardInicio modoNoche={modoNoche} />}

          {vistaActual === "agua" && <ConsumoAgua modoNoche={modoNoche} />}

          {vistaActual === "energía" && <ConsumoEnergia modoNoche={modoNoche} />}

          {vistaActual === "lecturas" && <Lecturas modoNoche={modoNoche} />}

          {vistaActual === "comparativoagua" && <ComparativoAgua modoNoche={modoNoche} />}

          {vistaActual === "comparativoenergia" && <ComparativoEnergia modoNoche={modoNoche} />}

          {vistaActual === "inspecciones" && <Inspecciones modoNoche={modoNoche} />}

          {vistaActual === "resmas" && <Resmas modoNoche={modoNoche} />}

          {vistaActual === "tonner" && <Tonner modoNoche={modoNoche} />}

                    <footer
  className={`
    mt-12 py-6
    border-t
    ${modoNoche
      ? "bg-[#1a1a1a] border-[#2f2f2f] text-gray-300"
      : "bg-[#f2f2f2] border-gray-300 text-gray-700"}
  `}
>
  <div className="max-w-6xl mx-auto flex flex-col gap-4 text-center px-4">

    {/* NOMBRE EMPRESA */}
    <h2
      className={`
        text-lg md:text-xl font-bold tracking-wide
        ${modoNoche ? "text-gray-100" : "text-gray-800"}
      `}
    >
      Envia Mensajería y Transporte
    </h2>

    {/* LEMA */}
    <p
      className={`
        text-sm md:text-base font-medium
        ${modoNoche ? "text-gray-400" : "text-gray-600"}
      `}
    >
      Movemos el país con eficiencia, responsabilidad y compromiso sostenible
    </p>

    {/* INFO SISTEMA */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm mt-2">
      <div>
        <span className="font-semibold">Sistema</span><br />
        Comparativo de SGA
      </div>

      <div>
        <span className="font-semibold">Año</span><br />
        {new Date().getFullYear()}
      </div>

      <div>
        <span className="font-semibold">Versión</span><br />
        v2.0 · Producción
      </div>
    </div>

    {/* COPYRIGHT */}
    <div
      className={`
        mt-3 text-[11px]
        ${modoNoche ? "text-gray-500" : "text-gray-500"}
      `}
    >
      © {new Date().getFullYear()} Envia · Uso interno corporativo
    </div>
  </div>
</footer>

        </main>

      </div>

      <BotonesScroll contenedorRef={mainRef} />

    </div>

  );

}