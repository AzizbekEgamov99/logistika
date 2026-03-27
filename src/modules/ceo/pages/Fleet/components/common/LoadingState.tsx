import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const LoadingState: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="ant-spin ant-spin-lg ant-spin-spinning">
            <span className="ant-spin-dot ant-spin-dot-spin">
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Ma`lumotlar yuklanmoqda...</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingState; 