import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Authentication from './Authentication';
import Sidebar from './Sidebar';
import './Emergencias.css';  

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
      <div>
        <Authentication/>
        <div className='wrapper3'>
          <div className='sidebar estado-carros'>
            <h3>Estado Carros</h3>
            <Sidebar />
          </div>
          <div className="content">
              <h2 style={{color: 'white'}}>Emergencias activas</h2>
              <table className="emergencias-table">
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
                                <button onClick={() => handleNavigate(id)} className="navigate-button">
                                  <img src="/fire-extinguisher.png" alt="Go to Emergencias" className="icon" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    );
};

export default Emergencias;
