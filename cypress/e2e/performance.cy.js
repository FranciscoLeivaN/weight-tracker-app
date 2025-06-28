// cypress/e2e/performance.cy.js

/**
 * Pruebas de rendimiento para la aplicación de seguimiento de peso
 * Estas pruebas utilizan Lighthouse para medir diversos aspectos del rendimiento 
 * como tiempo de carga, accesibilidad, mejores prácticas y SEO.
 * 
 * IMPORTANTE: Este archivo ejecuta pruebas tanto en entorno local como en CI.
 * Los umbrales son ajustados automáticamente para ser más permisivos en CI.
 */

// Detectar si estamos en CI basado en variables de entorno
const isCI = Cypress.env('CI') === true || Cypress.env('CI') === 'true';

// Definir umbrales basados en el entorno
// En CI, usamos umbrales más tolerantes para evitar falsos positivos
const thresholds = {
  performance: isCI ? 50 : 70,  // Más flexible en CI
  accessibility: isCI ? 70 : 80,
  'best-practices': isCI ? 70 : 85,
  seo: isCI ? 70 : 80,
  'first-contentful-paint': isCI ? 3000 : 2000,  // milisegundos
  'largest-contentful-paint': isCI ? 4000 : 2500,
  'total-blocking-time': isCI ? 500 : 300,
  'cumulative-layout-shift': isCI ? 0.25 : 0.1,
  'speed-index': isCI ? 5000 : 3000
};

describe('Pruebas de Rendimiento con Lighthouse', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Registrar información de entorno
    if (isCI) {
      cy.log('Ejecutando en entorno CI: umbrales adaptados');
    } else {
      cy.log('Ejecutando en entorno local con umbrales estándar');
    }
    
    // Crear un registro más visible
    cy.task('log', `Iniciando pruebas de rendimiento con Lighthouse - Entorno: ${isCI ? 'CI' : 'Local'}`);
  });

  it('debería pasar la auditoría de Lighthouse para la página principal', () => {
    cy.lighthouse({
      performance: thresholds.performance,
      accessibility: thresholds.accessibility,
      'best-practices': thresholds['best-practices'],
      seo: thresholds.seo,
    });
  });

  it('debería pasar la auditoría de métricas de rendimiento', () => {
    cy.lighthouse({
      'first-contentful-paint': thresholds['first-contentful-paint'],
      'largest-contentful-paint': thresholds['largest-contentful-paint'],
      'total-blocking-time': thresholds['total-blocking-time'],
      'cumulative-layout-shift': thresholds['cumulative-layout-shift'],
      'speed-index': thresholds['speed-index'],
    });
  });
});
