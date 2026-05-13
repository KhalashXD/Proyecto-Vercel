import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';

const Historial = () => {
  const [data, setData] = useState({ ids: [], texts: [], dates: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/historial');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNavigate = (id) => {
    navigate(`/emergencia/${id}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.ids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.ids.length / itemsPerPage);

  return (
    <MainLayout
      title="Historial de Emergencias"
      subtitle="Consulta y revisión de emergencias registradas"
    >
      <section className="content-card">
        {currentItems.length > 0 ? (
          <>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Llamado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((id, index) => (
                    <tr key={id}>
                      <td>{data.dates[indexOfFirstItem + index]}</td>
                      <td>{data.texts[indexOfFirstItem + index]}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleNavigate(id)}
                          className="app-btn app-btn-primary"
                        >
                          Ver emergencia
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination-row">
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    type="button"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    className="app-btn app-btn-dark"
                    style={{
                      background:
                        currentPage === pageIndex + 1
                          ? 'var(--primary)'
                          : '#1d1f27',
                    }}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            No hay registros en el historial.
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Historial;