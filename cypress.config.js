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
    defaultCommandTimeout: 60000, // Aumentado a 60 segundos
    pageLoadTimeout: 180000,
    requestTimeout: 60000, // Aumentado a 60 segundos
    responseTimeout: 60000, // Aumentado a 60 segundos
    videoTimeout: 30000, // Tiempo extendido para grabar video completo (30 segundos)
    experimentalInteractiveRunEvents: true, // Habilita eventos adicionales para controlar tests
    
    // Configuración de video y capturas
    video: true,
    videoCompression: 32, // Menor compresión para mejor calidad (0-100, donde 0 es sin compresión)
    trashAssetsBeforeRuns: false, // Mantener videos anteriores
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    videoRecording: {
      enabled: true
    },
    
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
    env: {
      videoCompression: 32, // Configuración de compresión
      waitForAnimations: true,
      animationDistanceThreshold: 20,
      videoRecordingDelay: 3000, // Esperar 3 segundos antes de finalizar la grabación
      numTestsKeptInMemory: 0, // Para evitar problemas de memoria
      videoRecording: true
    },
    
    // Control del proceso de grabación
    experimentalSessionAndOrigin: true,
    experimentalSourceRewriting: true
  },
});