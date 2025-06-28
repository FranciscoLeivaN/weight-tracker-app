# Instrucciones para Ejecutar Pruebas Automatizadas

Este documento proporciona instrucciones detalladas para ejecutar los tres tipos de pruebas automatizadas: unitarias, end-to-end (E2E) y rendimiento.

## 1. Pruebas Unitarias

### Ejecutar pruebas unitarias en modo interactivo
```bash
npm test
```
Este comando inicia el ejecutor de pruebas de Jest en modo interactivo, que observa cambios en los archivos y vuelve a ejecutar las pruebas automáticamente.

### Ejecutar pruebas unitarias con informe de cobertura
```bash
npm run test:coverage
```
Este comando ejecuta todas las pruebas unitarias una vez y genera un informe de cobertura de código en la carpeta `/coverage`.

## 2. Pruebas End-to-End (E2E)

### Opción 1: Ejecución completa (servidor y pruebas automatizadas)
```bash
npm run test:ci:e2e
```
Este comando inicia automáticamente el servidor, espera a que esté disponible, ejecuta las pruebas y cierra el servidor al terminar.

### Opción 2: Ejecución manual separada

#### Paso 1: Inicia la aplicación
```bash
npm start
```
Espera hasta que veas "Compiled successfully" y la URL http://localhost:3000 esté disponible.

#### Paso 2: Abre una nueva terminal (mantén la primera ejecutándose)

#### Paso 3: Ejecuta las pruebas E2E

**Con interfaz gráfica** (útil para desarrollo y depuración):
```bash
npm run test:e2e:open
```
Esto abrirá la interfaz de Cypress donde podrás seleccionar y ejecutar pruebas específicas.

**En modo headless** (más rápido, sin interfaz gráfica):
```bash
npm run test:e2e
```

## 3. Pruebas de Rendimiento (Lighthouse)

### Opción 1: Ejecución completa (servidor y pruebas automatizadas)
```bash
npm run test:ci:performance
```
Este comando inicia automáticamente el servidor, configura Chrome en modo debugging, ejecuta las pruebas de rendimiento y cierra todo al terminar.

### Opción 2: Ejecución manual separada

#### Paso 1: Inicia la aplicación
```bash
npm start
```

#### Paso 2: Abre una nueva terminal y ejecuta:

**Con interfaz gráfica**:
```bash
npm run test:performance:open
```

**En modo headless**:
```bash
npm run test:performance
```

## 4. Ejecutar todas las pruebas

### Opción automatizada completa
```bash
npm run test:ci:all
```

### Opción manual (paso a paso)
1. Ejecuta las pruebas unitarias: `npm run test:coverage`
2. Inicia la aplicación: `npm start`
3. En otra terminal, ejecuta E2E: `npm run test:e2e`
4. Después, ejecuta rendimiento: `npm run test:performance`

## GitHub Actions (CI/CD)

En el entorno de integración continua, estas pruebas se ejecutan automáticamente en cada push o pull request, mediante tres workflows separados:

- `unit-tests.yml`: Ejecuta pruebas unitarias con cobertura
- `e2e-tests.yml`: Ejecuta exclusivamente las pruebas E2E
- `performance-tests.yml`: Ejecuta exclusivamente las pruebas de rendimiento

La separación de los workflows garantiza que cada tipo de prueba se ejecute en un entorno optimizado para sus necesidades, evitando conflictos entre ellas (especialmente con las pruebas de rendimiento que requieren una configuración especial de Chrome).
