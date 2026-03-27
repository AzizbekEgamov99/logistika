# CEO Module Hooks

This folder contains hooks for the CEO module that utilize data from the accounting module. These hooks are designed to provide ready-to-use data and calculations for CEO dashboards and reports.

## Available Hooks

### 1. `useCEOCars`

Provides car data with calculations for fleet utilization and status breakdowns.

```tsx
import { useCEOCars } from '../hooks/useCEOCars';

const { 
  cars,                       // All cars
  isLoading,                  // Loading state
  statusData,                 // Status summary data
  inRaysCars,                 // Cars currently in use
  availableCars,              // Available cars
  inRaysCount,                // Count of cars in use
  availableCount,             // Count of available cars
  totalCars,                  // Total cars count
  carsInUsePercentage,        // Percentage of cars in use
  availableCarsPercentage,    // Percentage of available cars
  carsInMaintenance,          // Cars in maintenance
  carsInMaintenancePercentage, // Percentage of cars in maintenance
  getCarsByStatus             // Function to get cars by status
} = useCEOCars();
```

### 2. `useCEODrivers`

Provides driver data with calculations for driver status and availability.

```tsx
import { useCEODrivers } from '../hooks/useCEODrivers';

const {
  drivers,                    // All drivers
  total,                      // Total drivers count
  isLoading,                  // Loading state
  activeDrivers,              // Active drivers
  activeDriversCount,         // Count of active drivers
  inactiveDriversCount,       // Count of inactive drivers
  activeDriversPercentage,    // Percentage of active drivers
  driversOnTrip,              // Drivers currently on trips
  driversOnTripCount,         // Count of drivers on trips
  driversOnTripPercentage,    // Percentage of drivers on trips
  availableDrivers,           // Available drivers (active but not on trip)
  availableDriversCount,      // Count of available drivers
  availableDriversPercentage  // Percentage of available drivers
} = useCEODrivers();
```

### 3. `useCEOFurgons`

Provides furgon (truck) data with calculations for utilization and status breakdowns.

```tsx
import { useCEOFurgons } from '../hooks/useCEOFurgons';

const {
  furgons,                    // All furgons
  isLoading,                  // Loading state
  statusData,                 // Status summary data
  inRaysFurgons,              // Furgons currently in use
  availableFurgons,           // Available furgons
  inRaysCount,                // Count of furgons in use
  availableCount,             // Count of available furgons
  totalFurgons,               // Total furgons count
  furgonsInUsePercentage,     // Percentage of furgons in use
  availableFurgonsPercentage, // Percentage of available furgons
  furgonsInMaintenance,       // Furgons in maintenance
  furgonsInMaintenancePercentage, // Percentage of furgons in maintenance
  getFurgonsByStatus          // Function to get furgons by status
} = useCEOFurgons();
```

### 4. `useCEOTrips`

Provides trip data with calculations for trip status and completion rates.

```tsx
import { useCEOTrips } from '../hooks/useCEOTrips';

const {
  trips,                     // All trips
  isLoading,                 // Loading state
  totalTrips,                // Total trips count
  activeTrips,               // Active trips
  activeTripsCount,          // Count of active trips
  completedTrips,            // Completed trips
  completedTripsCount,       // Count of completed trips
  tripCompletionRate,        // Trip completion rate (percentage)
  activeRays,                // Active rays
  activeRaysCount,           // Count of active rays
  averageTripDuration        // Average trip duration in days
} = useCEOTrips();
```

### 5. `useCEOClients`

Provides client data with analysis of client activity.

```tsx
import { useCEOClients } from '../hooks/useCEOClients';

const {
  clients,                   // All clients
  isLoading,                 // Loading state
  totalClients,              // Total clients count
  activeClients,             // Active clients (with active trips)
  activeClientsCount,        // Count of active clients
  activeClientsPercentage,   // Percentage of active clients
  topClients,                // Top clients by trip count
  clientsWithCompletedTrips, // Clients with completed trips
  clientsWithCompletedTripsCount, // Count of clients with completed trips
  getClientsByTripCount      // Function to get clients sorted by trip count
} = useCEOClients();
```

## Usage Example

```tsx
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useCEOCars } from '../hooks/useCEOCars';
import { useCEODrivers } from '../hooks/useCEODrivers';

const FleetOverview = () => {
  const { totalCars, carsInUsePercentage, availableCarsPercentage } = useCEOCars();
  const { activeDriversCount, driversOnTripCount } = useCEODrivers();

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic title="Jami transport" value={totalCars} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Foydalanishda" value={`${Math.round(carsInUsePercentage)}%`} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Aktiv haydovchilar" value={activeDriversCount} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Reysda haydovchilar" value={driversOnTripCount} />
        </Card>
      </Col>
    </Row>
  );
};

export default FleetOverview;
``` 