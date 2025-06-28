import React, { useState, useEffect } from 'react';
import './App.css'; // Puedes crear un archivo CSS simple
import { 
  canAddWeight, 
  createWeightEntry, 
  loadWeights, 
  saveWeights 
} from './utils/weightUtils';

function App() {
  const [weights, setWeights] = useState([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar pesos desde localStorage al iniciar
  useEffect(() => {
    setWeights(loadWeights());
    
    // Cargar nombre de usuario desde localStorage para sugerirlo como valor default
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Guardar pesos en localStorage cada vez que cambian
  useEffect(() => {
    if (weights.length > 0) {
      saveWeights(weights);
    }
  }, [weights]);

  const handleWeightChange = (e) => {
    setCurrentWeight(e.target.value);
  };
  
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    // Guardamos inmediatamente como valor por defecto
    if (e.target.value.trim()) {
      localStorage.setItem('userName', e.target.value);
    }
  };

  const addWeightEntry = () => {
    if (!currentWeight || isNaN(currentWeight)) {
      setErrorMessage('Por favor, ingresa un peso válido.');
      return;
    }

    // Validación de 48 horas
    const { canAdd, hoursRemaining } = canAddWeight(weights);
    
    if (!canAdd) {
      setErrorMessage(`Debes esperar ${hoursRemaining} horas más para registrar un nuevo peso.`);
      return;
    }
    
    try {
      const newEntry = createWeightEntry(currentWeight, userName);
      setWeights([...weights, newEntry]);
      setCurrentWeight('');
      setErrorMessage('');
      // Guardamos el nombre para futuros registros
      if (userName.trim()) {
        localStorage.setItem('userName', userName);
      }
    } catch (error) {
      setErrorMessage('Error al crear el registro: ' + error.message);
    }
  };

  const clearAllWeights = () => {
    setWeights([]);
    localStorage.removeItem('userWeights');
  };

  return (
    <div className="App">
      <h1>Registro de Peso</h1>
      
      <div className="input-section">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={userName}
          onChange={handleUserNameChange}
        />
        <input
          type="number"
          placeholder="Ingresa tu peso (kg)"
          value={currentWeight}
          onChange={handleWeightChange}
        />
        <button onClick={addWeightEntry}>Registrar Peso</button>
        <button onClick={clearAllWeights} className="clear-button">Borrar Todos los Registros</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2>Historial de Pesos</h2>
      {weights.length === 0 ? (
        <p>Aún no hay registros de peso.</p>
      ) : (
        <ul>
          {weights.map((entry, index) => (
            <li key={index}>
              {entry.userName && <span className="user-name">Usuario: {entry.userName} - </span>}
              Peso: {entry.weight} kg - Fecha: {new Date(entry.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
