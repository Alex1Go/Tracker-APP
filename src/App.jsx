import React from 'react';
import Layout from './components/Layout/Layout';
import FileUploader from './components/FileUploader/FileUploader';
import ExperimentList from './components/ExperimentList/ExperimentList';
import MetricsChart from './components/MetricsChart/MetricsChart';
import { useExperimentData } from './hooks/useExperimentData';
import './App.css';

function App() {
  const {
    experiments,
    selectedExperiments,
    chartData,
    summary,
    isLoading,
    error,
    hasData,
    hasSelection,
    handleFileUpload,
    handleExperimentSelection,
    toggleExperimentSelection,
    selectAllExperiments,
    clearSelection,
    resetData
  } = useExperimentData();

  return (
    <div className="App">
      <Layout summary={summary}>
        <div className="app-content">
          <FileUploader
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            error={error}
            hasData={hasData}
            onReset={resetData}
          />
          
          {hasData && (
            <>
              <ExperimentList
                experiments={experiments}
                selectedExperiments={selectedExperiments}
                onSelectionChange={handleExperimentSelection}
                onExperimentToggle={toggleExperimentSelection}
              />
              
              <MetricsChart
                chartData={chartData}
                selectedExperiments={selectedExperiments}
                experiments={experiments}
              />
            </>
          )}
          
          {!hasData && !isLoading && !error && (
            <div className="welcome-section">
              <div className="welcome-content">
                <h2>🚀 Welcome to Experiment Tracker</h2>
                <p>
                  A powerful tool for visualizing and comparing machine learning experiment results.
                  Upload your CSV file to get started with interactive charts and detailed analysis.
                </p>
                
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Interactive Charts</h3>
                    <p>Visualize metrics with responsive line charts, zoom functionality, and custom tooltips</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Compare Experiments</h3>
                    <p>Select multiple experiments to compare performance side-by-side</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">📁</div>
                    <h3>Easy Upload</h3>
                    <p>Drag & drop CSV files or click to browse. Automatic data validation included</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Fast Processing</h3>
                    <p>Handle large datasets efficiently with optimized parsing and rendering</p>
                  </div>
                </div>
                
                <div className="data-format-info">
                  <h3>Expected CSV Format:</h3>
                  <div className="format-example">
                    <code>
                      experiment_id,metric_name,step,value<br/>
                      exp_001,accuracy,1,0.85<br/>
                      exp_001,loss,1,0.32<br/>
                      exp_002,accuracy,1,0.82<br/>
                      ...
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;