import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';

const Emergencias = () => {
  const [data, setData] = useState({ ids: [], texts: [], dates: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/emergencias');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNavigate = (id) => {
    navigate(`/emergencia/${id}`);
  };

  return (
    <MainLayout
      title="Emergencias Activas"
      subtitle="Monitoreo de incidentes actualmente en curso"
    >
      <section className="content-card">
        {data.ids.length > 0 ? (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Llamado</th>
                  <th>Modificar</th>
                </tr>
              </thead>

              <tbody>
                {data.ids.map((id, index) => (
                  <tr key={id}>
                    <td>{data.dates[index]}</td>
                    <td>{data.texts[index]}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleNavigate(id)}
                        className="app-btn app-btn-primary"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            No hay emergencias activas en este momento.
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Emergencias;