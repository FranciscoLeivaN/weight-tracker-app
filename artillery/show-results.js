/**
 * Script para mostrar un resumen de los resultados de las pruebas de rendimiento
 * 
 * Uso: node artillery/show-results.js <ruta-al-archivo-json>
 * Ejemplo: node artillery/show-results.js quick-report.json
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

function main() {
  // Obtener la ruta del archivo de resultados
  const args = process.argv.slice(2);
  const filePath = args[0];
  
  if (!filePath) {
    console.error(`${colors.red}Error: Debe proporcionar la ruta al archivo JSON de resultados.${colors.reset}`);
    console.log(`Uso: node ${path.basename(__filename)} <ruta-al-archivo-json>`);
    console.log(`Ejemplo: node ${path.basename(__filename)} quick-report.json`);
    process.exit(1);
  }
  
  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}Error: El archivo ${filePath} no existe.${colors.reset}`);
    process.exit(1);
  }
  
  // Leer y analizar el archivo JSON
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    showResults(data, filePath);
  } catch (error) {
    console.error(`${colors.red}Error al leer o analizar el archivo JSON: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

function showResults(data, filePath) {
  console.log('\n');
  console.log(`${colors.bgCyan}${colors.black} RESUMEN DE PRUEBAS DE RENDIMIENTO ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════${colors.reset}`);
  console.log(`${colors.dim}Archivo: ${path.basename(filePath)}${colors.reset}`);
  
  // Información de tiempo
  if (data.timestamp) {
    const date = new Date(data.timestamp);
    console.log(`${colors.bright}Fecha:${colors.reset} ${date.toLocaleString()}`);
  }
  
  if (data.duration) {
    console.log(`${colors.bright}Duración:${colors.reset} ${data.duration.toFixed(2)} segundos`);
  }
  
  // Información de fases
  if (data.phases && data.phases.length) {
    console.log(`\n${colors.yellow}${colors.bright}▶ Fases de la prueba:${colors.reset}`);
    data.phases.forEach((phase, index) => {
      console.log(`  ${colors.yellow}${index + 1}.${colors.reset} ${phase.name || 'Sin nombre'} - ${phase.duration}s (${phase.arrivalRate} - ${phase.rampTo || phase.arrivalRate} usuarios/s)`);
    });
  }
  
  // Métricas clave
  console.log(`\n${colors.green}${colors.bright}▶ Métricas clave:${colors.reset}`);
  
  // Verificar que tenemos los datos necesarios
  const counters = data.aggregate?.counters || {};
  const totalRequests = counters['http.requests'] || 0;
  const errors = counters['http.errors'] || 0;
  const errorRate = totalRequests ? ((errors / totalRequests) * 100).toFixed(2) : '0';
  // Calcular RPS basado en la duración total y el número de solicitudes
  const duration = data.duration || 
                   (data.lastCounterAt && data.firstCounterAt ? (data.lastCounterAt - data.firstCounterAt) / 1000 : null) ||
                   (data.aggregate?.firstCounterAt && data.aggregate?.lastCounterAt ? (data.aggregate.lastCounterAt - data.aggregate.firstCounterAt) / 1000 : 1);
  
  // Obtener RPS desde rates o calcularlo
  let rps = data.aggregate?.rates?.['http.request_rate'] || 0;
  
  // Si rates no tiene el valor o es 0, calculamos manualmente
  if ((!rps || rps === 0) && totalRequests > 0 && duration > 0) {
    rps = totalRequests / duration;
  }
  
  console.log(`  ${colors.bright}Solicitudes totales:${colors.reset} ${totalRequests}`);
  console.log(`  ${colors.bright}Errores:${colors.reset} ${errors}`);
  
  let errorColor = colors.green;
  if (errorRate > 5) {
    errorColor = colors.red;
  } else if (errorRate > 1) {
    errorColor = colors.yellow;
  }
  
  console.log(`  ${colors.bright}Tasa de error:${colors.reset} ${errorColor}${errorRate}%${colors.reset}`);
  console.log(`  ${colors.bright}Solicitudes por segundo:${colors.reset} ${typeof rps === 'object' ? rps.mean.toFixed(2) : typeof rps === 'number' ? rps.toFixed(2) : '0'}`);
  
  // Tiempos de respuesta
  const latency = data.aggregate?.summaries?.['http.response_time'] || {};
  
  console.log(`\n${colors.blue}${colors.bright}▶ Tiempos de respuesta:${colors.reset}`);
  console.log(`  ${colors.bright}Mínimo:${colors.reset} ${(latency.min || 0).toFixed(2)} ms`);
  console.log(`  ${colors.bright}Medio:${colors.reset} ${(latency.mean || 0).toFixed(2)} ms`);
  console.log(`  ${colors.bright}p95:${colors.reset} ${(latency.p95 || 0).toFixed(2)} ms`);
  console.log(`  ${colors.bright}p99:${colors.reset} ${(latency.p99 || 0).toFixed(2)} ms`);
  console.log(`  ${colors.bright}Máximo:${colors.reset} ${(latency.max || 0).toFixed(2)} ms`);
  
  // Resultados por endpoint
  console.log(`\n${colors.magenta}${colors.bright}▶ Resultados por endpoint:${colors.reset}`);
  
  // Buscar datos de endpoints por nombre de solicitud
  const endpoints = {};
  
  // Recopilar información de latencia por endpoint
  const summaries = data.aggregate?.summaries || {};
  
  Object.keys(summaries).forEach(key => {
    if (key.startsWith('plugins.metrics-by-endpoint.response_time.')) {
      const name = key.substring('plugins.metrics-by-endpoint.response_time.'.length);
      if (!endpoints[name]) {
        endpoints[name] = {};
      }
      endpoints[name].meanResponseTime = summaries[key].mean;
      endpoints[name].p95ResponseTime = summaries[key].p95;
    }
  });
  
  // Recopilar contadores por endpoint
  Object.keys(counters).forEach(key => {
    if (key.startsWith('plugins.metrics-by-endpoint.') && key.includes('.codes.')) {
      const parts = key.split('.');
      // Formato esperado: plugins.metrics-by-endpoint.<nombre>.codes.<código>
      const name = parts.slice(2, parts.length - 2).join('.');
      const statusCode = parts[parts.length - 1];
      
      if (!endpoints[name]) {
        endpoints[name] = {};
      }
      
      if (!endpoints[name].requests) {
        endpoints[name].requests = 0;
      }
      
      const count = counters[key];
      endpoints[name].requests += count;
    }
  });
  
  if (Object.keys(endpoints).length === 0) {
    console.log(`  ${colors.dim}No hay datos disponibles por endpoint${colors.reset}`);
  } else {
    Object.keys(endpoints).sort().forEach(name => {
      const endpoint = endpoints[name];
      console.log(`  ${colors.bright}${name}:${colors.reset}`);
      console.log(`    Solicitudes: ${endpoint.requests || 0}`);
      
      if (endpoint.meanResponseTime !== undefined) {
        console.log(`    Tiempo medio: ${endpoint.meanResponseTime.toFixed(2)} ms`);
      }
      
      if (endpoint.p95ResponseTime !== undefined) {
        console.log(`    Tiempo P95: ${endpoint.p95ResponseTime.toFixed(2)} ms`);
      }
      
      console.log('');
    });
  }
  
  console.log(`${colors.cyan}════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}✓ Análisis completado${colors.reset}\n`);
}

// Ejecutar el script
main();
