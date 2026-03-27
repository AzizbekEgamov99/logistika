import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchPanel = () => {
    return (
        <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            className="search-input"
            size="large"
        />
    );
}

export default SearchPanel;
