import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Brush
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Download, 
  Maximize2, 
  Grid3X3,
  Eye,
  EyeOff
} from 'lucide-react';
import './MetricsChart.css';

const MetricsChart = ({ chartData, selectedExperiments, experiments }) => {
  const [expandedChart, setExpandedChart] = useState(null);
  const [hiddenExperiments, setHiddenExperiments] = useState(new Set());
  const [smoothLines, setSmoothLines] = useState(true);
  const [showDataPoints, setShowDataPoints] = useState(false);

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', 
    '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb',
    '#dda0dd', '#98fb98', '#f0e68c', '#ffa07a'
  ];

  const visibleExperiments = useMemo(() => 
    selectedExperiments.filter(exp => !hiddenExperiments.has(exp)),
    [selectedExperiments, hiddenExperiments]
  );

  const toggleExperimentVisibility = (experimentId) => {
    const newHidden = new Set(hiddenExperiments);
    if (newHidden.has(experimentId)) {
      newHidden.delete(experimentId);
    } else {
      newHidden.add(experimentId);
    }
    setHiddenExperiments(newHidden);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">Step: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              <span className="tooltip-name">{entry.dataKey}:</span>
              <span className="tooltip-value">{entry.value?.toFixed(4) || 'N/A'}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const downloadChartData = (metricName) => {
    const data = chartData[metricName];
    const csv = [
      ['step', ...visibleExperiments].join(','),
      ...data.map(row => [
        row.step,
        ...visibleExperiments.map(exp => row[exp] ?? '')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metricName}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricStats = (metricName) => {
    const data = chartData[metricName];
    const stats = {};
    
    visibleExperiments.forEach(exp => {
      const values = data.map(d => d[exp]).filter(v => v !== null && v !== undefined);
      if (values.length > 0) {
        stats[exp] = {
          min: Math.min(...values),
          max: Math.max(...values),
          final: values[values.length - 1],
          trend: values.length > 1 ? values[values.length - 1] - values[0] : 0
        };
      }
    });
    
    return stats;
  };

  if (!Object.keys(chartData).length) {
    return (
      <div className="metrics-chart">
        <div className="no-data">
          <BarChart3 size={64} className="no-data-icon" />
          <h3>Select experiments to view metrics</h3>
          <p>Choose one or more experiments from the list above to visualize their metrics</p>
          <div className="no-data-tips">
            <h4>💡 Visualization Tips:</h4>
            <ul>
              <li>Select multiple experiments to compare performance</li>
              <li>Use filters to find specific experiments</li>
              <li>Charts will automatically scale to show all data</li>
              <li>Hover over data points for detailed values</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-chart">
      <div className="chart-header">
        <div className="header-title">
          <h2>
            <TrendingUp size={20} />
            Metrics Visualization
          </h2>
          <p>Interactive charts showing experiment metrics over training steps</p>
        </div>
        
        <div className="chart-controls">
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={smoothLines}
                onChange={(e) => setSmoothLines(e.target.checked)}
              />
              Smooth lines
            </label>
            <label>
              <input
                type="checkbox"
                checked={showDataPoints}
                onChange={(e) => setShowDataPoints(e.target.checked)}
              />
              Show data points
            </label>
          </div>
          
          <div className="view-controls">
            <button
              className={`view-btn ${!expandedChart ? 'active' : ''}`}
              onClick={() => setExpandedChart(null)}
              title="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {selectedExperiments.length > 0 && (
        <div className="experiment-legend">
          <h4>Experiments:</h4>
          <div className="legend-items">
            {selectedExperiments.map((exp, index) => (
              <div key={exp} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className={`legend-label ${hiddenExperiments.has(exp) ? 'hidden' : ''}`}>
                  {exp}
                </span>
                <button
                  className="visibility-btn"
                  onClick={() => toggleExperimentVisibility(exp)}
                  title={hiddenExperiments.has(exp) ? 'Show' : 'Hide'}
                >
                  {hiddenExperiments.has(exp) ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`charts-container ${expandedChart ? 'expanded' : ''}`}>
        {Object.entries(chartData).map(([metricName, data]) => {
          const stats = getMetricStats(metricName);
          const isExpanded = expandedChart === metricName;
          
          return (
            <div 
              key={metricName} 
              className={`chart-card ${isExpanded ? 'expanded-card' : ''}`}
            >
              <div className="chart-card-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">{metricName}</h3>
                  <div className="chart-stats">
                    {Object.entries(stats).map(([exp, stat]) => (
                      <div key={exp} className="stat-summary">
                        <span className="stat-exp">{exp}:</span>
                        <span className="stat-value">
                          Final: {stat.final.toFixed(4)}
                        </span>
                        <span className={`stat-trend ${stat.trend >= 0 ? 'positive' : 'negative'}`}>
                          {stat.trend >= 0 ? '↗' : '↘'} {Math.abs(stat.trend).toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="chart-actions">
                  <button
                    className="action-btn"
                    onClick={() => downloadChartData(metricName)}
                    title="Download CSV"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setExpandedChart(isExpanded ? null : metricName)}
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={isExpanded ? 500 : 300}>
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#f0f0f0" 
                      opacity={0.7}
                    />
                    <XAxis 
                      dataKey="step" 
                      stroke="#666"
                      fontSize={12}
                      tick={{ fill: '#666' }}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                      tick={{ fill: '#666' }}
                      tickFormatter={(value) => value.toFixed(3)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    {visibleExperiments.map((expId, index) => (
                      <Line
                        key={expId}
                        type={smoothLines ? "monotone" : "linear"}
                        dataKey={expId}
                        stroke={colors[selectedExperiments.indexOf(expId) % colors.length]}
                        strokeWidth={2}
                        dot={showDataPoints ? { r: 3, strokeWidth: 1 } : false}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        connectNulls={false}
                        name={expId}
                      />
                    ))}
                    {isExpanded && (
                      <Brush
                        dataKey="step"
                        height={30}
                        stroke="#4CAF50"
                        fill="rgba(76, 175, 80, 0.1)"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsChart;