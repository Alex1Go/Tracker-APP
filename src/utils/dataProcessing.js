import _ from 'lodash';

export const processExperimentData = (csvData) => {
  const experimentGroups = _.groupBy(csvData, 'experiment_id');
  
  const experiments = Object.keys(experimentGroups).map(experimentId => {
    const experimentData = experimentGroups[experimentId];
    const metricGroups = _.groupBy(experimentData, 'metric_name');
    
    const totalSteps = Math.max(...experimentData.map(d => parseInt(d.step) || 0));
    const uniqueMetrics = Object.keys(metricGroups);
    const totalDataPoints = experimentData.length;
    
    const processedMetrics = {};
    uniqueMetrics.forEach(metricName => {
      processedMetrics[metricName] = metricGroups[metricName]
        .map(point => ({
          step: parseInt(point.step),
          value: parseFloat(point.value)
        }))
        .filter(point => !isNaN(point.step) && !isNaN(point.value))
        .sort((a, b) => a.step - b.step);
    });

    return {
      id: experimentId,
      metrics: uniqueMetrics,
      data: processedMetrics,
      totalSteps,
      totalDataPoints,
      createdAt: new Date().toISOString()
    };
  });

  return experiments.sort((a, b) => a.id.localeCompare(b.id));
};

export const prepareChartData = (selectedExperiments, experiments) => {
  if (!selectedExperiments.length || !experiments.length) {
    return {};
  }

  const allMetrics = new Set();
  selectedExperiments.forEach(expId => {
    const experiment = experiments.find(e => e.id === expId);
    if (experiment) {
      experiment.metrics.forEach(metric => allMetrics.add(metric));
    }
  });

  const chartData = {};
  
  allMetrics.forEach(metricName => {
    const allSteps = new Set();
    
    selectedExperiments.forEach(expId => {
      const experiment = experiments.find(e => e.id === expId);
      if (experiment && experiment.data[metricName]) {
        experiment.data[metricName].forEach(point => {
          allSteps.add(point.step);
        });
      }
    });

    const sortedSteps = Array.from(allSteps).sort((a, b) => a - b);
    
    const metricChartData = sortedSteps.map(step => {
      const dataPoint = { step };
      
      selectedExperiments.forEach(expId => {
        const experiment = experiments.find(e => e.id === expId);
        if (experiment && experiment.data[metricName]) {
          const point = experiment.data[metricName].find(p => p.step === step);
          dataPoint[expId] = point ? point.value : null;
        } else {
          dataPoint[expId] = null;
        }
      });
      
      return dataPoint;
    });

    chartData[metricName] = metricChartData;
  });

  return chartData;
};

export const getExperimentSummary = (experiments) => {
  if (!experiments.length) return null;

  const totalExperiments = experiments.length;
  const allMetrics = new Set();
  let totalDataPoints = 0;
  let maxSteps = 0;

  experiments.forEach(exp => {
    exp.metrics.forEach(metric => allMetrics.add(metric));
    totalDataPoints += exp.totalDataPoints;
    maxSteps = Math.max(maxSteps, exp.totalSteps);
  });

  return {
    totalExperiments,
    uniqueMetrics: allMetrics.size,
    totalDataPoints,
    maxSteps,
    metricsNames: Array.from(allMetrics)
  };
};

export const exportSelectedData = (selectedExperiments, experiments) => {
  const exportData = selectedExperiments.map(expId => {
    const experiment = experiments.find(e => e.id === expId);
    return {
      experiment_id: experiment.id,
      metrics: experiment.metrics,
      total_steps: experiment.totalSteps,
      data_points: experiment.totalDataPoints
    };
  });

  return exportData;
};