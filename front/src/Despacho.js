import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Despacho.css';
import Sidebar from './Sidebar';
import Authentication from './Authentication';

// Custom icon for fixed markers (blue with a house)
const houseIcon = new L.Icon({
  iconUrl: '/house-icon.png',  // Path to your custom house icon image
  iconSize: [30, 41],  // Size of the icon
  iconAnchor: [12, 41],  // Anchor point of the icon
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Custom icon for intersection markers (red with a flame)
const flameIcon = new L.Icon({
  iconUrl: '/flame-icon.png',  // Path to your custom flame icon image
  iconSize: [30, 41],  // Size of the icon
  iconAnchor: [12, 41],  // Anchor point of the icon
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});


// Helper component to update the map view when a marker is placed
function SetMapView({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);  // Center the map on the marker's position
    }
  }, [position, map]);
  return null;
}

function Despacho() {
  const [streets, setStreets] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [selectedIntersection, setSelectedIntersection] = useState('');
  const [coordinates, setCoordinates] = useState({ x: [], y: [] });
  const [markerPosition, setMarkerPosition] = useState(null);  // Position for the map marker
  const [data, setData] = useState([]);
  const [clave, setClave] = useState('');  // Clave input
  const [textInput1, setTextInput1] = useState('');  // First text input
  const [textInput2, setTextInput2] = useState('');
  const [despacho, setDespacho] = useState([]);
  const [data2, setData2] = useState([]); // Opciones para los selects de Prueba.js
  const [selectedOptions, setSelectedOptions] = useState({}); // Estado para múltiples selects dinámicos
  const [integerValues, setIntegerValues] = useState({});
  const [emergencyId, setEmergencyId] = useState(null);


  // Cargar datos desde el JSON para el select de Prueba.js
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

  // Default map center coordinates
  const defaultCenter = [-33.04903608163022, -71.3756133238521];  // Villa Alemana default

  // Load streets and intersections from the JSON file
  useEffect(() => {
    fetch('/calles.json')  // The path to the file in the public folder
      .then((response) => response.json())
      .then((data) => {
        setData(data);  // Save fetched data to the state
        const streetOptions = data.map(item => ({ label: item.Calles, value: item.Calles }));  // Extract street names as options
        setStreets(streetOptions);
      })
      .catch((error) => console.error('Error fetching the JSON file:', error));
  }, []);

  useEffect(() => {
    const savedDespacho = localStorage.getItem('despacho');
    const savedEmergencyId = localStorage.getItem('emergencyId');
  
    if (savedDespacho && savedEmergencyId) {
      setDespacho(JSON.parse(savedDespacho));  // Parse despacho back to array
      setEmergencyId(savedEmergencyId);
    }
  }, []);
  

  const fixedPins = [
    { lat: -33.04826497621013, lng: -71.37766983702313, name: "1era Compañía" },
    { lat: -33.04348848857053, lng: -71.37182416898918, name: "2da Compañía" },
    { lat: -33.04649840040579, lng: -71.3530632234065, name: "3ra Compañía" },
    { lat: -33.05599775894304, lng: -71.3911704295499, name: "4ta Compañía" },
  ];


  const handleStreetChange = (selectedOption) => {
    const selected = selectedOption ? selectedOption.value : '';
    setSelectedStreet(selected);
    const selectedData = data.find(item => item.Calles === selected);
    
    // Parse the intersections and coordinates (X and Y) from string to array
    const parsedIntersections = selectedData ? JSON.parse(selectedData.Intersecciones.replace(/'/g, '"')) : [];
    const parsedX = selectedData ? JSON.parse(selectedData.X.replace(/'/g, '"')) : [];
    const parsedY = selectedData ? JSON.parse(selectedData.Y.replace(/'/g, '"')) : [];
    
    // Create intersection options
    const intersectionOptions = parsedIntersections.map((intersection, index) => ({
      label: intersection,
      value: index
    }));

    setIntersections(intersectionOptions);
    setCoordinates({
      x: parsedX,
      y: parsedY
    });

    // Clear the marker position when the street changes
    setMarkerPosition(null);
    setSelectedIntersection('');
  };

  const handleIntersectionChange = (selectedOption) => {
    const index = selectedOption ? selectedOption.value : null;
    setSelectedIntersection(intersections[index]?.label);

    const lat = coordinates.x[index];  // Y should be latitude
    const lng = coordinates.y[index];  // X should be longitude

    // Validate the latitude and longitude values
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition([lat, lng]);  // Set the valid coordinates
    } else {
      console.error('Invalid coordinates: ', lat, lng);
      setMarkerPosition(null);  // Clear the marker if the coordinates are invalid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from actually submitting

    // Prepare the data to be sent
    const formData = {
      clave: clave,
      calle: selectedStreet,
      interseccion: selectedIntersection,
      direccion: textInput1,
      informacion: textInput2,
    };
    
    // Show an alert for now, you can handle the form submission logic
    const alertData = `
      Clave: ${formData.clave}
      Calle: ${formData.calle}
      Intersección: ${formData.interseccion}
      Dirección: ${formData.direccion}
      Información: ${formData.informacion}
    `;
    alert(`DESPACHO ${alertData}`);

    try {
      const response = await fetch('http://localhost:5000/despacho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data successfully sent:', result);
        alert(result.resultado)
        
        localStorage.setItem('despacho', JSON.stringify(result.despacho)); // Save despacho as a JSON string
        localStorage.setItem('emergencyId', result.id);

        setDespacho(result.despacho);
        setEmergencyId(result.id);
      } else {
        console.error('Error sending data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

  // Enviar el despacho con los selects dinámicos
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
    };

    try {
      const response = await fetch('http://localhost:5000/carros_mando', {
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

    // Update the state with the new despacho list
    setDespacho(updatedDespacho);

    // Update the local storage with the new list
    localStorage.setItem('despacho', JSON.stringify(updatedDespacho));
  };

  return (
    <div>
    <Authentication />
      <div className="wrapper">
        {/* Sidebar (15%) */}
        <div className="sidebar">
          <h3>Estado Carros</h3>
          <Sidebar />
        </div>

        {/* Main Content (85%) */}
        <div className="main-content">
        <div className='form-container'>
        <div className='form-column'>
          <MapContainer center={defaultCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> PhoenixSOS'
            />
            {/* Update the view only when a marker position is selected */}
            <SetMapView position={markerPosition} />
            {markerPosition && (
              <Marker position={markerPosition} icon={flameIcon}>
                <Popup>
                  {selectedStreet} / {selectedIntersection}
                </Popup>
              </Marker>
            )}
            {fixedPins.map((pin, index) => (
                <Marker key={index} position={[pin.lat, pin.lng]} icon={houseIcon}>
                  <Popup>{pin.name}</Popup>
                </Marker>
              ))}
          </MapContainer>
          <form onSubmit={handleSubmit}>
            
          <div className='row-container'>
            <div className='left-center-top-column'>
            <label htmlFor="street-select" className="label-white">Seleccione Calle:</label>
            <div className='select'>
              <Select
                id="street-select"
                options={streets}
                onChange={handleStreetChange}
                isClearable
                placeholder="SELECCIONE UNA CALLE"
              />
            </div>
            </div>

            <div className="right-center-top-column">
              <label htmlFor="intersection-select" >Seleccione Intersección:</label>
              <div className='select'>
                <Select
                  id="intersection-select"
                  options={intersections}
                  onChange={handleIntersectionChange}
                  isClearable
                  isDisabled={!selectedStreet}
                  placeholder="SELECCIONE UNA INTERSECCIÓN"
                />
              </div>
            </div>
            </div>         
            
            <div className="center-down">
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
            </div>

            <div className='row-container'>
            <div className='left-center-down-column'>
            <label htmlFor="text-input1" >Dirección Exacta:</label>
            <input
              id="text-input1"
              type="text"
              value={textInput1}
              onChange={(e) => setTextInput1(e.target.value)}
              placeholder="Ingrese dirección exacta"
              style={{ width: '100%', }}
            />
            </div>

            <div className="right-center-down-column">
            <label htmlFor="text-input2" className="label-white">Información Adicional:</label>
            <input
              id="text-input2"
              type="text"
              value={textInput2}
              onChange={(e) => setTextInput2(e.target.value)}
              placeholder="Ingrese información adicional"
              style={{ width: '100%' }}
            />
            </div>
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary" 
                type="button" 
                onClick={handleSubmit}
                style={{ width: '100%', height: '100px' }}
              >
                Despacho
              </button>
            </div>
          </form>
          </div>
          <div className="right-column">
            {despacho.length > 0 ? (
              despacho.map((item, index) => (
                <form key={index} onSubmit={(e) => { 
                  e.preventDefault(); 
                  handleDespachoSubmit(index); // Prevent page refresh and handle the form submit
                  }}
                  style={{ marginBottom: '20px' }} 
                >
                  <label>Unidad {item}</label>
                  <div className='select' style={{ marginBottom: '10px' }}>
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
                    style={{ marginBottom: '10px' }}
                  />
                  <button type="submit" class="btn btn-success">Registar Despacho</button>  {/* Ensure this button is within a form and doesn't refresh */}
                </form>
              ))
            ) : (
              <p>No hay unidades despachadas</p>
            )}

          <div>
            <Link to={`/emergencia/${emergencyId}`}>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => {
              localStorage.removeItem('emergencyId');
            }}
            style={{ minWidth: '220px' }} 
          >
              Ultimo Despacho
            </button>
            </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
  );
}

export default Despacho;
