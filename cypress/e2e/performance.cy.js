describe('Pruebas de Rendimiento con Lighthouse', () => {
  const isCI = Cypress.env('CI') || false;
  
  // Configuración de umbrales según el entorno
  const thresholds = {
    CI: {
      performance: 50, // Más permisivo en CI
      accessibility: 75,
      'best-practices': 80,
      seo: 75,
      'first-contentful-paint': 4000,
      'largest-contentful-paint': 5000,
      'total-blocking-time': 600,
      'cumulative-layout-shift': 0.2,
      'speed-index': 5000
    },
    Local: {
      performance: 70,
      accessibility: 80,
      'best-practices': 85,
      seo: 80,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 2500,
      'total-blocking-time': 300,
      'cumulative-layout-shift': 0.1,
      'speed-index': 3000
    }
  };

  const currentThresholds = thresholds[isCI ? 'CI' : 'Local'];
  const environment = isCI ? 'CI' : 'Local';

  before(() => {
    cy.task('log', '=== INICIANDO PRUEBAS DE RENDIMIENTO ===');
    cy.task('log', `Entorno detectado: ${environment}`);
    cy.task('log', `Umbrales configurados para entorno ${environment}:`);
    cy.task('log', JSON.stringify(currentThresholds, null, 2));
  });

  beforeEach(() => {
    cy.task('log', `Ejecutando prueba en entorno: ${environment}`);
    
    // Solo verificar conectividad en CI, donde Chrome ya está pre-iniciado
    if (isCI) {
      cy.task('waitForPort', { 
        port: 9222, 
        host: '127.0.0.1', 
        timeout: 15000 
      }).then((result) => {
        if (!result.success) {
          throw new Error(`No se pudo conectar al puerto de debugging: ${result.error}`);
        }
        cy.task('log', `✅ Puerto 9222 disponible después de ${result.elapsed}ms`);
      });
    }
  });

  it('debería pasar la auditoría de Lighthouse para la página principal', () => {
    // Verificar conectividad solo si es necesario
    if (isCI) {
      cy.task('checkConnection').then((connectionResult) => {
        cy.task('log', `Estado de conexión: ${JSON.stringify(connectionResult)}`);
        
        if (!connectionResult.connected) {
          throw new Error(`No se puede conectar al puerto de debugging: ${connectionResult.error}`);
        }
      });
    }

    // Visitar la página principal
    cy.visit('/');
    
    // Esperar que la página se cargue completamente
    cy.get('body').should('be.visible');
    
    // Espera adicional para estabilización (más tiempo en CI)
    cy.wait(isCI ? 5000 : 2000);
    
    // Ejecutar auditoría de Lighthouse con configuración específica
    cy.lighthouse(currentThresholds, {
      port: Cypress.env('lighthouse_port') || 9222,
      hostname: Cypress.env('lighthouse_hostname') || '127.0.0.1',
      // Configuración adicional para CI
      ...(isCI && {
        disableDeviceEmulation: true,
        settings: {
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          formFactor: 'desktop',
          throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1
          },
          screenEmulation: {
            mobile: false,
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
            disabled: false
          }
        }
      })
    });
  });

  it('debería completar la ejecución de Lighthouse correctamente', () => {
    cy.visit('/');
    
    // Verificar que los elementos principales estén cargados
    cy.get('body').should('be.visible');
    cy.wait(isCI ? 5000 : 2000);
    
    // Configuración específica para la llamada directa a lighthouse
    const lighthouseConfig = {
      url: Cypress.config('baseUrl'),
      options: {
        port: Cypress.env('lighthouse_port') || 9222,
        hostname: Cypress.env('lighthouse_hostname') || '127.0.0.1',
        disableDeviceEmulation: isCI,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        settings: {
          formFactor: 'desktop',
          throttling: isCI ? {
            // Configuración más permisiva para CI
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
          } : {
            // Configuración estándar para local
            rttMs: 150,
            throughputKbps: 1638.4,
            cpuSlowdownMultiplier: 4
          },
          screenEmulation: {
            mobile: false,
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
            disabled: false
          }
        }
      }
    };
    
    cy.task('log', `Configuración de Lighthouse: ${JSON.stringify(lighthouseConfig.options, null, 2)}`);
    
    // Ejecutar Lighthouse y verificar que se complete sin errores
    cy.task('lighthouse', lighthouseConfig).then((lighthouseReport) => {
      cy.task('log', '✅ Lighthouse ejecutado correctamente');
      
      // Verificar que el reporte tenga la estructura esperada
      expect(lighthouseReport).to.have.property('lhr');
      expect(lighthouseReport.lhr).to.have.property('categories');
      expect(lighthouseReport.lhr.categories).to.have.property('performance');
      
      // Log de métricas principales
      const categories = lighthouseReport.lhr.categories;
      const metrics = lighthouseReport.lhr.audits;
      
      cy.task('log', '📊 Métricas de rendimiento:');
      cy.task('log', `  • Performance: ${Math.round(categories.performance.score * 100)}/100`);
      cy.task('log', `  • Accessibility: ${Math.round(categories.accessibility.score * 100)}/100`);
      cy.task('log', `  • Best Practices: ${Math.round(categories['best-practices'].score * 100)}/100`);
      cy.task('log', `  • SEO: ${Math.round(categories.seo.score * 100)}/100`);
      
      // Métricas Core Web Vitals
      if (metrics['first-contentful-paint']) {
        cy.task('log', `  • First Contentful Paint: ${Math.round(metrics['first-contentful-paint'].numericValue)}ms`);
      }
      if (metrics['largest-contentful-paint']) {
        cy.task('log', `  • Largest Contentful Paint: ${Math.round(metrics['largest-contentful-paint'].numericValue)}ms`);
      }
      if (metrics['total-blocking-time']) {
        cy.task('log', `  • Total Blocking Time: ${Math.round(metrics['total-blocking-time'].numericValue)}ms`);
      }
      if (metrics['cumulative-layout-shift']) {
        cy.task('log', `  • Cumulative Layout Shift: ${metrics['cumulative-layout-shift'].numericValue.toFixed(3)}`);
      }
    });
  });

  after(() => {
    cy.task('log', '=== PRUEBAS DE RENDIMIENTO COMPLETADAS ===');
  });
});