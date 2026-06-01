import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { abrirReporte } from "../api/reportService";
import "../styles/Prueba.css";

interface MultiSectionToggleProps {
  eventId?: string | number | null;
}

interface FormProps {
  eventId?: string | number | null;
  switchToTabA: () => void;
}

interface SelectOption {
  value: string | number;
  label: string;
}

interface Vehicle {
  id: number;
  vehicle_code: string;
  vehicle_type: string;
  station_name: string;
  status: string;
}

type IncidentActionType =
  | "A_evaluacion_incidente"
  | "A_nueva_clave"
  | "A_instrucciones"
  | "A_comandante"
  | "A_externos"
  | "A_informacion"
  | "A_victimas";

const registrarAccionEmergencia = async (
  incidentCode: string | undefined,
  eventType: IncidentActionType,
  description: string,
  emergencyCode?: string
): Promise<void> => {
  if (!incidentCode) {
    throw new Error("No se encontró el código de la emergencia");
  }

  const response = await fetch(
    `http://localhost:5000/emergenciasActivas/${incidentCode}/acciones`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: eventType,
        description,
        user_name: "system",
        emergency_code: emergencyCode,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

const MultiSectionToggle: React.FC<MultiSectionToggleProps> = ({ eventId }) => {
  const { id } = useParams<{ id: string }>();

  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [dataE, setDataE] = useState<any[] | null>(null);
  const [dataA, setDataA] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"info" | "actions">("info");

  const switchToTabA = (): void => {
    setActiveTab("info");
    setActiveSection(null);
  };

  const formatFecha = (value: string): string => {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatHora = (value: string): string => {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const sections = [
    { id: 1, label: "Unidades", content: <Form1 eventId={eventId} switchToTabA={switchToTabA} /> },
    { id: 2, label: "Evaluación", content: <Form2 switchToTabA={switchToTabA} /> },
    { id: 3, label: "Clave", content: <Form3 switchToTabA={switchToTabA} /> },
    { id: 4, label: "Instrucciones", content: <Form4 eventId={eventId} switchToTabA={switchToTabA} /> },
    { id: 5, label: "Superación", content: <Form5 switchToTabA={switchToTabA} /> },
    { id: 6, label: "Comandante", content: <Form6 switchToTabA={switchToTabA} /> },
    { id: 7, label: "Externos", content: <Form7 switchToTabA={switchToTabA} /> },
    { id: 8, label: "Información", content: <Form8 switchToTabA={switchToTabA} /> },
    { id: 9, label: "Víctimas", content: <Form9 switchToTabA={switchToTabA} /> },
  ];

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/emergenciasActivas/${id}`);
      const data = await response.json();

      setDataE([
        data.emergency.code,
        data.location.street_1,
        data.location.street_2,
        data.status
      ]);

      setDataA([
        ...data.timeline.map((event: any) => [
          formatFecha(event.created_at),
          formatHora(event.created_at),
          event.tipo,
          event.description
          
        ])
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching emergency data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "info") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title={`Clave ${dataE?.[0] || ""} ${dataE?.[1] || ""} / ${dataE?.[2] || ""}`}
      subtitle={dataE?.[3] || ""}
    >
      <section className="incident-card">
        <div className="report-actions">
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => abrirReporte(`/reportes/emergencias/${id}.pdf`)}
          >
            Descargar PDF
          </button>

          <button
            type="button"
            className="app-btn app-btn-dark"
            onClick={() => abrirReporte(`/reportes/emergencias/${id}.xlsx`)}
          >
            Descargar Excel
          </button>
        </div>

        <div className="incident-tabs">
          <button
            type="button"
            className={`incident-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Información
          </button>

          <button
            type="button"
            className={`incident-tab ${activeTab === "actions" ? "active" : ""}`}
            onClick={() => setActiveTab("actions")}
          >
            Acciones
          </button>
        </div>

        {activeTab === "info" && (
          <div>
            <h2>Cronología</h2>

            {dataA && dataA.length > 0 ? (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                    {dataA.map((accion, index) => (
                      <tr key={index}>
                        <td>{accion[0]}</td>
                        <td>{accion[1]}</td>
                        <td>{accion[2]}</td>
                        <td>{accion[3]}</td>
                        
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

        {activeTab === "actions" && (
          <div>
            <h2>Acciones</h2>

            <div className="action-grid">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`action-chip ${activeSection === section.id ? "active" : ""}`}
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

const Form1: React.FC<FormProps> = ({ eventId, switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [carrosActivos, setCarrosActivos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [carrosDisponibles, setCarrosDisponibles] = useState<Vehicle[]>([]);
  const [selectedDespacho, setSelectedDespacho] = useState<number[]>([]);
  const [despacho, setDespacho] = useState<string[]>([]);
  const [acciones, setAcciones] = useState<any[]>([]);
  const [data2, setData2] = useState<SelectOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, SelectOption | null>>({});
  const [integerValues, setIntegerValues] = useState<Record<number, number>>({});

  const cargarDisponibles = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:5000/vehiculos/disponibles"
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar las unidades disponibles");
      }

      const data = await response.json();
      setCarrosDisponibles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarActivos = async (): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:5000/emergenciasActivas/${id}`
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar las unidades despachadas");
      }

      const data = await response.json();
      setCarrosActivos(data.assigned_vehicles || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData: Array<{ id: string; nombre: string }>) => {
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
    const savedDespacho = localStorage.getItem("despacho");
    const savedAcciones = localStorage.getItem("acciones");

    if (savedDespacho && savedAcciones) {
      setDespacho(JSON.parse(savedDespacho));
      setAcciones(JSON.parse(savedAcciones));
    }
  }, []);

  useEffect(() => {
    cargarActivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, eventId]);


  useEffect(() => {
    cargarDisponibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert("Selecciona al menos una unidad despachada");
      return;
    }

    try {
      for (const vehicleId of selectedItems) {
        const response = await fetch(
          `http://localhost:5000/emergenciasActivas/${id}/vehiculos/${vehicleId}/estado`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "red",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo confirmar una de las unidades");
        }
      }

      setSelectedItems([]);
      await cargarActivos();
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudieron confirmar todas las unidades seleccionadas");
      await cargarActivos();
    }
  };


  const handleSubmit2 = async (
        e: React.FormEvent<HTMLFormElement>
      ): Promise<void> => {
        e.preventDefault();

        if (selectedDespacho.length === 0) {
          alert("Selecciona al menos una unidad antes de despachar");
          return;
        }

        try {
          for (const vehicleId of selectedDespacho) {
            const response = await fetch(
              `http://localhost:5000/emergenciasActivas/${id}/vehiculos`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  vehicle_id: vehicleId,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("No se pudo despachar una de las unidades");
            }
          }

          setSelectedDespacho([]);
          await cargarDisponibles();
          await cargarActivos();
          switchToTabA();
        } catch (error) {
          console.error(error);
          alert("No se pudieron despachar todas las unidades seleccionadas");
          await cargarDisponibles();
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

    if (!selectedOption || integerValue === undefined || Number.isNaN(integerValue)) {
      alert("Selecciona una opción y proporciona un número entero para este despacho");
      return;
    }

    const despachoData = {
      despachoIndex: index,
      selectedId: Number(selectedOption.value) + 1,
      integerValue,
      despacho,
      acciones,
      id,
    };

    try {
      const response = await fetch("http://localhost:5000/carros_mando2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const updatedAcciones = [...acciones];
    updatedAcciones.splice(index, 1);

    setDespacho(updatedDespacho);
    setAcciones(updatedAcciones);

    localStorage.setItem("despacho", JSON.stringify(updatedDespacho));
    localStorage.setItem("acciones", JSON.stringify(updatedAcciones));
  };

  const toggleSelection = (vehicleId: number): void => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(vehicleId)
        ? prevSelected.filter((id) => id !== vehicleId)
        : [...prevSelected, vehicleId]
    );
  };


    const toggleSelection2 = (vehicleId: number): void => {
    setSelectedDespacho((prevSelected) =>
      prevSelected.includes(vehicleId)
        ? prevSelected.filter((id) => id !== vehicleId)
        : [...prevSelected, vehicleId]
    );
  };

  if (loading) {
    return <p>Cargando información...</p>;
  }

  const unidadesEnEmergencia = carrosActivos.filter(
    (vehicle) => vehicle.status === "red"
  );

  const unidadesDespachadas = carrosActivos.filter(
    (vehicle) => vehicle.status === "yellow"
  );

  return (
    <div className="wrapper-carros">
      <div className="emergencia-column">
        <h2>Unidades en la Emergencia</h2>

        <div className="action-grid">
          {unidadesEnEmergencia.length > 0 ? (
            unidadesEnEmergencia.map((vehicle) => (
              <span
                key={vehicle.id}
                className="action-chip emergency-vehicle"
              >
                {vehicle.vehicle_code}
              </span>
            ))
          ) : (
            <p>No hay unidades confirmadas</p>
          )}
        </div>
      </div>

      <div className="activos-column">
        <h2>Unidades despachadas</h2>

        <form onSubmit={handleSubmit}>
          <div className="action-grid">
            {unidadesDespachadas.length > 0 ? (
              unidadesDespachadas.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => {
                    toggleSelection(vehicle.id);
                  }}
                  className={`action-chip dispatched-vehicle status-${vehicle.status} ${
                    selectedItems.includes(vehicle.id) ? "active" : ""
                  }`}
                >
                  {vehicle.vehicle_code}
                </button>
              ))
            ) : (
              <p>No hay unidades pendientes de confirmación</p>
            )}
          </div>

          {unidadesDespachadas.length > 0 && (
            <button type="submit" className="app-btn app-btn-primary">
              Confirmar llegada
            </button>
          )}
        </form>
      </div>

      <div className="disponibles-columna">
        <h2>Unidades disponibles</h2>

        <form onSubmit={handleSubmit2}>
          <div className="action-grid">

            {carrosDisponibles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => {
                  toggleSelection2(vehicle.id);
                }}
                className={`action-chip available-vehicle ${
                  selectedDespacho.includes(vehicle.id) ? "active" : ""
                }`}
              >
                {vehicle.vehicle_code}
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
              key={`${item}-${index}`}
              onSubmit={(e) => {
                e.preventDefault();
                handleDespachoSubmit(index);
              }}
            >
              <label>Unidad {item}</label>

              <Select
                value={selectedOptions[index] || null}
                onChange={(option) =>
                  handleDespachoChange(index, option as SelectOption | null)
                }
                options={data2}
                placeholder="Busca un nombre"
                isClearable
              />

              <input
                type="number"
                placeholder="Ingrese cantidad de bomberos"
                value={integerValues[index] || ""}
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

const Form2: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [evalu, setEval] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!evalu.trim()) {
      alert("Ingresa una evaluación");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_evaluacion_incidente",
        evalu.trim()
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la evaluación");
    }
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

    </div>
  );
};

const Form3: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [clave, setClave] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!clave) {
      alert("Selecciona una nueva clave");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_nueva_clave",
        `Clave de emergencia actualizada a ${clave}`,
        clave
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la clave");
    }
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
            <option value="7-1">7-1: ACUARTELAMIENTO GENERAL</option>
            <option value="9-1">9-1: EMERGENCIA INDUSTRIAL</option>
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
        </select>
      </label>

      <button type="submit" className="app-btn app-btn-primary">
        Confirmar
      </button>
    </form>
  );
};

const Form4: React.FC<FormProps> = ({ eventId, switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [carrosActivos, setCarrosActivos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    fetch(`http://localhost:5000/emergenciasActivas/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCarrosActivos(
          (data.assigned_vehicles || []).map(
            (vehicle: Vehicle) => vehicle.vehicle_code
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
        setLoading(false);
      });
  }, [id, eventId]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (selectedItems.length === 0 || !inputText.trim()) {
      alert("Selecciona unidades e ingresa una instrucción");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_instrucciones",
        `Unidades ${selectedItems.join(", ")}: ${inputText.trim()}`
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la instrucción");
    }
  };

  const toggleSelection = (item: string): void => {
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
            className={`action-chip ${activeSection === item ? "active" : ""}`}
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

const Form5: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [superado, setSuperado] = useState<number>(0);

  const handleToggle = (): void => {
    setSuperado((prevNumber) => (prevNumber === 0 ? 1 : 0));
  };

  const handleSubmit = async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        await fetch(
          `http://localhost:5000/emergenciasActivas/${id}/estado`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "closed"
            }),
          }
        );

        alert("Incidente cerrado correctamente");

        window.location.href =
          "/EmergenciasActivas";

      } catch (error) {

        console.error(error);

        alert("Error al cerrar incidente");
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Superación de incidente</h3>

      <button
        type="button"
        onClick={() => {
          handleToggle();
        }}
        className={`action-chip ${superado === 1 ? "active" : ""}`}
      >
        Superado
      </button>

      <button type="submit" className="app-btn app-btn-primary">
        Confirmar
      </button>
    </form>
  );
};

const Form6: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData: Array<{ id: string; nombre: string }>) => {
        const options = jsonData.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));

        setOptions(options);
      })
      .catch((error) => {
        console.error("Error al cargar el JSON:", error);
      });
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!selectedOption) {
      alert("Selecciona un comandante de incidentes.");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_comandante",
        `Comandante de incidentes asignado: ${selectedOption.label}`
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar el comandante");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cambio del Comandante de Incidentes</h3>

      <label>
        Seleccione:
        <Select
          value={selectedOption || null}
          onChange={(option) => setSelectedOption(option as SelectOption | null)}
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

const Form7: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [externos, setExternos] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!externos) {
      alert("Selecciona un recurso externo");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_externos",
        `Recurso externo solicitado: ${externos}`
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar el recurso externo");
    }
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

const Form8: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [info, setInfo] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!info.trim()) {
      alert("Ingresa información");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_informacion",
        info.trim()
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la información");
    }
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

const Form9: React.FC<FormProps> = ({ switchToTabA }) => {
  const { id } = useParams<{ id: string }>();

  const [info, setInfo] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!info.trim()) {
      alert("Ingresa información de víctimas");
      return;
    }

    try {
      await registrarAccionEmergencia(
        id,
        "A_victimas",
        info.trim()
      );
      switchToTabA();
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la información de víctimas");
    }
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
