# Manual de Usuario

## Phoenix S.O.S

Este manual explica como usar el sistema de gestion de emergencias y despacho de unidades.

## Acceso al sistema

1. Abre el frontend en el navegador:

```text
http://localhost:3000
```

2. Ingresa con tu correo y contrasena.
3. Si el sistema solicita verificacion por SMS, ingresa el codigo recibido.
4. Al iniciar sesion correctamente, entraras al panel operativo.

## Navegacion principal

La barra superior permite acceder a:

- **Despacho**: registrar una nueva emergencia y asignar unidades.
- **Emergencias**: ver emergencias activas.
- **Historial**: consultar emergencias cerradas.
- **Salir**: cerrar sesion.

Tambien muestra datos climaticos actuales:

- Condicion
- Temperatura
- Humedad
- Viento
- Lluvia
- IPO

## Registrar una emergencia

1. Entra a **Despacho**.
2. Selecciona la calle principal.
3. Selecciona la interseccion.
4. Selecciona la clave o tipo de emergencia.
5. Ingresa informacion adicional si corresponde.
6. Revisa la ubicacion en el mapa.
7. Confirma el despacho.

Al confirmar:

- El sistema crea la emergencia.
- Asigna unidades disponibles segun reglas del backend.
- Cambia el estado de las unidades despachadas.
- Si Telegram esta configurado, envia una notificacion automaticamente.

## Estados de unidades

Las unidades pueden aparecer con distintos estados:

- **Verde**: disponible en cuartel.
- **Amarillo**: despachada hacia una emergencia.
- **Rojo**: confirmada en el lugar de la emergencia.
- **Azul**: retorno pendiente al cuartel.
- **Gris**: no disponible.

## Ver emergencias activas

1. Entra a **Emergencias**.
2. Revisa la lista de emergencias en curso.
3. Presiona **Abrir** en una emergencia para ver el detalle.

En el detalle se muestra:

- Clave de emergencia.
- Ubicacion.
- Estado.
- Cronologia de eventos.
- Acciones operativas disponibles.
- Botones para descargar reportes PDF y Excel.

## Acciones sobre una emergencia

Dentro del detalle de una emergencia, entra a la pestana **Acciones**.

### Unidades

Permite gestionar carros asociados a la emergencia:

1. **Unidades despachadas**: selecciona una unidad amarilla y confirma su llegada para cambiarla a rojo.
2. **Unidades en la emergencia**: selecciona una unidad roja y liberala cuando corresponda.
3. **Unidades disponibles**: selecciona unidades verdes para agregarlas a la emergencia.

### Evaluacion

1. Entra a **Evaluacion**.
2. Escribe la evaluacion del incidente.
3. Presiona **Enviar**.

La evaluacion queda guardada en la cronologia.

### Clave

1. Entra a **Clave**.
2. Selecciona la nueva clave de emergencia.
3. Presiona **Confirmar**.

La clave del incidente se actualiza y queda registro en la cronologia.

### Instrucciones

1. Entra a **Instrucciones**.
2. Selecciona una o mas unidades.
3. Escribe la instruccion.
4. Presiona **Registrar**.

Las instrucciones quedan guardadas por unidad y aparecen en el registro de instrucciones.

### Superacion

1. Entra a **Superacion**.
2. Marca **Superado**.
3. Presiona **Confirmar**.

Esto cierra la emergencia y mueve las unidades a retorno pendiente.

### Comandante

1. Entra a **Comandante**.
2. Busca y selecciona el comandante de incidente.
3. Presiona **Confirmar**.

El cambio queda registrado en la cronologia.

### Externos

1. Entra a **Externos**.
2. Selecciona el recurso externo solicitado.
3. Presiona **Confirmar**.

Ejemplos de recursos:

- CONAF
- Chilquinta
- CGE
- ESVAL
- Seguridad Ciudadana
- Municipalidad

### Informacion

1. Entra a **Informacion**.
2. Escribe la informacion relevante.
3. Presiona **Enviar**.

El dato queda guardado en la cronologia.

### Victimas

1. Entra a **Victimas**.
2. Completa los datos solicitados:
   - Nombre
   - Sexo
   - Edad
   - Tipo de lesion
   - Motivo de estar en el lugar
   - Detalles adicionales
3. Presiona **Registrar victima**.

Las victimas registradas aparecen en la tabla inferior y se pueden buscar por nombre.

### Personal

1. Entra a **Personal**.
2. Revisa el personal requerido y registrado.
3. Para cada unidad, selecciona responsable y/o dotacion.
4. Presiona **Guardar** en la fila correspondiente.

El registro queda asociado a la unidad y a la emergencia.

## Historial

1. Entra a **Historial**.
2. Revisa las emergencias cerradas.
3. Presiona **Ver emergencia** para abrir el detalle.

Desde esta vista tambien puedes descargar:

- Reporte PDF general.
- Reporte Excel general.

## Descargar reportes

Los reportes se pueden descargar desde:

- **Historial**
- **Detalle de emergencia**

Formatos disponibles:

- PDF
- Excel

En el detalle de emergencia, los reportes corresponden al incidente abierto.
En historial, los reportes corresponden al conjunto de emergencias registradas.

## Telegram

Cuando Telegram esta configurado, el sistema envia automaticamente un mensaje al crear una emergencia desde **Despacho**.

Si no llega el mensaje:

1. Verifica que el bot este iniciado en Telegram.
2. Verifica que el bot pertenezca al grupo o chat correcto.
3. Verifica que el archivo `.env` tenga:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

4. Reinicia el backend:

```powershell
docker compose up -d --force-recreate backend
```

## Problemas frecuentes

### No aparecen carros

Verifica que el backend y la base de datos esten activos:

```powershell
docker compose ps
Invoke-RestMethod http://localhost:5000/db-test
Invoke-RestMethod http://localhost:5000/vehiculos
```

### No se guarda una accion

Revisa que el backend este corriendo:

```powershell
docker compose logs --tail=100 backend
```

Si la base fue creada antes de cambios recientes, reinicia el backend:

```powershell
docker compose up -d --force-recreate backend
```

### El bot no envia mensajes

Prueba el endpoint:

```powershell
Invoke-RestMethod -Method Post http://localhost:5000/telegram/send `
  -ContentType "application/json" `
  -Body '{"message":"Prueba Telegram"}'
```

Si responde `chat not found`, el `TELEGRAM_CHAT_ID` no corresponde al chat del bot.

### El clima no carga

Prueba:

```powershell
Invoke-RestMethod http://localhost:5000/api/fire-risk
```

Si responde con error o sin datos, puede haber un problema temporal consultando Open-Meteo.

## Cierre de sesion

Presiona **Salir** en la barra superior para cerrar la sesion del usuario actual.

## Recomendaciones de uso

- Registra informacion clara y breve en cada accion.
- Confirma la llegada de unidades antes de liberarlas.
- Usa el historial para validar que una emergencia cerrada quedo registrada.
- Descarga reportes PDF o Excel cuando necesites respaldar una emergencia.
- No compartas el archivo `.env`, porque contiene credenciales sensibles.
