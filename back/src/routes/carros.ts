export async function carrosRoutes(req: Request) {
  const url = new URL(req.url);

  // GET /carros/:id
  if (url.pathname.startsWith("/carros/") && req.method === "GET") {
    const id = url.pathname.split("/")[2];

    return Response.json({
      carros: [],
      emergencia_id: id,
    });
  }

  // POST /estado-carro
  if (url.pathname === "/estado-carro" && req.method === "POST") {
    const body = await req.json();

    return Response.json({
      message: "estado actualizado (base)",
      data: body,
    });
  }

  return new Response("Not Found", { status: 404 });
}