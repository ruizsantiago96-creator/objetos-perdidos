# 00. Contexto

## Problema

Todos los días se olvidan mochilas, llaves, termos, credenciales y otras cosas en el campus. Los objetos suelen terminar en la prefectura, pero los dueños no saben dónde buscar ni quién los resguardó.

## Objetivo

Plataforma web ágil y comunitaria donde cualquier estudiante que encuentre un objeto publique un reporte rápido (descripción, lugar del hallazgo y fotografía). El sistema muestra un muro público y cronológico para que los afectados busquen sus pertenencias, contacten directamente a quien lo encontró y se pueda marcar el objeto como "Devuelto" para quitarlo de la lista activa.

## Metas de calidad

- Publicar un objeto toma **menos de 1 minuto**.
- Encontrar un objeto toma **menos de 30 segundos**.

## Roles (sin cuentas)

- **Quien encontró el objeto** (publicador): llena el formulario y puede marcar su reporte como devuelto desde el mismo navegador.
- **Quien perdió el objeto** (visitante): navega, busca y contacta al publicador.

Nadie inicia sesión. La identidad del publicador se resuelve con un token secreto guardado en su navegador (ver `03-api.md`).

## Alcance

Proyecto de 2 semanas. Prioridad: que funcione correctamente y de forma simple.
