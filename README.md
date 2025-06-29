# Weight Tracker App

## 1. Descripción de la aplicación

Weight Tracker es una aplicación web sencilla pero efectiva para el seguimiento de peso corporal. 

### Características principales
- **Registro personalizado**: Registra tu peso con tu nombre de usuario
- **Validaciones inteligentes**: Sistema de validación de datos para asegurar entradas coherentes
- **Restricción anti-spam**: Límite de un registro cada 48 horas para fomentar un seguimiento real
- **Persistencia local**: Almacenamiento en localStorage para mantener tus datos aun cerrando el navegador
- **Interfaz minimalista**: Diseño simple y directo, enfocado en la funcionalidad

La aplicación está desarrollada como proyecto demostrativo para implementar buenas prácticas de desarrollo, pruebas automatizadas y CI/CD.

## 2. Instalación y despliegue

### Requisitos previos
- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

### Instalación
1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/weight-tracker-app.git
cd weight-tracker-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación en modo desarrollo:
```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000].

## 3. Ejecución de pruebas

La aplicación cuenta con un exhaustivo conjunto de pruebas automatizadas divididas en tres categorías principales:

### 3.1 Pruebas unitarias (Jest)

Las pruebas unitarias verifican el correcto funcionamiento de componentes individuales y funciones de utilidad.

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Ejecutar pruebas con cobertura de código
npm run test:coverage
```

La cobertura de código se puede visualizar en detalle abriendo el archivo `coverage/lcov-report/index.html` en cualquier navegador.

### 3.2 Pruebas End-to-End (Pruebas de funcionalidad con Cypress)

Las pruebas E2E simulan interacciones reales de usuario para validar el funcionamiento completo de la aplicación.

```bash
# Ejecutar pruebas E2E en modo headless
npm run test:e2e

# Abrir Cypress para ejecutar pruebas de forma interactiva
npm run test:e2e:open
```

Estas pruebas verifican:
- Registro de nuevos pesos
- Validación de formularios
- Persistencia de datos
- Restricciones temporales entre registros

### 3.3 Pruebas de rendimiento con Artillery

La aplicación implementa pruebas de rendimiento utilizando Artillery para asegurar un funcionamiento óptimo bajo diferentes niveles de carga.

```bash
# Prueba ultrarrápida (5 segundos)
npm run artillery:ultraquick

# Prueba rápida
npm run artillery:quick

# Prueba completa de rendimiento
npm run artillery:run

# Generar informe detallado
npm run artillery:report

# Analizar un informe existente
npm run artillery:analyze artillery-report.json
```

**Características de las pruebas de rendimiento**:
- Simulación de diferentes niveles de carga de usuarios
- Medición de tiempos de respuesta
- Identificación de cuellos de botella
- Validación de umbrales de rendimiento

Los resultados se muestran automáticamente en la consola tras cada ejecución, incluyendo:
- Tiempos de respuesta (mínimo, medio, p95, p99, máximo)
- Tasa de error
- Solicitudes por segundo
- Métricas por endpoint

## 4. Herramientas y tecnologías utilizadas

### Frontend
- **React**: Librería para la construcción de interfaces de usuario
- **CSS**: Estilos básicos para una experiencia visual limpia

### Almacenamiento
- **LocalStorage**: Persistencia de datos en el navegador del cliente

### Testing
- **Jest**: Framework para pruebas unitarias y de integración
- **Testing Library**: Utilidades para probar componentes React
- **Cypress**: Herramienta para pruebas end-to-end
- **Artillery**: Herramienta para pruebas de rendimiento y carga

### CI/CD e Integración
- **GitHub Actions**: Automatización de pruebas y despliegue
- **SonarCloud**: Análisis de calidad de código

### DevOps
- **npm scripts**: Automatización de tareas comunes
- **serve**: Servidor estático ligero para despliegue local

## 5. Mejores prácticas implementadas

- **Pruebas automáticas**: Cobertura completa con pruebas unitarias, E2E y de rendimiento
- **Integración continua**: Verificación automática de calidad en cada commit
- **Selectores resilientes**: Las pruebas E2E utilizan selectores que resisten cambios en la estructura del DOM
- **Timeouts adecuados**: Configuración optimizada para evitar falsos positivos
- **Reintentos automáticos**: Las pruebas reintentan operaciones en caso de fallos intermitentes
- **Informes detallados**: Generación automática de informes para análisis de rendimiento y cobertura
- **Umbrales de calidad**: Definición de estándares mínimos para cobertura y rendimiento

---

Desarrollado como parte de un proyecto demostrativo de buenas prácticas en desarrollo web.
