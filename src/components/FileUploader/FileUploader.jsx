import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import './FileUploader.css';

const FileUploader = ({ onFileUpload, isLoading, error, hasData, onReset }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const file = files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        return;
      }
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  }, [isLoading]);

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset?.();
  }, [onReset]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-uploader">
      <div className="uploader-header">
        <h2>📁 Upload Experiment Data</h2>
        <p>Load your CSV file containing experiment logs to start analysis</p>
      </div>

      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isLoading ? 'loading' : ''} ${hasData ? 'has-data' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          disabled={isLoading}
          style={{ display: 'none' }}
        />

        {isLoading ? (
          <div className="upload-content loading-state">
            <div className="spinner"></div>
            <h3>Processing file...</h3>
            <p>Parsing and analyzing your experiment data</p>
          </div>
        ) : hasData && !error ? (
          <div className="upload-content success-state">
            <CheckCircle size={48} className="success-icon" />
            <h3>File uploaded successfully!</h3>
            {uploadedFile && (
              <div className="file-info">
                <FileText size={16} />
                <span>{uploadedFile.name}</span>
                <span className="file-size">({formatFileSize(uploadedFile.size)})</span>
              </div>
            )}
            <button className="reset-button" onClick={handleReset}>
              <X size={16} />
              Upload different file
            </button>
          </div>
        ) : (
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <h3>Drop your CSV file here</h3>
            <p>or click to browse your computer</p>
            <div className="file-requirements">
              <div className="requirement">
                <CheckCircle size={14} />
                <span>CSV format with headers</span>
              </div>
              <div className="requirement">
                <CheckCircle size={14} />
                <span>Required columns: experiment_id, metric_name, step, value</span>
              </div>
              <div className="requirement">
                <CheckCircle size={14} />
                <span>Maximum file size: 100MB</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <div className="error-content">
            <h4>Upload Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="upload-tips">
        <h4>💡 Tips for better results:</h4>
        <ul>
          <li>Ensure your CSV has consistent column names</li>
          <li>Remove any empty rows or invalid data</li>
          <li>Use numeric values for step and value columns</li>
          <li>Keep experiment_id and metric_name as strings</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;