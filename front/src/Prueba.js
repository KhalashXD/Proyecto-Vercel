import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {Link, useParams} from 'react-router-dom';
import Authentication from './Authentication';
import Sidebar from './Sidebar';
import './Prueba.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap (opcional)


const MultiSectionToggle = ({ eventId }) => {
  // Track the currently selected button
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState(null);
  const [dataE, setDataE] = useState(null);  // State for data_e
  const [dataA, setDataA] = useState(null);  // State for data_a
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const switchToTabA = () => setActiveTab('info');

  // Data for buttons and forms
  const sections = [
    { id: 1, label: "Unidades", content: <Form1 switchToTabA={switchToTabA} /> },
    { id: 2, label: "Evaluación", content: <Form2 switchToTabA={switchToTabA} /> },
    { id: 3, label: "Clave", content: <Form3 switchToTabA={switchToTabA} /> },
    { id: 4, label: "Instrucciones", content: <Form4 switchToTabA={switchToTabA} /> },
    { id: 5, label: "Superación", content: <Form5 switchToTabA={switchToTabA} /> },
    { id: 6, label: "Comandante", content: <Form6 switchToTabA={switchToTabA} /> },
    { id: 7, label: "Externos", content: <Form7 switchToTabA={switchToTabA} /> },
    { id: 8, label: "Información", content: <Form8 switchToTabA={switchToTabA} /> },
    { id: 9, label: "Víctimas", content: <Form9 switchToTabA={switchToTabA} /> },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  const fetchData = async () => {
    try {
      const response = await fetch(`/emergencia_info/${id}`);
      const data = await response.json();
      setDataE(data.data_e);
      setDataA(data.data_a);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fire risk data:', error);
      setLoading(false);
    }
  };

  // Realizar el fetch solo cuando la pestaña "info" esté activa
  useEffect(() => {
    if (activeTab === 'info') {
      fetchData(); // Fetch al cambiar a la pestaña "info"
    }
  }, [activeTab, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no data was received, show a message
  if (!dataE && !dataA) {
    return <div>No data available for this event.</div>;
  }

  return (
    <div>
      <Authentication/>
      <div className="wrapper3">
        <div className="sidebar">
          <h3>Estado Carros</h3>
          <Sidebar />
        </div>
        <div className='main-content' style={{ marginBottom: '10px' }}>
          <h1>Clave {dataE[0]} {dataE[1]} / {dataE[2]}</h1>
            {/* Display data_e */}
            <p><strong>{dataE[3]}</strong></p>
          <div>
            <button
                type="button"
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
                onClick={() => handleTabChange("info")}
            >
              Información
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleTabChange('actions')}
            >
              Acciones
            </button>
          </div>

          {activeTab === 'info' && (
              <div>
                <h2>Cronología</h2>
                {dataA && dataA.length > 0 ? (
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Fecha</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Tipo</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Descripción</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Carro</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Orden</th>
                  </tr>
                </thead>
                <tbody>
                  {dataA.map((accion, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{accion[1]}</td> {/* Fecha */}
                      <td style={{ border: '1px solid black', padding: '8px' }}>{accion[0]}</td> {/* Acción */}
                      <td style={{ border: '1px solid black', padding: '8px' }}>{accion[3]}</td> {/* Descripción */}
                      <td style={{ border: '1px solid black', padding: '8px' }}>{accion[4]}</td> {/* Campo 1 */}
                      <td style={{ border: '1px solid black', padding: '8px' }}>{accion[5]}</td> {/* Campo 2 */}
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
              <div style={{ margin: '20px' }}>
                {/* Button row */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`btn btn-outline-primary ${activeSection === section.id ? 'active' : ''}`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>

                {/* Expanding content area */}
                <div
                    style={{
                      maxHeight: activeSection ? '1000px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.5s ease',
                      border: activeSection ? '1px solid #ddd' : 'none',
                    padding: activeSection ? '10px' : '0'
                  }}
                >
                  {activeSection && sections.find((section) => section.id === activeSection)?.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Example forms for each section
const Form1 = ({ eventId, switchToTabA }) => {
  const { id } = useParams();
  const [carrosActivos, setCarrosActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(null); 
  const [carrosDisponibles, setCarrosDisponibles] = useState([]);
  const [selectedDespacho, setSelectedDespacho] = useState([]);
  const [despacho, setDespacho] = useState([]);
  const [acciones, setAcciones] = useState([]);
  const [data2, setData2] = useState([]); // Opciones para los selects de Prueba.js
  const [selectedOptions, setSelectedOptions] = useState({}); // Estado para múltiples selects dinámicos
  const [integerValues, setIntegerValues] = useState({});
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    fetch('/data.json')
        .then((response) => response.json())
        .then((jsonData) => {
          const options = jsonData.map((item) => ({
            value: item.id,
            label: item.nombre,
          }));
          setData2(options); // Guardar opciones transformadas
        })
        .catch((error) => {
          console.error('Error al cargar el JSON:', error);
        });
  }, []);

  useEffect(() => {
    const savedDespacho = localStorage.getItem('despacho');
    const savedAcciones = localStorage.getItem('acciones');

    if (savedDespacho && savedAcciones) {
      setDespacho(JSON.parse(savedDespacho));  // Parse despacho back to array
      setAcciones(JSON.parse(savedAcciones));
    }
  }, []);
  useEffect(() => {
    // Fetch data from the Flask API
    fetch(`/carros/${id}`)
      .then(response => response.json())
      .then(data => {
        // Set the data in state
        setCarrosActivos(data.carros || []); // Use empty array as fallback
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching event data:", error);
        setLoading(false);
      });
  }, [eventId]);

  useEffect(() => {
    // Fetch data from the Flask API
    fetch(`/disponibles/${id}`)
      .then(response => response.json())
      .then(data => {
        // Set the data in state
        setCarrosDisponibles(data.carros || []); // Use empty array as fallback
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching event data:", error);
        setLoading(false);
      });
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      carro: selectedItems,
      estado: selectedEstado ? [selectedEstado] : [],
      id: id,
    };
    console.log("Data to send:", data);
    
    // Send data to backend
    fetch('/desmov', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log("Response from backend:", result);
        switchToTabA(); // Cambia la pestaña a 'info' después de enviar
      })
      .catch(error => console.error("Error:", error));
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    const data = {
      selectedDespacho: selectedDespacho,
      selectedOptions: "Despachado",
      id: id,
    };
    console.log("Data to send:", data);
    
    // Send data to backend
    fetch('/desp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log("Response from backend:", result);
        localStorage.setItem('despacho', JSON.stringify(result.despacho)); // Save despacho as a JSON string
        localStorage.setItem('acciones', JSON.stringify(result.acciones)); // Save despacho as a JSON string
        switchToTabA(); // Cambia la pestaña a 'info' después de enviar
      })
      .catch(error => console.error("Error:", error));
  };

  const handleDespachoChange = (index, selectedOption) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [index]: selectedOption, // Cambia solo el select correspondiente
    }));
  };

  const handleIntegerChange = (index, value) => {
    setIntegerValues((prevState) => ({
      ...prevState,
      [index]: value,
    }));
  };

  const handleDespachoSubmit = async (index) => {
    const selectedOption = selectedOptions[index];
    const integerValue = integerValues[index]; // Get the integer value for this form
    if (!selectedOption || integerValue === undefined) {
      alert('Selecciona una opción y proporciona un número entero para este despacho');
      return;
    }

    const despachoData = {
      despachoIndex: index,
      selectedId: parseFloat(selectedOption.value)+parseFloat(1),
      integerValue,
      despacho: despacho,
      acciones: acciones,
      id: id,
    };

    try {
      const response = await fetch('http://localhost:5000/carros_mando2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(despachoData),
      });
      if (response.ok) {
        const result = await response.json();
      } else {
        console.error('Error sending despacho item:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    let updatedDespacho = [...despacho]; // Copy the current despacho list
    updatedDespacho.splice(index, 1);    // Remove the item at the submitted index
    let updatedAcciones = [...acciones]; // Copy the current despacho list
    updatedAcciones.splice(index, 1);

    // Update the state with the new despacho list
    setDespacho(updatedDespacho);
    setAcciones(updatedAcciones);

    // Update the local storage with the new list
    localStorage.setItem('despacho', JSON.stringify(updatedDespacho));
    localStorage.setItem('acciones', JSON.stringify(updatedAcciones));
  };


  const toggleSelection = (item) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(i => i !== item) // Remove if already selected
        : [...prevSelected, item] // Add if not selected
    );
  };

  const toggleSelection2 = (item) => {
    setSelectedDespacho(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(i => i !== item) // Remove if already selected
        : [...prevSelected, item] // Add if not selected
    );
  };

  const selectEstado = (option) => {
    setSelectedEstado((prevOption) => (prevOption === option ? null : option));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
      <div className='wrapper-carros'>
        <div className='activos-column'>
          <h2>Unidades despachadas</h2>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {carrosActivos.map((item, index) => (
                  <button
                      key={index}
                      type="button"
                      onClick={() => {
                        toggleSelection(item);
                        setActiveSection(item);
                      }}
                      className={`btn btn-outline-primary ${activeSection === item ? 'active' : ''}`}

                  >
                    {item}
                  </button>
              ))}
            </div>
            <div style={{margin: "10px 0"}}>
              <button
                  type="button"
                  onClick={() => {
                    selectEstado("Desmovilizado");
                    setActiveSection("Desmovilizado"); // Marca esta sección como activa
                  }}
                  className={`btn btn-outline-primary ${activeSection === "Desmovilizado" ? "active" : ""}`}
                  style={{ marginRight: '10px' }}
              >
                Desmovilizado
              </button>
              <button
                  type="button"
                  onClick={() => {
                    selectEstado("En el lugar");
                    setActiveSection("En el lugar"); // Marca esta sección como activa
                  }}
                  className={`btn btn-outline-primary ${activeSection === "En el lugar" ? "active" : ""}`}
              >
                En el lugar
              </button>
            </div>
            <button type="submit"
                    className={`btn btn-outline-primary ${activeSection === "Confirmar" ? "active" : ''}`}
                    onClick={() => setActiveSection("Confirmar")}
            >
              Confirmar
            </button>
          </form>
        </div>
        <div className='disponibles-columna'>
          <h2>Unidades disponibles</h2>
          <form onSubmit={handleSubmit2}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px'}}>
              {carrosDisponibles.map((item, index) => (
                  <button
                      key={index}
                      type="button"
                      onClick={() => {
                        toggleSelection2(item);
                        setActiveSection(item); // Marca el elemento actual como activo
                      }}
                      className={`btn btn-outline-primary ${activeSection === item ? 'active' : ''}`}
                  >
                    {item}
                  </button>
              ))}
            </div>
            <button type="submit"
                    className={`btn btn-outline-primary ${activeSection === 'despachar' ? 'active' : ''}`}
            >
              Despachar
            </button>
          </form>
        </div>
        <div className='despacho'>
          {despacho.length > 0 ? (
              despacho.map((item, index) => (
                  <form key={index} onSubmit={(e) => {
                    e.preventDefault();
                    handleDespachoSubmit(index); // Prevent page refresh and handle the form submit
                  }}>
                    <label>Unidad {item}</label>
                    <div className='select'>
                      <Select
                          value={selectedOptions[index] || null}
                          onChange={(option) => handleDespachoChange(index, option)}
                          options={data2}
                          placeholder={`Busca un nombre`}
                          isClearable
                      />
                    </div>
                    <input
                        type="number"
                        placeholder="Ingrese cantidad de bomberos"
                        value={integerValues[index] || ''}
                        onChange={(e) => handleIntegerChange(index, parseInt(e.target.value, 10))}
                    />
                    <button type="submit" className="btn btn-success">Registar Despacho</button>
                    {/* Ensure this button is within a form and doesn't refresh */}
                  </form>
              ))
          ) : (
              <p>No hay unidades despachadas</p>
          )}
        </div>
      </div>
  );
};

const Form2 = ({ eventId, switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [evalu, setEval] = useState('');
  const [dataA, setDataA] = useState(null);  // State for data_a
  const [carrosActivos, setCarrosActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`/evaluaciones/${id}`);
      const data = await response.json();
      setDataA(data.evaluaciones);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fire risk data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === 'Evaluación') {
      fetchData(); // Fetch al cambiar a la pestaña "info"
    }
  }, [activeSection, id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/evaluacion", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({evaluacion: evalu, id: id})
    })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          switchToTabA();
        })
        .catch(error => console.error("Error:", error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Evaluación del incidente</h3>
        <label>
          Registrar: <input
            type="text"
            value={evalu}
            onChange={(e) => setEval(e.target.value)}
        />
        </label>
        <button type="submit"
                className={`btn btn-outline-primary ${activeSection === 'despachar' ? 'active' : ''}`}
                style={{marginLeft: '10px'}}
        >
          Enviar
        </button>
      </form>
      <div>
        {dataA && dataA.length > 0 ? (
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
              <thead>
              <tr>
                <th style={{border: '1px solid black', padding: '8px'}}>Fecha</th>
                <th style={{border: '1px solid black', padding: '8px'}}>Descripción</th>
                <th style={{border: '1px solid black', padding: '8px'}}>Orden</th>
              </tr>
              </thead>
              <tbody>
              {dataA.map((accion, index) => (
                  <tr key={index}>
                    <td style={{border: '1px solid black', padding: '8px'}}>{accion[0]}</td>
                    {/* Fecha */}
                    <td style={{border: '1px solid black', padding: '8px'}}>{accion[1]}</td>
                    {/* Acción */}
                    <td style={{border: '1px solid black', padding: '8px'}}>{accion[2]}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <p>No hay datos de acciones disponibles.</p>
        )}
      </div>
    </div>
  )
  ;
};

const Form3 = ({switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [clave, setClave] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/clave", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({clave: clave, id: id})
    })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          switchToTabA();
        })
        .catch(error => console.error("Error:", error));
  };

  return (
      <form onSubmit={handleSubmit}>
        <h3>Seleccione nueva clave</h3>
        <label>
          Seleccione Llamado:
          <select
              name="selectOption"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Seleccione una clave"
          >
            <option value="" disabled selected>SELECCIONE UNA CLAVE</option>
            {/* All the options from Despacho.js here */}
            <optgroup label="Incendio Declarado">
            <option value="X-1">X-1: INCENDIO DECLARADO</option>
          </optgroup>
          <optgroup label="Clave 1: Incendio Estructural">
            <option value="1-1">1-1: INCENDIO ESTRUCTURAL BÁSICO</option>
            <option value="1-2">1-2: INCENDIO ESTRUCTURAL EN ALTURA</option>
            <option value="1-3">1-3: INCENDIO ESTRUCTURAL EN LUGAR PÚBLICO O MASIVO</option>
          </optgroup>
          <optgroup label="Clave 2: Incendio Forestal">
            <option value="2-1">2-1: INCENDIO FORESTAL URBANO</option>
            <option value="2-2">2-2: INCENDIO FORESTAL DE INTERFASE</option>
            <option value="2-3">2-3: INCENDIO FORESTAL RURAL</option>
            <option value="2-4">2-4: INCENDIO EN VERTEDERO, MICRO BASURALES, BASUREROS</option>
          </optgroup>
          <optgroup label="Clave 3: Incendio Vehicular">
            <option value="3-1">3-1: INCENDIO VEHICULAR MENOR</option>
            <option value="3-2">3-2: INCENDIO VEHICULAR MAYOR</option>
            <option value="3-3">3-3: INCENDIO VEHICULAR CON CARGA PELIGROSA</option>
          </optgroup>
          <optgroup label="Clave 4: Materiales Peligrosos">
            <option value="4-1">4-1: HAZ-MAT DOMICILIARIA</option>
            <option value="4-2">4-2: HAZ-MAT EN VÍA PÚBLICA</option>
            <option value="4-3">4-3: HAZ-MAT INDUSTRIAL</option>
          </optgroup>
          <optgroup label="Clave 5: Rescate Vehicular">
            <option value="5-1">5-1: RESCATE VEHICULAR LIVIANO</option>
            <option value="5-2">5-2: RESCATE VEHICULAR PESADO</option>
            <option value="5-3">5-3: RESCATE VEHICULAR CON MATERIALES PELIGROSOS</option>
            <option value="5-4">5-4: RESCATE AÉREO, FERROVIARIO O DE BLINDADOS</option>
          </optgroup>
          <optgroup label="Clave 6: Rescate">
            <option value="6-1">6-1: APOYO A SAMU Y/O CARABINEROS</option>
            <option value="6-2">6-2: PERSONA EXTRAVIADA</option>
            <option value="6-3">6-3: PERSONA ENCERRADA</option>
            <option value="6-4">6-4: RESCATE ANIMAL</option>
            <option value="6-5">6-5: RESCATE EN ALTURA</option>
            <option value="6-6">6-6: RESCATE EN ESTRUCTURAS COLAPSADAS</option>
            <option value="6-7">6-7: RESCATE EN ESPACIOS CONFINADOS</option>
          </optgroup>
          <optgroup label="Otros Incidentes">
            <option value="7-1">9: ACUARTELAMIENTO GENERAL </option>
            <option value="9-1">9: EMERGENCIA INDUSTRIAL</option>
            <option value="10-1">10-1: TRASLADO DE BOMBERO ACCIDENTADO</option>
            <option value="10-2">10-2: ABASTECIMIENTO DE AGUA</option>
            <option value="10-3">10-3: ABRIR PUERTAS</option>
            <option value="10-4">10-4: COLOCAR DRIZAS</option>
            <option value="10-5">10-5: EMERGENCIA CLIMATOLÓGICA</option>
            <option value="10-5">10-6: VISITA INSPECTIVA</option>
            <option value="10-5">10-8: SALIDA A TALLER</option>
            <option value="10-5">10-9: INVESTIGACIÓN DE INCENDIOS</option>
            <option value="11-1">11: PREVENCIÓN DE EMERGENCIAS ESTRUCTURALES</option>
            <option value="13-1">13: REBROTE DE INCENDIO</option>
            <option value="15-1">15: EMERGENCIA NO CLASIFICADA</option>
          </optgroup>
          <optgroup label="Clave 8: Apoyo a Otros Cuerpos">
            <option value="8-1">Clave 1-1</option>
            <option value="8-2">Clave 1-2</option>
            <option value="8-3">Clave 1-3</option>
            <option value="8-4">Clave 2-1</option>
            <option value="8-5">Clave 2-2</option>
            <option value="8-6">Clave 2-3</option>
            <option value="8-7">Clave 2-4</option>
            <option value="8-8">Clave 3-1</option>
            <option value="8-9">Clave 3-2</option>
            <option value="8-10">Clave 3-3</option>
            <option value="8-11">Clave 4-1</option>
            <option value="8-12">Clave 4-2</option>
            <option value="8-13">Clave 4-3</option>
            <option value="8-14">Clave 5-1</option>
            <option value="8-15">Clave 5-2</option>
            <option value="8-16">Clave 5-3</option>
            <option value="8-17">Clave 5-4</option>
            <option value="8-18">Clave 6-1</option>
            <option value="8-19">Clave 6-2</option>
            <option value="8-20">Clave 6-3</option>
            <option value="8-21">Clave 6-4</option>
            <option value="8-22">Clave 6-5</option>
            <option value="8-23">Clave 6-6</option>
            <option value="8-24">Clave 6-7</option>
          </optgroup>
          <optgroup label="Clave 13: Simulacro de Incidente">
            <option value="13-1">Clave 1-1</option>
            <option value="13-2">Clave 1-2</option>
            <option value="13-3">Clave 1-3</option>
            <option value="13-4">Clave 2-1</option>
            <option value="13-5">Clave 2-2</option>
            <option value="13-6">Clave 2-3</option>
            <option value="13-7">Clave 2-4</option>
            <option value="13-8">Clave 3-1</option>
            <option value="13-9">Clave 3-2</option>
            <option value="13-10">Clave 3-3</option>
            <option value="13-11">Clave 4-1</option>
            <option value="13-12">Clave 4-2</option>
            <option value="13-13">Clave 4-3</option>
            <option value="13-14">Clave 5-1</option>
            <option value="13-15">Clave 5-2</option>
            <option value="13-16">Clave 5-3</option>
            <option value="13-17">Clave 5-4</option>
            <option value="13-18">Clave 6-1</option>
            <option value="13-19">Clave 6-2</option>
            <option value="13-20">Clave 6-3</option>
            <option value="13-21">Clave 6-4</option>
            <option value="13-22">Clave 6-5</option>
            <option value="13-23">Clave 6-6</option>
            <option value="13-24">Clave 6-7</option>
          </optgroup>
          {/* Add other optgroups as necessary */}
        </select>
      </label>
        <button type="submit"
                onClick={() => setActiveSection("despachar")}
                className={`btn btn-outline-primary ${activeSection === "despachar" ? "active" : ""}`}
                style={{ marginLeft: '10px' }}
        >
          Confirmar
        </button>
      </form>
  );
};


const Form4 = ({eventId, switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [carrosActivos, setCarrosActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected buttons
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Fetch data from the Flask API
    fetch(`/carros/${id}`)
      .then(response => response.json())
      .then(data => {
        // Set the data in state
        setCarrosActivos(data.carros || []); // Use empty array as fallback
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching event data:", error);
        setLoading(false);
      });
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      selectedItems: selectedItems,
      text: inputText,
      id: id,
    };
    console.log("Data to send:", data);
    
    // Send data to backend
    fetch('/instrucciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {console.log("Response from backend:", result);
        switchToTabA();})
      .catch(error => console.error("Error:", error));
  };

  const toggleSelection = (item) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(i => i !== item) // Remove if already selected
        : [...prevSelected, item] // Add if not selected
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {carrosActivos.map((item, index) => (
            <button
                key={index}
                type="button"
                onClick={() => {
                  toggleSelection(item);
                  setActiveSection(item); // Marca este botón como activo
                }}
                className={`btn btn-outline-primary ${activeSection === item ? 'active' : ''}`}
            >
              {item}
            </button>
        ))}
      </div>
      <label>
        Enter text:
        <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{display: 'block', margin: '10px 0'}}
        />
      </label>
      <button
          type="submit"
          onClick={() => setActiveSection("SubmitForm1")}
          className={`btn btn-outline-primary ${activeSection === "SubmitForm1" ? 'active' : ''}`}
          style={{ marginLeft: '10px' }}
      >
        Registrar
      </button>
    </form>
  );
};


const Form5 = ({switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [superado, setSuperado] = useState(0);

  const handleToggle = () => {
    setSuperado(prevNumber => (prevNumber === 0 ? 1 : 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the number to Flask backend
    fetch('/superacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: superado, id:id }), // Send number as JSON
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from Flask:', data);
        switchToTabA();
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Superación de incidente</h3>
      
      {/* Button to toggle number */}
      <button
          type="button"
          onClick={() => {
            handleToggle(); // Lógica existente
            setActiveSection("Superado"); // Actualiza el estado para reflejar que está activo
          }}
          className={`btn btn-outline-primary ${activeSection === "Superado" ? 'active' : ''}`}
      >
        Superado
      </button>

      {/* Submit button */}
      <button
          type="submit"
          onClick={() => setActiveSection("SubmitForm")}
          className={`btn btn-outline-primary ${activeSection === 'SubmitForm' ? 'active' : ''}`}
          style={{ marginLeft: '10px' }}
      >
        Confirmar
      </button>
    </form>
  );
};


const Form6 = ({switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [options, setOptions] = useState([]); // Options for dropdown
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const options = jsonData.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));
        setOptions(options); // Guardar opciones transformadas
      })
      .catch((error) => {
        console.error('Error al cargar el JSON:', error);
      });
  }, []);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption) {
      const data = { id_bombero: selectedOption.value, nombre: selectedOption.label, id: id };
      console.log('Data to send:', data);

      // Send data to the backend
      fetch('/mando', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(result => {console.log('Response from backend:', result);
          switchToTabA();})
        .catch(error => console.error('Error:', error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cambio del Comandante de Incidentes</h3>
      <label>
        Seleccione:
        <Select
          value={selectedOption || null}
          onChange={setSelectedOption}
          options={options}
          placeholder={`Busca un nombre`}
          isClearable
        />
      </label>
      <button type="submit"
              onClick={() => setActiveSection("Confirmar")}
              className={`btn btn-outline-primary ${activeSection === 'Confirmar' ? 'active' : ''}`}
              style={{ marginLeft: '10px' }}
      >
        Confirmar
      </button>
    </form>
  );
};


const Form7 = ({switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [externos, setExternos] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/externos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ externos: externos, id: id })
    })
      .then(response => response.json())
      .then(result => {console.log('Response from backend:', result);
        switchToTabA();})
      .catch(error => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro de solicitud de recursos externos</h3>
      <label>
        Seleccione:
        <select value={externos} onChange={(e) => setExternos(e.target.value)}>
          <option value="" disabled selected>Seleccione</option>
          <option value="CONAF">CONAF</option>
          <option value="Chilquinta">Chilquinta</option>
          <option value="CGE">CGE</option>
          <option value="ESVAL">ESVAL</option>
          <option value="Lipigas">Lipigas</option>
          <option value="Abastible">Abastible</option>
          <option value="Gasco">Gasco</option>
          <option value="Metrogas">Metrogas</option>
          <option value="Seguridad Ciudadana">Seguridad Ciudadana</option>
          <option value="Municipalidad">Municipalidad</option>
        </select>
      </label>
      <button type="submit"
              onClick={() => setActiveSection("Confirmar")}
              className={`btn btn-outline-primary ${activeSection === 'Confirmar' ? 'active' : ''}`}
              style={{ marginLeft: '10px' }}
      >
        Confirmar
      </button>
    </form>
  );
};


const Form8 = ({switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [info, setInfo] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/informacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ info: info, id: id })
    })
      .then(response => response.json())
      .then(result => {console.log('Response from backend:', result);
        switchToTabA();})
      .catch(error => console.error("Error:", error));
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro de información general</h3>
      <label>
        Registrar:  <input
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </label>
      <button type="submit"
              onClick={() => setActiveSection("Enviar")}
              className={`btn btn-outline-primary ${activeSection === 'Enviar' ? 'active' : ''}`}
              style={{ marginLeft: '10px' }}
      >
        Enviar
      </button>
    </form>
  );
};

const Form9 = ({switchToTabA}) => {
  const [activeSection, setActiveSection] = useState(null);
  const {id} = useParams();
  const [info, setInfo] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/informacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ info: info, id: id })
    })
        .then(response => response.json())
        .then(result => {console.log('Response from backend:', result);
          switchToTabA();})
        .catch(error => console.error("Error:", error));
  };
  return (
      <form onSubmit={handleSubmit}>
        <h3>Registro de víctimas</h3>
        <label>
          Registrar:  <input
            type="text"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
        />
        </label>
        <button type="submit"
                onClick={() => setActiveSection("Enviar")}
                className={`btn btn-outline-primary ${activeSection === 'Enviar' ? 'active' : ''}`}
        >
          Enviar
        </button>
      </form>
  );
};

export default MultiSectionToggle;
