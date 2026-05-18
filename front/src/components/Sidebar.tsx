import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";

type EstadoCarro = 0 | 1 | 2 | 3 | 4;

interface Carro {
  carro: number;
  estado: EstadoCarro;
  x: number;
  y: number;
  calle: string;
  interseccion: string;
}

const Sidebar: React.FC = React.memo(() => {
  const [dataCarro, setDataCarro] = useState<Carro[]>([]);
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchDataCarro = async (): Promise<void> => {
      try {
        const response = await fetch("/carros.json");
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

  const getColorByStatus = (estado: EstadoCarro): string => {
    switch (estado) {
      case 0:
        return "#078b16";
      case 1:
        return "#f4a300";
      case 2:
        return "#2f80ed";
      case 3:
        return "#6f6f6f";
      case 4:
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
          <div key={item.carro}>
            <div
              onClick={() => toggleOpenItem(index)}
              className="sidebar-unit"
              style={{ backgroundColor: getColorByStatus(item.estado) }}
            >
              {item.carro}
            </div>

            {openItemIndex === index && (
              <div className="sidebar-actions">
                <button
                  type="button"
                  className="btn-disponible"
                  onClick={() => handleButtonClick(item.carro, "0")}
                >
                  Disponible
                </button>

                <button
                  type="button"
                  className="btn-cuartel"
                  onClick={() => handleButtonClick(item.carro, "2")}
                >
                  Cuartel
                </button>

                <button
                  type="button"
                  className="btn-fuera"
                  onClick={() => handleButtonClick(item.carro, "4")}
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
          <span className="sidebar-dot" style={{ background: "#2f80ed" }} />
          En cuartel
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: "#6f6f6f" }} />
          Sin estado
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