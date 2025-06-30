# Documentación de Pruebas - Weight Tracker App

Este documento describe los diferentes tipos de pruebas implementadas en la aplicación Weight Tracker, su propósito, ubicación y cómo ejecutarlas.

## Tipos de Pruebas

La aplicación Weight Tracker implementa múltiples niveles de pruebas para garantizar la calidad del código y prevenir regresiones:

1. **Pruebas Unitarias**
2. **Pruebas de Componentes**
3. **Pruebas End-to-End (E2E)**
4. **Pruebas de Rendimiento**
5. **Análisis de Calidad de Código**

## 1. Pruebas Unitarias

### Propósito
Verificar el funcionamiento correcto de unidades individuales de código (funciones, métodos) de forma aislada.

### Ubicación
- `src/__tests__/weightUtils.test.js`
  
### Tecnologías
- Jest (Framework de pruebas)
- @testing-library/jest-dom (Matchers adicionales para Jest)

### Cobertura
Estas pruebas tienen configurado un umbral mínimo de cobertura del 80% para:
- Ramas (branches)
- Funciones (functions)
- Líneas (lines)
- Declaraciones (statements)

### Cómo ejecutar
```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas unitarias con informe de cobertura
npm run test:coverage
```

## 2. Pruebas de Componentes

### Propósito
Verificar que los componentes de React se renderizan correctamente y responden adecuadamente a las interacciones del usuario.

### Ubicación
- `src/__tests__/App.test.js`

### Tecnologías
- Jest (Framework de pruebas)
- @testing-library/react (Utilidades para probar componentes React)
- @testing-library/user-event (Simulación de eventos de usuario)

### Cómo ejecutar
```bash
# Las pruebas de componentes se ejecutan junto con las unitarias
npm test
```

## 3. Pruebas End-to-End (E2E)

### Propósito
Verificar el funcionamiento de la aplicación completa simulando la interacción real de un usuario desde la interfaz de usuario.

### Ubicación
- `cypress/e2e/weightTracker.cy.js`

### Tecnologías
- Cypress (Framework de pruebas E2E)

### Escenarios Probados
- Registro de peso básico
- Restricción de 48 horas entre registros
- Persistencia de datos después de recargar
- Eliminación de registros
- Adición de registro después de 48 horas

### Cómo ejecutar
```bash
# Ejecutar pruebas E2E en modo headless
npm run cypress:run
npm run test:e2e

# Ejecutar pruebas E2E con interfaz visual
npm run cypress:open
npm run test:e2e:open

# Configuración específica para CI
npm run test:ci:e2e
```

## 4. Pruebas de Rendimiento

### Propósito
Evaluar el rendimiento de la aplicación bajo diferentes niveles de carga y asegurar que no haya regresiones de rendimiento.

### Ubicación
- `artillery/performance-test.yml`
- `artillery/quick-test.yml`
- `artillery/show-results.js`

### Tecnologías
- Artillery (Herramienta de pruebas de carga)

### Escenarios Probados
- Navegación básica
- Flujo de usuario típico (añadir y eliminar pesos)

### Fases de Carga
- Calentamiento
- Carga constante
- Carga pico

### Cómo ejecutar
```bash
# Prueba de rendimiento completa
npm run test:performance

# Prueba de rendimiento rápida
npm run test:performance:quick
npm run artillery:quick
npm run artillery:ultraquick

# Analizar resultados
npm run artillery:show-results
```

## 5. Análisis de Calidad de Código

### Propósito
Realizar análisis estático del código para identificar problemas de calidad, bugs potenciales y vulnerabilidades.

### Tecnologías
- SonarCloud

### Configuración
- `.github/workflows/sonarcloud.yml`
- `sonar-project.properties`

### Métricas Analizadas
- Bugs potenciales
- Vulnerabilidades de seguridad
- Code smells (problemas de diseño)
- Cobertura de código
- Duplicación de código

### Cómo ejecutar
Este análisis se ejecuta automáticamente en GitHub Actions cuando se realiza un push a las ramas main, master o develop.

## 6. Pruebas de Regresión

### Propósito
Verificar específicamente que los cambios recientes en el código no afecten negativamente a la funcionalidad existente. Las pruebas de regresión combinan aspectos de pruebas unitarias, de componentes y E2E para validar flujos completos.

### Ubicación
- `src/__tests__/regression.test.js`

### Tecnologías
- Jest (Framework de pruebas)
- @testing-library/react (Utilidades para probar componentes React)

### Escenarios Probados
- Flujos de usuario completos (registro, validación, restricciones temporales)
- Persistencia y recuperación de datos
- Validación de entradas y manejo de errores
- Integración entre componentes y funcionalidades

### Configuración CI/CD
- `.github/workflows/regression-tests.yml`

### Cómo ejecutar
```bash
# Ejecutar pruebas de regresión
npm run test:regression

# Ejecutar pruebas de regresión con informe de cobertura
npm run test:regression:coverage
```

Además, las pruebas unitarias, de componentes y E2E existentes también funcionan como pruebas de regresión cuando se ejecutan después de cambios en el código.

### Cómo ejecutar todas las pruebas (suite de regresión)
```bash
# Ejecutar todas las pruebas (unitarias, componentes y E2E)
npm run test:all

# Ejecutar todas las pruebas en entorno CI
npm run test:ci:all
```

## Recomendaciones para Futuras Mejoras

1. **Separación clara por tipos de pruebas**:
   - Crear directorios separados para pruebas unitarias, de integración y E2E
   - Renombrar los archivos para indicar claramente qué tipo de prueba contienen

2. **Pruebas de integración dedicadas**:
   - Añadir pruebas específicas para la integración entre múltiples componentes

3. **Pruebas de snapshot**:
   - Implementar pruebas de snapshot para componentes UI

4. **Pruebas de accesibilidad**:
   - Añadir pruebas que verifiquen la accesibilidad de la interfaz (a11y)

5. **Pruebas de regresión visual**:
   - Implementar herramientas como Percy o Chromatic para pruebas de regresión visual

6. **Mejorar las pruebas de rendimiento**:
   - Incluir escenarios más complejos y API reales
   - Establecer umbrales de rendimiento más precisos
