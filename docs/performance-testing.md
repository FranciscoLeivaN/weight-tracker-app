# Pruebas de Rendimiento con Cypress y Lighthouse

Este documento explica cómo realizar pruebas de rendimiento en la aplicación Weight Tracker usando Cypress con la integración de Lighthouse.

## Configuración

La configuración para las pruebas de rendimiento incluye:

- **cypress-audit**: Plugin que integra Lighthouse con Cypress
- **lighthouse**: Herramienta de Google para auditar rendimiento, accesibilidad, SEO y más

## Ejecución de Pruebas de Rendimiento

Para ejecutar las pruebas de rendimiento, sigue estos pasos:

1. **Iniciar la aplicación en modo desarrollo**:
   ```
   npm start
   ```

2. **En otra terminal, ejecutar las pruebas de rendimiento**:
   ```
   npm run test:performance
   ```

   Esto ejecutará las pruebas de Cypress que incluyen auditorías de Lighthouse contra la aplicación en desarrollo.

3. **Para abrir Cypress y ejecutar las pruebas manualmente**:
   ```
   npm run test:performance:open
   ```

## Métricas Evaluadas

Las pruebas de rendimiento evalúan las siguientes métricas:

- **Performance (Rendimiento)**: Mínimo 70%
- **Accessibility (Accesibilidad)**: Mínimo 80% 
- **Best Practices (Mejores Prácticas)**: Mínimo 85%
- **SEO**: Mínimo 80%

Además, se evalúan métricas específicas como:

- **First Contentful Paint**: Máximo 2 segundos
- **Largest Contentful Paint**: Máximo 2.5 segundos
- **Total Blocking Time**: Máximo 300 ms
- **Cumulative Layout Shift**: Máximo 0.1
- **Speed Index**: Máximo 3 segundos

## Integración Continua

Para integración continua (CI), se ha configurado un archivo `lighthouserc.json` que define los umbrales para las diferentes métricas. Esto permite que las pruebas de CI fallen si el rendimiento de la aplicación cae por debajo de los umbrales definidos.

## Notas Importantes

- Las pruebas de rendimiento son independientes de las pruebas E2E existentes
- Para obtener resultados más precisos, ejecuta las pruebas en un entorno limpio
- Los umbrales establecidos pueden ajustarse según las necesidades del proyecto
