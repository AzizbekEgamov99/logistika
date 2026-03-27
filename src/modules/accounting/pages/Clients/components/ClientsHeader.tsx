import React from 'react';
import { Row, Col, Input, Button, Select, DatePicker, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '../styles/clients.module.css';

const { RangePicker } = DatePicker;

interface ClientsHeaderProps {
    onSearch: (value: string) => void;
    onAddClient: () => void;
    onStatusFilter: (status: string) => void;
    onDateRangeFilter: (dates: [string, string] | null) => void;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({
    onSearch,
    onAddClient,
    onStatusFilter,
    onDateRangeFilter,
}) => {
    return (
        <div className={styles.headerContainer}>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col xs={24} sm={24} md={16} lg={16}>
                    <Space size="middle" className={styles.filterGroup}>
                        <Input
                            placeholder="Mijozlarni qidirish..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => onSearch(e.target.value)}
                            className={styles.searchInput}
                            allowClear
                        />
                        <Select
                            placeholder="Status"
                            onChange={onStatusFilter}
                            className={styles.statusFilter}
                            allowClear
                        >
                            <Select.Option value="active">Faol</Select.Option>
                            <Select.Option value="inactive">Faol emas</Select.Option>
                        </Select>
                        <RangePicker
                            onChange={(dates) => {
                                if (dates) {
                                    onDateRangeFilter([
                                        dates[0]!.format('YYYY-MM-DD'),
                                        dates[1]!.format('YYYY-MM-DD'),
                                    ]);
                                } else {
                                    onDateRangeFilter(null);
                                }
                            }}
                            className={styles.dateFilter}
                        />
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} className={styles.actionCol}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddClient}
                        className={styles.addButton}
                    >
                        Yangi mijoz qo`shish
                    </Button>
                </Col>
            </Row>
        </div>
    );
}; 