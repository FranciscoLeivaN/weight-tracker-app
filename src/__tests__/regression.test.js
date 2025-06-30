import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

/**
 * Pruebas de Regresión para la Aplicación Weight Tracker
 * 
 * Este archivo contiene pruebas específicas de regresión que verifican que los cambios 
 * recientes en el código no afecten negativamente a la funcionalidad existente.
 * 
 * Las pruebas de regresión se centran en verificar:
 * 1. La integración entre múltiples componentes
 * 2. Flujos de usuario completos
 * 3. Comportamiento del sistema tras cambios de estado
 * 4. Persistencia y recuperación de datos
 */

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

describe('Pruebas de Regresión - Weight Tracker App', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    
    // Reestablecemos la fecha simulada antes de cada prueba
    jest.useRealTimers();
  });

  /**
   * Prueba de regresión 1: Flujo de usuario completo
   * 
   * Esta prueba simula un flujo de usuario completo con varias interacciones
   * para verificar que todos los aspectos de la aplicación funcionan correctamente en conjunto.
   */
  test('Debería soportar un flujo de usuario completo (registros, restricción temporal, borrado)', () => {
    // Simulamos una fecha fija para tener pruebas consistentes
    jest.useFakeTimers();
    const baseTime = new Date('2025-06-29T10:00:00Z').getTime();
    jest.setSystemTime(new Date(baseTime));
    
    // Renderizamos la aplicación
    render(<App />);
    
    // 1. Registrar un nuevo peso con nombre
    const nameInput = screen.getByPlaceholderText('Nombre de usuario');
    const weightInput = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    fireEvent.change(nameInput, { target: { value: 'Usuario Test' } });
    fireEvent.change(weightInput, { target: { value: '75.5' } });
    fireEvent.click(addButton);
    
    // Verificar que el peso se haya añadido
    expect(screen.getByText(/Peso: 75.5 kg/)).toBeInTheDocument();
    expect(screen.getByText(/Usuario: Usuario Test/)).toBeInTheDocument();
    
    // 2. Verificar restricción de 48 horas
    fireEvent.change(nameInput, { target: { value: 'Usuario Test 2' } });
    fireEvent.change(weightInput, { target: { value: '76' } });
    fireEvent.click(addButton);
    
    // Debería mostrar un mensaje de error
    expect(screen.getByText(/Debes esperar/)).toBeInTheDocument();
    
    // Sólo debería existir un registro
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    
    // 3. Avanzar el tiempo 49 horas y agregar otro peso
    jest.setSystemTime(new Date(baseTime + 49 * 60 * 60 * 1000));
    
    fireEvent.change(nameInput, { target: { value: 'Usuario Test 2' } });
    fireEvent.change(weightInput, { target: { value: '76' } });
    fireEvent.click(addButton);
    
    // Verificar que ahora hay dos registros
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    
    // 4. Borrar todos los registros
    const clearButton = screen.getByText('Borrar Todos los Registros');
    fireEvent.click(clearButton);
    
    // Verificar que se hayan borrado los registros
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.getByText('Aún no hay registros de peso.')).toBeInTheDocument();
    
    // Restaurar el tiempo real
    jest.useRealTimers();
  });

  /**
   * Prueba de regresión 2: Manejo del historial de pesos
   * 
   * Esta prueba verifica que el historial de pesos se maneje correctamente
   * al añadir múltiples registros a lo largo del tiempo.
   */
  test('Debería manejar correctamente múltiples registros de peso', () => {
    // Simulamos una fecha fija para tener pruebas consistentes
    jest.useFakeTimers();
    const baseDate = new Date('2025-06-29T10:00:00Z');
    jest.setSystemTime(baseDate);

    // Renderizamos la aplicación
    render(<App />);

    // Verificamos que inicialmente no hay registros
    expect(screen.getByText('Aún no hay registros de peso.')).toBeInTheDocument();

    // Añadimos un primer registro
    const nameInput1 = screen.getByPlaceholderText('Nombre de usuario');
    const weightInput1 = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton1 = screen.getByText('Registrar Peso');
    
    fireEvent.change(nameInput1, { target: { value: 'Usuario Test 1' } });
    fireEvent.change(weightInput1, { target: { value: '75.5' } });
    fireEvent.click(addButton1);
    
    // Verificamos que se ha añadido y ya no aparece el mensaje de no registros
    expect(screen.queryByText('Aún no hay registros de peso.')).not.toBeInTheDocument();
    
    // Debería haber una lista con un elemento
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(listItems[0].textContent).toContain('Usuario: Usuario Test 1');
    expect(listItems[0].textContent).toContain('Peso: 75.5 kg');
    
    // Avanzamos el tiempo 49 horas para permitir un nuevo registro
    jest.setSystemTime(new Date(baseDate.getTime() + 49 * 60 * 60 * 1000));
    
    // Añadimos un segundo registro
    fireEvent.change(nameInput1, { target: { value: 'Usuario Test 2' } });
    fireEvent.change(weightInput1, { target: { value: '74.5' } });
    fireEvent.click(addButton1);
    
    // Verificamos que ahora hay dos registros
    const updatedListItems = screen.getAllByRole('listitem');
    expect(updatedListItems).toHaveLength(2);
    expect(updatedListItems[0].textContent).toContain('Usuario: Usuario Test 1');
    expect(updatedListItems[1].textContent).toContain('Usuario: Usuario Test 2');
    
    // Restaurar el tiempo real
    jest.useRealTimers();
  });

  /**
   * Prueba de regresión 3: Validación de entradas y manejo de errores
   * 
   * Esta prueba verifica que el sistema valide correctamente diferentes tipos de entradas
   * y maneje los errores de manera apropiada, asegurando la robustez de la aplicación.
   */
  test('Debería validar entradas y manejar errores correctamente', () => {
    render(<App />);
    
    const nameInput = screen.getByPlaceholderText('Nombre de usuario');
    const weightInput = screen.getByPlaceholderText('Ingresa tu peso (kg)');
    const addButton = screen.getByText('Registrar Peso');
    
    // 1. Entrada vacía
    fireEvent.click(addButton);
    expect(screen.getByText('Por favor, ingresa un peso válido.')).toBeInTheDocument();
    
    // 2. Entrada no numérica
    fireEvent.change(weightInput, { target: { value: 'abc' } });
    fireEvent.click(addButton);
    expect(screen.getByText('Por favor, ingresa un peso válido.')).toBeInTheDocument();
    
    // Limpiar el error antes de continuar
    fireEvent.change(weightInput, { target: { value: '' } });
    
    // 3. Entrada correcta - debería funcionar
    fireEvent.change(nameInput, { target: { value: 'Usuario Test' } });
    fireEvent.change(weightInput, { target: { value: '70' } });
    fireEvent.click(addButton);
    
    // Verificar que no hay mensaje de error
    expect(screen.queryByText('Por favor, ingresa un peso válido.')).not.toBeInTheDocument();
    // Y que se ha añadido el registro
    expect(screen.getByText(/Peso: 70 kg/)).toBeInTheDocument();
  });
});
