const fs = require('fs');
const path = require('path');

/**
 * Script para analizar los resultados de las pruebas de rendimiento de Artillery
 * 
 * Este script toma un archivo de resultados JSON generado por Artillery
 * y proporciona un resumen amigable de las métricas clave.
 * 
 * Uso: node analyze-performance.js path/to/artillery-report.json
 */

const THRESHOLDS = {
  meanResponseTime: 200,  // ms
  p95ResponseTime: 500,   // ms
  p99ResponseTime: 1000,  // ms
  errorRate: 1            // %
};

function analyzePerformance(reportPath) {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(reportPath)) {
      console.error(`❌ Error: El archivo ${reportPath} no existe.`);
      process.exit(1);
    }
    
    // Leer el archivo de reporte
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Extraer métricas clave
    const metrics = {
      totalRequests: reportData.aggregate?.counters?.['http.requests'] || 0,
      successfulRequests: reportData.aggregate?.counters?.['http.responses.200'] || 0,
      failedRequests: reportData.aggregate?.counters?.['http.errors'] || 0,
      meanResponseTime: reportData.aggregate?.latency?.mean || 0,
      minResponseTime: reportData.aggregate?.latency?.min || 0,
      maxResponseTime: reportData.aggregate?.latency?.max || 0,
      p95ResponseTime: reportData.aggregate?.latency?.p95 || 0,
      p99ResponseTime: reportData.aggregate?.latency?.p99 || 0,
      rps: reportData.aggregate?.rps || 0
    };
    
    // Calcular métricas derivadas
    metrics.errorRate = metrics.totalRequests > 0 
      ? (metrics.failedRequests / metrics.totalRequests) * 100 
      : 0;
    
    // Imprimir resumen
    console.log('\n📊 RESUMEN DE PRUEBAS DE RENDIMIENTO');
    console.log('====================================');
    console.log(`🕒 Fecha de ejecución: ${new Date().toLocaleString()}`);
    console.log(`📝 Archivo analizado: ${path.basename(reportPath)}`);
    console.log('\n📈 MÉTRICAS PRINCIPALES:');
    console.log(`✓ Total de solicitudes: ${metrics.totalRequests}`);
    console.log(`✓ Solicitudes exitosas: ${metrics.successfulRequests}`);
    console.log(`✓ Solicitudes fallidas: ${metrics.failedRequests}`);
    console.log(`✓ Tasa de error: ${metrics.errorRate.toFixed(2)}%`);
    console.log(`✓ Solicitudes por segundo: ${metrics.rps.toFixed(2)}`);
    console.log('\n⏱️ TIEMPOS DE RESPUESTA:');
    console.log(`✓ Tiempo mínimo: ${metrics.minResponseTime.toFixed(2)} ms`);
    console.log(`✓ Tiempo medio: ${metrics.meanResponseTime.toFixed(2)} ms`);
    console.log(`✓ Tiempo P95: ${metrics.p95ResponseTime.toFixed(2)} ms`);
    console.log(`✓ Tiempo P99: ${metrics.p99ResponseTime.toFixed(2)} ms`);
    console.log(`✓ Tiempo máximo: ${metrics.maxResponseTime.toFixed(2)} ms`);
    
    // Evaluar umbrales
    console.log('\n🚦 EVALUACIÓN DE UMBRALES:');
    
    const evaluations = [
      { 
        name: 'Tiempo medio de respuesta',
        value: metrics.meanResponseTime,
        threshold: THRESHOLDS.meanResponseTime,
        unit: 'ms',
        pass: metrics.meanResponseTime <= THRESHOLDS.meanResponseTime
      },
      { 
        name: 'Tiempo P95 de respuesta',
        value: metrics.p95ResponseTime,
        threshold: THRESHOLDS.p95ResponseTime,
        unit: 'ms',
        pass: metrics.p95ResponseTime <= THRESHOLDS.p95ResponseTime
      },
      { 
        name: 'Tiempo P99 de respuesta',
        value: metrics.p99ResponseTime,
        threshold: THRESHOLDS.p99ResponseTime,
        unit: 'ms',
        pass: metrics.p99ResponseTime <= THRESHOLDS.p99ResponseTime
      },
      { 
        name: 'Tasa de error',
        value: metrics.errorRate,
        threshold: THRESHOLDS.errorRate,
        unit: '%',
        pass: metrics.errorRate <= THRESHOLDS.errorRate
      }
    ];
    
    for (const evaluation of evaluations) {
      const status = evaluation.pass ? '✅ PASADO' : '❌ FALLIDO';
      console.log(`${status} - ${evaluation.name}: ${evaluation.value.toFixed(2)} ${evaluation.unit} (umbral: ${evaluation.threshold} ${evaluation.unit})`);
    }
    
    // Resultado final
    const allPassed = evaluations.every(e => e.pass);
    console.log('\n🏁 RESULTADO FINAL:');
    if (allPassed) {
      console.log('✅ La aplicación cumple con todos los umbrales de rendimiento.');
    } else {
      console.log('❌ La aplicación NO cumple con todos los umbrales de rendimiento.');
      console.log('   Revise las métricas que han fallado y optimice el rendimiento de la aplicación.');
    }
    
  } catch (error) {
    console.error(`❌ Error al analizar el reporte: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar el análisis si se proporciona un archivo como argumento
if (process.argv.length < 3) {
  console.log('Uso: node analyze-performance.js path/to/artillery-report.json');
} else {
  analyzePerformance(process.argv[2]);
}
