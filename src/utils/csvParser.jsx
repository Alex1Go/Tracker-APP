import Papa from 'papaparse';

export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        
        const cleanedData = results.data.map(row => {
          const cleanedRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim();
            cleanedRow[cleanKey] = row[key];
          });
          return cleanedRow;
        }).filter(row => 
          row.experiment_id && 
          row.metric_name && 
          row.step && 
          row.value
        );

        resolve(cleanedData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const validateCSVStructure = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('CSV file is empty or invalid');
  }

  const requiredColumns = ['experiment_id', 'metric_name', 'step', 'value'];
  const firstRow = data[0];
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return true;
};