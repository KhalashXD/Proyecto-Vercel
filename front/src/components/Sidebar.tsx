import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";

type VehicleStatus = "green" | "yellow" | "red" | "blue" | "gray";

interface Carro {
  id: number;
  vehicle_code: string;
  status: VehicleStatus;
  station: {
    latitude: number;
    longitude: number;
  };
}

const Sidebar: React.FC = React.memo(() => {
  const [dataCarro, setDataCarro] = useState<Carro[]>([]);
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  const fetchDataCarro = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:5000/vehiculos");
      const result: Carro[] = await response.json();
      setDataCarro(result);
    } catch (error) {
      console.error("Error fetching carros:", error);
    }
  };

  useEffect(() => {
    fetchDataCarro();

    const interval = window.setInterval(fetchDataCarro, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const getColorByStatus = (status: VehicleStatus): string => {
    switch (status) {
      case "green":
        return "#078b16";

      case "yellow":
        return "#f4a300";

      case "red":
        return "#d84b4b";

      case "blue":
        return "#2f80ed";

      case "gray":
        return "#6f6f6f";

      default:
        return "#ffffff";
    }
  };

  const toggleOpenItem = (index: number): void => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  const handleButtonClick = async (
    carro: number,
    status: VehicleStatus
  ): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/vehiculos/${carro}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del carro");
      }

      await fetchDataCarro();
      setOpenItemIndex(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <div className="sidebar-grid">
        {dataCarro.map((item, index) => (
          <div key={item.vehicle_code}>
            <div
              onClick={() => toggleOpenItem(index)}
              className="sidebar-unit"
              style={{ backgroundColor: getColorByStatus(item.status) }}
            >
              {item.vehicle_code}
            </div>

            {openItemIndex === index && (
              <div className="sidebar-actions">
                {(item.status === "blue" || item.status === "gray") && (
                  <button
                    type="button"
                    className="btn-disponible"
                    onClick={() => handleButtonClick(item.id, "green")}
                  >
                    Confirmar en cuartel
                  </button>
                )}

                {(item.status === "green" || item.status === "blue") && (
                  <button
                    type="button"
                    className="btn-no-disponible"
                    onClick={() => handleButtonClick(item.id, "gray")}
                  >
                    No disponible
                  </button>
                )}

                {(item.status === "yellow" || item.status === "red") && (
                  <span className="sidebar-action-note">
                    Estado gestionado desde la emergencia
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-legend">
        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: "#078b16" }} />
          Disponible
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: "#f4a300" }} />
          Despachado
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: "#d84b4b" }} />
          En emergencia
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: "#2f80ed" }} />
          Regreso pendiente
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: "#6f6f6f" }} />
          No disponible
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
