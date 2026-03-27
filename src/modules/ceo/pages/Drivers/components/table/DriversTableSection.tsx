import React from 'react';
import { Card } from 'antd';
import { DriverType } from '../../../../../accounting/types/driver';
import DriversTable from './DriversTable';
import DriversTableFilters from './DriversTableFilters';

interface DriversTableSectionProps {
  drivers: DriverType[];
  loading: boolean;
  total: number;
  searchText: string;
  filters: {
    page?: number;
    pageSize?: number;
    status?: string;
  };
  onSearch: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onAddDriver: () => void;
  onViewDriver: (driver: DriverType) => void;
  onEditDriver: (driver: DriverType) => void;
  onDeleteDriver: (driver: DriverType) => void;
}

const DriversTableSection: React.FC<DriversTableSectionProps> = ({
  drivers,
  loading,
  total,
  searchText,
  filters,
  onSearch,
  onStatusChange,
  onTableChange,
  onAddDriver,
  onViewDriver,
  onEditDriver,
  onDeleteDriver,
}) => {
  return (
    <div className="drivers-table-container">
      <DriversTableFilters
        searchText={searchText}
        statusFilter={filters.status}
        onSearch={onSearch}
        onStatusChange={onStatusChange}
        onAddDriver={onAddDriver}
      />

      <Card className="drivers-table-card">
        <DriversTable
          drivers={drivers}
          loading={loading}
          pagination={{
            current: filters.page || 1,
            pageSize: filters.pageSize || 10,
            total: total,
            onChange: (page) => onTableChange({ current: page }, {}, {}),
          }}
          onTableChange={onTableChange}
          onViewDriver={onViewDriver}
          onEditDriver={onEditDriver}
          onDeleteDriver={onDeleteDriver}
        />
      </Card>
    </div>
  );
};

export default DriversTableSection; 