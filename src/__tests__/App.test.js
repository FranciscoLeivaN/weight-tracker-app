import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

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

describe('Componente App', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('Debería renderizarse sin errores', () => {
    // Descripción: Verifica que el componente se renderice correctamente con todos sus elementos principales
    render(<App />);
    
    expect(screen.getByText('Registro de Peso')).toBeInTheDocument();
    expect(screen.getByText('Historial de Pesos')).toBeInTheDocument();
    expect(screen.getByText('Aún no hay registros de peso.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu peso (kg)')).toBeInTheDocument();
  });
  
  test('Debería permitir ingresar un valor de peso válido', () => {
    // Descripción: Verifica que el campo de entrada de peso acepte valores numéricos correctamente
    render(<App />);
    
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    fireEvent.change(input, { target: { value: '75.5' } });
    
    expect(input.value).toBe('75.5');
  });
  
  test('Debería mostrar mensaje de error para entradas de peso inválidas', async () => {
    // Descripción: Verifica que se muestren mensajes de error apropiados cuando se ingresan valores de peso inválidos
    render(<App />);
    
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    // Entrada vacía
    fireEvent.click(addButton);
    
    expect(await screen.findByText('Por favor, ingresa un peso válido.')).toBeInTheDocument();
    
    // Entrada inválida (no numérica)
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(addButton);
    
    expect(await screen.findByText('Por favor, ingresa un peso válido.')).toBeInTheDocument();
  });
  
  test('Debería añadir un nuevo registro de peso con entrada válida', async () => {
    // Descripción: Verifica que se añada correctamente un nuevo registro cuando se proporciona un peso válido
    const { rerender } = render(<App />);
    
    // Configurar entrada y botón
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    // Ingresar un peso válido
    fireEvent.change(input, { target: { value: '75.5' } });
    fireEvent.click(addButton);
    
    // Forzar re-renderizado para capturar los cambios de estado
    rerender(<App />);
    
    // El campo de entrada debería limpiarse
    expect(input.value).toBe('');
    
    // El registro debería ser añadido
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(screen.queryByText('Aún no hay registros de peso.')).not.toBeInTheDocument();
    expect(screen.getByText(/Peso: 75.5 kg/)).toBeInTheDocument();
  });
  
  test('loads existing weights from localStorage', () => {
    // Descripción: Verifica que la aplicación cargue correctamente los registros de peso desde el almacenamiento local
    // Configurar datos simulados
    const mockWeights = [
      { weight: 70, date: '2025-06-20T10:00:00Z' },
      { weight: 69.5, date: '2025-06-23T10:00:00Z' }
    ];
    
    // Configurar mock de localStorage
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
    
    render(<App />);
    
    // Verificar que los pesos se muestren
    expect(screen.getByText(/Peso: 70 kg/)).toBeInTheDocument();
    expect(screen.getByText(/Peso: 69.5 kg/)).toBeInTheDocument();
  });
  
  test('clears all weight records', () => {
    // Descripción: Verifica que la funcionalidad de borrar todos los registros funcione correctamente
    // Configurar datos simulados
    const mockWeights = [
      { weight: 70, date: '2025-06-20T10:00:00Z' }
    ];
    
    // Configurar mock de localStorage
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
    
    render(<App />);
    
    // Verificar que el peso se muestre
    expect(screen.getByText(/Peso: 70 kg/)).toBeInTheDocument();
    
    // Borrar todos los registros
    const clearButton = screen.getByText('Borrar Todos los Registros');
    fireEvent.click(clearButton);
    
    // Verificar que no se muestren registros y localStorage se haya limpiado
    expect(screen.getByText('Aún no hay registros de peso.')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('userWeights');
  });
  
  test('enforces 48-hour rule between weight entries', () => {
    // Descripción: Verifica que la aplicación imponga la regla de 48 horas entre registros de peso
    // Configurar hora actual como fecha fija
    jest.spyOn(Date, 'now').mockImplementation(() => 
      new Date('2025-06-27T10:00:00Z').getTime()
    );
    
    // Configurar datos simulados con un registro reciente (menos de 48 horas)
    const mockWeights = [
      { weight: 70, date: '2025-06-26T10:00:00Z' } // 24 horas atrás
    ];
    
    // Guardar el mock en localStorage
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
    
    render(<App />);
    
    // Añadir un nuevo peso
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    fireEvent.change(input, { target: { value: '72' } });
    fireEvent.click(addButton);
    
    // Verificar mensaje de error cuando se intenta añadir un peso antes de las 48 horas
    expect(screen.getByText(/Debes esperar \d+ horas/)).toBeInTheDocument();
    
    // Limpiar el mock
    jest.restoreAllMocks();
  });
});
