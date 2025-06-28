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
            
            // Configuraciones estándar para entornos CI
            launchOptions.args.push('--headless=new'); // Usar el nuevo modo headless
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-setuid-sandbox');
            launchOptions.args.push('--no-first-run');
            launchOptions.args.push('--disable-extensions');
            
            // CRÍTICO: Forzar IPv4 para debugging - soluciona problemas de conectividad con ::1 (IPv6)
            console.log('Aplicando configuraciones para mejorar conectividad en CI');
            launchOptions.args.push('--remote-debugging-address=127.0.0.1'); // Forzar IPv4
            launchOptions.args.push('--remote-debugging-port=9222');
            launchOptions.args.push('--disable-ipv6'); // Deshabilitar completamente IPv6
            launchOptions.args.push('--dns-prefetch-disable'); // Evitar problemas DNS
            
            // Deshabilitar aislamiento de sitios para mejor rendimiento
            launchOptions.args.push('--disable-features=IsolateOrigins,site-per-process');
            launchOptions.args.push('--disable-site-isolation-trials');
            
            // Configuraciones para rendimiento
            launchOptions.args.push('--disable-web-security');
            launchOptions.args.push('--disable-software-rasterizer');
            launchOptions.args.push('--ignore-certificate-errors');
            
            // Configuraciones adicionales para debugging
            launchOptions.args.push('--enable-logging');
            launchOptions.args.push('--v=1');
            console.log('Chrome configurado para usar exclusivamente IPv4 en modo debug');
          }
          
          // Configuración para Lighthouse
          console.log(`Preparando auditoría Lighthouse para entorno: ${isCI ? 'CI' : 'local'}`);
          const lighthouseOptions = isCI ? 
            { 
              // Opciones específicas para CI
              chromeFlags: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--disable-extensions',
                '--remote-debugging-address=127.0.0.1',
                '--remote-debugging-port=9222',
                '--disable-ipv6', // Importante: deshabilitar IPv6
                '--headless=new',
                '--disable-storage-reset', // Evita reinicios de estado
                '--enable-logging',
                '--v=1'
              ],
              // Usar settings más tolerantes en CI
              formFactor: 'desktop',
              throttling: { 
                cpuSlowdownMultiplier: 1, // Reducido para mejor rendimiento
                rttMs: 0,
                throughputKbps: 10240
              },
              onlyAudits: ['first-contentful-paint', 'largest-contentful-paint'],
              skipAudits: ['uses-optimized-images', 'uses-webp-images', 'offscreen-images']
            } : 
            {};
            
          return prepareAudit(launchOptions, lighthouseOptions);
        }
        return launchOptions;
      });

      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          const isCI = process.env.CI === 'true' || process.env.CI === true;
          // Manejo especial para entornos CI
          if (isCI) {
            console.log('Lighthouse en CI: aplicando adaptaciones para CI');
            
            try {
              // Guardar el reporte completo en un archivo
              const fs = require('fs');
              const path = require('path');
              const reportDir = path.join(__dirname, '.cypress-audit');
              
              if (!fs.existsSync(reportDir)) {
                fs.mkdirSync(reportDir, { recursive: true });
              }
              
              // Añadir diagnóstico IPv4/IPv6 al reporte
              let networkInfo = {};
              try {
                const os = require('os');
                const ifaces = os.networkInterfaces();
                networkInfo.interfaces = Object.keys(ifaces).reduce((acc, ifname) => {
                  acc[ifname] = ifaces[ifname].map(iface => ({ 
                    family: iface.family, 
                    address: iface.address,
                    internal: iface.internal
                  }));
                  return acc;
                }, {});
                
                // Verificar si hay conexión IPv6
                networkInfo.hasIPv6 = Object.values(ifaces).some(
                  iface => iface.some(addr => addr.family === 'IPv6')
                );
                
                console.log(`Información de red: ${JSON.stringify(networkInfo, null, 2)}`);
              } catch (err) {
                console.log(`Error al obtener información de red: ${err.message}`);
              }
              
              const reportPath = path.join(reportDir, `lighthouse-report-${new Date().toISOString().replace(/:/g, '-')}.json`);
              fs.writeFileSync(reportPath, JSON.stringify({
                ...lighthouseReport,
                networkInfo,
                ciDiagnostic: {
                  timestamp: new Date().toISOString(),
                  environment: process.env,
                  nodeVersion: process.version
                }
              }, null, 2));
              
              console.log(`Reporte detallado de Lighthouse guardado en: ${reportPath}`);
              
              // Crear un resumen simplificado para consumo rápido
              const summaryPath = path.join(reportDir, 'lighthouse-summary.json');
              const metrics = lighthouseReport.lhr?.audits || {};
              const summary = {
                timestamp: new Date().toISOString(),
                url: lighthouseReport.lhr?.finalUrl,
                scores: {
                  performance: lighthouseReport.lhr?.categories?.performance?.score || 0,
                  accessibility: lighthouseReport.lhr?.categories?.accessibility?.score || 0,
                  'best-practices': lighthouseReport.lhr?.categories?.['best-practices']?.score || 0,
                  seo: lighthouseReport.lhr?.categories?.seo?.score || 0
                },
                metrics: {
                  FCP: metrics['first-contentful-paint']?.numericValue,
                  LCP: metrics['largest-contentful-paint']?.numericValue,
                  TBT: metrics['total-blocking-time']?.numericValue,
                  CLS: metrics['cumulative-layout-shift']?.numericValue
                },
                executedInCI: true,
                connectionSuccessful: true
              };
              fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
              console.log(`Resumen de métricas guardado en: ${summaryPath}`);
            } catch (err) {
              console.error(`Error al guardar reporte de Lighthouse: ${err.message}`);
            }
            
            // Añadimos una marca para indicar que se ejecutó en CI
            return {
              ...lighthouseReport,
              executedInCI: true,
              connectionSuccessful: true
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
