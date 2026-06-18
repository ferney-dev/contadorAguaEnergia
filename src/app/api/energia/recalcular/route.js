const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/energia/recalcular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { error: "Error recalculando consumo de energía" },
      { status: 500 }
    );
  }
}
