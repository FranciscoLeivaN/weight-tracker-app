const { defineConfig } = require("cypress");
// Removida dependencia de cypress-audit para simplificar

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuración para cypress-audit (Lighthouse)
      on("before:browser:launch", (browser = {}, launchOptions) => {
        const isCI = process.env.CI === 'true' || process.env.CI === true;
        console.log(`Entorno detectado: ${isCI ? 'CI' : 'Local'}`);
        
        // Para Chrome/Chromium - Configuración ULTRA simplificada
        if (browser.name === "chrome" || browser.name === "chromium") {
          console.log(`Configurando Chrome/Chromium para entorno: ${isCI ? 'CI' : 'Local'}`);
          
          // Solo flags esenciales para estabilidad
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-web-security');
          
          // Configuraciones básicas para CI
          if (isCI) {
            console.log('Aplicando configuraciones mínimas para CI');
            
            // Solo flags críticos
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--mute-audio');
            
            console.log('✅ Configuración mínima para CI aplicada');
          }
        }
        
        return launchOptions;
      });

      on("task", {
        // Solo tareas básicas para logging
        log(message) {
          console.log(`[CYPRESS LOG] ${message}`);
          return null;
        },
        
        // Tarea para registrar mensajes en la consola
        log(message) {
          console.log(`[CYPRESS LOG] ${message}`);
          return null;
        },
        
        // Tarea mejorada para verificar conectividad con timeout más largo
        checkConnection() {
          const net = require('net');
          
          return new Promise((resolve) => {
            const client = new net.Socket();
            
            client.setTimeout(10000); // Aumentamos timeout a 10 segundos
            
            client.on('connect', () => {
              console.log('✅ Conexión al puerto de debugging exitosa');
              client.destroy();
              resolve({ connected: true, port: 9222 });
            });
            
            client.on('error', (err) => {
              console.log('❌ Error de conexión:', err.message);
              resolve({ connected: false, error: err.message });
            });
            
            client.on('timeout', () => {
              console.log('⏰ Timeout de conexión');
              client.destroy();
              resolve({ connected: false, error: 'timeout' });
            });
            
            try {
              client.connect(9222, '127.0.0.1');
            } catch (error) {
              console.log('❌ Error iniciando conexión:', error.message);
              resolve({ connected: false, error: error.message });
            }
          });
        },
        
        // Nueva tarea para esperar que el puerto esté disponible
        waitForPort({ port = 9222, host = '127.0.0.1', timeout = 30000 } = {}) {
          const net = require('net');
          
          return new Promise((resolve) => {
            const startTime = Date.now();
            
            const tryConnect = () => {
              if (Date.now() - startTime > timeout) {
                resolve({ success: false, error: 'timeout', elapsed: Date.now() - startTime });
                return;
              }
              
              const client = new net.Socket();
              client.setTimeout(1000);
              
              client.on('connect', () => {
                client.destroy();
                resolve({ success: true, elapsed: Date.now() - startTime });
              });
              
              client.on('error', () => {
                client.destroy();
                setTimeout(tryConnect, 1000); // Reintentar en 1 segundo
              });
              
              client.on('timeout', () => {
                client.destroy();
                setTimeout(tryConnect, 1000);
              });
              
              client.connect(port, host);
            };
            
            tryConnect();
          });
        }
      });
    },
    
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configuración de timeouts mejorada para CI
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 180000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    
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
    
    // Variables de entorno específicas
    env: {
      lighthouse_port: 9222,
      lighthouse_hostname: '127.0.0.1'
    }
  },
});