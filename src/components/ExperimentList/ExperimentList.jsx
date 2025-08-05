import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './ExperimentList.css';

const ExperimentList = ({ 
  experiments, 
  selectedExperiments, 
  onSelectionChange,
  onExperimentToggle 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterByMetrics, setFilterByMetrics] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedExperiments = useMemo(() => {
    let filtered = experiments.filter(exp => {
      const matchesSearch = exp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMetrics = !filterByMetrics || 
        exp.metrics.some(metric => 
          metric.toLowerCase().includes(filterByMetrics.toLowerCase())
        );
      return matchesSearch && matchesMetrics;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'metrics':
          comparison = a.metrics.length - b.metrics.length;
          break;
        case 'steps':
          comparison = a.totalSteps - b.totalSteps;
          break;
        case 'dataPoints':
          comparison = a.totalDataPoints - b.totalDataPoints;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [experiments, searchTerm, sortBy, sortOrder, filterByMetrics]);

  const handleExperimentToggle = (experimentId) => {
    onExperimentToggle(experimentId);
  };

  const selectAll = () => {
    onSelectionChange(filteredAndSortedExperiments.map(exp => exp.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const allMetrics = useMemo(() => {
    const metricsSet = new Set();
    experiments.forEach(exp => {
      exp.metrics.forEach(metric => metricsSet.add(metric));
    });
    return Array.from(metricsSet).sort();
  }, [experiments]);

  if (!experiments.length) return null;

  return (
    <div className="experiment-list">
      <div className="list-header">
        <div className="header-title">
          <h2>
            <FileText size={20} />
            Experiments ({filteredAndSortedExperiments.length}/{experiments.length})
          </h2>
          <p>Select experiments to visualize their metrics</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={selectAll} className="btn-secondary">
            Select All ({filteredAndSortedExperiments.length})
          </button>
          <button onClick={clearAll} className="btn-secondary">
            Clear All
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search experiments by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterByMetrics}
              onChange={(e) => setFilterByMetrics(e.target.value)}
              className="metric-filter"
            >
              <option value="">All metrics</option>
              {allMetrics.map(metric => (
                <option key={metric} value={metric}>{metric}</option>
              ))}
            </select>

            <div className="sort-controls">
              <label>Sort by:</label>
              <button
                className={`sort-btn ${sortBy === 'id' ? 'active' : ''}`}
                onClick={() => toggleSort('id')}
              >
                ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                className={`sort-btn ${sortBy === 'metrics' ? 'active' : ''}`}
                onClick={() => toggleSort('metrics')}
              >
                Metrics {sortBy === 'metrics' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                className={`sort-btn ${sortBy === 'steps' ? 'active' : ''}`}
                onClick={() => toggleSort('steps')}
              >
                Steps {sortBy === 'steps' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="selection-summary">
        {selectedExperiments.length > 0 && (
          <div className="selected-info">
            <CheckCircle size={16} className="selected-icon" />
            <span>
              {selectedExperiments.length} experiment{selectedExperiments.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>
      
      <div className="experiments-grid">
        {filteredAndSortedExperiments.map(experiment => (
          <ExperimentCard
            key={experiment.id}
            experiment={experiment}
            isSelected={selectedExperiments.includes(experiment.id)}
            onToggle={handleExperimentToggle}
          />
        ))}
      </div>

      {filteredAndSortedExperiments.length === 0 && experiments.length > 0 && (
        <div className="no-results">
          <Search size={48} className="no-results-icon" />
          <h3>No experiments found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

const ExperimentCard = ({ experiment, isSelected, onToggle }) => {
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  const displayedMetrics = showAllMetrics 
    ? experiment.metrics 
    : experiment.metrics.slice(0, 4);

  return (
    <div
      className={`experiment-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(experiment.id)}
    >
      <div className="card-header">
        <div className="experiment-title">
          {isSelected && <CheckCircle size={16} className="check-icon" />}
          <span className="experiment-id">{experiment.id}</span>
        </div>
        <div className="selection-indicator">
          <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
            {isSelected && <CheckCircle size={12} />}
          </div>
        </div>
      </div>

      <div className="card-stats">
        <div className="stat-row">
          <div className="stat">
            <TrendingUp size={14} />
            <span>{experiment.metrics.length} metrics</span>
          </div>
          <div className="stat">
            <BarChart3 size={14} />
            <span>{experiment.totalSteps} steps</span>
          </div>
        </div>
        <div className="stat">
          <span className="data-points">
            {experiment.totalDataPoints.toLocaleString()} data points
          </span>
        </div>
      </div>

      <div className="metrics-section">
        <h4>Metrics:</h4>
        <div className="metrics-list">
          {displayedMetrics.map(metric => (
            <span key={metric} className="metric-tag">{metric}</span>
          ))}
          {experiment.metrics.length > 4 && (
            <button
              className="show-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllMetrics(!showAllMetrics);
              }}
            >
              {showAllMetrics 
                ? 'Show less' 
                : `+${experiment.metrics.length - 4} more`
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentList;