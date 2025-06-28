# Pruebas Funcionales con Cypress

Este directorio contiene las pruebas end-to-end para la aplicación de Seguimiento de Peso utilizando Cypress.

## Estructura

- `weightTracker.cy.js`: Pruebas para el flujo de trabajo principal de la aplicación.

## Pruebas Implementadas

1. **Registro de peso básico**:
   - Verifica que se pueda ingresar un nombre de usuario y un peso.
   - Comprueba que el registro aparezca en el historial.
   - Confirma que el campo de entrada se limpie después del registro.

2. **Validación de 48 horas**:
   - Verifica que no se puedan hacer dos registros consecutivos sin esperar 48 horas.
   - Comprueba que aparezca un mensaje de error al intentarlo.

3. **Persistencia de datos**:
   - Comprueba que los datos persistan después de recargar la página.

4. **Borrado de registros**:
   - Verifica la funcionalidad de borrar todos los registros.

5. **Registro después de 48 horas**:
   - Comprueba que se pueda hacer un nuevo registro después de que pasen 48 horas.

## Cómo ejecutar las pruebas

**IMPORTANTE**: Cypress necesita que la aplicación esté en ejecución para realizar las pruebas.

### Instrucciones paso a paso (modo local)

1. **Inicia la aplicación** en modo desarrollo:
   ```
   npm start
   ```

2. **Espera** a que la aplicación esté completamente cargada (cuando veas "Compiled successfully" en la terminal)

3. **Abre una nueva terminal** (manteniendo la primera en ejecución) y ejecuta:
   - Para interfaz gráfica de Cypress:
     ```
     npm run test:e2e:open
     ```
     o
     ```
     npm run cypress:open
     ```

   - Para ejecutar pruebas en modo headless (sin interfaz gráfica):
     ```
     npm run test:e2e
     ```
     o
     ```
     npm run cypress:run
     ```

### Nota sobre integración continua

La configuración de GitHub Actions ya está configurada para ejecutar automáticamente tanto el servidor como las pruebas en secuencia. El archivo de configuración `.github/workflows/e2e-tests.yml` utiliza la acción oficial de Cypress que:

1. Inicia automáticamente el servidor
2. Espera a que esté disponible
3. Ejecuta todas las pruebas de Cypress

No es necesario realizar ninguna acción manual para la ejecución de pruebas en el entorno de CI.
