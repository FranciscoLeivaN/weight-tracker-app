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
          // Configuraciones para Chrome en CI
          if (isCI) {
            console.log('Aplicando configuraciones de Chrome para CI y habilitando Lighthouse');
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-dev-shm-usage');
            launchOptions.args.push('--disable-setuid-sandbox');
            launchOptions.args.push('--no-first-run');
            launchOptions.args.push('--disable-extensions');
            
            // Además de aplicar configuraciones de CI, también preparamos Lighthouse
            console.log('Preparando auditoría Lighthouse también para CI');
            return prepareAudit(launchOptions);
          } else {
            // Preparar las auditorías en entorno local
            console.log('Preparando auditoría Lighthouse en entorno local');
            return prepareAudit(launchOptions);
          }
        }
        return launchOptions;
      });

      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          const isCI = process.env.CI === 'true' || process.env.CI === true;
          // Manejo especial para entornos CI
          if (isCI) {
            console.log('Lighthouse en CI: aplicando adaptaciones para CI');
            // Añadimos una marca para indicar que se ejecutó en CI
            return {
              ...lighthouseReport,
              executedInCI: true
            };
          }
          return lighthouseReport;
        }),
      });
    },
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    // Solucionar problemas de tiempo de espera
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    video: true
  },
});
