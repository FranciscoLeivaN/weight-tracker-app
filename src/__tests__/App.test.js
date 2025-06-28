import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

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

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('renders without crashing', () => {
    render(<App />);
    
    expect(screen.getByText('Registro de Peso')).toBeInTheDocument();
    expect(screen.getByText('Historial de Pesos')).toBeInTheDocument();
    expect(screen.getByText('Aún no hay registros de peso.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu peso (kg)')).toBeInTheDocument();
  });
  
  test('allows entering a valid weight value', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    fireEvent.change(input, { target: { value: '75.5' } });
    
    expect(input.value).toBe('75.5');
  });
  
  test('displays error message for invalid weight input', async () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    // Empty input
    fireEvent.click(addButton);
    
    expect(await screen.findByText('Por favor, ingresa un peso válido.')).toBeInTheDocument();
    
    // Invalid input (non-numeric)
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(addButton);
    
    expect(await screen.findByText('Por favor, ingresa un peso válido.')).toBeInTheDocument();
  });
  
  test('adds a new weight entry with valid input', async () => {
    const { rerender } = render(<App />);
    
    // Set up the input and button
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    // Enter a valid weight
    fireEvent.change(input, { target: { value: '75.5' } });
    fireEvent.click(addButton);
    
    // Force a rerender to capture the state changes
    rerender(<App />);
    
    // The input should be cleared
    expect(input.value).toBe('');
    
    // The entry should be added
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(screen.queryByText('Aún no hay registros de peso.')).not.toBeInTheDocument();
    expect(screen.getByText(/Peso: 75.5 kg/)).toBeInTheDocument();
  });
  
  test('loads existing weights from localStorage', () => {
    // Setup mock data
    const mockWeights = [
      { weight: 70, date: '2025-06-20T10:00:00Z' },
      { weight: 69.5, date: '2025-06-23T10:00:00Z' }
    ];
    
    // Set mock localStorage
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
    
    render(<App />);
    
    // Verify weights are displayed
    expect(screen.getByText(/Peso: 70 kg/)).toBeInTheDocument();
    expect(screen.getByText(/Peso: 69.5 kg/)).toBeInTheDocument();
  });
  
  test('clears all weight records', () => {
    // Setup mock data
    const mockWeights = [
      { weight: 70, date: '2025-06-20T10:00:00Z' }
    ];
    
    // Set mock localStorage
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
    
    render(<App />);
    
    // Verify weight is displayed
    expect(screen.getByText(/Peso: 70 kg/)).toBeInTheDocument();
    
    // Clear all records
    const clearButton = screen.getByText('Borrar Todos los Registros');
    fireEvent.click(clearButton);
    
    // Verify no records shown and localStorage cleared
    expect(screen.getByText('Aún no hay registros de peso.')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('userWeights');
  });
  
  test('enforces 48-hour rule between weight entries', () => {
    // Set up current time as fixed date
    jest.spyOn(Date, 'now').mockImplementation(() => 
      new Date('2025-06-27T10:00:00Z').getTime()
    );
    
    // Setup mock data with recent entry (less than 48 hours ago)
    const mockWeights = [
      { weight: 70, date: '2025-06-26T10:00:00Z' } // 24 hours ago
    ];
    
    // Set mock localStorage
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockWeights));
    
    render(<App />);
    
    // Try to add a new weight
    const input = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    fireEvent.change(input, { target: { value: '72' } });
    fireEvent.click(addButton);
    
    // Should show error message about waiting
    expect(screen.getByText(/Debes esperar \d+ horas/)).toBeInTheDocument();
    
    // Clean up mock
    jest.restoreAllMocks();
  });
});
