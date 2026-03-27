import React from 'react';
import { Card, Space, Button } from 'antd';
import { TripFilters } from './TripFilters';
import { ExportDropdown } from './ExportDropdown';

interface TripFilterCardProps {
  searchText: string;
  dateRange: any;
  statusFilter: string;
  vehicleFilter: string;
  setSearchText: (value: string) => void;
  setDateRange: (value: any) => void;
  setStatusFilter: (value: string) => void;
  setVehicleFilter: (value: string) => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExport: (period: string) => void;
}

export const TripFilterCard: React.FC<TripFilterCardProps> = ({
  searchText,
  dateRange,
  statusFilter,
  vehicleFilter,
  setSearchText,
  setDateRange,
  setStatusFilter,
  setVehicleFilter,
  onRefresh,
  isExporting,
  onExport
}) => {
  return (
    <Card 
      className="section-card" 
      title="Filterlash" 
      style={{ marginTop: 16 }}
      extra={
        <Space>
          <Button 
            onClick={onRefresh} 
            type="primary"
          >
            Yangilash
          </Button>
          <ExportDropdown 
            isExporting={isExporting} 
            onExport={onExport} 
          />
        </Space>
      }
    >
      <TripFilters
        searchText={searchText}
        setSearchText={setSearchText}
        dateRange={dateRange}
        setDateRange={setDateRange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        vehicleFilter={vehicleFilter}
        setVehicleFilter={setVehicleFilter}
      />
    </Card>
  );
}; 