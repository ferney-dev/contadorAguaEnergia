const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

/* =========================
   GET · LISTAR INSPECCIONES ENERGÍA
========================= */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/inspecciones-energia/`);

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensaje: text };
    }

    return Response.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("GET ERROR:", error);

    return Response.json(
      {
        error: error.message || "Error obteniendo inspecciones de energía",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   POST · CREAR / ACTUALIZAR (UPSERT)
========================= */
export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/inspecciones-energia/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensaje: text };
    }

    if (!res.ok) {
      console.error("POST BACKEND ERROR:", data);
    }

    return Response.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("POST ERROR:", error);

    return Response.json(
      {
        error: error.message || "Error guardando inspección de energía",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   PUT · ACTUALIZAR
========================= */
export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json(
        {
          error: "Falta el id para actualizar",
        },
        {
          status: 400,
        }
      );
    }

    const res = await fetch(`${BACKEND_URL}/inspecciones-energia/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensaje: text };
    }

    if (!res.ok) {
      console.error("PUT BACKEND ERROR:", data);
    }

    return Response.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("PUT ERROR:", error);

    return Response.json(
      {
        error: error.message || "Error actualizando inspección de energía",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE · ELIMINAR
========================= */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    let res;

    if (id) {
      res = await fetch(
        `${BACKEND_URL}/inspecciones-energia/?id=${id}`,
        {
          method: "DELETE",
        }
      );
    } else {
      const body = await request.json();

      res = await fetch(`${BACKEND_URL}/inspecciones-energia/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    }

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensaje: text };
    }

    if (!res.ok) {
      console.error("DELETE BACKEND ERROR:", data);
    }

    return Response.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return Response.json(
      {
        error: error.message || "Error eliminando inspección de energía",
      },
      {
        status: 500,
      }
    );
  }
}