import React, { useState, useCallback } from 'react';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import './DriverHeader.css';

interface DriverHeaderProps {
    onSearch: (value: string) => void;
    onAddDriver: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({ 
    onSearch, 
    onAddDriver 
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            onSearch(value);
        }, 300); 
        
        setSearchTimeout(timeout as unknown as NodeJS.Timeout);
    }, [onSearch, searchTimeout]);

    return (
        <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 24 }}>
            <Col xs={24} lg={14}>
                <div className="custom-search-wrapper">
                    <Input
                        placeholder="Haydovchi ismini kiriting"
                        value={searchValue}
                        onChange={handleSearchChange}
                        onPressEnter={() => onSearch(searchValue)}
                        prefix={<UserOutlined />}
                        className="custom-search-input"
                    />
                </div>
            </Col>
            <Col xs={24} lg={10} style={{ textAlign: 'right' }}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={onAddDriver}
                    size="middle"
                >
                    Yangi haydovchi
                </Button>
            </Col>
        </Row>
    );
};

export default DriverHeader;