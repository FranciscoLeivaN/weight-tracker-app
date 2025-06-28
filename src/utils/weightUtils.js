/**
 * Funciones de utilidad para operaciones de seguimiento de peso
 */

/**
 * Verifica si se puede añadir un nuevo registro de peso basado en la regla de 48 horas
 * @param {Array} weights - Array de registros de peso existentes
 * @param {Date} currentDate - La fecha actual o fecha contra la que verificar
 * @returns {Object} - { canAdd: boolean, hoursRemaining: number }
 */
export const canAddWeight = (weights, currentDate = new Date()) => {
  if (!weights || weights.length === 0) {
    return { canAdd: true, hoursRemaining: 0 };
  }

  const lastEntryDate = new Date(weights[weights.length - 1].date);
  const timeDiff = currentDate.getTime() - lastEntryDate.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  if (hoursDiff < 48) {
    return {
      canAdd: false,
      hoursRemaining: Math.ceil(48 - hoursDiff)
    };
  }
  
  return { canAdd: true, hoursRemaining: 0 };
};

/**
 * Crea un nuevo registro de peso con la fecha actual y el nombre del usuario
 * @param {number} weight - El valor del peso a registrar
 * @param {string} userName - El nombre del usuario (opcional)
 * @returns {Object} - El objeto del registro de peso
 */
export const createWeightEntry = (weight, userName = '') => {
  if (!weight || isNaN(weight)) {
    throw new Error('Valor de peso inválido');
  }
  
  return {
    weight: parseFloat(weight),
    userName: userName.trim(),
    date: new Date().toISOString()
  };
};

/**
 * Formatea un registro de peso para su visualización
 * @param {Object} entry - El objeto de registro de peso
 * @returns {string} - Representación formateada como cadena de texto
 */
export const formatWeightEntry = (entry) => {
  if (!entry || !entry.weight || !entry.date) {
    return 'Registro inválido';
  }
  
  const userName = entry.userName ? `Usuario: ${entry.userName} - ` : '';
  return `${userName}Peso: ${entry.weight} kg - Fecha: ${new Date(entry.date).toLocaleString()}`;
};

/**
 * Carga los registros de peso desde localStorage
 * @returns {Array} - Array de registros de peso
 */
export const loadWeights = () => {
  try {
    const storedWeights = localStorage.getItem('userWeights');
    return storedWeights ? JSON.parse(storedWeights) : [];
  } catch (error) {
    console.error('Error al cargar pesos desde localStorage:', error);
    return [];
  }
};

/**
 * Guarda los registros de peso en localStorage
 * @param {Array} weights - Array de registros de peso
 * @returns {boolean} - Estado de éxito
 */
export const saveWeights = (weights) => {
  try {
    localStorage.setItem('userWeights', JSON.stringify(weights));
    return true;
  } catch (error) {
    console.error('Error al guardar pesos en localStorage:', error);
    return false;
  }
};
