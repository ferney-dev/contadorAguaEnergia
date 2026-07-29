const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://contador-backend-6eyq.onrender.com";

/* =========================
   GET · LISTAR COMPARATIVO
========================= */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/comparativoAgua`);
    const data = await res.json();

    return Response.json(data, { status: res.status });

  } catch (error) {
    return Response.json(
      { error: "Error obteniendo comparativo de agua" },
      { status: 500 }
    );
  }
}

/* =========================
   POST · CREAR COMPARATIVO
========================= */
export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/comparativoAgua/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Respuesta inválida del backend", detail: text },
        { status: res.status || 500 }
      );
    }

    return Response.json(data, { status: res.status });

  } catch (error) {
    return Response.json(
      { error: "Error guardando comparativo de agua" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE · ELIMINAR COMPARATIVO
========================= */
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Falta parámetro id" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/comparativoAgua/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      return Response.json(
        { error: "Error eliminando en backend" },
        { status: res.status }
      );
    }

    return Response.json(
      { mensaje: "Eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { error: "Error en DELETE" },
      { status: 500 }
    );
  }
}