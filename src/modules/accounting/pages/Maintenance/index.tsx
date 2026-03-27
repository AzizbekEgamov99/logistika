import React from 'react';
import { Layout, Typography, Tabs, Spin, Alert } from 'antd';
import {
  DashboardOutlined, ToolOutlined, CarOutlined, ExperimentOutlined,
  SettingOutlined, TruckOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import ServiceDashboard from './components/ServiceDashboard';
import SimpleServiceList from './components/SimpleServiceList';
import ServiceAdd from './components/services/ServiceAdd';
import ServiceList from './components/services/ServiceList';
import OptolAdd from './components/optol/OptolAdd';
import OptolList from './components/optol/OptolList';
import BalonAdd from './components/balon/BalonAdd';
import BalonList from './components/balon/BalonList';
import BalonFurgonAdd from './components/balonfurgon/BalonFurgonAdd';
import BalonFurgonList from './components/balonfurgon/BalonFurgonList';
import TehnicalServiceAdd from './components/tehnical/TehnicalServiceAdd';
import TehnicalServiceList from './components/tehnical/TehnicalServiceList';
import { useServiceManagement } from './hooks/useServiceManagement';
import { useOptolManagement } from './hooks/useOptolManagement';
import { useBalonManagement } from './hooks/useBalonManagement';
import { useBalonFurgonManagement } from './hooks/useBalonFurgonManagement';
import { useTehnicalServiceManagement } from './hooks/useTehnicalServiceManagement';
import type { TabsProps } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const styles = {
  maintenancePage: {
    background: '#f5f5f5',
    borderRadius: '8px',
    minHeight: '100%',
    padding: '20px'
  },
  maintenanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0'
  },
  maintenanceTitle: {
    margin: '0 !important',
    display: 'flex',
    alignItems: 'center'
  },
  titleIcon: {
    fontSize: '24px',
    color: '#1677ff',
    marginRight: '12px'
  },
  tab: {
    padding: '12px 20px'
  },
  serviceSection: {
    marginTop: '20px'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '48px'
  }
};

export const MaintenancePage: React.FC = () => {
  const {
    services,
    isLoading: servicesLoading,
    isError: servicesError,
    addService,
    deleteService,
    updateService,
  } = useServiceManagement();

  const {
    optolServices,
    isLoading: optolLoading,
    isError: optolError,
    addOptolService,
    updateOptolService,
    deleteOptolService,
    completeOptolService,
  } = useOptolManagement();

  const {
    balonServices,
    isLoading: balonLoading,
    isError: balonError,
    addBalonService,
    updateBalonService,
    deleteBalonService,
  } = useBalonManagement();

  const {
    balonFurgonServices,
    isLoading: balonFurgonLoading,
    isError: balonFurgonError,
    addBalonFurgonService,
    updateBalonFurgonService,
    deleteBalonFurgonService,
  } = useBalonFurgonManagement();

  const {
    tehnicalServices,
    isLoading: tehnicalLoading,
    isError: tehnicalError,
    addTehnicalService,
    updateTehnicalService,
    deleteTehnicalService,
  } = useTehnicalServiceManagement();

  const isLoading = servicesLoading || optolLoading || balonLoading || balonFurgonLoading || tehnicalLoading;
  const hasError = servicesError || optolError || balonError || balonFurgonError || tehnicalError;

  const items: TabsProps['items'] = [

    {
      key: 'dashboard',
      label: (
        <span style={styles.tab}>
          <DashboardOutlined /> Dashboard
        </span>
      ),
      children: <ServiceDashboard />,
    },
    {
      key: 'services',
      label: (
        <span style={styles.tab}>
          <ToolOutlined /> Xizmatlar
        </span>
      ),
      children: (
        <div style={styles.serviceSection}>
          <ServiceAdd addService={addService} />
          <ServiceList
            services={services}
            deleteService={deleteService}
            updateService={updateService}
          />
        </div>
      ),
    },
    {
      key: 'optol',
      label: (
        <span style={styles.tab}>
          <ExperimentOutlined /> Moy xizmati
        </span>
      ),
      children: (
        <div style={styles.serviceSection}>
          <OptolAdd addOptolService={addOptolService} />
          <OptolList
            optolServices={optolServices}
            updateOptolService={updateOptolService}
            deleteOptolService={deleteOptolService}
            completeOptolService={completeOptolService}
          />
        </div>
      ),
    },
    {
      key: 'balon',
      label: (
        <span style={styles.tab}>
          <CarOutlined /> Balon xizmati
        </span>
      ),
      children: (
        <div style={styles.serviceSection}>
          <BalonAdd addBalonService={addBalonService} />
          <BalonList
            balonServices={balonServices}
            updateBalonService={updateBalonService}
            deleteBalonService={deleteBalonService}
          />
        </div>
      ),
    },
    {
      key: 'balonfurgon',
      label: (
        <span style={styles.tab}>
          <TruckOutlined /> Furgon balon xizmati
        </span>
      ),
      children: (
        <div style={styles.serviceSection}>
          <BalonFurgonAdd addBalonFurgonService={addBalonFurgonService} />
          <BalonFurgonList
            balonFurgonServices={balonFurgonServices}
            updateBalonFurgonService={updateBalonFurgonService}
            deleteBalonFurgonService={deleteBalonFurgonService}
          />
        </div>
      ),
    }, {
      key: 'all-services',
      label: (
        <span style={styles.tab}>
          <UnorderedListOutlined /> Barcha xizmatlar
        </span>
      ),
      children: <SimpleServiceList />,
    },
    {
      key: 'tehnical',
      label: (
        <span style={styles.tab}>
          <SettingOutlined /> Texnik xizmat
        </span>
      ),
      children: (
        <div style={styles.serviceSection}>
          <TehnicalServiceAdd addTehnicalService={addTehnicalService} />
          <TehnicalServiceList
            tehnicalServices={tehnicalServices}
            updateTehnicalService={updateTehnicalService}
            deleteTehnicalService={deleteTehnicalService}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout style={styles.maintenancePage}>
      <Content>
        <div style={styles.maintenanceHeader}>
          <Title level={4} style={styles.maintenanceTitle}>
            <ToolOutlined style={styles.titleIcon} /> Texnik xizmat ko`rsatish
          </Title>
        </div>

        {isLoading ? (
          <div style={styles.loadingContainer}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Ma`lumotlar yuklanmoqda...</div>
          </div>
        ) : hasError ? (
          <Alert
            message="Xatolik"
            description="Ma'lumotlarni yuklashda muammo yuzaga keldi. Iltimos, keyinroq qayta urinib ko'ring."
            type="error"
            showIcon
          />
        ) : (
          <Tabs
            defaultActiveKey="all-services"
            items={items}
            style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default MaintenancePage;
