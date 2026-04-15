import { despachoRoutes } from "./routes/despacho";
import { emergenciasRoutes } from "./routes/emergencias";
import { carrosRoutes } from "./routes/carros";
import { accionesRoutes } from "./routes/acciones";

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Routing centralizado
    if (url.pathname.startsWith("/despacho")) return despachoRoutes(req);
    if (url.pathname.startsWith("/emergencias")) return emergenciasRoutes(req);
    if (url.pathname.startsWith("/carros")) return carrosRoutes(req);
    if (url.pathname.startsWith("/acciones")) return accionesRoutes(req);

    return new Response("Not Found", { status: 404 });
  },
});