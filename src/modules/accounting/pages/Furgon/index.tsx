import React, { useState } from "react";
import { Tabs, Layout, Card, Typography, Button } from "antd";
import { motion } from "framer-motion";
import {
  DashboardOutlined,
  CarOutlined,
  CompassOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import FurgonDashboard from "./components/FurgonDashboard";
import FurgonForm from "./components/FurgonForm";
import RoadFurgons from "./components/RoadFurgons";
import AvailableFurgons from "./components/AvailableFurgons";
import AllFurgons from "./components/AllFurgons";
import { useFurgonStatus } from "../../hooks/useFurgon";
import styles from './style/furgon.module.css';

const { Content } = Layout;
const { Title, Text } = Typography;

export const FurgonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { inRaysCount, availableCount } = useFurgonStatus();

  const tabItems = [
    {
      key: 'dashboard',
      label: <span><DashboardOutlined /> Dashboard</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.tabContent}
        >
          <FurgonDashboard />
        </motion.div>
      )
    },
    {
      key: 'all',
      label: <span><UnorderedListOutlined /> Barcha furgonlar</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.tabContent}
        >
          <AllFurgons onAddNew={() => setIsModalVisible(true)} />
        </motion.div>
      )
    },
    {
      key: 'roadFurgons',
      label: <span><CompassOutlined /> Yo`ldagi furgonlar ({inRaysCount || 0})</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.tabContent}
        >
          <RoadFurgons />
        </motion.div>
      )
    },
    {
      key: 'availableFurgons',
      label: <span><CheckCircleOutlined /> Mavjud furgonlar ({availableCount || 0})</span>,
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.tabContent}
        >
          <AvailableFurgons />
        </motion.div>
      )
    }
  ];

  return (
    <Layout className={styles.furgonPage}>
      <Content className={styles.furgonContent}>
        {/* Page header with title */}
        <div className={styles.pageHeader}>
          <div>
            <Title level={4} className={styles.pageTitle}>
              <CarOutlined /> Furgonlar boshqaruvi
            </Title>
            <Text type="secondary">Furgonlar ma``lumotlarini ko`ring va boshqaring</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
            size="large"
          >
            Yangi furgon qo`shish
          </Button>
        </div>
        
        <Card 
          className={styles.mainCard}
          variant="borderless"
        >
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className={styles.furgonTabs}
            items={tabItems}
            type="card"
            size="large"
          />
        </Card>
        
        <FurgonForm
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          furgon={null}
        />
      </Content>
    </Layout>
  );
};

export default FurgonPage;