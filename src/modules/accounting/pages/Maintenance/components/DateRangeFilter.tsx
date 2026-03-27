import React from 'react';
import { Card, DatePicker, Button, Space, Typography, Divider } from 'antd';
import { FilterOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

interface DateRangeFilterProps {
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void;
  onReset: () => void;
}

const styles = {
  filterCard: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    border: 'none',
    overflow: 'hidden'
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #597ef7 0%, #2f54eb 100%)',
    color: 'white'
  },
  filterContent: {
    padding: '20px 24px'
  },
  iconWhite: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '8px',
    borderRadius: '50%',
    marginRight: '8px'
  },
  innerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  rangePickerWrapper: {
    flexGrow: 1,
    maxWidth: '450px'
  },
  resetButton: {
    marginLeft: '16px',
    borderRadius: '6px'
  }
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  onReset
}) => {
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can't select days in the future
    return current && current > dayjs().endOf('day');
  };

  // Predefined ranges for quick selection
  const ranges: RangePickerProps['presets'] = [
    {
      label: 'Bugun',
      value: [dayjs().startOf('day'), dayjs().endOf('day')]
    },
    {
      label: 'Kecha',
      value: [
        dayjs().subtract(1, 'day').startOf('day'),
        dayjs().subtract(1, 'day').endOf('day')
      ]
    },
    {
      label: 'Oxirgi 7 kun',
      value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')]
    },
    {
      label: 'Bu oy',
      value: [dayjs().startOf('month'), dayjs().endOf('day')]
    },
    {
      label: 'O\'tgan oy',
      value: [
        dayjs().subtract(1, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month')
      ]
    }
  ];

  return (
    <Card
      style={styles.filterCard}
      bodyStyle={{ padding: 0 }}
    >
      <div style={styles.filterHeader}>
        <FilterOutlined style={styles.iconWhite} />
        Sana bo'yicha saralash
      </div>
      
      <div style={styles.filterContent}>
        <div style={styles.innerContent}>
          <div style={styles.rangePickerWrapper}>
            <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
              <CalendarOutlined style={{ marginRight: '8px' }} />
              Vaqt oralig'ini tanlang:
            </Text>
            <RangePicker
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              presets={ranges}
              onChange={(dates) => onDateRangeChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
              allowClear
              size="large"
              format="DD.MM.YYYY"
            />
          </div>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onReset}
            type="primary"
            size="large"
            style={styles.resetButton}
            ghost
          >
            Tozalash
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DateRangeFilter; 