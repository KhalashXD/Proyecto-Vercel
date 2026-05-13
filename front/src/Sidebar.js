import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = React.memo(() => {
  const [dataCarro, setDataCarro] = useState([]);
  const [openItemIndex, setOpenItemIndex] = useState(null);

  useEffect(() => {
    const fetchDataCarro = async () => {
      try {
        const response = await fetch('/carros.json');
        const result = await response.json();
        setDataCarro(result);
      } catch (error) {
        console.error('Error fetching carros:', error);
      }
    };

    fetchDataCarro();

    const interval = setInterval(fetchDataCarro, 10000);

    return () => clearInterval(interval);
  }, []);

  const getColorByStatus = (estado) => {
    switch (estado) {
      case 0:
        return '#078b16'; // Disponible
      case 1:
        return '#f4a300'; // Despachado / En proceso
      case 2:
        return '#2f80ed'; // En cuartel
      case 3:
        return '#6f6f6f'; // No disponible / Sin estado
      case 4:
        return '#d84b4b'; // Fuera
      default:
        return '#ffffff';
    }
  };

  const toggleOpenItem = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  const handleButtonClick = async (carro, button) => {
    try {
      await fetch('/estado-carro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carro, button }),
      });

      setOpenItemIndex(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <div className="sidebar-grid">
        {dataCarro.map((item, index) => (
          <div key={index}>
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
                  onClick={() => handleButtonClick(item.carro, '0')}
                >
                  Disponible
                </button>

                <button
                  type="button"
                  className="btn-cuartel"
                  onClick={() => handleButtonClick(item.carro, '2')}
                >
                  Cuartel
                </button>

                <button
                  type="button"
                  className="btn-fuera"
                  onClick={() => handleButtonClick(item.carro, '4')}
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
          <span className="sidebar-dot" style={{ background: '#078b16' }} />
          Disponible
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: '#f4a300' }} />
          Despachado
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: '#2f80ed' }} />
          En cuartel
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: '#6f6f6f' }} />
          Sin estado
        </div>

        <div className="sidebar-legend-item">
          <span className="sidebar-dot" style={{ background: '#d84b4b' }} />
          Fuera
        </div>
      </div>
    </div>
  );
});

export default Sidebar;