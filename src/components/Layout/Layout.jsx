import React from 'react';
import { BarChart3, Github, ExternalLink } from 'lucide-react';
import './Layout.css';

const Layout = ({ children, summary }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="logo">
            <BarChart3 size={32} className="logo-icon" />
            <h1>Experiment Tracker</h1>
          </div>
          
          {summary && (
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{summary.totalExperiments}</span>
                <span className="stat-label">Experiments</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{summary.uniqueMetrics}</span>
                <span className="stat-label">Metrics</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{summary.totalDataPoints.toLocaleString()}</span>
                <span className="stat-label">Data Points</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="layout-main">
        <div className="main-content">
          {children}
        </div>
      </main>

      <footer className="layout-footer">
        <div className="footer-content">
          <p>&copy; 2025 Experiment Tracker. Built for ML experiment visualization.</p>
          <div className="footer-links">
            <a href="https://github.com/Alex1Go/Tracker-APP" className="footer-link">
              <Github size={16} />
              GitHub
            </a>
            <a href="https://github.com/Alex1Go/Tracker-APP?tab=readme-ov-file#tracker-app" className="footer-link">
              <ExternalLink size={16} />
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;