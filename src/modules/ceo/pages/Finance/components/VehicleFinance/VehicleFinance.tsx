import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Space, Spin, Alert, Empty, Statistic, Row, Col } from 'antd';
import { CarOutlined, AreaChartOutlined, DollarOutlined, ToolOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import VehiclesList from './VehiclesList';
import RevenueReport from './RevenueReport';
import ExpensesReport from './ExpensesReport';
import MaintenanceSchedule from './MaintenanceSchedule';
import { useQuery } from '@tanstack/react-query';
import { useCEOCars, useCEOFurgons } from '../../../../api/vehicles';
import { tripApi } from '../../../../api/trip/tripApi';
import { getServices } from '../../../../../accounting/api/maintance/ServiceCreate';

const { TabPane } = Tabs;

// Define types
export interface Vehicle {
  id: string | number;
  name: string;
  model: string;
  licensePlate: string;
  type: string;
  status: string;
  purchaseDate: Date | string;
  lastServiceDate?: Date | string;
  totalRevenue: number;
  totalExpenses: number;
  totalTrips: number;
}

export interface Trip {
  id: string | number;
  vehicleId: string | number;
  driverId: string | number;
  startDate: Date | string;
  endDate?: Date | string;
  origin: string;
  destination: string;
  distance: number;
  status: string;
  revenue: number;
  expenses: number;
  clients: {
    id: number;
    name: string;
  }[];
}

export interface VehicleService {
  id: string | number;
  vehicleId: string | number;
  name: string;
  carModel: string;
  carNumber: string;
  serviceType: string;
  details: string;
  price: number;
  date: string;
  completed: boolean;
  mileage: number;
  carId: number;
}

const VehicleFinance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [services, setServices] = useState<VehicleService[]>([]);
  
  // Fetch vehicles using React Query
  const { data: carsData, isLoading: carsLoading, error: carsError } = useCEOCars();
  const { data: furgonsData, isLoading: furgonsLoading, error: furgonsError } = useCEOFurgons();
  
  // Fetch trips for the vehicles
  const { data: tripsData, isLoading: tripsLoading, error: tripsError } = useQuery({
    queryKey: ['vehicle-trips'],
    queryFn: () => tripApi.getAllTrips({ pageSize: 100 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch trip statistics
  const { data: tripStats, error: statsError } = useQuery({
    queryKey: ['trip-statistics'],
    queryFn: () => tripApi.getTripStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch service data
  const { data: serviceData, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['vehicle-services'],
    queryFn: getServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    const combineData = () => {
      setLoading(true);
      
      try {
        // Process vehicles data (combine cars and furgons)
        const allVehicles: Vehicle[] = [];
        
        // Process cars
        if (carsData && Array.isArray(carsData)) {
          const carVehicles = carsData.map(car => ({
            id: car.id,
            name: car.name || 'Unnamed Car',
            model: car.year || 'Unknown Model',
            licensePlate: car.car_number || car.number || 'No Plate',
            type: 'Car',
            status: car.holat || 'active',
            purchaseDate: new Date().toISOString(),
            lastServiceDate: undefined,
            totalRevenue: 0,
            totalExpenses: 0,
            totalTrips: 0
          }));
          allVehicles.push(...carVehicles);
        }
        
        // Process furgons
        if (furgonsData && Array.isArray(furgonsData)) {
          const furgonVehicles = furgonsData.map(furgon => ({
            id: furgon.id,
            name: furgon.name || 'Unnamed Furgon',
            model: 'Furgon',
            licensePlate: furgon.number || 'No Plate',
            type: 'Furgon',
            status: furgon.is_busy ? 'active' : 'inactive',
            purchaseDate: new Date().toISOString(),
            lastServiceDate: undefined,
            totalRevenue: 0,
            totalExpenses: 0,
            totalTrips: 0
          }));
          allVehicles.push(...furgonVehicles);
        }
        
        // Process trips data
        const processedTrips: Trip[] = [];
        if (tripsData && tripsData.data) {
          processedTrips.push(...tripsData.data.map(trip => ({
            id: trip.id,
            vehicleId: trip.vehicle || 0,
            driverId: trip.driver || 0,
            startDate: trip.start_date || new Date().toISOString(),
            endDate: trip.end_date,
            origin: trip.origin || 'Unknown Origin',
            destination: trip.destination || 'Unknown Destination',
            distance: trip.distance || 0,
            status: trip.status || 'unknown',
            revenue: trip.total_income || 0,
            expenses: trip.total_expense || 0,
            clients: trip.clients || []
          })));
        }
        
        // Process services data
        const processedServices: VehicleService[] = [];
        if (serviceData && Array.isArray(serviceData)) {
          processedServices.push(...serviceData.map(service => ({
            id: service.id || 0,
            vehicleId: service.carId || 0,
            name: service.name || 'Unknown Service',
            carModel: service.carModel || '',
            carNumber: service.carNumber || '',
            serviceType: service.serviceType || 'Maintenance',
            details: service.details || '',
            price: service.price || 0,
            date: service.date || new Date().toISOString(),
            completed: service.completed || false,
            mileage: service.mileage || 0,
            carId: service.carId || 0
          })));
        }
        
        // Calculate revenue, expenses and trips per vehicle
        allVehicles.forEach(vehicle => {
          // Find all trips for this vehicle
          const vehicleTrips = processedTrips.filter(trip => 
            String(trip.vehicleId) === String(vehicle.id)
          );
          
          // Calculate total revenue and expenses from trips
          vehicle.totalTrips = vehicleTrips.length;
          vehicle.totalRevenue = vehicleTrips.reduce((sum, trip) => sum + trip.revenue, 0);
          vehicle.totalExpenses = vehicleTrips.reduce((sum, trip) => sum + trip.expenses, 0);
          
          // Add maintenance expenses
          const vehicleServices = processedServices.filter(service => 
            String(service.vehicleId) === String(vehicle.id) || String(service.carId) === String(vehicle.id)
          );
          
          vehicle.totalExpenses += vehicleServices.reduce((sum, service) => sum + service.price, 0);
          
          // Find the latest service date
          if (vehicleServices.length > 0) {
            const latestService = vehicleServices.reduce((latest, service) => {
              const serviceDate = new Date(service.date);
              const latestDate = latest ? new Date(latest) : new Date(0);
              return serviceDate > latestDate ? service.date : latest;
            }, '');
            
            if (latestService) {
              vehicle.lastServiceDate = latestService;
            }
          }
        });
        
        setVehicles(allVehicles);
        setTrips(processedTrips);
        setServices(processedServices);
        setError(null);
      } catch (err) {
        console.error('Error processing vehicle data:', err);
        setError('Ma\'lumotlarni qayta ishlashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    
    // Check if all data is loaded
    if (!carsLoading && !furgonsLoading && !tripsLoading && !servicesLoading) {
      combineData();
    }
  }, [carsData, furgonsData, tripsData, serviceData, carsLoading, furgonsLoading, tripsLoading, servicesLoading]);
  
  const handleRefresh = () => {
    // React Query will refetch automatically
    window.location.reload();
  };
  
  const isAnyError = carsError || furgonsError || tripsError || servicesError || statsError;
  
  if (loading || carsLoading || furgonsLoading || tripsLoading || servicesLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Spin size="large" />
          <span style={{ color: '#666' }}>Transport ma'lumotlari yuklanmoqda...</span>
        </div>
      </div>
    );
  }
  
  if (error || isAnyError) {
    return (
      <Alert
        message="Xatolik"
        description={error || "Ma'lumotlarni yuklashda xatolik yuz berdi"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="vehicle-finance">
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <div>
          <h2>Transport vositalari moliyasi</h2>
          <p>Transport vositalari, daromadlari va xarajatlari hisoboti</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => console.log('Add vehicle clicked')}
          >
            Yangi transport
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Yangilash
          </Button>
        </Space>
      </Space>
      
      {/* Dashboard summary stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Jami transport vositalari"
              value={vehicles.length}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Jami daromad"
              value={vehicles.reduce((sum, v) => sum + v.totalRevenue, 0)}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Jami xarajat"
              value={vehicles.reduce((sum, v) => sum + v.totalExpenses, 0)}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Jami reyslar"
              value={tripStats?.total_trips || vehicles.reduce((sum, v) => sum + v.totalTrips, 0)}
              prefix={<AreaChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {vehicles.length === 0 && !loading ? (
        <Empty 
          description={
            <span>
              Transport vositalari mavjud emas. Transport vositalarini qo&apos;shish uchun &quot;Yangi transport&quot; tugmasini bosing.
            </span>
          }
        />
      ) : (
        <Card>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={<span><CarOutlined /> Transport vositalari</span>} key="vehicles">
              <VehiclesList vehicles={vehicles} />
        </TabPane>
        
            <TabPane tab={<span><DollarOutlined /> Daromad hisoboti</span>} key="revenue">
              <RevenueReport vehicles={vehicles} trips={trips} />
        </TabPane>
        
            <TabPane tab={<span><AreaChartOutlined /> Xarajatlar hisoboti</span>} key="expenses">
              <ExpensesReport vehicles={vehicles} trips={trips} services={services} />
        </TabPane>
        
            <TabPane tab={<span><ToolOutlined /> Texnik xizmat jadvali</span>} key="maintenance">
              <MaintenanceSchedule vehicles={vehicles} services={services} />
        </TabPane>
      </Tabs>
        </Card>
      )}
    </div>
  );
};

export default VehicleFinance; 