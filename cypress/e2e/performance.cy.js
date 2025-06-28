// cypress/e2e/performance.cy.js

/**
 * Pruebas de rendimiento para la aplicación de seguimiento de peso
 * Estas pruebas utilizan Lighthouse para medir diversos aspectos del rendimiento 
 * como tiempo de carga, accesibilidad, mejores prácticas y SEO.
 */

describe('Pruebas de Rendimiento con Lighthouse', () => {
  // Salta las pruebas si estamos en CI para evitar problemas
  const shouldSkip = Cypress.env('CI') === 'true';
  
  beforeEach(() => {
    // Verificar si estamos en CI y saltar si es necesario
    if (shouldSkip) {
      cy.log('Saltando prueba de rendimiento en entorno CI');
      return;
    }
    
    // Visitar la página principal
    cy.visit('/');
  });

  it('debería pasar la auditoría de Lighthouse para la página principal', () => {
    // Saltar en CI
    if (shouldSkip) {
      cy.log('Prueba saltada en CI');
      return;
    }
    
    // La función cy.lighthouse() es proporcionada por cypress-audit
    // Establece umbrales para diferentes métricas
    cy.lighthouse({
      performance: 70,     // Rendimiento mínimo esperado: 70%
      accessibility: 80,   // Accesibilidad mínima esperada: 80%
      'best-practices': 85, // Mejores prácticas mínimas esperadas: 85%
      seo: 80,             // SEO mínimo esperado: 80%
      // No incluimos PWA ya que esta aplicación no está configurada como PWA
    });
  });

  it('debería pasar la auditoría de métricas de rendimiento', () => {
    // Saltar en CI
    if (shouldSkip) {
      cy.log('Prueba saltada en CI');
      return;
    }
    
    // La función cy.pa11y() se utilizaría para pruebas de accesibilidad específicas
    // pero depende de pa11y que es otro paquete, así que usamos lighthouse específicamente
    // para métricas de rendimiento críticas
    cy.lighthouse({
      'first-contentful-paint': 2000,  // máximo 2 segundos
      'largest-contentful-paint': 2500, // máximo 2.5 segundos
      'total-blocking-time': 300,      // máximo 300 ms
      'cumulative-layout-shift': 0.1,  // máximo 0.1 (muy bueno)
      'speed-index': 3000,             // máximo 3 segundos
    });
  });
});
  });
});
