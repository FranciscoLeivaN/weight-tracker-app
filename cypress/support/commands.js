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

// Importar y registrar los comandos de cypress-audit para Lighthouse
import 'cypress-audit/commands';
