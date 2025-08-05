import { useState, useCallback, useMemo } from 'react';
import { parseCSVFile, validateCSVStructure } from '../utils/csvParser';
import { processExperimentData, prepareChartData, getExperimentSummary } from '../utils/dataProcessing';

export const useExperimentData = () => {
  const [rawData, setRawData] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiments, setSelectedExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const csvData = await parseCSVFile(file);
      validateCSVStructure(csvData);
      
      setRawData(csvData);
      const processedExperiments = processExperimentData(csvData);
      setExperiments(processedExperiments);
      setSelectedExperiments([]);
      
    } catch (err) {
      setError(err.message);
      console.error('Error processing file:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExperimentSelection = useCallback((experimentIds) => {
    setSelectedExperiments(experimentIds);
  }, []);

  const toggleExperimentSelection = useCallback((experimentId) => {
    setSelectedExperiments(prev => 
      prev.includes(experimentId)
        ? prev.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  }, []);

  const selectAllExperiments = useCallback(() => {
    setSelectedExperiments(experiments.map(exp => exp.id));
  }, [experiments]);

  const clearSelection = useCallback(() => {
    setSelectedExperiments([]);
  }, []);

  const chartData = useMemo(() => 
    prepareChartData(selectedExperiments, experiments),
    [selectedExperiments, experiments]
  );

  const summary = useMemo(() => 
    getExperimentSummary(experiments),
    [experiments]
  );

  const selectedExperimentsData = useMemo(() => 
    experiments.filter(exp => selectedExperiments.includes(exp.id)),
    [experiments, selectedExperiments]
  );

  const resetData = useCallback(() => {
    setRawData([]);
    setExperiments([]);
    setSelectedExperiments([]);
    setError(null);
  }, []);

  return {
    // Data
    rawData,
    experiments,
    selectedExperiments,
    selectedExperimentsData,
    chartData,
    summary,
    
    // State
    isLoading,
    error,
    
    // Actions
    handleFileUpload,
    handleExperimentSelection,
    toggleExperimentSelection,
    selectAllExperiments,
    clearSelection,
    resetData,
    
    // Computed
    hasData: experiments.length > 0,
    hasSelection: selectedExperiments.length > 0
  };
};