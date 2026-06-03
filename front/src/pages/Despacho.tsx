import React, { useState, useEffect } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer as LeafletTileLayer,
  Marker as LeafletMarker,
  Popup,
  useMap,
} from "react-leaflet";
import Select from "react-select";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/Despacho.css";
import MainLayout from "../components/MainLayout";
import { playDispatchAlert } from "../utils/playDispatchAlert";

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

interface Coordinates {
  x: number[];
  y: number[];
}

interface DespachoResponse {
  resultado: string;
  despacho: string[];
  id: string;
  required_personnel: number;
}

interface DispatchConfirmation {
  incidentCode: string;
  clave: string;
  calle: string;
  interseccion: string;
  direccion: string;
  informacion: string;
  vehicles: string[];
  requiredPersonnel: number;
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
  const [dispatchConfirmation, setDispatchConfirmation] =
    useState<DispatchConfirmation | null>(null);

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
      latitude: markerPosition?.[0] ?? null,
      longitude: markerPosition?.[1] ?? null,
    };

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

        setDispatchConfirmation({
          incidentCode: result.id,
          clave: formData.clave,
          calle: formData.calle,
          interseccion: formData.interseccion,
          direccion: formData.direccion,
          informacion: formData.informacion,
          vehicles: result.despacho,
          requiredPersonnel: result.required_personnel,
        });

        await playDispatchAlert(result.despacho);
      } else {
        console.error("Error sending data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

                <optgroup label="Incendio Declarado">
                    <option value="X-1">X-1: INCENDIO DECLARADO</option>
                </optgroup>

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
                  <option value="7-1">7-1: ACUARTELAMIENTO GENERAL</option>
                  <option value="9-1">9-1: EMERGENCIA INDUSTRIAL</option>
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
                    11-1: PREVENCIÓN DE EMERGENCIAS ESTRUCTURALES
                  </option>
                  <option value="13-1">13: REBROTE DE INCENDIO</option>
                  <option value="15-1">
                    15-1: EMERGENCIA NO CLASIFICADA
                  </option>
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

      </div>

      {dispatchConfirmation && (
        <div className="dispatch-confirmation-backdrop">
          <section
            className="dispatch-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dispatch-confirmation-title"
          >
            <div className="dispatch-confirmation-header">
              <span>Despacho generado</span>
              <h2 id="dispatch-confirmation-title">
                {dispatchConfirmation.incidentCode}
              </h2>
            </div>

            <dl className="dispatch-confirmation-details">
              <div>
                <dt>Clave</dt>
                <dd>{dispatchConfirmation.clave}</dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>
                  {dispatchConfirmation.calle} con{" "}
                  {dispatchConfirmation.interseccion}
                </dd>
              </div>
              <div>
                <dt>Dirección exacta</dt>
                <dd>{dispatchConfirmation.direccion || "Sin información"}</dd>
              </div>
              <div>
                <dt>Información adicional</dt>
                <dd>{dispatchConfirmation.informacion || "Sin información"}</dd>
              </div>
            </dl>

            <div className="dispatch-confirmation-summary">
              <div>
                <span>Personal requerido</span>
                <strong>{dispatchConfirmation.requiredPersonnel}</strong>
              </div>

              <div>
                <span>Unidades despachadas</span>
                <div className="dispatch-confirmation-units">
                  {dispatchConfirmation.vehicles.length > 0 ? (
                    dispatchConfirmation.vehicles.map((vehicle) => (
                      <b key={vehicle}>{vehicle}</b>
                    ))
                  ) : (
                    <em>No se asignaron unidades disponibles</em>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="dispatch-confirmation-ok"
              onClick={() => setDispatchConfirmation(null)}
            >
              OK
            </button>
          </section>
        </div>
      )}
    </MainLayout>
  );
};

export default Despacho;
