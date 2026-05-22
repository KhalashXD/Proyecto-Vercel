import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

interface HistorialData {
  ids: string[];
  texts: string[];
  dates: string[];
}

const Historial: React.FC = () => {
  const [data, setData] = useState<HistorialData>({
    ids: [],
    texts: [],
    dates: [],
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  /*const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:5000/emergenciasHistorial");
      const result: HistorialData = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };*/
  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:5000/emergenciasHistorial");
      const result = await response.json();

      setData({
        ids: result.map((item: any) => item.incident_code),
        texts: result.map(
          (item: any) =>
            `${item.emergency_code} ${item.street_1} con ${item.street_2}`
        ),
        dates: result.map((item: any) => {
          const date = new Date(item.closed_at || item.created_at);

          return date.toLocaleString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNavigate = (id: string): void => {
    navigate(`/emergenciasActivas/${id}`);
  };

  const handlePageChange = (pageNumber: number): void => {
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
                          ? "var(--primary)"
                          : "#1d1f27",
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