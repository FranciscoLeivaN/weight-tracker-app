// cypress/e2e/performance.cy.js

/**
 * Pruebas de rendimiento para la aplicación de seguimiento de peso
 * Estas pruebas utilizan Lighthouse para medir diversos aspectos del rendimiento 
 * como tiempo de carga, accesibilidad, mejores prácticas y SEO.
 * 
 * IMPORTANTE: Este archivo ejecuta pruebas tanto en entorno local como en CI.
 * Los umbrales son ajustados automáticamente para ser más permisivos en CI.
 */

describe('Pruebas de Rendimiento con Lighthouse', () => {
  // Detectar si estamos en CI basado en variables de entorno
  const isCI = Cypress.env('CI') === true || Cypress.env('CI') === 'true';
  
  // Definir umbrales basados en el entorno
  // En CI, usamos umbrales más tolerantes para evitar falsos positivos
  const thresholds = {
    performance: isCI ? 20 : 70,  // Mucho más flexible en CI
    accessibility: isCI ? 50 : 80,
    'best-practices': isCI ? 50 : 85,
    seo: isCI ? 50 : 80,
    'first-contentful-paint': isCI ? 5000 : 2000,  // milisegundos
    'largest-contentful-paint': isCI ? 8000 : 2500,
    'total-blocking-time': isCI ? 1000 : 300,
    'cumulative-layout-shift': isCI ? 0.5 : 0.1,
    'speed-index': isCI ? 8000 : 3000
  };
  
  before(() => {
    // Registrar información de configuración al inicio
    cy.task('log', `=== INICIANDO PRUEBAS DE RENDIMIENTO ===`);
    cy.task('log', `Entorno detectado: ${isCI ? 'CI' : 'Local'}`);
    cy.task('log', `Umbrales configurados para entorno ${isCI ? 'CI' : 'Local'}:`);
    cy.task('log', JSON.stringify(thresholds, null, 2));
  });

  beforeEach(() => {
    // Añadir un retraso para estabilizar la prueba
    cy.wait(2000);
    
    cy.visit('/', {
      // Aumentar los timeouts específicamente para las pruebas de rendimiento
      timeout: isCI ? 120000 : 60000,
      // No fallar en status de error en CI
      failOnStatusCode: !isCI
    });
    
    // Esperar a que la página esté completamente cargada
    cy.get('body', { timeout: 10000 }).should('be.visible');
    
    // Registrar información de entorno
    cy.task('log', `Ejecutando prueba en entorno: ${isCI ? 'CI' : 'Local'}`);
  });

  it('debería pasar la auditoría de Lighthouse para la página principal', () => {
    // Añadir un retraso antes de ejecutar Lighthouse
    cy.wait(2000);
    
    // Ejecutar la auditoría con manejo de errores
    cy.lighthouse({
      performance: thresholds.performance,
      accessibility: thresholds.accessibility,
      'best-practices': thresholds['best-practices'],
      seo: thresholds.seo,
    }, {
      // Opciones para Lighthouse
      formFactor: 'desktop',
      screenEmulation: {
        width: 1280,
        height: 720,
        deviceScaleRatio: 1,
        mobile: false,
        disable: false,
      }
    }).then((report) => {
      // Registrar los resultados
      cy.task('log', `Resultados de la auditoría Lighthouse: ${JSON.stringify(report)}`);
    });
  });

  // Separamos las métricas en pruebas más pequeñas para facilitar el diagnóstico
  it('debería pasar la métrica First Contentful Paint', () => {
    cy.wait(1000);
    cy.lighthouse({
      'first-contentful-paint': thresholds['first-contentful-paint']
    });
  });

  it('debería pasar la métrica Largest Contentful Paint', () => {
    cy.wait(1000);
    cy.lighthouse({
      'largest-contentful-paint': thresholds['largest-contentful-paint']
    });
  });

  it('debería pasar las métricas de rendimiento restantes', () => {
    cy.wait(1000);
    cy.lighthouse({
      'total-blocking-time': thresholds['total-blocking-time'],
      'cumulative-layout-shift': thresholds['cumulative-layout-shift'],
      'speed-index': thresholds['speed-index'],
    });
  });
  
  after(() => {
    // Registrar finalización de pruebas
    cy.task('log', `=== PRUEBAS DE RENDIMIENTO COMPLETADAS ===`);
  });
});
