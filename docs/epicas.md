# Épicas del proyecto para GitHub Projects / Issues

Manteniendo las **4 épicas**, pero ahora mucho más alineadas a lo que realmente hace el software:

## Épica 1. Mejora e integración del frontend
**Descripción:**  
Refactorizar el frontend actual para mejorar usabilidad, claridad visual y preparación para la integración con backend, manteniendo el flujo operativo de registro de llamados, visualización en mapa y gestión visual de estados.

**Incluye:**
- mejora visual del mapa y paneles
- rediseño de interfaz
- formularios de llamado
- validaciones
- navegación entre vistas
- conexión futura con API

---

## Épica 2. Gestión de emergencias y reglas de despacho
**Descripción:**  
Implementar la lógica de negocio para registrar emergencias, clasificar tipos de llamados y aplicar reglas operativas que definan carros, personal y condiciones asociadas al despacho.

**Incluye:**
- creación de llamados
- catálogo de tipos de emergencia
- reglas por tipo de llamado
- definición de carros requeridos
- definición de personal requerido
- despacho preliminar

---

## Épica 3. Gestión operativa de carros y llamados activos
**Descripción:**  
Desarrollar la gestión de estados de carros y el seguimiento de llamados activos, permitiendo actualizar incidentes en curso, completar formularios operativos y escalar recursos cuando sea necesario.

**Incluye:**
- estados de carros
- asignación de carros
- llamados activos
- formularios de incidente
- solicitud de recursos adicionales
- cierre de incidentes

---

## Épica 4. Plataforma tecnológica, persistencia e integraciones
**Descripción:**  
Construir la arquitectura backend, la persistencia en base de datos y las integraciones externas necesarias para soportar la operación del sistema, incluyendo historial, exportación documental y mensajería.

**Incluye:**
- backend API REST
- base de datos
- historial
- exportación Excel/PDF
- Telegram API
- generación de código Morse
- Dockerización

---
##Épica 5. Buffer, bug fixes and final delivery

**Descripción:** 
Esta épica contempla principalmente el período final del proyecto destinado a la estabilización del sistema, corrección de errores, ajustes de interfaz, optimización de rendimiento y preparación para la entrega final. Incluye la validación integral del flujo operativo, pruebas funcionales del despacho de emergencias, verificación de integraciones externas y generación de la documentación necesaria para su despliegue y uso.

**Incluye:**
- Corrección de errores generales
- Corrección de errores detectados durante pruebas funcionales
- Validación de reglas de despacho y estados de carros
- Pruebas de integración entre frontend, backend y base de datos
- Verificación de envío de notificaciones (Telegram)
- Validación de generación de formularios y exportación Excel/PDF
- Optimización de rendimiento del sistema
- Pruebas de escenarios completos de operación
- Configuración final con Docker
- Preparación para despliegue y entrega final

--

# 4. Leyenda funcional del sistema para documentación

## Estados de carros
- **Verde:** carro disponible en cuartel, apto para ser despachado
- **Amarillo:** carro no disponible temporalmente, en transición o pendiente de actualización
- **Rojo:** carro asignado a un llamado activo, no disponible para nuevos despachos

## Vistas principales
- **Inicio:** mapa principal, ingreso de llamados y visualización de carros
- **Historial:** listado de llamados cerrados y eventos pasados
- **Llamados actuales:** incidentes activos en curso con acceso a formularios operativos

## Elementos del mapa
- **Pin de cuartel:** ubicación fija de una estación de bomberos
- **Pin de emergencia:** ubicación del incidente registrado
- **Mapa central:** referencia geográfica para visualizar cuarteles y eventos activos

## Tipos de llamado
Corresponden a categorías predefinidas con reglas operativas asociadas, tales como:
- cantidad de carros requeridos
- tipos de carros requeridos
- cantidad de personal requerida
- reglas específicas de despacho

---

# 5. Historias de usuario base para GitHub Issues

## Frontend
- Como operador, quiero visualizar los cuarteles en el mapa para identificar las ubicaciones base de los carros.
- Como operador, quiero ingresar una intersección de calles para registrar la ubicación de una emergencia.
- Como operador, quiero ver la emergencia representada en el mapa para confirmar su ubicación.
- Como operador, quiero seleccionar un tipo de llamado desde una lista predefinida para activar las reglas correspondientes.
- Como operador, quiero navegar entre inicio, historial y llamados actuales para acceder rápidamente a la información operativa.
- Como operador, quiero una interfaz más clara y ordenada para reducir errores de operación.

## Emergencias y despacho
- Como operador, quiero registrar un llamado con su tipo y ubicación para iniciar el proceso de despacho.
- Como operador, quiero que cada tipo de llamado tenga reglas asociadas para definir recursos mínimos requeridos.
- Como operador, quiero conocer qué carros y cuántos bomberos se requieren para un llamado determinado.
- Como operador, quiero generar un despacho preliminar para actuar con mayor rapidez.

## Carros y llamados activos
- Como operador, quiero ver el estado actual de cada carro para saber si puede ser utilizado.
- Como operador, quiero cambiar el estado de un carro para reflejar su condición operativa real.
- Como operador, quiero asignar carros a un llamado para dejar trazabilidad del despacho.
- Como operador, quiero ver todos los llamados activos para monitorear incidentes en curso.
- Como operador, quiero completar formularios operativos dentro de un llamado activo para registrar eventos relevantes.
- Como operador, quiero solicitar más carros durante un incidente para escalar la respuesta cuando sea necesario.
- Como operador, quiero cerrar un llamado una vez finalizado para moverlo al historial.

## Backend e integraciones
- Como sistema, quiero almacenar llamados y formularios en una base de datos para mantener trazabilidad histórica.
- Como sistema, quiero registrar los cambios de estado de los carros para auditar la operación.
- Como operador, quiero exportar formularios a Excel o PDF para entregar reportes operativos.
- Como sistema, quiero enviar mensajes a Telegram para notificar a los bomberos del despacho.
- Como sistema, quiero generar código Morse según reglas definidas para soportar el protocolo operativo.