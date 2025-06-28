// cypress/e2e/weightTracker.cy.js

/**
 * Pruebas end-to-end (E2E) para la aplicación de seguimiento de peso
 * Estas pruebas simulan la interacción del usuario con la aplicación
 * y verifican que todas las funcionalidades trabajen correctamente juntas.
 * 
 * IMPORTANTE: Para ejecutar estas pruebas, asegúrate de que la aplicación
 * esté en ejecución con `npm start` en otra terminal antes de ejecutar Cypress.
 */

describe('Pruebas E2E de la Aplicación de Seguimiento de Peso', () => {
  beforeEach(() => {
    // Limpia el localStorage antes de cada prueba para asegurar un estado limpio
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000'); // Asume que tu aplicación corre en este puerto
  });

  /**
   * Prueba que verifica el flujo básico de registro de peso
   * - El usuario ingresa un peso
   * - El sistema muestra el peso en el historial
   * - El campo de entrada se limpia después del registro
   */
  it('debería permitir al usuario registrar un peso y mostrarlo en el historial', () => {
    // Ingresar el nombre de usuario
    cy.get('input[placeholder="Nombre de usuario"]').type('Usuario Prueba');
    // Ingresar el peso
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('75.5');
    // Hacer clic en el botón de registro
    cy.contains('button', 'Registrar Peso').click();

    // Verificar que se muestre en el historial
    cy.get('ul').should('contain', 'Peso: 75.5 kg');
    cy.get('ul').should('contain', 'Usuario: Usuario Prueba');
    // Verificar que el campo de entrada del peso se haya limpiado
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').should('have.value', '');
  });

  /**
   * Prueba que verifica la restricción de 48 horas entre registros
   * - El usuario registra un peso
   * - Intenta registrar otro peso inmediatamente
   * - El sistema muestra un mensaje de error
   * - Solo debe existir un registro en el historial
   */
  it('debería impedir añadir un peso dentro de las 48 horas y mostrar un mensaje de error', () => {
    // Primer registro
    cy.get('input[placeholder="Nombre de usuario"]').type('Usuario Prueba');
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('70');
    cy.contains('button', 'Registrar Peso').click();

    // Esperar un corto tiempo (simulando que no pasaron 48h)
    cy.wait(100);

    // Intentar registrar de nuevo inmediatamente
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('70.1');
    cy.contains('button', 'Registrar Peso').click();

    // Verificar que aparece el mensaje de error
    cy.get('.error-message').should('contain', 'Debes esperar');
    // Verificar que solo hay un registro
    cy.get('ul li').should('have.length', 1);
  });

  /**
   * Prueba que verifica la persistencia de datos
   * - El usuario registra un peso
   * - Se recarga la página
   * - El peso debe seguir apareciendo en el historial
   */
  it('debería persistir los pesos después de recargar la página', () => {
    // Registrar un peso
    cy.get('input[placeholder="Nombre de usuario"]').type('Usuario Prueba');
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('80');
    cy.contains('button', 'Registrar Peso').click();

    // Recargar la página
    cy.reload();

    // Verificar que el peso sigue visible
    cy.get('ul').should('contain', 'Peso: 80 kg');
    cy.get('ul').should('contain', 'Usuario: Usuario Prueba');
  });

  /**
   * Prueba que verifica la funcionalidad de borrar todos los registros
   * - El usuario registra un peso
   * - Hace clic en borrar todos los registros
   * - El historial debe quedar vacío
   */
  it('debería borrar todos los pesos cuando se hace clic en "Borrar Todos los Registros"', () => {
    // Registrar un peso
    cy.get('input[placeholder="Nombre de usuario"]').type('Usuario Prueba');
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('65');
    cy.contains('button', 'Registrar Peso').click();

    // Hacer clic en borrar todos los registros
    cy.contains('button', 'Borrar Todos los Registros').click();
    
    // Verificar que no hay registros y se muestra el mensaje de vacío
    cy.contains('p', 'Aún no hay registros de peso.').should('be.visible');
    cy.get('ul li').should('not.exist');
  });

  /**
   * Prueba que verifica la posibilidad de añadir un registro después de 48 horas
   * - El usuario registra un peso
   * - Se adelanta el reloj 50 horas
   * - El usuario registra otro peso
   * - Deben existir dos registros en el historial
   */
  it('debería permitir añadir un nuevo registro después de 48 horas', () => {
    // Configurar el reloj inicial
    const now = new Date();
    cy.clock(now);
    
    // Primer registro
    cy.get('input[placeholder="Nombre de usuario"]').type('Usuario Prueba');
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('65');
    cy.contains('button', 'Registrar Peso').click();

    // Avanzar el reloj 50 horas (más de 48h)
    cy.tick(50 * 60 * 60 * 1000);
    
    // Segundo registro
    cy.get('input[placeholder="Nombre de usuario"]').clear().type('Usuario Prueba 2');
    cy.get('input[placeholder="Ingresa tu peso (kg)"]').type('66');
    cy.contains('button', 'Registrar Peso').click();

    // Verificar que hay dos registros
    cy.get('ul li').should('have.length', 2);
    cy.get('ul').should('contain', 'Peso: 65 kg');
    cy.get('ul').should('contain', 'Peso: 66 kg');
    cy.get('ul').should('contain', 'Usuario: Usuario Prueba');
    cy.get('ul').should('contain', 'Usuario: Usuario Prueba 2');
  });
});
