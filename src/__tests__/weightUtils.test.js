import { 
  canAddWeight,
  createWeightEntry,
  formatWeightEntry,
  loadWeights,
  saveWeights
} from '../utils/weightUtils';

// Simulación (mock) del objeto localStorage para pruebas
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Funciones de Utilidad de Peso', () => {
  // Reiniciar simulaciones entre pruebas
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  describe('canAddWeight', () => {
    test('Debería permitir añadir peso cuando no existen registros previos', () => {
      // Descripción: Verifica que se permita añadir un peso si no hay registros previos
      const result = canAddWeight([]);
      expect(result.canAdd).toBeTruthy();
      expect(result.hoursRemaining).toBe(0);
    });
    
    test('Debería permitir añadir peso cuando han pasado más de 48 horas', () => {
      // Descripción: Verifica que se permita añadir un peso cuando han pasado más de 48 horas desde el último registro
      const now = new Date('2025-06-27T10:00:00Z');
      const weights = [
        { weight: 70, date: '2025-06-24T10:00:00Z' } // 72 horas atrás
      ];
      
      const result = canAddWeight(weights, now);
      expect(result.canAdd).toBeTruthy();
      expect(result.hoursRemaining).toBe(0);
    });
    
    test('No debería permitir añadir peso cuando han pasado menos de 48 horas', () => {
      // Descripción: Verifica que no se permita añadir un peso cuando han pasado menos de 48 horas desde el último registro
      const now = new Date('2025-06-27T10:00:00Z');
      const weights = [
        { weight: 70, date: '2025-06-26T10:00:00Z' } // 24 horas atrás
      ];
      
      const result = canAddWeight(weights, now);
      expect(result.canAdd).toBeFalsy();
      expect(result.hoursRemaining).toBe(24); // 24 horas restantes
    });
  });
  
  describe('createWeightEntry', () => {
    test('Debería crear un objeto de registro de peso válido', () => {
      // Descripción: Verifica que la función cree un objeto con las propiedades correctas
      const entry = createWeightEntry(75.5);
      expect(entry).toHaveProperty('weight');
      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('userName');
      expect(entry.weight).toBe(75.5);
      expect(entry.userName).toBe('');
      expect(new Date(entry.date)).toBeInstanceOf(Date);
    });
    
    test('Debería crear un registro con nombre de usuario si se proporciona', () => {
      // Descripción: Verifica que el registro incluya el nombre de usuario cuando se proporciona
      const entry = createWeightEntry(75.5, 'Juan');
      expect(entry.weight).toBe(75.5);
      expect(entry.userName).toBe('Juan');
    });
    
    test('Debería convertir valores numéricos de tipo string a números', () => {
      // Descripción: Verifica que la función convierta correctamente strings numéricos a valores de tipo number
      const entry = createWeightEntry('80.2');
      expect(entry.weight).toBe(80.2);
    });
    
    test('Debería lanzar un error para valores de peso inválidos', () => {
      // Descripción: Verifica que la función lance errores apropiados para entradas inválidas
      expect(() => createWeightEntry()).toThrow('Valor de peso inválido');
      expect(() => createWeightEntry('')).toThrow('Valor de peso inválido');
      expect(() => createWeightEntry('not-a-number')).toThrow('Valor de peso inválido');
    });
  });
  
  describe('formatWeightEntry', () => {
    test('Debería formatear un registro de peso correctamente sin nombre de usuario', () => {
      // Descripción: Verifica que la función formatee correctamente un registro sin nombre de usuario
      const entry = {
        weight: 70.5,
        date: '2025-06-27T10:00:00Z'
      };
      
      const formattedEntry = formatWeightEntry(entry);
      expect(formattedEntry).toContain('Peso: 70.5 kg');
      expect(formattedEntry).toContain('Fecha:');
      expect(formattedEntry).not.toContain('Usuario:');
    });
    
    test('Debería formatear un registro de peso correctamente con nombre de usuario', () => {
      // Descripción: Verifica que la función formatee correctamente un registro que incluye nombre de usuario
      const entry = {
        weight: 70.5,
        userName: 'Juan',
        date: '2025-06-27T10:00:00Z'
      };
      
      const formattedEntry = formatWeightEntry(entry);
      expect(formattedEntry).toContain('Usuario: Juan');
      expect(formattedEntry).toContain('Peso: 70.5 kg');
      expect(formattedEntry).toContain('Fecha:');
    });
    
    test('Debería manejar entradas inválidas', () => {
      // Descripción: Verifica que la función maneje adecuadamente registros inválidos o incompletos
      expect(formatWeightEntry()).toBe('Registro inválido');
      expect(formatWeightEntry({})).toBe('Registro inválido');
      expect(formatWeightEntry({ weight: 70 })).toBe('Registro inválido');
    });
  });
  
  describe('loadWeights', () => {
    test('Debería cargar los pesos desde localStorage', () => {
      // Descripción: Verifica que la función cargue correctamente los datos de pesos desde localStorage
      const mockWeights = [
        { weight: 70, date: '2025-06-20T10:00:00Z' },
        { weight: 69.5, date: '2025-06-23T10:00:00Z' }
      ];
      
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
      
      const result = loadWeights();
      expect(localStorage.getItem).toHaveBeenCalledWith('userWeights');
      expect(result).toEqual(mockWeights);
    });
    
    test('Debería devolver un array vacío cuando no hay pesos en localStorage', () => {
      // Descripción: Verifica que la función devuelva un array vacío cuando no hay datos guardados
      localStorage.getItem.mockReturnValueOnce(null);
      
      const result = loadWeights();
      expect(result).toEqual([]);
    });
    
    test('Debería devolver un array vacío y manejar errores cuando localStorage lanza una excepción', () => {
      // Descripción: Verifica que la función maneje adecuadamente los errores de localStorage
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      const result = loadWeights();
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual([]);
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('saveWeights', () => {
    test('Debería guardar los pesos en localStorage', () => {
      // Descripción: Verifica que la función guarde correctamente los datos de pesos en localStorage
      const weights = [
        { weight: 70, date: '2025-06-20T10:00:00Z' },
        { weight: 69.5, date: '2025-06-23T10:00:00Z' }
      ];
      
      const result = saveWeights(weights);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('userWeights', JSON.stringify(weights));
      expect(result).toBeTruthy();
    });
    
    test('Debería manejar errores cuando localStorage lanza una excepción', () => {
      // Descripción: Verifica que la función maneje adecuadamente los errores al guardar en localStorage
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });
      
      const result = saveWeights([{ weight: 70, date: '2025-06-20T10:00:00Z' }]);
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeFalsy();
      
      consoleSpy.mockRestore();
    });
  });
});
