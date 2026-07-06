"use client";

import { useEffect, useState, RefObject } from "react";

interface Props {
  contenedorRef: RefObject<HTMLElement | null>;
}

export default function BotonesScroll({ contenedorRef }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [alturaTotal, setAlturaTotal] = useState(0);

  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollY(el.scrollTop);
      setAlturaTotal(el.scrollHeight - el.clientHeight);
    };

    handleScroll(); // ejecutar una vez
    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [contenedorRef]);

  const subirArriba = () => {
    contenedorRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bajarAbajo = () => {
    contenedorRef.current?.scrollTo({ top: alturaTotal, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-2 flex flex-col gap-3 z-50">

      {/* 🔼 SUBIR */}
      <button
        onClick={subirArriba}
        className={`
          p-3 rounded-full shadow-md transition-all duration-300
          ${scrollY > 100
            ? "bg-red-600 hover:bg-red-700 text-white scale-100"
            : "bg-gray-400 text-white opacity-60 scale-90"}
        `}
      >
        ↑
      </button>

      {/* 🔽 BAJAR */}
      <button
        onClick={bajarAbajo}
        className={`
          p-3 rounded-full shadow-md transition-all duration-300
          ${scrollY < alturaTotal - 100
            ? "bg-red-600 hover:bg-red-700 text-white scale-100"
            : "bg-gray-400 text-white opacity-60 scale-90"}
        `}
      >
        ↓
      </button>

    </div>
  );
}
