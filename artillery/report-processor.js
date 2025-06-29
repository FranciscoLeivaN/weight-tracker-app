'use strict';

// Este script procesa los resultados de Artillery y genera métricas adicionales
module.exports = {
  // Esta función se ejecuta antes de que comience la prueba
  beforeScenario: function (userContext, events, done) {
    // Inicializar variables para tracking de tiempos
    userContext.vars.startTime = Date.now();
    return done();
  },

  // Esta función se ejecuta después de cada escenario
  afterScenario: function (userContext, events, done) {
    // Calcular tiempo total para este escenario
    const duration = Date.now() - userContext.vars.startTime;
    events.emit('histogram', 'scenario_duration', duration);
    
    return done();
  },

  // Esta función se ejecuta después de cada respuesta
  afterResponse: function (requestParams, response, context, events, done) {
    // Rastrear el tamaño de respuesta
    const size = response.body ? response.body.length : 0;
    events.emit('histogram', 'response_size', size);

    // Rastrear códigos de estado
    events.emit('counter', `status_${response.statusCode}`, 1);

    // Si hay un tiempo de respuesta, registrarlo
    if (response.timings && response.timings.phases.total) {
      events.emit('histogram', 'response_time', response.timings.phases.total);
    }

    return done();
  },

  // Función para generar un reporte personalizado
  generateReport: function (statsObject) {
    const report = {
      summary: {
        totalRequests: statsObject.counters['http.requests.total'],
        successfulRequests: statsObject.counters['http.responses.200'],
        failedRequests: statsObject.counters['http.errors'],
        meanResponseTime: statsObject.summaries['http.response_time']?.mean || 0,
        p95ResponseTime: statsObject.summaries['http.response_time']?.p95 || 0,
        p99ResponseTime: statsObject.summaries['http.response_time']?.p99 || 0
      },
      scenarios: {
        created: statsObject.counters['vusers.created'],
        completed: statsObject.counters['vusers.completed'],
        failed: statsObject.counters['vusers.failed']
      },
      customMetrics: {
        addWeight: statsObject.counters['add_weight'] || 0,
        deleteWeight: statsObject.counters['delete_weight'] || 0
      }
    };

    return report;
  }
};
