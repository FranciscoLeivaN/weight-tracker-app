// Este archivo sirve como prueba para asegurarse de que
// las pruebas de rendimiento no se ejecuten en entorno de CI,
// pero que el runner de Cypress no falle.

describe('Pruebas de rendimiento en CI', () => {
  it('No ejecutar pruebas de rendimiento en CI', () => {
    cy.log('Las pruebas de rendimiento están desactivadas en CI');
    expect(true).to.equal(true);
  });
});
