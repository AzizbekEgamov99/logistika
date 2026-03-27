'use client';
import React from 'react';
import DriverSalaryManager from './components/DriverSalaryManager';
import './styles/DriverSalaryManager.css';
const DriverSalaryPage: React.FC = () => {
  return (
    <div className="driver-salary-page">
      <DriverSalaryManager />
    </div>
  );
};

export default DriverSalaryPage; 