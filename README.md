# Sistema de Gestión de Emergencias y Despacho de Unidades

## Descripción

Este proyecto consiste en el desarrollo de una aplicación web para la gestión de emergencias, que permite registrar llamados, administrar su estado y coordinar la asignación de carros (unidades de respuesta).

El sistema busca mejorar el control operativo mediante una interfaz clara, actualización de estados y seguimiento en tiempo real. Actualmente, se cuenta con un frontend funcional que será optimizado como primera etapa del proyecto e integrado posteriormente con un backend y una base de datos.

---

## Objetivos

- Mejorar el frontend existente (interfaz y experiencia de usuario)
- Implementar formularios completos y validaciones
- Desarrollar un backend con API REST
- Integrar una base de datos para persistencia de información
- Gestionar estados de emergencias y carros
- Incorporar actualización en tiempo real
- Desplegar el sistema mediante contenedores Docker

---

## Alcance

El sistema permitirá:

- Registrar emergencias indicando ubicación, tipo y observaciones
- Gestionar el estado de las emergencias (pendiente, en proceso, en ruta, finalizado)
- Registrar y administrar carros (estado, disponibilidad)
- Asignar carros a emergencias
- Visualizar información operativa en un panel centralizado
- Actualizar estados en tiempo real

---

## Tecnologías

- Frontend: React + Vite + Bun
- Backend: Node.js (Express o Fastify)
- Base de datos: PostgreSQL o MongoDB
- Tiempo real: WebSockets (Socket.io)
- Contenedores: Docker y Docker Compose

---

## Arquitectura

El sistema se basa en una arquitectura cliente-servidor:

- Cliente: Aplicación web desarrollada en React
- Servidor: API REST desarrollada en Node.js
- Base de datos: Sistema de almacenamiento persistente
- Comunicación en tiempo real: WebSockets

---

## Estado del Proyecto

Actualmente el proyecto se encuentra en fase inicial. Se dispone de:

- Frontend funcional (sin integración con backend)
- Simulación de registro de emergencias

Pendiente de desarrollo:

- Backend
- Base de datos
- Integración completa
- Gestión de estados en tiempo real

---

## Plan de Desarrollo

El proyecto se desarrollará bajo metodología Scrum en 15 sprints, con las siguientes etapas principales:

1. Mejora del frontend
2. Implementación del backend
3. Integración con base de datos
4. Gestión de emergencias y carros
5. Implementación de tiempo real
6. Pruebas y despliegue

---
