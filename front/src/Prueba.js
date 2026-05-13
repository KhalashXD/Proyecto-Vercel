import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import MainLayout from './MainLayout';
import './Prueba.css';

const MultiSectionToggle = ({ eventId }) => {
  const { id } = useParams();

  const [activeSection, setActiveSection] = useState(null);
  const [dataE, setDataE] = useState(null);
  const [dataA, setDataA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  const switchToTabA = () => {
    setActiveTab('info');
    setActiveSection(null);
  };

  const sections = [
    { id: 1, label: 'Unidades', content: <Form1 switchToTabA={switchToTabA} /> },
    { id: 2, label: 'Evaluación', content: <Form2 switchToTabA={switchToTabA} /> },
    { id: 3, label: 'Clave', content: <Form3 switchToTabA={switchToTabA} /> },
    { id: 4, label: 'Instrucciones', content: <Form4 switchToTabA={switchToTabA} /> },
    { id: 5, label: 'Superación', content: <Form5 switchToTabA={switchToTabA} /> },
    { id: 6, label: 'Comandante', content: <Form6 switchToTabA={switchToTabA} /> },
    { id: 7, label: 'Externos', content: <Form7 switchToTabA={switchToTabA} /> },
    { id: 8, label: 'Información', content: <Form8 switchToTabA={switchToTabA} /> },
    { id: 9, label: 'Víctimas', content: <Form9 switchToTabA={switchToTabA} /> },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(`/emergencia_info/${id}`);
      const data = await response.json();

      setDataE(data.data_e);
      setDataA(data.data_a);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'info') {
      fetchData();
    }
  }, [activeTab, id]);

  if (loading) {
    return (
      <MainLayout title="Emergencia" subtitle="Cargando información">
        <div className="empty-state">Cargando información...</div>
      </MainLayout>
    );
  }

  if (!dataE && !dataA) {
    return (
      <MainLayout title="Emergencia" subtitle="Sin información disponible">
        <div className="empty-state">
          No hay información disponible para esta emergencia.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={`Clave ${dataE[0]} ${dataE[1]} / ${dataE[2]}`}
      subtitle={dataE[3]}
    >
      <section className="incident-card">
        <div className="incident-tabs">
          <button
            type="button"
            className={`incident-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>

          <button
            type="button"
            className={`incident-tab ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Acciones
          </button>
        </div>

        {activeTab === 'info' && (
          <div>
            <h2>Cronología</h2>

            {dataA && dataA.length > 0 ? (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Carro</th>
                      <th>Orden</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataA.map((accion, index) => (
                      <tr key={index}>
                        <td>{accion[1]}</td>
                        <td>{accion[0]}</td>
                        <td>{accion[3]}</td>
                        <td>{accion[4]}</td>
                        <td>{accion[5]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                No hay datos de acciones disponibles.
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <h2>Acciones</h2>

            <div className="action-grid">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`action-chip ${activeSection === section.id ? 'active' : ''}`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {activeSection ? (
              <div className="action-panel">
                {sections.find((section) => section.id === activeSection)?.content}
              </div>
            ) : (
              <div className="empty-state">
                Selecciona una acción para registrar información.
              </div>
            )}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

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
  const [data2, setData2] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
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

        setData2(options);
      })
      .catch((error) => {
        console.error('Error al cargar el JSON:', error);
      });
  }, []);

  useEffect(() => {
    const savedDespacho = localStorage.getItem('despacho');
    const savedAcciones = localStorage.getItem('acciones');

    if (savedDespacho && savedAcciones) {
      setDespacho(JSON.parse(savedDespacho));
      setAcciones(JSON.parse(savedAcciones));
    }
  }, []);

  useEffect(() => {
    fetch(`/carros/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCarrosActivos(data.carros || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [id, eventId]);

  useEffect(() => {
    fetch(`/disponibles/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCarrosDisponibles(data.carros || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [id, eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      carro: selectedItems,
      estado: selectedEstado ? [selectedEstado] : [],
      id,
    };

    fetch('/desmov', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();

    const data = {
      selectedDespacho,
      selectedOptions: 'Despachado',
      id,
    };

    fetch('/desp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);

        localStorage.setItem('despacho', JSON.stringify(result.despacho));
        localStorage.setItem('acciones', JSON.stringify(result.acciones));

        setDespacho(result.despacho || []);
        setAcciones(result.acciones || []);

        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleDespachoChange = (index, selectedOption) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [index]: selectedOption,
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
    const integerValue = integerValues[index];

    if (!selectedOption || integerValue === undefined || Number.isNaN(integerValue)) {
      alert('Selecciona una opción y proporciona un número entero para este despacho');
      return;
    }

    const despachoData = {
      despachoIndex: index,
      selectedId: parseFloat(selectedOption.value) + 1,
      integerValue,
      despacho,
      acciones,
      id,
    };

    try {
      const response = await fetch('http://localhost:5000/carros_mando2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(despachoData),
      });

      if (!response.ok) {
        console.error('Error sending despacho item:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    const updatedDespacho = [...despacho];
    updatedDespacho.splice(index, 1);

    const updatedAcciones = [...acciones];
    updatedAcciones.splice(index, 1);

    setDespacho(updatedDespacho);
    setAcciones(updatedAcciones);

    localStorage.setItem('despacho', JSON.stringify(updatedDespacho));
    localStorage.setItem('acciones', JSON.stringify(updatedAcciones));
  };

  const toggleSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const toggleSelection2 = (item) => {
    setSelectedDespacho((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const selectEstado = (option) => {
    setSelectedEstado((prevOption) => (prevOption === option ? null : option));
  };

  if (loading) {
    return <p>Cargando información...</p>;
  }

  return (
    <div className="wrapper-carros">
      <div className="activos-column">
        <h2>Unidades despachadas</h2>

        <form onSubmit={handleSubmit}>
          <div className="action-grid">
            {carrosActivos.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  toggleSelection(item);
                  setActiveSection(item);
                }}
                className={`action-chip ${activeSection === item ? 'active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="action-grid">
            <button
              type="button"
              onClick={() => {
                selectEstado('Desmovilizado');
                setActiveSection('Desmovilizado');
              }}
              className={`action-chip ${activeSection === 'Desmovilizado' ? 'active' : ''}`}
            >
              Desmovilizado
            </button>

            <button
              type="button"
              onClick={() => {
                selectEstado('En el lugar');
                setActiveSection('En el lugar');
              }}
              className={`action-chip ${activeSection === 'En el lugar' ? 'active' : ''}`}
            >
              En el lugar
            </button>
          </div>

          <button type="submit" className="app-btn app-btn-primary">
            Confirmar
          </button>
        </form>
      </div>

      <div className="disponibles-columna">
        <h2>Unidades disponibles</h2>

        <form onSubmit={handleSubmit2}>
          <div className="action-grid">
            {carrosDisponibles.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  toggleSelection2(item);
                  setActiveSection(item);
                }}
                className={`action-chip ${activeSection === item ? 'active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <button type="submit" className="app-btn app-btn-primary">
            Despachar
          </button>
        </form>
      </div>

      <div className="despacho">
        <h2>Registro de dotación</h2>

        {despacho.length > 0 ? (
          despacho.map((item, index) => (
            <form
              key={index}
              onSubmit={(e) => {
                e.preventDefault();
                handleDespachoSubmit(index);
              }}
            >
              <label>Unidad {item}</label>

              <Select
                value={selectedOptions[index] || null}
                onChange={(option) => handleDespachoChange(index, option)}
                options={data2}
                placeholder="Busca un nombre"
                isClearable
              />

              <input
                type="number"
                placeholder="Ingrese cantidad de bomberos"
                value={integerValues[index] || ''}
                onChange={(e) =>
                  handleIntegerChange(index, parseInt(e.target.value, 10))
                }
              />

              <button type="submit" className="app-btn app-btn-primary">
                Registrar Despacho
              </button>
            </form>
          ))
        ) : (
          <p>No hay unidades despachadas</p>
        )}
      </div>
    </div>
  );
};

const Form2 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [evalu, setEval] = useState('');
  const [dataA, setDataA] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`/evaluaciones/${id}`);
      const data = await response.json();
      setDataA(data.evaluaciones);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/evaluacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluacion: evalu, id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Evaluación del incidente</h3>

        <label>
          Registrar:
          <input
            type="text"
            value={evalu}
            onChange={(e) => setEval(e.target.value)}
          />
        </label>

        <button type="submit" className="app-btn app-btn-primary">
          Enviar
        </button>
      </form>

      {dataA && dataA.length > 0 ? (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Orden</th>
              </tr>
            </thead>

            <tbody>
              {dataA.map((accion, index) => (
                <tr key={index}>
                  <td>{accion[0]}</td>
                  <td>{accion[1]}</td>
                  <td>{accion[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay evaluaciones disponibles.</p>
      )}
    </div>
  );
};

const Form3 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [clave, setClave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/clave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave, id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
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
        >
          <option value="" disabled>
            SELECCIONE UNA CLAVE
          </option>

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
            <option value="7-1">9: ACUARTELAMIENTO GENERAL</option>
            <option value="9-1">9: EMERGENCIA INDUSTRIAL</option>
            <option value="10-1">10-1: TRASLADO DE BOMBERO ACCIDENTADO</option>
            <option value="10-2">10-2: ABASTECIMIENTO DE AGUA</option>
            <option value="10-3">10-3: ABRIR PUERTAS</option>
            <option value="10-4">10-4: COLOCAR DRIZAS</option>
            <option value="10-5">10-5: EMERGENCIA CLIMATOLÓGICA</option>
            <option value="10-6">10-6: VISITA INSPECTIVA</option>
            <option value="10-8">10-8: SALIDA A TALLER</option>
            <option value="10-9">10-9: INVESTIGACIÓN DE INCENDIOS</option>
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
        </select>
      </label>

      <button type="submit" className="app-btn app-btn-primary">
        Confirmar
      </button>
    </form>
  );
};

const Form4 = ({ eventId, switchToTabA }) => {
  const { id } = useParams();

  const [activeSection, setActiveSection] = useState(null);
  const [carrosActivos, setCarrosActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetch(`/carros/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCarrosActivos(data.carros || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [id, eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      selectedItems,
      text: inputText,
      id,
    };

    fetch('/instrucciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  const toggleSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  if (loading) {
    return <p>Cargando información...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Instrucciones a unidades</h3>

      <div className="action-grid">
        {carrosActivos.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              toggleSelection(item);
              setActiveSection(item);
            }}
            className={`action-chip ${activeSection === item ? 'active' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>

      <label>
        Instrucción:
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </label>

      <button type="submit" className="app-btn app-btn-primary">
        Registrar
      </button>
    </form>
  );
};

const Form5 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [activeSection, setActiveSection] = useState(null);
  const [superado, setSuperado] = useState(0);

  const handleToggle = () => {
    setSuperado((prevNumber) => (prevNumber === 0 ? 1 : 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/superacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: superado, id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from Flask:', data);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Superación de incidente</h3>

      <button
        type="button"
        onClick={() => {
          handleToggle();
          setActiveSection('Superado');
        }}
        className={`action-chip ${activeSection === 'Superado' ? 'active' : ''}`}
      >
        Superado
      </button>

      <button type="submit" className="app-btn app-btn-primary">
        Confirmar
      </button>
    </form>
  );
};

const Form6 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const options = jsonData.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));

        setOptions(options);
      })
      .catch((error) => {
        console.error('Error al cargar el JSON:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOption) {
      alert('Selecciona un comandante de incidentes.');
      return;
    }

    const data = {
      id_bombero: selectedOption.value,
      nombre: selectedOption.label,
      id,
    };

    fetch('/mando', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
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
          placeholder="Busca un nombre"
          isClearable
        />
      </label>

      <button type="submit" className="app-btn app-btn-primary">
        Confirmar
      </button>
    </form>
  );
};

const Form7 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [externos, setExternos] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/externos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externos, id }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro de solicitud de recursos externos</h3>

      <label>
        Seleccione:
        <select value={externos} onChange={(e) => setExternos(e.target.value)}>
          <option value="" disabled>
            Seleccione
          </option>
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

      <button type="submit" className="app-btn app-btn-primary">
        Confirmar
      </button>
    </form>
  );
};

const Form8 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [info, setInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/informacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ info, id }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro de información general</h3>

      <label>
        Registrar:
        <input
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </label>

      <button type="submit" className="app-btn app-btn-primary">
        Enviar
      </button>
    </form>
  );
};

const Form9 = ({ switchToTabA }) => {
  const { id } = useParams();

  const [info, setInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/informacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ info, id }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Response from backend:', result);
        switchToTabA();
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro de víctimas</h3>

      <label>
        Registrar:
        <input
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </label>

      <button type="submit" className="app-btn app-btn-primary">
        Enviar
      </button>
    </form>
  );
};

export default MultiSectionToggle;