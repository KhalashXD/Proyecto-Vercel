import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Authentication from './Authentication';
import './Prueba.css';


const Emergencia = ({ eventId }) => {
  const { id } = useParams();
  const [dataE, setDataE] = useState(null);  // State for data_e
  const [dataA, setDataA] = useState(null);  // State for data_a
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectionChange = (event) => {
    setSelectedType(event.target.value);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    // Fetch data from the Flask API
    fetch(`/emergencia_info/${id}`)
      .then(response => response.json())
      .then(data => {
        // Set the data_e and data_a in state
        setDataE(data.data_e);
        setDataA(data.data_a);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching event data:", error);
        setLoading(false);
      });
  }, [eventId]);

  // If still loading, display a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no data was received, show a message
  if (!dataE && !dataA) {
    return <div>No data available for this event.</div>;
  }
  const renderSecondDropdown = () => {
    switch (selectedType) {
      case 'Modificacion':
        return (
          <div>
            <label htmlFor="a-dropdown">Despacho: </label>
            <select id="a-dropdown" className="form-select">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        );
      case 'Evaluacion':
        return (
          <div>
            <label htmlFor="b-dropdown">Evaluación: </label>
            <select id="b-dropdown" className="form-select">
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        );
      case 'Clave':
        return (
          <div>
            <label htmlFor="c-dropdown">Clave: </label>
            <select id="c-dropdown" className="form-select">
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
          </div>
        );
      case 'Instrucciones':
        return (
          <div>
            <label htmlFor="d-dropdown">Instrucciones: </label>
            <select id="d-dropdown" className="form-select">
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Authentication/>
      <div className="main-content">
        <h1>Clave {dataE[0]} {dataE[1]} / {dataE[2]}</h1>
          {/* Display data_e */}
        <p><strong>{dataE[3]}</strong></p>
        <div className="mb-3">
          <button 
            onClick={() => handleTabChange('info')} 
            className={`btn btn-${activeTab === 'info' ? 'primary' : 'secondary'} me-2`}
          >
            Información
          </button>
          <button 
            onClick={() => handleTabChange('actions')} 
            className={`btn btn-${activeTab === 'actions' ? 'primary' : 'secondary'}`}
          >
            Acciones
          </button>
        </div>

        {activeTab === 'info' && (
        <div>
          <h2>Cronología</h2>
          {dataA && dataA.length > 0 ? (
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Carros</th>
                  <th>Orden</th>
                </tr>
              </thead>
              <tbody>
                {dataA.map((accion, index) => (
                  <tr key={index}>
                    <td>{accion[0]}</td> {/* Acción */}
                    <td>{accion[1]}</td> {/* Fecha */}
                    <td>{accion[3]}</td> {/* Descripción */}
                    <td>{accion[4]}</td> {/* Campo 1 */}
                    <td>{accion[5]}</td> {/* Campo 2 */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay datos de acciones disponibles.</p>
          )}
        </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <h2>Acciones</h2>
            <label>Seleccione Tipo de Acción:</label>
            <select value={selectedType} onChange={handleSelectionChange} className="form-select mb-3">
              <option value="">Selecciona una opción</option>
              <option value="Modificacion">Modificación</option>
              <option value="Evaluacion">Evaluación</option>
              <option value="Clave">Clave</option>
              <option value="Instrucciones">Instrucciones</option>
            </select>
            {renderSecondDropdown()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Emergencia;
