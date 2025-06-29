const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuración básica del navegador
      on("before:browser:launch", (browser = {}, launchOptions) => {
        const isCI = process.env.CI === 'true' || process.env.CI === true;
        console.log(`Entorno detectado: ${isCI ? 'CI' : 'Local'}`);
        
        // Agregar flags de estabilidad para todos los navegadores
        launchOptions.args = launchOptions.args || [];
        launchOptions.args.push('--disable-dev-shm-usage');
        
        // En entorno CI
        if (isCI) {
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--mute-audio');
        }
        
        return launchOptions;
      });

      on("task", {
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
    
    // Configuración de timeouts mejorada para CI
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 180000,
    requestTimeout: 30000,
    responseTimeout: 20000,
    
    // Configuración de video y capturas
    video: true,
    videoCompression: false,
    trashAssetsBeforeRuns: false,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    
    // Configuración de reportes
    reporter: 'spec',
    reporterOptions: {
      toConsole: true
    },
    
    // Configuración adicional para estabilidad
    retries: {
      runMode: 3, // Aumentamos a 3 reintentos en CI
      openMode: 0  // Sin reintentos en modo desarrollo
    },
    
    // Variables de entorno para E2E
    env: {}
  },
});