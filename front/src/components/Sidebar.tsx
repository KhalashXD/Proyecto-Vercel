import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";

type VehicleStatus = "green" | "yellow" | "red";

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

  useEffect(() => {
    const fetchDataCarro = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:5000/vehiculos");
        const result: Carro[] = await response.json();
        setDataCarro(result);
      } catch (error) {
        console.error("Error fetching carros:", error);
      }
    };

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

      default:
        return "#ffffff";
    }
  };

  const toggleOpenItem = (index: number): void => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  const handleButtonClick = async (
    carro: number,
    button: string
  ): Promise<void> => {
    try {
      await fetch("/estado-carro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carro, button }),
      });

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
                <button
                  type="button"
                  className="btn-disponible"
                  onClick={() => handleButtonClick(item.id, "0")}
                >
                  Disponible
                </button>

                <button
                  type="button"
                  className="btn-cuartel"
                  onClick={() => handleButtonClick(item.id, "2")}
                >
                  Cuartel
                </button>

                <button
                  type="button"
                  className="btn-fuera"
                  onClick={() => handleButtonClick(item.id, "4")}
                >
                  Fuera
                </button>
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
          Fuera
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
