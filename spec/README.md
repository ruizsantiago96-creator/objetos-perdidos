# Spec: Red Social Interna de Objetos Perdidos (Tec Campus Poniente)

Este paquete contiene la especificación completa dividida en módulos para que un agente de código construya el sistema sin ambigüedades.

## Cómo debe trabajar el agente

1. Leer los archivos **en orden numérico** (00 a 08) antes de escribir código.
2. Seguir `07-tareas.md` en el orden de prioridad que indica (sprint por sprint, no por número de tarea). No avanzar a la siguiente historia sin verificar la actual.
3. Al terminar, recorrer `06-criterios-aceptacion.md` y reportar PASA / FALLA por cada criterio.
4. Si algo no está especificado, elegir la opción más simple. **No agregar funcionalidades** que no estén descritas (ver `08-fuera-de-alcance.md`).
5. Las decisiones de `01-decisiones-tecnicas.md` son fijas: no cambiar librerías, estructura ni nombres.

## Índice

| Archivo | Contenido |
|---|---|
| 00-contexto.md | Problema, objetivo y metas de calidad |
| 01-decisiones-tecnicas.md | Stack, estructura de carpetas y ejecución |
| 02-modelo-datos.md | Tabla `objetos` |
| 03-api.md | Endpoints exactos |
| 04-validaciones.md | Reglas de validación y seguridad |
| 05-interfaz.md | Diseño y comportamiento del frontend |
| 06-criterios-aceptacion.md | Lista de verificación final |
| 07-tareas.md | Plan de trabajo por sprint y prioridad |
| 08-fuera-de-alcance.md | Lo que NO se debe construir |
