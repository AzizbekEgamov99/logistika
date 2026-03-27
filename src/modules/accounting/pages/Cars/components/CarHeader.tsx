import React from 'react';
import { Row, Col, Button, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface CarHeaderProps {
    onAddCar: () => void;
    onSearch: (value: string) => void;
    onStatusFilter: (status: string) => void;
}

const CarHeader: React.FC<CarHeaderProps> = ({
    onAddCar,
    onSearch,
    onStatusFilter,
}) => {
    return (
        <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 24 }}>
            <Col xs={24} md={16}>
                <Space size="middle" wrap>
                    <Search
                        placeholder="Transport qidirish"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={onSearch}
                        style={{ width: 250 }}
                        onChange={(e) => {
                            if (!e.target.value.trim()) {
                                onSearch('');
                            }
                        }}
                    />
                    <Select
                        placeholder="Holati bo'yicha saralash"
                        allowClear
                        style={{ width: 200 }}
                        onChange={onStatusFilter}
                        defaultValue="all"
                    >
                        <Select.Option value="all">Barchasi</Select.Option>
                        <Select.Option value="active">Faol</Select.Option>
                        <Select.Option value="inactive">Faol emas</Select.Option>
                        <Select.Option value="maintenance">Texnik xizmatda</Select.Option>
                        <Select.Option value="repair">Ta`mirda</Select.Option>
                    </Select>
                </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAddCar}
                >
                    Yangi transport qo`shish
                </Button>
            </Col>
        </Row>
    );
};

export default CarHeader;