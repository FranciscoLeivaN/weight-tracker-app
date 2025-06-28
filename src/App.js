import React, { useState, useEffect } from 'react';
import './App.css'; // Puedes crear un archivo CSS simple

function App() {
  const [weights, setWeights] = useState([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar pesos desde localStorage al iniciar
  useEffect(() => {
    const storedWeights = JSON.parse(localStorage.getItem('userWeights'));
    if (storedWeights) {
      setWeights(storedWeights);
    }
  }, []);

  // Guardar pesos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('userWeights', JSON.stringify(weights));
  }, [weights]);

  const handleWeightChange = (e) => {
    setCurrentWeight(e.target.value);
  };

  const addWeightEntry = () => {
    if (!currentWeight || isNaN(currentWeight)) {
      setErrorMessage('Por favor, ingresa un peso válido.');
      return;
    }

    const newWeight = parseFloat(currentWeight);
    const newEntry = { weight: newWeight, date: new Date().toISOString() };

    // Validación de 48 horas
    if (weights.length > 0) {
      const lastEntryDate = new Date(weights[weights.length - 1].date);
      const now = new Date();
      const timeDiff = now.getTime() - lastEntryDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 48) {
        setErrorMessage(`Debes esperar ${Math.ceil(48 - hoursDiff)} horas más para registrar un nuevo peso.`);
        return;
      }
    }

    setWeights([...weights, newEntry]);
    setCurrentWeight('');
    setErrorMessage('');
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
              Peso: {entry.weight} kg - Fecha: {new Date(entry.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
