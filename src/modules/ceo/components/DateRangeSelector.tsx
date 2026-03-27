import React, { useState } from 'react';
import { Button, DatePicker, Dropdown, Space, Typography, Tooltip, Tag } from 'antd';
import { 
  DownOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { DateRange, DateRangeType } from '../types';
import locale from 'antd/lib/date-picker/locale/uz_UZ';
import dayjs, { Dayjs } from 'dayjs';
import type { MenuProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (newRange: DateRange) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, onDateRangeChange }) => {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleRangeTypeChange = (type: DateRangeType) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch(type) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      // Simplified options - removing quarter and year
      default:
        break;
    }
    
    onDateRangeChange({
      startDate,
      endDate,
      type,
    });
    
    if (type !== 'custom') {
      setShowCustomRange(false);
    }
  };

  const handleCustomRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      onDateRangeChange({
        startDate: dates[0].toDate(),
        endDate: dates[1].toDate(),
        type: 'custom',
      });
    }
  };

  const formatRangeLabel = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return 'Sana tanlang';
    }
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = dateRange.startDate.toLocaleDateString('uz-UZ', options);
    const endStr = dateRange.endDate.toLocaleDateString('uz-UZ', options);
    
    if (dateRange.type === 'custom') {
      return `${startStr} — ${endStr}`;
    }
    
    switch(dateRange.type) {
      case 'week':
        return 'So\'nggi 7 kun';
      case 'month':
        return 'So\'nggi oy';
      default:
        return `${startStr} — ${endStr}`;
    }
  };

  const getRangeIcon = (type: DateRangeType) => {
    switch(type) {
      case 'week':
        return <ClockCircleOutlined />;
      case 'month':
        return <CalendarOutlined />;
      case 'custom':
        return <CalendarOutlined />;
      default:
        return <CalendarOutlined />;
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'week',
      label: (
        <div className="date-menu-item">
          <ClockCircleOutlined className="date-menu-icon" />
          <span>So'nggi 7 kun</span>
          {dateRange.type === 'week' && <CheckCircleOutlined className="date-menu-check" />}
        </div>
      ),
      onClick: () => handleRangeTypeChange('week'),
    },
    {
      key: 'month',
      label: (
        <div className="date-menu-item">
          <CalendarOutlined className="date-menu-icon" />
          <span>So'nggi oy</span>
          {dateRange.type === 'month' && <CheckCircleOutlined className="date-menu-check" />}
        </div>
      ),
      onClick: () => handleRangeTypeChange('month'),
    },
    {
      type: 'divider',
    },
    {
      key: 'custom',
      label: (
        <div className="date-menu-item">
          <CalendarOutlined className="date-menu-icon" />
          <span>Boshqa sana oralig`i</span>
          {dateRange.type === 'custom' && <CheckCircleOutlined className="date-menu-check" />}
        </div>
      ),
      onClick: () => setShowCustomRange(true),
    },
  ];
  
  // Calculate date difference in days
  const dayDifference = React.useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return 0;
    }
    return Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [dateRange.startDate, dateRange.endDate]);

  // Define presets for RangePicker
  const rangePresets: RangePickerProps['presets'] = [
    { label: 'Bugun', value: [dayjs(), dayjs()] },
    { label: 'Kecha', value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')] },
    { label: "So'nggi 7 kun", value: [dayjs().subtract(7, 'day'), dayjs()] },
    { label: 'Joriy oy', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
    { label: "O'tgan oy", value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
  ];

  return (
    <div className="date-range-selector">
      <Tooltip title="Vaqt oralig'ini tanlang">
        <Dropdown menu={{ items: menuItems }} trigger={['click']} overlayClassName="date-range-dropdown">
          <Button className="date-range-button">
            <Space>
              {getRangeIcon(dateRange.type)}
              <span className="date-range-label">{formatRangeLabel()}</span>
              {dateRange.startDate && dateRange.endDate && (
                <Tag className="date-days-tag">{dayDifference} kun</Tag>
              )}
              <DownOutlined className="date-dropdown-icon" />
            </Space>
          </Button>
        </Dropdown>
      </Tooltip>
      
      <AnimatePresence>
        {showCustomRange && (
          <motion.div 
            className="custom-range-picker"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Typography.Title level={5} style={{ marginBottom: '12px' }}>
              Sana oralig&apos;ini tanlang
            </Typography.Title>
            <RangePicker
              value={[
                dateRange.startDate && dateRange.type === 'custom' ? 
                  dayjs(dateRange.startDate) : undefined, 
                dateRange.endDate && dateRange.type === 'custom' ? 
                  dayjs(dateRange.endDate) : undefined
              ]}
              onChange={handleCustomRangeChange}
              format="DD.MM.YYYY"
              allowClear={false}
              locale={locale}
              style={{ width: '100%' }}
              presets={rangePresets}
            />
            <div className="custom-range-actions">
              <Button
                size="middle"
                onClick={() => setShowCustomRange(false)}
                className="custom-range-cancel-btn"
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                size="middle"
                onClick={() => setShowCustomRange(false)}
                className="custom-range-apply-btn"
              >
                Qo&apos;llash
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .date-range-selector {
          position: relative;
        }
        
        .date-range-button {
          min-width: 210px;
          padding: 0 12px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0f5ff;
          border: 1px solid #d6e4ff;
          color: #1890ff;
          transition: all 0.3s;
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.1);
        }
        
        .date-range-button:hover {
          background: #e6f7ff;
          border-color: #91caff;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
        }
        
        .date-range-button .anticon {
          color: #1890ff;
        }
        
        .date-range-label {
          font-weight: 500;
          margin: 0 4px;
          white-space: nowrap;
        }
        
        .date-days-tag {
          background: rgba(24, 144, 255, 0.1);
          border: none;
          color: #1890ff;
          margin-right: 4px;
          font-size: 12px;
          padding: 0 6px;
          height: 22px;
          line-height: 22px;
          border-radius: 4px;
        }
        
        .date-dropdown-icon {
          font-size: 12px;
        }
        
        .custom-range-picker {
          position: absolute;
          top: 46px;
          right: 0;
          width: 380px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);
          z-index: 1000;
        }
        
        .date-range-dropdown .ant-dropdown-menu {
          padding: 8px;
          border-radius: 10px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05);
        }
        
        .date-menu-item {
          display: flex;
          align-items: center;
          padding: 4px 0;
          position: relative;
        }
        
        .date-menu-icon {
          margin-right: 10px;
          font-size: 16px;
          color: #1890ff;
        }
        
        .date-menu-check {
          position: absolute;
          right: 0;
          color: #52c41a;
        }
        
        .custom-range-actions {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .custom-range-cancel-btn:hover {
          color: #ff4d4f;
          border-color: #ff4d4f;
        }
        
        .custom-range-apply-btn {
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
          transition: all 0.3s;
        }
        
        .custom-range-apply-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
        }
        
        /* RangePicker styles */
        .custom-range-picker .ant-picker-range {
          border-radius: 8px;
          border: 1px solid #d9d9d9;
        }
        
        .custom-range-picker .ant-picker-range:hover,
        .custom-range-picker .ant-picker-range:focus,
        .custom-range-picker .ant-picker-range-focused {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .custom-range-picker .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
        .custom-range-picker .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
        .custom-range-picker .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
          background: #1890ff;
        }
        
        .custom-range-picker .ant-picker-cell-in-view.ant-picker-cell-in-range::before {
          background: #e6f7ff;
        }
        
        @media (max-width: 576px) {
          .date-range-button {
            min-width: auto;
          }
          
          .date-days-tag {
            display: none;
          }
          
          .custom-range-picker {
            width: 100%;
            left: 0;
            right: auto;
          }
        }
      `}</style>
    </div>
  );
}; 