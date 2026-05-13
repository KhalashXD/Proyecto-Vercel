import React from 'react';
import Authentication from './Authentication';
import Sidebar from './Sidebar';

const MainLayout = ({ title, subtitle, children }) => {
  return (
    <div className="app-shell">
      <Authentication />

      <div className="page-layout">
        <aside className="page-sidebar">
          <h3>Estado<br />Carros</h3>
          <Sidebar />
        </aside>

        <main className="page-content">
          {(title || subtitle) && (
            <div className="page-header">
              <div>
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;