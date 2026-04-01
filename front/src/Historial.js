import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Authentication from './Authentication';
import Sidebar from './Sidebar';
import './Historial.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const Historial = () => {
    const [data, setData] = useState({ ids: [], texts: [], dates: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Número de elementos por página
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

    // Calcular los elementos a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.ids.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(data.ids.length / itemsPerPage);

    return (
        <div>
            <Authentication />
            <div className="d-flex">
                <div className="sidebar">
                    <h3>Estado Carros</h3>
                    <Sidebar />
                </div>
                <div className="p-4 flex-grow-1">
                    <h2 className="text-white text-center">Historial de Emergencias</h2>
                    <table className="table table-dark table-striped mt-4">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Llamado</th>
                            <th scope="col">Ir</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((id, index) => (
                            <tr key={id}>
                                <td>{data.dates[indexOfFirstItem + index]}</td>
                                <td>{data.texts[indexOfFirstItem + index]}</td>
                                <td>
                                    <button
                                        onClick={() => handleNavigate(id)}
                                        className="btn btn-outline-primary"
                                    >
                                        <img
                                            src="/fire-extinguisher.png"
                                            alt="Go to Emergencias"
                                            className="icon"
                                            style={{ width: '25px', height: '25px' }}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination d-flex justify-content-center mt-3">
                        {[...Array(totalPages)].map((_, pageIndex) => (
                            <button
                                key={pageIndex}
                                onClick={() => handlePageChange(pageIndex + 1)}
                                className={`btn btn-sm ${
                                    currentPage === pageIndex + 1
                                        ? 'btn-primary'
                                        : 'btn-outline-secondary'
                                } mx-1`}
                            >
                                {pageIndex + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Historial;
