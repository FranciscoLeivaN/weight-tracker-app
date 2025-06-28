# Estrategia de Pruebas de Regresión

Este documento describe la estrategia de pruebas de regresión automatizadas para la aplicación de Seguimiento de Peso.

## ¿Qué son las pruebas de regresión?

Las pruebas de regresión son una técnica para verificar que los cambios recientes en el código no han afectado negativamente a las funcionalidades existentes. Estas pruebas aseguran que las características que funcionaban correctamente antes de los cambios siguen funcionando después de los mismos.

## Nuestra estrategia

Nuestra estrategia de pruebas de regresión se basa en los siguientes pilares:

### 1. Automatización completa

Utilizamos GitHub Actions como herramienta de Integración Continua (CI) para automatizar la ejecución de todas nuestras pruebas cada vez que se realiza un push al repositorio o se crea un Pull Request.

### 2. Pruebas unitarias

- Se ejecutan automáticamente en cada push/PR
- Verifican que cada componente y función individual funcione correctamente
- Generan informes de cobertura de código para identificar áreas sin suficientes pruebas

### 3. Pruebas End-to-End (E2E)

- Se ejecutan automáticamente en cada push/PR
- Simulan la interacción del usuario con la aplicación completa
- Verifican que los flujos de trabajo críticos funcionen correctamente

### 4. Detección temprana de regresiones

- La integración con GitHub asegura que cualquier fallo en las pruebas sea visible inmediatamente
- Las pruebas se ejecutan antes de integrar cambios en las ramas principales

### 5. Artefactos y evidencia

- Se guardan los informes de cobertura de código
- Se guardan las capturas de pantalla y videos de pruebas E2E fallidas
- Estos artefactos permiten una rápida depuración de problemas

## Archivos de configuración

- `.github/workflows/unit-tests.yml` - Configuración para pruebas unitarias
- `.github/workflows/e2e-tests.yml` - Configuración para pruebas End-to-End con Cypress

## Mejores prácticas

1. **Mantener alta cobertura**: Intentamos mantener al menos un 80% de cobertura en pruebas unitarias
2. **Pruebas para cada nueva característica**: Cada nueva característica debe incluir sus pruebas correspondientes
3. **Pruebas para cada corrección de errores**: Cada corrección de errores debe incluir una prueba que verifique que el error no vuelve a ocurrir
4. **Revisión periódica**: Revisar y actualizar regularmente las pruebas para asegurar que siguen siendo relevantes

## Ejecución local

Para ejecutar las mismas pruebas localmente:

```bash
# Pruebas unitarias con cobertura
npm test -- --coverage

# Pruebas E2E
npm start
# En otra terminal
npm run cypress:open
```
