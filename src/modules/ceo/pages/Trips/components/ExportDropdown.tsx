import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';

interface ExportDropdownProps {
  isExporting: boolean;
  onExport: (period: string) => void;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ isExporting, onExport }) => {
  const exportMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => onExport('all')}>
        Barcha ma'lumotlar
      </Menu.Item>
      <Menu.Item key="week" onClick={() => onExport('week')}>
        So'nggi hafta
      </Menu.Item>
      <Menu.Item key="month" onClick={() => onExport('month')}>
        So'nggi oy
      </Menu.Item>
      <Menu.Item key="year" onClick={() => onExport('year')}>
        So'nggi yil
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={exportMenu} disabled={isExporting}>
      <Button 
        icon={<DownloadOutlined />} 
        loading={isExporting}
      >
        Eksport <DownOutlined />
      </Button>
    </Dropdown>
  );
}; 