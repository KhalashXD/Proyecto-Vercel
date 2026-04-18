//información, evaluaciones, etc
export async function accionesRoutes(req: Request) {
  const url = new URL(req.url);

  // POST /informacion
  if (url.pathname === "/informacion" && req.method === "POST") {
    const body = await req.json();

    return Response.json({
      message: "info recibida",
      data: body,
    });
  }

  // POST /evaluacion
  if (url.pathname === "/evaluacion" && req.method === "POST") {
    const body = await req.json();

    return Response.json({
      message: "evaluacion recibida",
      data: body,
    });
  }

  // GET /evaluaciones/:id
  if (url.pathname.startsWith("/evaluaciones/") && req.method === "GET") {
    const id = url.pathname.split("/")[2];

    return Response.json({
      evaluaciones: [],
      id,
    });
  }

  return new Response("Not Found", { status: 404 });
}