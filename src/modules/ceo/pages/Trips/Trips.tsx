'use client'
import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { TripDetails } from './components/TripDetails' 
import { TripStatistics } from './components/TripStatistics'
import { TripFilterCard } from './components/TripFilterCard'
import { TripTableSection } from './components/TripTableSection'
import { PopularRoutes } from './components/PopularRoutes'
import { useTripData, useTripsFilters, useTripsExport } from './hooks'

export const TripsPage = () => {
  // Use custom hooks to separate concerns
  const { 
    trips, 
    filteredTrips, 
    displayTrips,
    loading, 
    statistics,
    fetchTrips,
    updateDisplayTrips
  } = useTripData();

  const {
    searchText,
    dateRange,
    statusFilter,
    vehicleFilter,
    setSearchText,
    setDateRange,
    setStatusFilter,
    setVehicleFilter,
    currentPage,
    pageSize,
    handlePaginationChange
  } = useTripsFilters(trips, filteredTrips, updateDisplayTrips);

  const { 
    isExporting, 
    exportToExcel 
  } = useTripsExport(dateRange);

  // Function to show trip details
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const showTripDetails = (record) => {
    setSelectedTrip(record);
    setDetailVisible(true);
  };

  // Load trips when component mounts
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <DashboardLayout
      title="Reyslar tarixi"
      subtitle="Barcha reyslar ro'yxati va ma'lumotlari"
    >
      <div className="trips-dashboard">
        <TripStatistics
          totalTrips={statistics.totalTrips}
          totalRevenue={statistics.totalRevenue}
          totalExpense={statistics.totalExpense}
          totalProfit={statistics.totalProfit}
          avgDistance={statistics.avgDistance}
        />

        <TripFilterCard
          searchText={searchText}
          dateRange={dateRange}
          statusFilter={statusFilter}
          vehicleFilter={vehicleFilter}
          setSearchText={setSearchText}
          setDateRange={setDateRange}
          setStatusFilter={setStatusFilter}
          setVehicleFilter={setVehicleFilter}
          onRefresh={fetchTrips}
          isExporting={isExporting}
          onExport={exportToExcel}
        />

        <TripTableSection
          displayTrips={displayTrips}
          loading={loading}
          onViewTrip={showTripDetails}
          currentPage={currentPage}
          pageSize={pageSize}
          totalTrips={filteredTrips.length}
          onPaginationChange={handlePaginationChange}
        />

        {/* Popular Routes */}
        <PopularRoutes 
          trips={trips}
          loading={loading}
        />

        <TripDetails
          trip={selectedTrip}
          visible={detailVisible}
          onClose={() => setDetailVisible(false)}
        />
      </div>
    </DashboardLayout>
  )
} 