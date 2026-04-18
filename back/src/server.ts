import { Elysia } from "elysia";
import { despachoRoutes } from "./routes/despacho";
import { emergenciasRoutes } from "./routes/emergencias";
import { carrosRoutes } from "./routes/carros";
import { accionesRoutes } from "./routes/acciones";

const app = new Elysia();

// Ruta base
app.get("/", () => "API funcionando 🚀");

// Middleware para usar tus rutas actuales
app.all("*", async ({ request }) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/despacho")) return despachoRoutes(request);
  if (url.pathname.startsWith("/emergencias")) return emergenciasRoutes(request);
  if (url.pathname.startsWith("/carros")) return carrosRoutes(request);
  if (url.pathname.startsWith("/acciones")) return accionesRoutes(request);

  return new Response("Not Found", { status: 404 });
});

app.listen(3000);