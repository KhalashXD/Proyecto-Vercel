import React, { useState, useEffect } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { Link } from "react-router-dom";
import Select from "react-select";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/Despacho.css";
import MainLayout from "../components/MainLayout";

const MapContainer = LeafletMapContainer as any;
const TileLayer = LeafletTileLayer as any;
const Marker = LeafletMarker as any;

interface SelectOption {
  label: string;
  value: string | number;
}

interface StreetData {
  Calles: string;
  Intersecciones: string;
  X: string;
  Y: string;
}

interface BomberoData {
  nombre: string;
  id: string;
}

interface Coordinates {
  x: number[];
  y: number[];
}

interface DespachoResponse {
  resultado: string;
  despacho: string[];
  id: string;
}

const houseIcon = new L.Icon({
  iconUrl: "/house-icon.png",
  iconSize: [30, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const flameIcon = new L.Icon({
  iconUrl: "/flame-icon.png",
  iconSize: [30, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface SetMapViewProps {
  position: [number, number] | null;
}

function SetMapView({ position }: SetMapViewProps): null {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
}

const Despacho: React.FC = () => {
  const [streets, setStreets] = useState<SelectOption[]>([]);
  const [intersections, setIntersections] = useState<SelectOption[]>([]);
  const [selectedStreet, setSelectedStreet] = useState<string>("");
  const [selectedIntersection, setSelectedIntersection] =
    useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates>({
    x: [],
    y: [],
  });
  const [markerPosition, setMarkerPosition] =
    useState<[number, number] | null>(null);

  const [data, setData] = useState<StreetData[]>([]);
  const [clave, setClave] = useState<string>("");
  const [textInput1, setTextInput1] = useState<string>("");
  const [textInput2, setTextInput2] = useState<string>("");
  const [despacho, setDespacho] = useState<string[]>([]);
  const [data2, setData2] = useState<SelectOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, SelectOption | null>
  >({});
  const [integerValues, setIntegerValues] = useState<Record<number, number>>(
    {}
  );
  const [emergencyId, setEmergencyId] = useState<string | null>(null);

  const defaultCenter: [number, number] = [
    -33.04903608163022,
    -71.3756133238521,
  ];

  const fixedPins: Array<{
    lat: number;
    lng: number;
    name: string;
  }> = [
    {
      lat: -33.04826497621013,
      lng: -71.37766983702313,
      name: "1era Compañía",
    },
    {
      lat: -33.04348848857053,
      lng: -71.37182416898918,
      name: "2da Compañía",
    },
    {
      lat: -33.04649840040579,
      lng: -71.3530632234065,
      name: "3ra Compañía",
    },
    {
      lat: -33.05599775894304,
      lng: -71.3911704295499,
      name: "4ta Compañía",
    },
  ];

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData: BomberoData[]) => {
        const options = jsonData.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));

        setData2(options);
      })
      .catch((error) => {
        console.error("Error al cargar el JSON:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/calles.json")
      .then((response) => response.json())
      .then((jsonData: StreetData[]) => {
        setData(jsonData);

        const streetOptions = jsonData.map((item) => ({
          label: item.Calles,
          value: item.Calles,
        }));

        setStreets(streetOptions);
      })
      .catch((error) => {
        console.error("Error fetching the JSON file:", error);
      });
  }, []);

  useEffect(() => {
    const savedDespacho = localStorage.getItem("despacho");
    const savedEmergencyId = localStorage.getItem("emergencyId");

    if (savedDespacho && savedEmergencyId) {
      setDespacho(JSON.parse(savedDespacho));
      setEmergencyId(savedEmergencyId);
    }
  }, []);

  const handleStreetChange = (selectedOption: SelectOption | null): void => {
    const selected =
      selectedOption && typeof selectedOption.value === "string"
        ? selectedOption.value
        : "";

    setSelectedStreet(selected);

    const selectedData = data.find((item) => item.Calles === selected);

    const parsedIntersections: string[] = selectedData
      ? JSON.parse(selectedData.Intersecciones.replace(/'/g, '"'))
      : [];

    const parsedX: number[] = selectedData
      ? JSON.parse(selectedData.X.replace(/'/g, '"'))
      : [];

    const parsedY: number[] = selectedData
      ? JSON.parse(selectedData.Y.replace(/'/g, '"'))
      : [];

    const intersectionOptions = parsedIntersections.map(
      (intersection, index) => ({
        label: intersection,
        value: index,
      })
    );

    setIntersections(intersectionOptions);
    setCoordinates({
      x: parsedX,
      y: parsedY,
    });

    setMarkerPosition(null);
    setSelectedIntersection("");
  };

  const handleIntersectionChange = (
    selectedOption: SelectOption | null
  ): void => {
    const index =
      selectedOption && typeof selectedOption.value === "number"
        ? selectedOption.value
        : null;

    if (index === null) {
      setSelectedIntersection("");
      setMarkerPosition(null);
      return;
    }

    setSelectedIntersection(String(intersections[index]?.label || ""));

    const lat = coordinates.x[index];
    const lng = coordinates.y[index];

    if (lat && lng && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      setMarkerPosition([lat, lng]);
    } else {
      console.error("Invalid coordinates:", lat, lng);
      setMarkerPosition(null);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = {
      clave,
      calle: selectedStreet,
      interseccion: selectedIntersection,
      direccion: textInput1,
      informacion: textInput2,
    };

    const alertData = `
      Clave: ${formData.clave}
      Calle: ${formData.calle}
      Intersección: ${formData.interseccion}
      Dirección: ${formData.direccion}
      Información: ${formData.informacion}
    `;

    alert(`DESPACHO ${alertData}`);

    try {
      const response = await fetch("http://localhost:5000/despacho", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result: DespachoResponse = await response.json();

        console.log("Data successfully sent:", result);
        alert(result.resultado);

        localStorage.setItem("despacho", JSON.stringify(result.despacho));
        localStorage.setItem("emergencyId", result.id);

        setDespacho(result.despacho);
        setEmergencyId(result.id);
      } else {
        console.error("Error sending data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDespachoChange = (
    index: number,
    selectedOption: SelectOption | null
  ): void => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [index]: selectedOption,
    }));
  };

  const handleIntegerChange = (index: number, value: number): void => {
    setIntegerValues((prevState) => ({
      ...prevState,
      [index]: value,
    }));
  };

  const handleDespachoSubmit = async (index: number): Promise<void> => {
    const selectedOption = selectedOptions[index];
    const integerValue = integerValues[index];

    if (
      !selectedOption ||
      integerValue === undefined ||
      Number.isNaN(integerValue)
    ) {
      alert(
        "Selecciona una opción y proporciona un número entero para este despacho"
      );
      return;
    }

    const despachoData = {
      despachoIndex: index,
      selectedId: Number(selectedOption.value) + 1,
      integerValue,
      despacho,
    };

    try {
      const response = await fetch("http://localhost:5000/carros_mando", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(despachoData),
      });

      if (!response.ok) {
        console.error("Error sending despacho item:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    const updatedDespacho = [...despacho];
    updatedDespacho.splice(index, 1);

    setDespacho(updatedDespacho);
    localStorage.setItem("despacho", JSON.stringify(updatedDespacho));
  };

  return (
    <MainLayout
      title="Despacho de Emergencias"
      subtitle="Registro, ubicación y asignación inicial de unidades"
    >
      <div className="dispatch-layout">
        <section className="dispatch-main-card">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            className="dispatch-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> PhoenixSOS'
            />

            <SetMapView position={markerPosition} />

            {markerPosition && (
              <Marker position={markerPosition} icon={flameIcon}>
                <Popup>
                  {selectedStreet} / {selectedIntersection}
                </Popup>
              </Marker>
            )}

            {fixedPins.map((pin, index) => (
              <Marker
                key={index}
                position={[pin.lat, pin.lng]}
                icon={houseIcon}
              >
                <Popup>{pin.name}</Popup>
              </Marker>
            ))}
          </MapContainer>

          <form className="dispatch-form" onSubmit={handleSubmit}>
            <div className="dispatch-row">
              <div>
                <label htmlFor="street-select">Seleccione Calle</label>

                <div className="dispatch-select">
                  <Select
                    id="street-select"
                    options={streets}
                    onChange={(option) =>
                      handleStreetChange(option as SelectOption | null)
                    }
                    isClearable
                    placeholder="SELECCIONE UNA CALLE"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="intersection-select">
                  Seleccione Intersección
                </label>

                <div className="dispatch-select">
                  <Select
                    id="intersection-select"
                    options={intersections}
                    onChange={(option) =>
                      handleIntersectionChange(option as SelectOption | null)
                    }
                    isClearable
                    isDisabled={!selectedStreet}
                    placeholder="SELECCIONE UNA INTERSECCIÓN"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="clave-select">Seleccione Llamado</label>

              <select
                id="clave-select"
                name="selectOption"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              >
                <option value="" disabled>
                  SELECCIONE UNA CLAVE
                </option>

                <optgroup label="Clave 1: Incendio Estructural">
                  <option value="1-1">
                    1-1: INCENDIO ESTRUCTURAL BÁSICO
                  </option>
                  <option value="1-2">
                    1-2: INCENDIO ESTRUCTURAL EN ALTURA
                  </option>
                  <option value="1-3">
                    1-3: INCENDIO ESTRUCTURAL EN LUGAR PÚBLICO O MASIVO
                  </option>
                </optgroup>

                <optgroup label="Clave 2: Incendio Forestal">
                  <option value="2-1">2-1: INCENDIO FORESTAL URBANO</option>
                  <option value="2-2">
                    2-2: INCENDIO FORESTAL DE INTERFASE
                  </option>
                  <option value="2-3">2-3: INCENDIO FORESTAL RURAL</option>
                  <option value="2-4">
                    2-4: INCENDIO EN VERTEDERO, MICRO BASURALES, BASUREROS
                  </option>
                </optgroup>

                <optgroup label="Clave 3: Incendio Vehicular">
                  <option value="3-1">3-1: INCENDIO VEHICULAR MENOR</option>
                  <option value="3-2">3-2: INCENDIO VEHICULAR MAYOR</option>
                  <option value="3-3">
                    3-3: INCENDIO VEHICULAR CON CARGA PELIGROSA
                  </option>
                </optgroup>

                <optgroup label="Clave 4: Materiales Peligrosos">
                  <option value="4-1">4-1: HAZ-MAT DOMICILIARIA</option>
                  <option value="4-2">4-2: HAZ-MAT EN VÍA PÚBLICA</option>
                  <option value="4-3">4-3: HAZ-MAT INDUSTRIAL</option>
                </optgroup>

                <optgroup label="Clave 5: Rescate Vehicular">
                  <option value="5-1">5-1: RESCATE VEHICULAR LIVIANO</option>
                  <option value="5-2">5-2: RESCATE VEHICULAR PESADO</option>
                  <option value="5-3">
                    5-3: RESCATE VEHICULAR CON MATERIALES PELIGROSOS
                  </option>
                  <option value="5-4">
                    5-4: RESCATE AÉREO, FERROVIARIO O DE BLINDADOS
                  </option>
                </optgroup>

                <optgroup label="Clave 6: Rescate">
                  <option value="6-1">
                    6-1: APOYO A SAMU Y/O CARABINEROS
                  </option>
                  <option value="6-2">6-2: PERSONA EXTRAVIADA</option>
                  <option value="6-3">6-3: PERSONA ENCERRADA</option>
                  <option value="6-4">6-4: RESCATE ANIMAL</option>
                  <option value="6-5">6-5: RESCATE EN ALTURA</option>
                  <option value="6-6">
                    6-6: RESCATE EN ESTRUCTURAS COLAPSADAS
                  </option>
                  <option value="6-7">
                    6-7: RESCATE EN ESPACIOS CONFINADOS
                  </option>
                </optgroup>

                <optgroup label="Otros Incidentes">
                  <option value="7-1">9: ACUARTELAMIENTO GENERAL</option>
                  <option value="9-1">9: EMERGENCIA INDUSTRIAL</option>
                  <option value="10-1">
                    10-1: TRASLADO DE BOMBERO ACCIDENTADO
                  </option>
                  <option value="10-2">10-2: ABASTECIMIENTO DE AGUA</option>
                  <option value="10-3">10-3: ABRIR PUERTAS</option>
                  <option value="10-4">10-4: COLOCAR DRIZAS</option>
                  <option value="10-5">
                    10-5: EMERGENCIA CLIMATOLÓGICA
                  </option>
                  <option value="10-6">10-6: VISITA INSPECTIVA</option>
                  <option value="10-8">10-8: SALIDA A TALLER</option>
                  <option value="10-9">
                    10-9: INVESTIGACIÓN DE INCENDIOS
                  </option>
                  <option value="11-1">
                    11: PREVENCIÓN DE EMERGENCIAS ESTRUCTURALES
                  </option>
                  <option value="13-1">13: REBROTE DE INCENDIO</option>
                  <option value="15-1">
                    15: EMERGENCIA NO CLASIFICADA
                  </option>
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
            </div>

            <div className="dispatch-row">
              <div>
                <label htmlFor="text-input1">Dirección Exacta</label>

                <input
                  id="text-input1"
                  type="text"
                  value={textInput1}
                  onChange={(e) => setTextInput1(e.target.value)}
                  placeholder="Ingrese dirección exacta"
                />
              </div>

              <div>
                <label htmlFor="text-input2">Información Adicional</label>

                <input
                  id="text-input2"
                  type="text"
                  value={textInput2}
                  onChange={(e) => setTextInput2(e.target.value)}
                  placeholder="Ingrese información adicional"
                />
              </div>
            </div>

            <button className="dispatch-button" type="submit">
              Despacho
            </button>
          </form>
        </section>

        <aside className="dispatch-side-card">
          <h2 className="dispatch-side-title">Unidades por registrar</h2>

          {despacho.length > 0 ? (
            despacho.map((item, index) => (
              <form
                key={`${item}-${index}`}
                className="dispatch-unit-card"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDespachoSubmit(index);
                }}
              >
                <label>Unidad {item}</label>

                <div className="dispatch-select">
                  <Select
                    value={selectedOptions[index] || null}
                    onChange={(option) =>
                      handleDespachoChange(index, option as SelectOption | null)
                    }
                    options={data2}
                    placeholder="Busca un nombre"
                    isClearable
                  />
                </div>

                <input
                  type="number"
                  placeholder="Cantidad de bomberos"
                  value={integerValues[index] || ""}
                  onChange={(e) =>
                    handleIntegerChange(index, parseInt(e.target.value, 10))
                  }
                />

                <button type="submit" className="btn btn-success">
                  Registrar Despacho
                </button>
              </form>
            ))
          ) : (
            <div className="dispatch-empty">No hay unidades despachadas</div>
          )}

          <Link to={`/emergencia/${emergencyId || ""}`}>
            <button
              type="button"
              className="btn btn-primary last-dispatch-button"
              onClick={() => {
                localStorage.removeItem("emergencyId");
              }}
            >
              Último Despacho
            </button>
          </Link>
        </aside>
      </div>
    </MainLayout>
  );
};

export default Despacho;