# Aplicación de Seguimiento de Peso

Esta aplicación permite a los usuarios registrar sus pesos con nombre de usuario, visualizar el historial y asegura que haya al menos 48 horas entre cada registro.

El proyecto fue creado con [Create React App](https://github.com/facebook/create-react-app).

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verla en tu navegador.

La página se recargará cuando hagas cambios.\
También puedes ver errores de lint en la consola.

### `npm test`

Inicia el ejecutor de pruebas en modo interactivo.\
Consulta la sección sobre [ejecutar pruebas](https://facebook.github.io/create-react-app/docs/running-tests) para más información.

### `npm run cypress:open` o `npm run test:e2e:open`

Abre la interfaz gráfica de Cypress para ejecutar y depurar pruebas funcionales end-to-end.\
Esto te permite seleccionar y ejecutar pruebas específicas en un navegador visual.\
**IMPORTANTE**: Asegúrate de tener la aplicación en ejecución con `npm start` antes de usar este comando.

### `npm run cypress:run` o `npm run test:e2e`

Ejecuta todas las pruebas de Cypress en modo headless (sin interfaz gráfica).\
Útil para integración continua o para ejecutar todas las pruebas rápidamente.\
**IMPORTANTE**: Asegúrate de tener la aplicación en ejecución con `npm start` antes de usar este comando.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Características de la Aplicación

- Registro de peso con nombre de usuario
- Validación de 48 horas entre registros
- Persistencia de datos usando localStorage
- Historial de registros con fecha y hora
- Capacidad para borrar todo el historial

## Pruebas

El proyecto incluye tres niveles de pruebas:

### Pruebas Unitarias (Jest)

Las pruebas unitarias verifican componentes y funciones individuales en aislamiento.
Se encuentran en `src/__tests__/` y se pueden ejecutar con `npm test`.

### Pruebas Funcionales (Cypress)

Las pruebas end-to-end verifican la aplicación completa simulando la interacción del usuario.
Se encuentran en `cypress/e2e/` y se pueden ejecutar con `npm run cypress:open`.

## Más Información

Consulta la [documentación de Create React App](https://facebook.github.io/create-react-app/docs/getting-started) para más información sobre la estructura base.

Para aprender React, visita la [documentación oficial de React](https://reactjs.org/).

Para información sobre Cypress, visita la [documentación oficial de Cypress](https://docs.cypress.io).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
