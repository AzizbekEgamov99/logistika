import React from 'react';
import { Form, Tabs, Card } from 'antd';
import CarHistory from './CarHistory';
import { MaintenanceData } from './CarHistory';

interface CarHistoryFormProps {
  carId: number;
  data: MaintenanceData;
}

const CarHistoryForm: React.FC<CarHistoryFormProps> = ({ carId, data }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} name="car_history_form" layout="vertical">
      <Card variant="outlined" className="car-history-container">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Car History" key="1">
            <CarHistory data={data} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Form>
  );
};

export default CarHistoryForm; 