import React from 'react';
import { Row, Col, Input, Button, Space } from 'antd';
import { SearchOutlined, UserAddOutlined, FilterOutlined } from '@ant-design/icons';

interface DriverHeaderProps {
    onSearch: (value: string) => void;
    onAddDriver: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({ onSearch, onAddDriver }) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }} justify="space-between" align="middle">
            <Col xs={24} sm={12} md={8} lg={8}>
                <Input
                    placeholder="Haydovchi qidirish..."
                    prefix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                />
            </Col>
            <Col xs={24} sm={12} md={16} lg={16} style={{ textAlign: 'right' }}>
                <Space>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={onAddDriver}
                    >
                        Yangi haydovchi
                    </Button>
                </Space>
            </Col>
        </Row>
    );
};

export default DriverHeader; 