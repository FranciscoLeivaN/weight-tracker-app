const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("cypress-audit");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuración para cypress-audit (Lighthouse)
      on("before:browser:launch", (browser = {}, launchOptions) => {
        // Para Chrome/Chromium
        if (browser.name === "chrome" || browser.name === "chromium") {
          // Configuraciones para Chrome en CI
          if (process.env.CI) {
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-dev-shm-usage');
          }
        }
        return prepareAudit(launchOptions);
      });

      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          // Manejo especial para entornos CI
          if (process.env.CI) {
            console.log('Lighthouse en CI: saltando validaciones estrictas');
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
