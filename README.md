# Weight Tracker App

Una aplicación web para seguimiento de peso corporal, con pruebas completas de funcionalPara generar un informe detallado y ver su resumen en la consola:

```bash
npm run artillery:report
```

### Análisis de resultados

Las pruebas generan archivos JSON con los resultados detallados y automáticamente muestran un resumen en la consola después de cada ejecución.ndimiento.

## Características

- Registro de peso con nombre de usuario
- Validación de datos de entrada
- Restricción de 48 horas entre registros
- Persistencia de datos en localStorage
- Interfaz de usuario simple e intuitiva

## Tecnologías

- React (FrontEnd)
- LocalStorage (Persistencia)
- Cypress (Pruebas end-to-end y rendimiento)
- GitHub Actions (CI/CD)
- SonarCloud (Calidad de código)

## Desarrollo Local

### Requisitos previos

- Node.js (versión 14 o superior)
- npm (viene con Node.js)

### Instalación

1. Clonar este repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Iniciar la aplicación en modo desarrollo:

```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Pruebas

### Pruebas unitarias

Para ejecutar las pruebas unitarias:

```bash
npm test
```

Para ejecutar las pruebas con cobertura:

```bash
npm run test:coverage
```

### Pruebas End-to-End

Para ejecutar las pruebas e2e con Cypress:

```bash
npm run test:e2e
```

Para abrir Cypress y ejecutar las pruebas de forma interactiva:

```bash
npm run test:e2e:open
```

### Pruebas de Rendimiento

La aplicación incluye un conjunto completo de pruebas de rendimiento que miden métricas clave:

- **Latencia**: Tiempo de respuesta para operaciones específicas


## Pruebas de Rendimiento con Artillery

Este proyecto utiliza [Artillery](https://www.artillery.io/) para realizar pruebas de rendimiento y carga. Artillery es una herramienta moderna y potente que permite simular tráfico realista a la aplicación.

### Características de las pruebas de rendimiento

- **Escenarios realistas**: Simulación de flujos reales de usuarios
- **Fases de carga**: Rampa gradual, carga sostenida y pruebas de pico
- **Métricas detalladas**: Tiempos de respuesta, tasas de error, percentiles
- **Reportes JSON**: Generación automática de informes detallados en formato JSON

### Ejecutar pruebas de rendimiento

Para ejecutar pruebas de rendimiento básicas:

```bash
npm run artillery:quick
```

Para ejecutar pruebas ultra rápidas (5 segundos):

```bash
npm run artillery:ultraquick
```

Para ejecutar pruebas de rendimiento completas:

```bash
npm run artillery:run
```

Para generar un informe detallado en JSON:

```bash
npm run artillery:report
```

### Análisis de resultados

Las pruebas generan archivos JSON con los resultados detallados que se pueden analizar manualmente o utilizar herramientas externas para su visualización.

Los archivos de resultados contienen:
- Tiempos de respuesta (promedio, mínimo, máximo, percentiles)
- Número de solicitudes y respuestas
- Tasas de error
- Métricas por endpoint
- Estadísticas de sesión de usuario

Para ejecutar pruebas de rendimiento en un entorno de construcción:

```bash
npm run test:performance
```

### Reportes de rendimiento

Las pruebas generan automáticamente informes detallados que incluyen:

- Tiempo mínimo, máximo y promedio para cada operación
- Percentiles P95 y P99 de tiempos de respuesta
- Tasa de error por operación
- Throughput general del sistema
- Estadísticas de concurrencia simulada

Los reportes están disponibles en formato JSON:

- **quick-report.json**: Para pruebas ultrarrápidas
- **artillery-report.json**: Para pruebas completas

Los resultados se muestran automáticamente en la consola después de cada ejecución. Si deseas analizar un informe existente en cualquier momento:

```bash
npm run artillery:analyze quick-report.json
# o
npm run artillery:analyze artillery-report.json
```

## CI/CD

Este proyecto utiliza GitHub Actions para automatizar:

1. **Pruebas funcionales**: Validación de la funcionalidad básica
2. **Pruebas de rendimiento**: Evaluación del rendimiento con Artillery
3. **Análisis de calidad**: Integración con SonarCloud para análisis de código

Los workflows están configurados en `.github/workflows/`.

## Mejores Prácticas Implementadas

- **Selectores resilientes**: Las pruebas utilizan selectores que son tolerantes a cambios en la estructura del DOM
- **Timeouts adecuados**: Configuración de timeouts apropiados para CI/CD
- **Reintento automático**: Las pruebas reintentan operaciones en caso de fallos intermitentes
- **Medición precisa**: Sistema avanzado para medir métricas de rendimiento
- **Reportes detallados**: Generación automática de reportes de rendimiento
