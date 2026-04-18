# Requerimientos Funcionales y No Funcionales de la Base de Datos
## Sistema de Gestión de Emergencias y Despacho de Bomberos - Grupo Phoenix

---

## PARTE 1: REQUERIMIENTOS FUNCIONALES (RF)

### Nivel 1: Gestión de Infraestructura Operativa

#### RF-1.1 Gestión de Estaciones
**Descripción**: El sistema debe permitir registrar y mantener la información de todas las estaciones de bomberos.

**Funcionalidades**:
- RF-1.1.1: Crear nueva estación con código único, nombre único, dirección, coordenadas geográficas (latitud/longitud), teléfono y email
- RF-1.1.2: Actualizar información de estación (excepto código y nombre)
- RF-1.1.3: Consultar todas las estaciones activas
- RF-1.1.4: Consultar estación por código o nombre
- RF-1.1.5: Filtrar estaciones por ubicación geográfica (rango de coordenadas)
- RF-1.1.6: Listar información de contacto de estaciones (teléfono, email)

**Datos a Capturar**:
- Código de estación (único, inmutable)
- Nombre estación (único, inmutable)
- Dirección completa
- Coordenadas geográficas (precisión mínima 8 decimales)
- Teléfono de contacto
- Email de contacto
- Timestamps de creación y actualización

**Restricciones**:
- Código y nombre son únicos en todo el sistema
- Coordenadas deben ser válidas (rango WGS84)
- Teléfono debe cumplir formato internacional

---

#### RF-1.2 Gestión de Vehículos/Unidades
**Descripción**: El sistema debe permitir gestionar todos los vehículos operativos de las estaciones.

**Funcionalidades**:
- RF-1.2.1: Registrar nuevo vehículo con código único, tipo de vehículo, estación de origen, estado inicial (verde), nombre de conductor y capacidad
- RF-1.2.2: Actualizar estado de vehículo (verde ↔ amarillo ↔ rojo) en tiempo real
- RF-1.2.3: Registrar ubicación actual del vehículo (latitud, longitud, timestamp)
- RF-1.2.4: Consultar disponibilidad de vehículos por estación
- RF-1.2.5: Listar vehículos por estado (disponibles, en tránsito, asignados)
- RF-1.2.6: Filtrar vehículos por tipo (Camión Bombero, Ambulancia, Escalera, Tanquero, etc.)
- RF-1.2.7: Consultar historial de ubicación de un vehículo
- RF-1.2.8: Cambiar asignación de vehículo a otra estación
- RF-1.2.9: Listar vehículos por capacidad de personal
- RF-1.2.10: Registrar cambio de conductor

**Datos a Capturar**:
- Código de vehículo (único)
- Tipo de vehículo (referencia a catálogo)
- Estación asignada
- Estado operativo (verde/amarillo/rojo)
- Nombre conductor
- Capacidad de personal
- Última ubicación conocida (lat, lng, timestamp)
- Timestamps de creación y actualización

**Estados Permitidos**:
- GREEN (Verde): Disponible en cuartel
- YELLOW (Amarillo): No disponible temporalmente o en transición
- RED (Rojo): Asignado a una emergencia

**Restricciones**:
- No se puede eliminar vehículo si pertenece a incidente activo
- Cambio de estado debe ser auditable
- Ubicación debe actualizarse con timestamp preciso
- Cada vehículo debe tener una estación asignada

---

#### RF-1.3 Gestión de Tipos de Vehículos (Catálogo)
**Descripción**: Mantener catálogo de tipos de vehículos disponibles en el sistema.

**Funcionalidades**:
- RF-1.3.1: Crear tipo de vehículo nuevo (código, nombre, descripción)
- RF-1.3.2: Consultar tipos de vehículos disponibles
- RF-1.3.3: Actualizar información de tipo de vehículo
- RF-1.3.4: Listar vehículos por tipo

**Datos a Capturar**:
- Código de tipo (único)
- Nombre de tipo (único)
- Descripción

**Restricciones**:
- Código y nombre son únicos
- Predefinidos: Camión Bombero, Ambulancia, Escalera, Tanquero

---

### Nivel 2: Gestión de Emergencias

#### RF-2.1 Registro de Emergencias
**Descripción**: El sistema permite registrar nuevas llamadas de emergencia con información de ubicación y tipo.

**Funcionalidades**:
- RF-2.1.1: Crear nuevo incidente mediante intersección de dos calles (calle 1, calle 2)
- RF-2.1.2: Registrar ubicación automática mediante geocodificación (latitud, longitud)
- RF-2.1.3: Seleccionar tipo de emergencia desde catálogo predefinido
- RF-2.1.4: Registrar información del llamante (nombre, teléfono)
- RF-2.1.5: Registrar descripción narrativa de la emergencia
- RF-2.1.6: Asignar código único de incidente automáticamente
- RF-2.1.7: Registrar incidente con estado inicial 'registrado'
- RF-2.1.8: Permitir notas adicionales sobre la ubicación
- RF-2.1.9: Asignar nivel de prioridad inicial según tipo de emergencia

**Datos a Capturar**:
- Código de incidente (único, autogenerado)
- Calle 1 (intersección)
- Calle 2 (intersección)
- Coordenadas (latitud, longitud)
- Notas de ubicación
- Nombre del llamante
- Teléfono del llamante
- Descripción del incidente
- Tipo de emergencia
- Estado inicial (REGISTERED)
- Prioridad
- Timestamp de creación

**Restricciones**:
- Código de incidente debe ser único
- Ambas calles son requeridas
- Tipo de emergencia debe existir en catálogo
- Coordenadas deben ser válidas

---

#### RF-2.2 Gestión de Tipos de Emergencia (Catálogo)
**Descripción**: Mantener catálogo de tipos de emergencias y sus parámetros operativos.

**Funcionalidades**:
- RF-2.2.1: Crear tipo de emergencia con código único, nombre, descripción
- RF-2.2.2: Definir unidades requeridas por tipo de emergencia
- RF-2.2.3: Definir personal requerido por tipo de emergencia
- RF-2.2.4: Asignar código Morse para cada tipo de emergencia
- RF-2.2.5: Establecer nivel de prioridad por tipo
- RF-2.2.6: Activar/desactivar tipos de emergencia
- RF-2.2.7: Consultar catálogo de tipos de emergencia
- RF-2.2.8: Modificar parámetros de tipo de emergencia

**Datos a Capturar**:
- Código de tipo (único)
- Nombre de tipo (único)
- Descripción
- Unidades requeridas (mínimo)
- Personal requerido (mínimo)
- Código Morse (para comunicaciones)
- Prioridad (1-4, siendo 1 la más alta)
- Estado activo/inactivo

**Tipos Predefinidos**:
1. INC - Incendio (3 unidades, 12 personal, prioridad 1)
2. ACC - Accidente (2 unidades, 8 personal, prioridad 2)
3. RES - Rescate (2 unidades, 10 personal, prioridad 1)
4. ASI - Asistencia Médica (1 unidad, 4 personal, prioridad 3)
5. FLS - Falsa Alarma (1 unidad, 2 personal, prioridad 4)
6. MAT - Materiales Peligrosos (2 unidades, 8 personal, prioridad 1)

**Restricciones**:
- No se puede eliminar tipo que tenga incidentes asociados
- Código y nombre son únicos
- Prioridad debe estar entre 1 y 4

---

#### RF-2.3 Seguimiento de Estados de Incidentes
**Descripción**: Permitir transiciones de estado del incidente durante su ciclo de vida.

**Funcionalidades**:
- RF-2.3.1: Cambiar estado de incidente de REGISTERED a PENDING
- RF-2.3.2: Cambiar estado de incidente de PENDING a IN_PROGRESS
- RF-2.3.3: Cambiar estado de incidente de IN_PROGRESS a RESOLVED
- RF-2.3.4: Cambiar estado de incidente de RESOLVED a CLOSED
- RF-2.3.5: Registrar timestamp de llegada de primera unidad
- RF-2.3.6: Registrar timestamp de cierre de incidente
- RF-2.3.7: Permitir cambios de estado según flujo permitido
- RF-2.3.8: Registrar cada cambio de estado como evento auditable

**Estados Permitidos**:
- REGISTERED: Incidente registrado, pendiente de validación
- PENDING: Validado, pendiente de despacho
- IN_PROGRESS: Unidades despachadas y en ruta/en lugar
- RESOLVED: Situación resuelta, procedimiento finalizado
- CLOSED: Incidente cerrado, formularios completados

**Flujo de Estados**:
```
REGISTERED → PENDING → IN_PROGRESS → RESOLVED → CLOSED
```

**Restricciones**:
- No se permiten saltos en el flujo
- Timestamp de cierre no puede ser anterior a creación
- Cambio de estado requiere usuario responsable

---

### Nivel 3: Asignación y Despacho de Vehículos

#### RF-3.1 Asignación de Vehículos a Incidentes
**Descripción**: Asignar vehículos específicos a incidentes según reglas operativas.

**Funcionalidades**:
- RF-3.1.1: Asignar vehículo a incidente con registro de timestamp
- RF-3.1.2: Permitir múltiples asignaciones por incidente
- RF-3.1.3: Impedir asignación de vehículos no disponibles (estado ≠ green)
- RF-3.1.4: Impedir duplicación de asignación (mismo vehículo, mismo incidente)
- RF-3.1.5: Registrar cambio automático de estado a RED al asignar
- RF-3.1.6: Desasignar vehículo de incidente
- RF-3.1.7: Registrar timestamp de llegada del vehículo
- RF-3.1.8: Registrar timestamp de partida del vehículo
- RF-3.1.9: Permitir notas sobre el viaje/asignación
- RF-3.1.10: Consultar vehículos asignados a un incidente

**Datos a Capturar**:
- Incidente destino
- Vehículo asignado
- Timestamp de asignación
- Timestamp de llegada (nullable)
- Timestamp de partida (nullable)
- Notas de la asignación
- Timestamp de registro

**Restricciones**:
- Vehículo debe tener estado GREEN para asignación
- No se permite duplicación de asignación
- Timestamps deben ser coherentes (llegada > asignación > partida)
- Cambio a RED debe ser transaccional con asignación

---

#### RF-3.2 Reglas de Despacho Automático
**Descripción**: Definir y aplicar reglas de despacho automático según tipo de emergencia.

**Funcionalidades**:
- RF-3.2.1: Crear regla de despacho para tipo de emergencia
- RF-3.2.2: Definir orden de prioridad de tipos de vehículos a desplegar
- RF-3.2.3: Especificar cantidad requerida de cada tipo de vehículo
- RF-3.2.4: Asignar código Morse a regla de despacho
- RF-3.2.5: Asignar mensaje de Telegram a regla de despacho
- RF-3.2.6: Consultar regla de despacho según tipo de emergencia
- RF-3.2.7: Definir requisitos adicionales por regla (JSON)
- RF-3.2.8: Modificar reglas de despacho existentes

**Datos a Capturar**:
- Tipo de emergencia (referencia)
- Orden de prioridad
- Tipo de vehículo requerido
- Cantidad requerida
- Código Morse de notificación
- Mensaje Telegram de notificación
- Requisitos adicionales (JSON)

**Restricciones**:
- No se puede tener dos reglas con mismo tipo y prioridad
- Cantidad requerida debe ser > 0
- Tipo de vehículo debe existir en catálogo

---

#### RF-3.3 Generación Automática de Despacho Preliminar
**Descripción**: El sistema propone automáticamente vehículos basándose en reglas operativas.

**Funcionalidades**:
- RF-3.3.1: Consultar reglas aplicables al tipo de emergencia
- RF-3.3.2: Calcular cantidad de vehículos requeridos
- RF-3.3.3: Determinar tipos de vehículos a desplegar
- RF-3.3.4: Filtrar vehículos disponibles por tipo
- RF-3.3.5: Generar lista propuesta de vehículos para asignación
- RF-3.3.6: Permitir validación manual de despacho propuesto
- RF-3.3.7: Facilitar despacho con un click de todos los vehículos propuestos

**Restricciones**:
- Despacho es propuesta, no automático
- Debe permitir modificación antes de confirmación
- Vehículos propuestos deben estar disponibles

---

### Nivel 4: Formularios Operacionales

#### RF-4.1 Registro de Formularios Operacionales
**Descripción**: Capturar información operacional de cada incidente mediante formularios.

**Funcionalidades**:
- RF-4.1.1: Crear formulario operacional asociado a incidente
- RF-4.1.2: Registrar cantidad de personal en escena
- RF-4.1.3: Registrar equipos utilizados (múltiples, con cantidad)
- RF-4.1.4: Registrar información de pacientes (si aplica)
- RF-4.1.5: Registrar acciones tomadas en narrativa libre
- RF-4.1.6: Seleccionar resultado del incidente (dropdown)
- RF-4.1.7: Indicar si se requieren unidades adicionales
- RF-4.1.8: Indicar si se solicitó ambulancia
- RF-4.1.9: Registrar apoyo institucional requerido
- RF-4.1.10: Marcar formulario como completado
- RF-4.1.11: Registrar persona responsable de completar formulario

**Datos a Capturar**:
- Incidente asociado (único por formulario)
- Personal en escena (cantidad)
- Equipos utilizados (lista con cantidades)
- Información de pacientes (lista)
  - Nombre paciente
  - Edad
  - Condición
  - Tratamiento proporcionado
- Acciones realizadas (texto libre)
- Resultado del incidente
- Unidades adicionales solicitadas (boolean)
- Ambulancia solicitada (boolean)
- Apoyo institucional (texto)
- Estado de completitud
- Persona que completa (nombre)
- Timestamps

**Resultados Permitidos**:
- Exitoso
- Parcial
- Fallido
- Derivado a otra institución
- Falsa alarma

**Restricciones**:
- Un incidente tiene un único formulario operacional
- Formulario solo puede estar asociado a un incidente
- Personal en escena debe ser número positivo

---

#### RF-4.2 Gestión de Equipos en Formularios
**Descripción**: Registrar equipo utilizado de manera granular.

**Funcionalidades**:
- RF-4.2.1: Agregar equipo utilizado al formulario
- RF-4.2.2: Registrar cantidad de equipo utilizado
- RF-4.2.3: Listar equipos utilizados por formulario
- RF-4.2.4: Eliminar registro de equipo
- RF-4.2.5: Modificar cantidad de equipo registrado

**Datos a Capturar**:
- Nombre del equipo
- Cantidad utilizada

---

#### RF-4.3 Gestión de Pacientes en Formularios
**Descripción**: Registrar información de pacientes atendidos.

**Funcionalidades**:
- RF-4.3.1: Agregar paciente atendido al formulario
- RF-4.3.2: Registrar datos demográficos (nombre, edad)
- RF-4.3.3: Registrar condición/diagnóstico
- RF-4.3.4: Registrar tratamiento proporcionado
- RF-4.3.5: Listar pacientes por formulario/incidente
- RF-4.3.6: Eliminar registro de paciente
- RF-4.3.7: Modificar información de paciente

**Datos a Capturar**:
- Nombre del paciente
- Edad/año nacimiento
- Condición médica
- Tratamiento proporcionado

---

### Nivel 5: Auditoría y Trazabilidad

#### RF-5.1 Registro de Eventos de Incidente
**Descripción**: Mantener registro detallado de todos los eventos que ocurren durante un incidente.

**Funcionalidades**:
- RF-5.1.1: Registrar evento automático al crear incidente
- RF-5.1.2: Registrar evento al asignar vehículo
- RF-5.1.3: Registrar evento cuando vehículo llega
- RF-5.1.4: Registrar evento cuando vehículo se va
- RF-5.1.5: Registrar evento cuando incidente cambia estado
- RF-5.1.6: Registrar evento cuando se solicitan unidades adicionales
- RF-5.1.7: Registrar evento cuando se solicita ambulancia
- RF-5.1.8: Registrar evento cuando se envía formulario
- RF-5.1.9: Registrar evento cuando se cierra incidente
- RF-5.1.10: Registrar quién genera cada evento
- RF-5.1.11: Generar reporte de línea de tiempo de incidente

**Tipos de Eventos**:
- CREATED: Incidente creado
- VEHICLE_ASSIGNED: Vehículo asignado
- VEHICLE_ARRIVED: Vehículo llegó
- VEHICLE_DEPARTED: Vehículo partió
- STATUS_CHANGED: Estado cambió
- ADDITIONAL_UNITS_REQUESTED: Se solicitaron unidades
- AMBULANCE_REQUESTED: Se solicitó ambulancia
- FORM_SUBMITTED: Formulario enviado
- INCIDENT_CLOSED: Incidente cerrado

**Datos a Capturar**:
- Incidente
- Tipo de evento
- Descripción narrativa
- Usuario responsable
- Timestamp

**Restricciones**:
- Los eventos son inmutables una vez registrados
- Cada evento debe tener timestamp preciso
- Usuario es requerido para eventos manuales

---

#### RF-5.2 Auditoría de Cambios en Entidades Críticas
**Descripción**: Registrar cambios en entidades críticas del sistema.

**Funcionalidades**:
- RF-5.2.1: Registrar cambios en VEHICLES (estado, ubicación, conductor)
- RF-5.2.2: Registrar cambios en INCIDENTS (estado, prioridad)
- RF-5.2.3: Registrar cambios en OPERATIONAL_FORMS
- RF-5.2.4: Almacenar valores anteriores y nuevos
- RF-5.2.5: Registrar usuario responsable del cambio
- RF-5.2.6: Generar reporte de auditoría de cambios

**Datos a Capturar**:
- Tipo de entidad
- ID de entidad
- Acción (INSERT, UPDATE, DELETE)
- Valores anteriores (JSON)
- Valores nuevos (JSON)
- Usuario
- Timestamp

**Restricciones**:
- Registros de auditoría son inmutables
- Cada cambio debe ser registrado antes de confirmarse
- Usuario es requerido

---

#### RF-5.3 Archivo de Incidentes Cerrados
**Descripción**: Mantener historial de incidentes cerrados optimizado.

**Funcionalidades**:
- RF-5.3.1: Archivar automáticamente incidentes cuando se cierran
- RF-5.3.2: Registrar resumen de información de incidente
- RF-5.3.3: Registrar cantidad de vehículos asignados
- RF-5.3.4: Registrar tiempo de respuesta total
- RF-5.3.5: Consultar historial de incidentes cerrados
- RF-5.3.6: Filtrar historial por fecha, tipo, etc.
- RF-5.3.7: Exportar datos históricos

**Datos a Capturar**:
- Código de incidente original
- Tipo de emergencia
- Ubicación (calles)
- Estado final
- Tiempo total de respuesta
- Cantidad de vehículos
- Timestamp de archivo
- Datos adicionales (JSON)

**Restricciones**:
- Archivado es automático al cerrar
- Datos históricos son read-only

---

### Nivel 6: Notificaciones y Comunicaciones

#### RF-6.1 Generación de Código Morse
**Descripción**: Generar código Morse automáticamente para notificaciones.

**Funcionalidades**:
- RF-6.1.1: Consultar código Morse por tipo de emergencia
- RF-6.1.2: Consultar código Morse por regla de despacho
- RF-6.1.3: Generar notificación en código Morse automáticamente

**Datos a Capturar**:
- Código Morse (string)

**Restricciones**:
- Código Morse debe ser consistente para un tipo de emergencia

---

#### RF-6.2 Envío de Notificaciones por Telegram
**Descripción**: Enviar notificaciones automáticas a grupo de Telegram.

**Funcionalidades**:
- RF-6.2.1: Obtener mensaje Telegram asociado a regla de despacho
- RF-6.2.2: Formatear mensaje con datos de incidente
- RF-6.2.3: Enviar mensaje a grupo de Telegram mediante API
- RF-6.2.4: Registrar confirmación de envío
- RF-6.2.5: Reintentar en caso de fallo

**Datos a Capturar**:
- Mensaje base (de regla)
- Datos de incidente (reemplazos dinámicos)
- Chat ID de Telegram
- Timestamp de envío

**Restricciones**:
- API de Telegram debe estar disponible
- Mensajes deben ser concisos

---

### Nivel 7: Consultas y Reportes

#### RF-7.1 Consultas de Incidentes Activos
**Descripción**: Permitir visualización y consulta de incidentes en curso.

**Funcionalidades**:
- RF-7.1.1: Listar todos los incidentes activos (REGISTERED, PENDING, IN_PROGRESS)
- RF-7.1.2: Filtrar incidentes activos por tipo de emergencia
- RF-7.1.3: Filtrar incidentes activos por prioridad
- RF-7.1.4: Filtrar incidentes activos por ubicación geográfica
- RF-7.1.5: Ordenar incidentes por timestamp de creación (más reciente primero)
- RF-7.1.6: Consultar detalle de incidente activo con vehículos asignados
- RF-7.1.7: Obtener estadísticas de incidentes activos

**Restricciones**:
- Solo mostrar incidentes activos
- Información debe actualizarse en tiempo real

---

#### RF-7.2 Consultas de Disponibilidad de Vehículos
**Descripción**: Permitir visualización del estado operativo de vehículos.

**Funcionalidades**:
- RF-7.2.1: Listar vehículos por estación
- RF-7.2.2: Listar vehículos disponibles (estado GREEN) por estación
- RF-7.2.3: Listar vehículos en transición (estado YELLOW) por estación
- RF-7.2.4: Listar vehículos asignados (estado RED) por estación
- RF-7.2.5: Filtrar vehículos por tipo
- RF-7.2.6: Consultar ubicación actual de vehículos
- RF-7.2.7: Generación de vista de disponibilidad por estación

**Restricciones**:
- Información debe actualizarse en tiempo real

---

#### RF-7.3 Exportación de Datos
**Descripción**: Permitir exportar información en formatos estándar.

**Funcionalidades**:
- RF-7.3.1: Exportar incidentes cerrados a Excel
- RF-7.3.2: Exportar incidentes cerrados a PDF
- RF-7.3.3: Exportar formularios operacionales a Excel
- RF-7.3.4: Exportar formularios operacionales a PDF
- RF-7.3.5: Exportar reporte de auditoría a Excel
- RF-7.3.6: Exportar reporte de auditoría a PDF
- RF-7.3.7: Filtrar por rango de fechas antes de exportar

**Formatos Soportados**:
- Excel (.xlsx)
- PDF

**Restricciones**:
- Exportación debe incluir todos los datos asociados
- Formatos deben ser legibles y profesionales

---

#### RF-7.4 Reportes de Estadísticas
**Descripción**: Generar reportes de estadísticas operacionales.

**Funcionalidades**:
- RF-7.4.1: Contar total de incidentes por tipo (cerrados)
- RF-7.4.2: Calcular tiempo promedio de respuesta por tipo
- RF-7.4.3: Calcular tiempo de respuesta máximo y mínimo
- RF-7.4.4: Contar incidentes cerrados por rango de fechas
- RF-7.4.5: Listar incidentes más comunes
- RF-7.4.6: Calcular disponibilidad promedio de vehículos
- RF-7.4.7: Generar reporte de uso de recursos

**Métricas**:
- Total de incidentes
- Incidentes cerrados vs pendientes
- Tiempo de respuesta promedio
- Vehículos por estación
- Eficiencia operacional

---

## PARTE 2: REQUERIMIENTOS NO FUNCIONALES (RNF)

### RNF-1: Rendimiento

#### RNF-1.1 Tiempo de Respuesta
**Requerimiento**: El sistema debe responder a consultas en tiempos aceptables para operaciones críticas.

**Especificaciones**:
- Consulta de incidentes activos: < 500ms
- Despacho automático de vehículos: < 1 segundo
- Consulta de disponibilidad de vehículos: < 500ms
- Cambio de estado de vehículo: < 200ms
- Registro de evento: < 100ms
- Consultas de estadísticas: < 5 segundos

**Justificación**: Las operaciones de emergencia son críticas y requieren respuesta inmediata.

---

#### RNF-1.2 Throughput
**Requerimiento**: La base de datos debe soportar múltiples operaciones simultáneas.

**Especificaciones**:
- Mínimo 100 transacciones por segundo durante operación normal
- Mínimo 500 transacciones por segundo durante peak (múltiples incidentes simultáneos)
- Máximo 50 conexiones simultáneas sin degradación
- Soporte para al menos 10 usuarios simultáneos

**Justificación**: Centro de operaciones debe atender múltiples emergencias en paralelo.

---

#### RNF-1.3 Optimización de Consultas
**Requerimiento**: Todas las consultas frecuentes deben estar indexadas y optimizadas.

**Índices Requeridos**:
- idx_incidents_status_created: ON incidents(status, created_at DESC)
- idx_vehicles_station_status: ON vehicles(station_id, status)
- idx_incident_events_timestamp: ON incident_events(created_at DESC)
- idx_station_code: ON stations(code)
- idx_vehicle_code: ON vehicles(vehicle_code)
- idx_incident_code: ON incidents(incident_code)
- idx_location: ON incidents(latitude, longitude)
- idx_emergency_type: ON emergency_types(code)

---

### RNF-2: Disponibilidad y Confiabilidad

#### RNF-2.1 Disponibilidad del Sistema
**Requerimiento**: El sistema debe estar disponible de forma continua para operaciones de emergencia.

**Especificaciones**:
- Disponibilidad mínima de 99.5% anual
- Máximo 43.2 minutos de downtime mensual
- Operación 24/7 sin mantenimiento programado durante horas pico
- Mantenimiento programado solo en ventanas de bajo uso

**Justificación**: Las emergencias ocurren a cualquier hora y no pueden ser pospuestas.

---

#### RNF-2.2 Recuperación ante Desastres
**Requerimiento**: El sistema debe recuperarse ante fallos de hardware o software.

**Especificaciones**:
- Backup automático cada hora
- Backup diario en sistema remoto
- Recovery Time Objective (RTO): máximo 15 minutos
- Recovery Point Objective (RPO): máximo 1 hora
- Procedimiento de recuperación documentado y probado regularmente

**Justificación**: Pérdida de datos podría comprometer operaciones futuras.

---

#### RNF-2.3 Redundancia
**Requerimiento**: Componentes críticos deben tener redundancia.

**Especificaciones**:
- Base de datos replicada en servidor secundario
- Sistema de alertas si réplica se desconecta
- Failover automático configurado
- Almacenamiento redundante (RAID 5 mínimo)

---

### RNF-3: Seguridad

#### RNF-3.1 Autenticación y Autorización
**Requerimiento**: Acceso controlado al sistema con diferentes roles.

**Especificaciones**:
- Autenticación requerida para todo acceso
- Contraseñas con mínimo 8 caracteres, complejidad
- Sesiones con timeout automático después de 30 minutos inactividad
- Roles: Despachador, Operario, Supervisor, Administrador
- Control de acceso basado en roles (RBAC)
- Cada rol tiene permisos específicos sobre funciones y datos

**Roles y Permisos**:
- **Despachador**: Crear incidentes, asignar vehículos, actualizar estados, completar formularios
- **Operario**: Ver información de incidentes asignados, registrar eventos, actualizar ubicación
- **Supervisor**: Acceso a reportes, auditoría, estadísticas, cambios operacionales
- **Administrador**: Acceso total, gestión de usuarios, catálogos, respaldo

---

#### RNF-3.2 Integridad de Datos
**Requerimiento**: Garantizar que datos no sean modificados sin autorización.

**Especificaciones**:
- Validación de integridad referencial mediante Foreign Keys
- Restricciones a nivel de base de datos (CHECK constraints)
- Transacciones ACID para operaciones críticas
- Triggers para validación de reglas de negocio

**Restricciones Clave**:
- No se puede eliminar estación si tiene vehículos
- No se puede asignar vehículo no disponible
- No se puede modificar incidente cerrado
- Cambios de estado deben seguir flujo permitido

---

#### RNF-3.3 Auditoría
**Requerimiento**: Registrar todos los cambios para auditoría.

**Especificaciones**:
- Tabla AUDIT_LOG para todos los cambios en entidades críticas
- Registro de usuario responsable de cada cambio
- Registro de valores antes y después
- Imposibilidad de eliminar registros de auditoría
- Reporte de auditoría debe estar disponible para supervisores

---

#### RNF-3.4 Confidencialidad
**Requerimiento**: Proteger datos sensibles durante transmisión y almacenamiento.

**Especificaciones**:
- Conexiones HTTPS obligatorias (TLS 1.2+)
- Datos sensibles (teléfono, dirección) pueden estar enmascarados
- Cifrado de datos en tránsito
- Datos de auditoría y logs deben estar protegidos
- Cumplimiento con regulaciones locales de privacidad

---

### RNF-4: Escalabilidad

#### RNF-4.1 Escalabilidad Horizontal
**Requerimiento**: Sistema debe crecer con nueva infraestructura.

**Especificaciones**:
- Diseño de base de datos soporta sharding futuro
- Índices diseñados para reducir tamaño de tablas
- Particionamiento de tablas históricas por fecha
- Capacidad de agregar nuevas estaciones sin rediseño
- Soporte para múltiples regiones operacionales

---

#### RNF-4.2 Escalabilidad Vertical
**Requerimiento**: Sistema debe soportar aumento de carga.

**Especificaciones**:
- Diseño soporta aumento de usuarios
- Índices optimizados para query plans eficientes
- Caché de consultas frecuentes
- Purga automática de datos antiguos según política de retención
- Archivado de incidentes cerrados después de 1 año

---

### RNF-5: Mantenibilidad

#### RNF-5.1 Documentación
**Requerimiento**: Sistema debe estar bien documentado.

**Especificaciones**:
- Documentación del modelo de datos (MER, esquema físico)
- Documentación de todas las tablas y campos
- Diccionario de datos completo
- Diagramas de entidad-relación
- Documentación de índices y estrategias de optimización
- Procedimientos almacenados documentados
- Documentación de triggers

---

#### RNF-5.2 Estándares de Código
**Requerimiento**: Código debe seguir estándares consistentes.

**Especificaciones**:
- Nomenclatura consistente: snake_case para campos, CamelCase para clases
- Comentarios en SQL para triggers complejos
- Versionamiento de esquema de BD (control de cambios)
- Scripts de migración versionados
- Uso de transacciones explícitas para operaciones críticas

---

#### RNF-5.3 Control de Cambios
**Requerimiento**: Cambios a la estructura de datos deben controlarse.

**Especificaciones**:
- Todos los cambios de esquema requieren aprobación
- Scripts de migración versionados y ejecutables
- Rollback scripts para cada migración
- Documentación de cambios
- Testing de cambios en ambiente de desarrollo primero

---

### RNF-6: Integridad Referencial

#### RNF-6.1 Restricciones de Integridad
**Requerimiento**: Garantizar consistencia de relaciones entre tablas.

**Especificaciones**:

| Tabla | Foreign Key | Referencias | Comportamiento |
|-------|------------|------------|---|
| VEHICLES | station_id | STATIONS.id | RESTRICT (no eliminar si tiene vehículos) |
| VEHICLES | vehicle_type_id | VEHICLE_TYPES.id | RESTRICT |
| VEHICLES | status_id | VEHICLE_STATUS_TYPES.id | RESTRICT |
| INCIDENTS | emergency_type_id | EMERGENCY_TYPES.id | RESTRICT |
| INCIDENTS | status_id | INCIDENT_STATUS_TYPES.id | RESTRICT |
| INCIDENT_VEHICLES | incident_id | INCIDENTS.id | CASCADE (eliminar asignaciones) |
| INCIDENT_VEHICLES | vehicle_id | VEHICLES.id | RESTRICT |
| DISPATCH_RULES | emergency_type_id | EMERGENCY_TYPES.id | CASCADE |
| OPERATIONAL_FORMS | incident_id | INCIDENTS.id | CASCADE |
| INCIDENT_EVENTS | incident_id | INCIDENTS.id | CASCADE |
| INCIDENT_EVENTS | event_type_id | EVENT_TYPES.id | RESTRICT |

---

#### RNF-6.2 Validaciones de Datos
**Requerimiento**: Validar correctitud de datos al ingreso.

**Especificaciones**:
- Coordenadas válidas (rango WGS84: -90 a 90 latitud, -180 a 180 longitud)
- Teléfonos con formato válido
- Emails con formato válido
- Fechas y timestamps coherentes
- Estados solo de valores predefinidos
- Cantidades numéricas positivas
- Prioridades entre 1-4

---

### RNF-7: Cumplimiento Normativo

#### RNF-7.1 Regulaciones Locales
**Requerimiento**: Cumplimiento con regulaciones de protección de datos.

**Especificaciones**:
- Cumplimiento con ley de protección de datos personal
- Derecho a acceso de datos personales
- Derecho a eliminación (con limitaciones para auditoría)
- Consentimiento para recopilación de datos
- Notificación de brechas de seguridad

---

#### RNF-7.2 Regulaciones de Emergencia
**Requerimiento**: Cumplimiento con procedimientos de emergencia.

**Especificaciones**:
- Código de incidente sigue formato reglamentario
- Tiempos de respuesta registrados según norma
- Información de llamantes protegida
- Reportes generados según formato reglamentario

---

### RNF-8: Interoperabilidad

#### RNF-8.1 Integración con Sistemas Externos
**Requerimiento**: Sistema debe integrarse con plataformas externas.

**Especificaciones**:
- API REST para consultas de datos
- Integración con API de Telegram
- Integración con servicios de geocodificación (Google Maps, etc.)
- Soporte para importación/exportación de datos
- Webhooks para notificaciones de cambios críticos

---

#### RNF-8.2 Formatos de Datos
**Requerimiento**: Soportar múltiples formatos de intercambio.

**Especificaciones**:
- JSON para API
- XML para algunos reportes
- CSV para importación/exportación
- PDF para reportes descargables
- Excel para análisis

---

### RNF-9: Monitoreo y Logging

#### RNF-9.1 Logging
**Requerimiento**: Registrar eventos críticos para diagnóstico.

**Especificaciones**:
- Log de todas las transacciones de base de datos
- Log de acceso de usuarios
- Log de cambios en datos críticos
- Log de errores y excepciones
- Rotación de logs automática
- Retención de logs mínimo 1 año

---

#### RNF-9.2 Monitoreo
**Requerimiento**: Monitorear salud del sistema.

**Especificaciones**:
- Alertas si tiempo de respuesta > 1 segundo
- Alertas si CPU > 80%
- Alertas si almacenamiento > 85%
- Alertas si conexiones de DB > 80 de máximo
- Dashboard de monitoreo en tiempo real
- Notificación inmediata de fallos

---

### RNF-10: Capacidad de Almacenamiento

#### RNF-10.1 Requisitos de Espacio
**Requerimiento**: Estimar y planificar capacidad de almacenamiento.

**Especificaciones**:

```
Tabla INCIDENTS:
- Registros anuales estimados: 100,000
- Tamaño por registro: ~500 bytes
- Tamaño anual: ~50 MB

Tabla INCIDENT_EVENTS:
- Registros anuales: 500,000 (5 eventos/incidente promedio)
- Tamaño por registro: ~200 bytes
- Tamaño anual: ~100 MB

Tabla AUDIT_LOG:
- Registros anuales: 1,000,000
- Tamaño por registro: ~500 bytes
- Tamaño anual: ~500 MB

Tabla INCIDENT_VEHICLES:
- Registros anuales: 300,000 (3 vehículos/incidente)
- Tamaño por registro: ~100 bytes
- Tamaño anual: ~30 MB

Total anual: ~700 MB
Total 5 años: ~3.5 GB
Proyección con crecimiento 10%: ~5.7 GB para 5 años
Espacio recomendado inicial: 20 GB
Espacio recomendado futuro: 50 GB
```

#### RNF-10.2 Política de Retención
**Requerimiento**: Definir cuánto tiempo se retienen datos.

**Especificaciones**:
- Incidentes activos: guardados indefinidamente en tabla principal
- Incidentes cerrados: archivados después de 1 año
- Eventos: retención 3 años mínimo
- Auditoría: retención 5 años mínimo
- Logs: retención 1 año
- Datos de incidentes archivados: pueden ser purgados después de 7 años

---

## RESUMEN EJECUTIVO

### Requerimientos Funcionales: 7 Niveles
1. **Gestión de Infraestructura** (RF-1): 3 módulos principales
2. **Gestión de Emergencias** (RF-2): 3 módulos principales
3. **Asignación y Despacho** (RF-3): 3 módulos principales
4. **Formularios Operacionales** (RF-4): 3 módulos principales
5. **Auditoría y Trazabilidad** (RF-5): 3 módulos principales
6. **Notificaciones** (RF-6): 2 módulos principales
7. **Consultas y Reportes** (RF-7): 4 módulos principales

**Total RF**: 21 módulos principales con 147+ funcionalidades específicas

### Requerimientos No Funcionales: 10 Categorías
1. **Rendimiento**: Tiempos de respuesta < 1 segundo (operaciones críticas)
2. **Disponibilidad**: 99.5% uptime anual
3. **Seguridad**: RBAC, auditoría, integridad referencial
4. **Escalabilidad**: Soporte para crecimiento 10% anual
5. **Mantenibilidad**: Documentación completa, versionamiento
6. **Integridad**: Validaciones, restricciones, transacciones ACID
7. **Cumplimiento**: Regulaciones locales, procedimientos emergencia
8. **Interoperabilidad**: APIs, integración externa
9. **Monitoreo**: Logging, alertas, dashboards
10. **Capacidad**: 20-50 GB almacenamiento, 5 años retención

