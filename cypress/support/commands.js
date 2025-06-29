// ***********************************************
// Este archivo de comandos se procesa y
// se carga automáticamente antes de tus archivos de prueba.
//
// Puedes agregar comandos personalizados o anular
// los comandos existentes de Cypress.
//
// Para más información sobre los comandos personalizados visita:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- Esto es un comando personalizado de ejemplo -- //
//
// -- Este comando ha sido comentado -- //
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- Esto es un ejemplo de sobrescritura de un comando existente --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Comando personalizado mejorado para medir el rendimiento de operaciones
 * Permite medir el tiempo que toma ejecutar una operación específica
 * y muestra los resultados en el log de Cypress
 * 
 * Esta versión corregida utiliza variables en el contexto global de Cypress
 * para obtener mediciones más precisas
 * 
 * @example
 * cy.measurePerformance('Operación de registro', () => {
 *   // Código de la operación que quieres medir
 *   cy.get('button').click();
 * }).then(time => {
 *   // Realizar aserciones con el tiempo
 *   expect(time).to.be.lessThan(1000);
 * });
 */
Cypress.Commands.add('measurePerformance', (operationName, callback) => {
  // Crear un ID único para esta medición
  const perfKey = `perf_${Date.now()}`;
  let startTime;
  
  // Marcar el tiempo inicial y almacenarlo en una variable
  return cy
    .window()
    .then((win) => {
      startTime = performance.now();
      win[perfKey] = {
        name: operationName,
        startTime: startTime
      };
    })
    // Ejecutar la operación a medir
    .then(() => {
      callback();
    })
    // Calcular el tiempo cuando todo termina
    .then(() => {
      return cy.window();
    })
    .then((win) => {
      const endTime = performance.now();
      const operationTime = endTime - (win[perfKey]?.startTime || startTime);
      
      cy.log(`Rendimiento: [${operationName}] - ${operationTime.toFixed(2)}ms`);
      
      // Limpieza
      if (win[perfKey]) {
        delete win[perfKey];
      }
      
      // Devolver el tiempo de operación para posibles aserciones
      return operationTime;
    });
});
