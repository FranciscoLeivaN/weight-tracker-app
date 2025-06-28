import { 
  canAddWeight,
  createWeightEntry,
  formatWeightEntry,
  loadWeights,
  saveWeights
} from '../utils/weightUtils';

// Mock localStorage
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
  // Reset mocks between tests
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  describe('canAddWeight', () => {
    test('should allow adding weight when no previous entries exist', () => {
      const result = canAddWeight([]);
      expect(result.canAdd).toBeTruthy();
      expect(result.hoursRemaining).toBe(0);
    });
    
    test('should allow adding weight when more than 48 hours have passed', () => {
      const now = new Date('2025-06-27T10:00:00Z');
      const weights = [
        { weight: 70, date: '2025-06-24T10:00:00Z' } // 72 hours ago
      ];
      
      const result = canAddWeight(weights, now);
      expect(result.canAdd).toBeTruthy();
      expect(result.hoursRemaining).toBe(0);
    });
    
    test('should not allow adding weight when less than 48 hours have passed', () => {
      const now = new Date('2025-06-27T10:00:00Z');
      const weights = [
        { weight: 70, date: '2025-06-26T10:00:00Z' } // 24 hours ago
      ];
      
      const result = canAddWeight(weights, now);
      expect(result.canAdd).toBeFalsy();
      expect(result.hoursRemaining).toBe(24); // 24 hours remaining
    });
  });
  
  describe('createWeightEntry', () => {
    test('should create a valid weight entry object', () => {
      const entry = createWeightEntry(75.5);
      expect(entry).toHaveProperty('weight');
      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('userName');
      expect(entry.weight).toBe(75.5);
      expect(entry.userName).toBe('');
      expect(new Date(entry.date)).toBeInstanceOf(Date);
    });
    
    test('should create entry with userName if provided', () => {
      const entry = createWeightEntry(75.5, 'Juan');
      expect(entry.weight).toBe(75.5);
      expect(entry.userName).toBe('Juan');
    });
    
    test('should convert string numbers to numeric values', () => {
      const entry = createWeightEntry('80.2');
      expect(entry.weight).toBe(80.2);
    });
    
    test('should throw an error for invalid weight values', () => {
      expect(() => createWeightEntry()).toThrow('Valor de peso inválido');
      expect(() => createWeightEntry('')).toThrow('Valor de peso inválido');
      expect(() => createWeightEntry('not-a-number')).toThrow('Valor de peso inválido');
    });
  });
  
  describe('formatWeightEntry', () => {
    test('should format a weight entry correctly without userName', () => {
      const entry = {
        weight: 70.5,
        date: '2025-06-27T10:00:00Z'
      };
      
      const formattedEntry = formatWeightEntry(entry);
      expect(formattedEntry).toContain('Peso: 70.5 kg');
      expect(formattedEntry).toContain('Fecha:');
      expect(formattedEntry).not.toContain('Usuario:');
    });
    
    test('should format a weight entry correctly with userName', () => {
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
    
    test('should handle invalid entries', () => {
      expect(formatWeightEntry()).toBe('Registro inválido');
      expect(formatWeightEntry({})).toBe('Registro inválido');
      expect(formatWeightEntry({ weight: 70 })).toBe('Registro inválido');
    });
  });
  
  describe('loadWeights', () => {
    test('should load weights from localStorage', () => {
      const mockWeights = [
        { weight: 70, date: '2025-06-20T10:00:00Z' },
        { weight: 69.5, date: '2025-06-23T10:00:00Z' }
      ];
      
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
      
      const result = loadWeights();
      expect(localStorage.getItem).toHaveBeenCalledWith('userWeights');
      expect(result).toEqual(mockWeights);
    });
    
    test('should return empty array when no weights in localStorage', () => {
      localStorage.getItem.mockReturnValueOnce(null);
      
      const result = loadWeights();
      expect(result).toEqual([]);
    });
    
    test('should return empty array and handle errors when localStorage throws exception', () => {
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
    test('should save weights to localStorage', () => {
      const weights = [
        { weight: 70, date: '2025-06-20T10:00:00Z' },
        { weight: 69.5, date: '2025-06-23T10:00:00Z' }
      ];
      
      const result = saveWeights(weights);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('userWeights', JSON.stringify(weights));
      expect(result).toBeTruthy();
    });
    
    test('should handle errors when localStorage throws exception', () => {
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
