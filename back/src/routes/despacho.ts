export async function despachoRoutes(req: Request) {
  const url = new URL(req.url);

  // POST /despacho
  if (url.pathname === "/despacho" && req.method === "POST") {
    const body = await req.json();

    //  lógica real pendiente
    return Response.json({
      resultado: "pendiente",
      despacho: [],
      id: null,
    });
  }

  return new Response("Not Found", { status: 404 });
}