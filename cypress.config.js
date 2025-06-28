const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("cypress-audit");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuración para cypress-audit (Lighthouse)
      on("before:browser:launch", (browser = {}, launchOptions) => {
        const isCI = process.env.CI === 'true' || process.env.CI === true;
        console.log(`Entorno detectado: ${isCI ? 'CI' : 'local'}`);
        
        // Para Chrome/Chromium
        if (browser.name === "chrome" || browser.name === "chromium") {
          console.log(`Configurando Chrome/Chromium para entorno: ${isCI ? 'CI' : 'local'}`);
          
          // Configuraciones básicas para todos los entornos
          launchOptions.args.push('--disable-dev-shm-usage');
          
          // Configuraciones adicionales para CI
          if (isCI) {
            console.log('Aplicando configuraciones específicas de Chrome para CI');
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-setuid-sandbox');
            launchOptions.args.push('--no-first-run');
            launchOptions.args.push('--disable-extensions');
          }
          
          // Preparar Lighthouse en ambos entornos
          console.log(`Preparando auditoría Lighthouse para entorno: ${isCI ? 'CI' : 'local'}`);
          return prepareAudit(launchOptions);
        }
        return launchOptions;
      });

      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          const isCI = process.env.CI === 'true' || process.env.CI === true;
          // Manejo especial para entornos CI
          if (isCI) {
            console.log('Lighthouse en CI: aplicando adaptaciones para CI');
            
            // Guardar el reporte completo en un archivo
            const fs = require('fs');
            const path = require('path');
            const reportDir = path.join(__dirname, '.cypress-audit');
            
            if (!fs.existsSync(reportDir)) {
              fs.mkdirSync(reportDir, { recursive: true });
            }
            
            const reportPath = path.join(reportDir, `lighthouse-report-${new Date().toISOString().replace(/:/g, '-')}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(lighthouseReport, null, 2));
            console.log(`Reporte de Lighthouse guardado en: ${reportPath}`);
            
            // Añadimos una marca para indicar que se ejecutó en CI
            return {
              ...lighthouseReport,
              executedInCI: true
            };
          }
          return lighthouseReport;
        }),
        
        // Tarea para registrar mensajes en la consola
        log(message) {
          console.log(`[CYPRESS LOG] ${message}`);
          return null;
        }
      });
    },
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    // Solucionar problemas de tiempo de espera
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 180000,
    // Configuración de video y resultados
    video: true,
    videoCompression: false,
    trashAssetsBeforeRuns: false,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    // Configuración para generar reportes
    reporter: 'spec',
    reporterOptions: {
      toConsole: true
    }
  },
});
