import React, { useState, useMemo } from 'react';
import { Typography, Card, message } from 'antd';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useRays } from '../../hooks/useRays';
import { TripData } from '../../hooks/useTrips';
import TripsList from './components/TripsList';
import TripStatsSummary from './components/TripStatsSummary';
import TripDetailsModal from './components/TripDetailsModal';
import TripSearch from './components/TripSearch';
import dayjs from 'dayjs';

const { Title } = Typography;

const TripsPage: React.FC = () => {
  // State for selected trip and modal visibility
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  // Get all trip data from the hooks
  const {
    activeTrips: allActiveTrips,
    historyTrips: allHistoryTrips,
    activeTripsCount,
    historyTripsCount,
    isLoading,
    error,
    completeTrip,
    isCompletingTrip,
    reactivateTrip,
    isReactivatingTrip
  } = useRays();
  
  // Search filter state
  const [filters, setFilters] = useState({
    searchText: '',
    dateRange: null as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    status: 'all'
  });
  
  // Function to filter trips based on search criteria
  const filterTrips = (trips: TripData[]) => {
    return trips.filter(trip => {
      // Search text filter
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        const driverName = (trip.driver?.fullname || '').toLowerCase();
        const vehicleInfo = `${trip.car?.name || ''} ${trip.car?.number || ''}`.toLowerCase();
        const clientName = trip.client && trip.client.length > 0
          ? `${trip.client[0]?.first_name || ''} ${trip.client[0]?.last_name || ''}`.toLowerCase()
          : '';
        const locations = `${trip.from1 || ''} ${trip.to_go || ''}`.toLowerCase();
        const id = String(trip.id);
        
        if (
          !driverName.includes(searchText) &&
          !vehicleInfo.includes(searchText) &&
          !clientName.includes(searchText) &&
          !locations.includes(searchText) &&
          !id.includes(searchText)
        ) {
          return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const startDate = dayjs(trip.created_at);
        if (
          !startDate.isAfter(filters.dateRange[0], 'day') ||
          !startDate.isBefore(filters.dateRange[1], 'day')
        ) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Apply filters to trips
  const filteredActiveTrips = useMemo(() => 
    filterTrips(allActiveTrips), 
    [allActiveTrips, filters]
  );
  
  const filteredHistoryTrips = useMemo(() => 
    filterTrips(allHistoryTrips), 
    [allHistoryTrips, filters]
  );
  
  // Handle search submission
  const handleSearch = (values: any) => {
    setFilters(values);
  };
  
  // Handle search reset
  const handleResetSearch = () => {
    setFilters({
      searchText: '',
      dateRange: null,
      status: 'all'
    });
  };
  
  // Trip details functions
  const handleViewDetails = (trip: TripData) => {
    setSelectedTrip(trip);
    setDetailsVisible(true);
  };
  
  const handleCloseDetails = () => {
    setDetailsVisible(false);
  };
  
  // Handle complete trip
  const handleCompleteTrip = (id: number) => {
    completeTrip(id, {
      onSuccess: () => {
        message.success('Reys muvaffaqiyatli yakunlandi');
      },
      onError: () => {
        message.error('Reysni yakunlashda xatolik yuz berdi');
      }
    });
  };
  
  // Handle reactivate trip
  const handleReactivateTrip = (id: number) => {
    reactivateTrip(id, {
      onSuccess: () => {
        message.success('Reys muvaffaqiyatli faollashtirildi');
      },
      onError: () => {
        message.error('Reysni faollashtirishda xatolik yuz berdi');
      }
    });
  };
  
  if (error) {
    message.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
  }
  
  return (
    <DashboardLayout>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        <Title level={2}>Reyslar boshqaruvi</Title>
        <TripSearch 
          onSearch={handleSearch} 
          onReset={handleResetSearch} 
          loading={isLoading} 
        />
        
        <TripStatsSummary 
          activeTripsCount={activeTripsCount}
          historyTripsCount={historyTripsCount}
        />
        
        <Card style={{ marginTop: '1rem' }}>
          <TripsList
            activeTrips={filteredActiveTrips}
            historyTrips={filteredHistoryTrips}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onCompleteTrip={handleCompleteTrip}
            onReactivateTrip={handleReactivateTrip}
            isCompletingTrip={isCompletingTrip}
            isReactivatingTrip={isReactivatingTrip}
          />
        </Card>
        
        <TripDetailsModal
          visible={detailsVisible}
          trip={selectedTrip}
          onClose={handleCloseDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default TripsPage; 