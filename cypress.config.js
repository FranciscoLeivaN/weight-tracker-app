const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("cypress-audit");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuración para cypress-audit (Lighthouse)
      on("before:browser:launch", (browser = {}, launchOptions) => {
        const isCI = process.env.CI === 'true' || process.env.CI === true;
        console.log(`Entorno detectado: ${isCI ? 'CI' : 'Local'}`);
        
        // Para Chrome/Chromium
        if (browser.name === "chrome" || browser.name === "chromium") {
          console.log(`Configurando Chrome/Chromium para entorno: ${isCI ? 'CI' : 'Local'}`);
          
          // Configuraciones básicas para todos los entornos
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--ignore-certificate-errors');
          launchOptions.args.push('--allow-running-insecure-content');
          
          // Configuraciones adicionales para CI
          if (isCI) {
            console.log('Aplicando configuraciones específicas de Chrome para CI');
            
            // Flags esenciales para CI
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-setuid-sandbox');
            launchOptions.args.push('--no-first-run');
            launchOptions.args.push('--disable-extensions');
            launchOptions.args.push('--disable-background-timer-throttling');
            launchOptions.args.push('--disable-backgrounding-occluded-windows');
            launchOptions.args.push('--disable-renderer-backgrounding');
            launchOptions.args.push('--disable-features=TranslateUI');
            launchOptions.args.push('--disable-ipc-flooding-protection');
            launchOptions.args.push('--enable-features=NetworkService,NetworkServiceLogging');
            launchOptions.args.push('--force-color-profile=srgb');
            launchOptions.args.push('--metrics-recording-only');
            launchOptions.args.push('--no-default-browser-check');
            launchOptions.args.push('--disable-default-apps');
            launchOptions.args.push('--disable-background-networking');
            launchOptions.args.push('--disable-sync');
            launchOptions.args.push('--disable-translate');
            launchOptions.args.push('--hide-scrollbars');
            launchOptions.args.push('--mute-audio');
            
            // 🔧 CLAVE: Configuración del puerto de debugging remoto para Lighthouse
            launchOptions.args.push('--remote-debugging-port=9222');
            launchOptions.args.push('--remote-debugging-address=127.0.0.1'); // Forzar IPv4
            
            console.log('✅ Configuración de Chrome para CI aplicada');
          } else {
            // Configuración local más simple pero efectiva
            launchOptions.args.push('--remote-debugging-port=9222');
            launchOptions.args.push('--remote-debugging-address=127.0.0.1');
          }
          
          // Preparar Lighthouse en ambos entornos
          console.log(`Preparando auditoría Lighthouse para entorno: ${isCI ? 'CI' : 'Local'}`);
          return prepareAudit(launchOptions);
        }
        
        return launchOptions;
      });

      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          const isCI = process.env.CI === 'true' || process.env.CI === true;
          
          // Configuración específica para Lighthouse
          const lighthouseOptions = {
            // Configuración del puerto para conectar con Chrome
            port: 9222,
            hostname: '127.0.0.1', // Forzar IPv4 en lugar de IPv6
            
            // Configuraciones específicas para CI
            ...(isCI && {
              chromeFlags: [
                '--headless',
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--remote-debugging-port=9222',
                '--remote-debugging-address=127.0.0.1'
              ]
            })
          };
          
          // Manejo especial para entornos CI
          if (isCI) {
            console.log('🔧 Lighthouse en CI: aplicando adaptaciones para CI');
            console.log('📊 Configuración de Lighthouse:', JSON.stringify(lighthouseOptions, null, 2));
            
            // Guardar el reporte completo en un archivo
            const fs = require('fs');
            const path = require('path');
            const reportDir = path.join(__dirname, '.cypress-audit');
            
            if (!fs.existsSync(reportDir)) {
              fs.mkdirSync(reportDir, { recursive: true });
            }
            
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const reportPath = path.join(reportDir, `lighthouse-report-${timestamp}.json`);
            
            try {
              fs.writeFileSync(reportPath, JSON.stringify(lighthouseReport, null, 2));
              console.log(`✅ Reporte de Lighthouse guardado en: ${reportPath}`);
            } catch (error) {
              console.error('❌ Error guardando reporte de Lighthouse:', error);
            }
            
            // Añadimos información adicional para CI
            return {
              ...lighthouseReport,
              executedInCI: true,
              lighthouseOptions
            };
          }
          
          return lighthouseReport;
        }),
        
        // Tarea para registrar mensajes en la consola
        log(message) {
          console.log(`[CYPRESS LOG] ${message}`);
          return null;
        },
        
        // Nueva tarea para verificar conectividad
        checkConnection() {
          const net = require('net');
          
          return new Promise((resolve) => {
            const client = new net.Socket();
            
            client.setTimeout(5000);
            
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
            
            client.connect(9222, '127.0.0.1');
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
      runMode: 2, // Reintentos en CI
      openMode: 0  // Sin reintentos en modo desarrollo
    },
    
    // Variables de entorno específicas
    env: {
      lighthouse_port: 9222,
      lighthouse_hostname: '127.0.0.1'
    }
  },
});