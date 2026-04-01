import React, { useState, useEffect } from 'react';

const Sidebar = React.memo(() => {
  const [dataCarro, setDataCarro] = useState([]);
  const [openItemIndex, setOpenItemIndex] = useState(null);

  useEffect(() => {
    const fetchDataCarro = async () => {
      const response = await fetch('/carros.json');
      const result = await response.json();
      setDataCarro(result);
    };

    // Fetch data initially
    fetchDataCarro();

    // Polling every 10 seconds for updates
    const interval = setInterval(fetchDataCarro, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getColorByStatus = (estado) => {
    switch (estado) {
      case 0: return 'green';
      case 1: return 'orange';
      case 2: return 'blue';
      case 3: return 'grey';
      case 4: return 'red';
      default: return 'white';
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
      // Close the section after the button is clicked
      setOpenItemIndex(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dataCarro.map((item, index) => (
          <div key={index} style={{ width: '150px', marginBottom: '2px' }}>
            <div 
              onClick={() => toggleOpenItem(index)}
              style={{
                backgroundColor: getColorByStatus(item.estado),
                color: 'white',
                padding: '20px',
                height: '55px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.carro}</div>
            </div>

            {/* Expanded section with buttons */}
            {openItemIndex === index && (
              <div style={{
                backgroundColor: '#393939',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                marginTop: '5px',
              }}>
                <button onClick={() => handleButtonClick(item.carro, '0')} style={{width: '120px', borderRadius: '5px', cursor: 'pointer'}}>Disponible</button>
                <button onClick={() => handleButtonClick(item.carro, '0')} style={{width: '120px', borderRadius: '5px', cursor: 'pointer'}}>Cuartel</button>
                <button onClick={() => handleButtonClick(item.carro, '4')} style={{width: '120px', borderRadius: '5px', cursor: 'pointer'}}>Fuera</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Sidebar;
