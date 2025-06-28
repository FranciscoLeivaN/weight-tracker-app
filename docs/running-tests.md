# Instrucciones para Ejecutar Pruebas de Regresión

Este documento proporciona instrucciones detalladas para ejecutar tanto las pruebas unitarias como las pruebas end-to-end (E2E) en tu entorno local.

## 1. Pruebas Unitarias

### Ejecutar pruebas unitarias en modo interactivo
```
npm test
```
Este comando inicia el ejecutor de pruebas de Jest en modo interactivo, que observa cambios en los archivos y vuelve a ejecutar las pruebas automáticamente.

### Ejecutar pruebas unitarias con informe de cobertura
```
npm run test:coverage
```
Este comando ejecuta todas las pruebas unitarias una vez y genera un informe de cobertura de código en la carpeta `/coverage`.

## 2. Pruebas End-to-End (E2E)

Las pruebas E2E requieren que la aplicación esté en ejecución. Sigue estos pasos:

### Paso 1: Inicia la aplicación
```
npm start
```
Espera hasta que veas "Compiled successfully" y la URL http://localhost:3000 esté disponible.

### Paso 2: Abre una nueva terminal (mantén la primera ejecutándose)

### Paso 3: Ejecuta las pruebas E2E

**Con interfaz gráfica** (útil para desarrollo y depuración):
```
npm run cypress:open
```
Esto abrirá la interfaz de Cypress donde podrás seleccionar y ejecutar pruebas específicas.

**En modo headless** (más rápido, sin interfaz gráfica):
```
npm run cypress:run
```
Ejecutará todas las pruebas E2E en segundo plano y mostrará los resultados en la terminal.

## 3. Ejecutar todas las pruebas

Para una verificación completa, ejecuta tanto las pruebas unitarias como las E2E:

### Paso 1: Ejecuta las pruebas unitarias con cobertura
```
npm run test:coverage
```

### Paso 2: Inicia la aplicación en otra terminal
```
npm start
```

### Paso 3: Ejecuta las pruebas E2E en una tercera terminal
```
npm run cypress:run
```

## Nota sobre GitHub Actions

En el entorno de integración continua (GitHub Actions), todas estas pruebas se ejecutan automáticamente cuando se realiza un push o se crea un pull request, siguiendo la configuración en los archivos `.github/workflows/`.

- `unit-tests.yml`: Ejecuta pruebas unitarias con cobertura
- `e2e-tests.yml`: Inicia la aplicación y ejecuta las pruebas de Cypress
