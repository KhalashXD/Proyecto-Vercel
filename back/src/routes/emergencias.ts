export async function emergenciasRoutes(req: Request) {
  const url = new URL(req.url);

  // GET /emergencias
  if (url.pathname === "/emergencias" && req.method === "GET") {
    return Response.json({
      ids: [],
      texts: [],
      dates: [],
    });
  }

  // GET /historial
  if (url.pathname === "/historial" && req.method === "GET") {
    return Response.json({
      ids: [],
      texts: [],
      dates: [],
    });
  }

  return new Response("Not Found", { status: 404 });
}