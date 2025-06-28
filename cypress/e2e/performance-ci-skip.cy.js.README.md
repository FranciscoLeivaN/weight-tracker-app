# Archivo eliminado: performance-ci-skip.cy.js

Este archivo fue eliminado el 28 de junio de 2025 porque ya no es necesario.

## Propósito original
Anteriormente, este archivo servía como prueba placeholder para CI que simplemente pasaba sin ejecutar ninguna prueba de rendimiento real.

## Solución actual
Ahora, usamos directamente el archivo `performance.cy.js` tanto en entorno local como en CI. Las pruebas de rendimiento se ejecutan con umbrales adaptados para cada entorno.

## Referencia
El workflow de GitHub Actions ahora especifica exactamente qué archivos de prueba ejecutar:
- `weightTracker.cy.js` para pruebas E2E
- `performance.cy.js` para pruebas de rendimiento
