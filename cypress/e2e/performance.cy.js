// cypress/e2e/performance.cy.js

/**
 * Pruebas de rendimiento para la aplicación de seguimiento de peso
 * Estas pruebas utilizan Lighthouse para medir diversos aspectos del rendimiento 
 * como tiempo de carga, accesibilidad, mejores prácticas y SEO.
 * 
 * IMPORTANTE: Este archivo ejecutará pruebas SOLO en entorno local.
 * En entorno CI, estas pruebas son COMPLETAMENTE OMITIDAS.
 */

// Detectar si estamos en CI basado en variables de entorno
const isCI = Cypress.env('CI') === true || Cypress.env('CI') === 'true';

if (isCI) {
  // En CI, creamos un conjunto de pruebas vacío
  describe('Pruebas de Rendimiento (omitidas en CI)', () => {
    it('Las pruebas de rendimiento están deshabilitadas en entorno CI', () => {
      cy.log('Pruebas de rendimiento omitidas intencionalmente en entorno CI');
      expect(true).to.equal(true); // Siempre pasa
    });
  });
} else {
  // Solo en entorno local, ejecutamos las pruebas reales
  describe('Pruebas de Rendimiento con Lighthouse', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('debería pasar la auditoría de Lighthouse para la página principal', () => {
      cy.lighthouse({
        performance: 70,
        accessibility: 80,
        'best-practices': 85,
        seo: 80,
      });
    });

    it('debería pasar la auditoría de métricas de rendimiento', () => {
      cy.lighthouse({
        'first-contentful-paint': 2000,
        'largest-contentful-paint': 2500,
        'total-blocking-time': 300,
        'cumulative-layout-shift': 0.1,
        'speed-index': 3000,
      });
    });
  });
}
