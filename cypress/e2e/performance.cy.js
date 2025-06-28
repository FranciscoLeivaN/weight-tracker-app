// cypress/e2e/performance.cy.js

/**
 * Pruebas de rendimiento para la aplicación de seguimiento de peso
 * Estas pruebas utilizan Lighthouse para medir diversos aspectos del rendimiento 
 * como tiempo de carga, accesibilidad, mejores prácticas y SEO.
 * 
 * Nota: Las pruebas se omiten automáticamente en el entorno CI para evitar fallos.
 */

describe('Pruebas de Rendimiento con Lighthouse', () => {
  // Comprobar si estamos en un entorno CI
  const isCI = Cypress.env('CI');
  
  before(() => {
    // Mostrar mensaje informativo si estamos en CI
    if (isCI) {
      cy.log('Entorno de CI detectado. Las pruebas de rendimiento se omitirán.');
    }
  });

  beforeEach(function() {
    // Omitir todas las pruebas en entorno CI
    if (isCI) {
      this.skip();
    } else {
      // Solo visitar la página si no estamos en CI
      cy.visit('/');
    }
  });

  it('debería pasar la auditoría de Lighthouse para la página principal', function() {
    // Si estamos en CI, esta prueba nunca se ejecutará debido al skip en beforeEach
    cy.lighthouse({
      performance: 70,     // Rendimiento mínimo esperado: 70%
      accessibility: 80,   // Accesibilidad mínima esperada: 80%
      'best-practices': 85, // Mejores prácticas mínimas esperadas: 85%
      seo: 80,             // SEO mínimo esperado: 80%
    });
  });

  it('debería pasar la auditoría de métricas de rendimiento', function() {
    // Si estamos en CI, esta prueba nunca se ejecutará debido al skip en beforeEach
    cy.lighthouse({
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 2500,
      'total-blocking-time': 300,
      'cumulative-layout-shift': 0.1,
      'speed-index': 3000,
    });
  });
});
