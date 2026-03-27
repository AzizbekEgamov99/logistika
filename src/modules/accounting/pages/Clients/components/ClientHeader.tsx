import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../styles/clients.module.css';

interface ClientHeaderProps {
    onSearch: (value: string) => void;
    onAddClient: () => void;
    onStatusFilter?: (status: string) => void;
    onDateRangeFilter?: (dates: [string, string] | null) => void;
    isLoading?: boolean;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
    onSearch,
    onAddClient,
    isLoading = false,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    useEffect(() => {
        onSearch(debouncedSearchValue);
    }, [debouncedSearchValue, onSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className={styles.headerContainer}>
           
            <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col xs={24} sm={24} md={16}>
                    <Space direction="horizontal" size="middle" wrap className={styles.filterGroup}>
                        <Input.Search
                            placeholder="Mijozlarni qidirish..."
                            allowClear
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                        {isLoading && <Spin size="small" />}
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={8} className={styles.actionCol}>
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