# Reglas para el agente

Proyecto: Objetos Perdidos – Tec Campus Poniente. La especificación en `spec/` es la única fuente de verdad.

- Antes de escribir código, lee todo `spec/` en orden (README, 00 a 08).
- Sigue `spec/07-tareas.md` en el orden que indica y respeta las puertas de verificación de cada sprint.
- No avances a la siguiente historia sin verificar la actual.
- Las decisiones de `spec/01-decisiones-tecnicas.md` son fijas: no cambies librerías, estructura ni nombres.
- No implementes nada de `spec/08-fuera-de-alcance.md`.
- Si algo no está especificado, elige la opción más simple y avisa; no inventes funcionalidades.
- Si encuentras una contradicción o un hueco en la spec, detente y repórtalo en lugar de resolverlo por tu cuenta.
- El código va en la raíz del proyecto (`server.js`, `public/`, etc.), nunca dentro de `spec/`.
- Un commit por historia (HU).
- Reporta cada criterio como PASA/FALLA con evidencia: comando curl y respuesta, o descripción de lo que se ve.
