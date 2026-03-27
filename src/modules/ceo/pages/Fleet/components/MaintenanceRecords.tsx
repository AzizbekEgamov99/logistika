import React, { memo, useState } from 'react';
import { Collapse, Empty, Pagination, Tag } from 'antd';
import { 
  ExperimentOutlined, 
  ToolOutlined, 
  DollarOutlined,
  ClockCircleOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';
import { formatCurrency, formatNumber, formatDate } from '../../../utils/formatters';

const { Panel } = Collapse;

interface MaintenanceRecordsProps {
  optol: any[];
  bolon: any[];
  texnic: any[];
}

const pageSize = 5;

const MaintenanceRecords = memo(({ optol, bolon, texnic }: MaintenanceRecordsProps) => {
  // State for pagination
  const [oilPage, setOilPage] = useState(1);
  const [tirePage, setTirePage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  
  // State for showing all items
  const [showAllOil, setShowAllOil] = useState(false);
  const [showAllTire, setShowAllTire] = useState(false);
  const [showAllService, setShowAllService] = useState(false);

  // Helper function to get paginated items
  const getPaginatedItems = (items, page, showAll) => {
    if (showAll) return items;
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Collapse 
        defaultActiveKey={['oil', 'tire', 'service']}
        ghost
        expandIconPosition="end"
      >
        {/* Oil change records */}
        <Panel 
          key="oil" 
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ExperimentOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <h3 style={{ margin: 0 }}>Moy almashtirish tarixi</h3>
                <Tag style={{ marginLeft: '8px', backgroundColor: '#e6f7ff', color: '#1890ff', borderRadius: '10px', fontSize: '12px' }}>
                  {optol.length} dona
                </Tag>
              </div>
            </div>
          }
        >
          {optol.length > 0 ? (
            <div>
              <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '10px' }}>
                {getPaginatedItems(optol, oilPage, showAllOil).map((item, index) => (
                  <div 
                    key={`oil-${index}`} 
                    style={{ 
                      backgroundColor: '#f8f9ff', 
                      padding: '12px 16px', 
                      marginBottom: '10px', 
                      borderRadius: '6px',
                      borderLeft: '4px solid #1890ff' 
                    }}
                  >
                    <div style={{ color: '#8c8c8c', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Kilometr:</span>
                        <span style={{ fontWeight: 500 }}>{formatNumber(item.kilometr || 0)} km</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Narxi:</span>
                        <span style={{ color: '#f5222d', fontWeight: 500 }}>{formatCurrency(item.price || 0)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Izoh:</span>
                        <span style={{ fontWeight: 500 }}>{item.description || 'Izoh mavjud emas'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {optol.length > pageSize && !showAllOil && (
                <div 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px', 
                    marginTop: '10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s' 
                  }}
                  onClick={() => setShowAllOil(true)}
                >
                  <DownOutlined style={{ marginRight: '5px' }} /> 
                  Hammasi ko'rsatish ({optol.length})
                </div>
              )}
              
              {showAllOil && optol.length > pageSize && (
                <div 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px', 
                    marginTop: '10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s' 
                  }}
                  onClick={() => setShowAllOil(false)}
                >
                  <UpOutlined style={{ marginRight: '5px' }} /> 
                  Yig'ish
                </div>
              )}
              
              {!showAllOil && optol.length > pageSize && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    simple 
                    current={oilPage} 
                    pageSize={pageSize} 
                    total={optol.length} 
                    onChange={setOilPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty description="Moy almashtirish ma'lumotlari mavjud emas" />
          )}
        </Panel>
        
        {/* Tire records */}
        <Panel 
          key="tire" 
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ToolOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <h3 style={{ margin: 0 }}>Shina almashtirish tarixi</h3>
                <Tag style={{ marginLeft: '8px', backgroundColor: '#f6ffed', color: '#52c41a', borderRadius: '10px', fontSize: '12px' }}>
                  {bolon.length} dona
                </Tag>
              </div>
            </div>
          }
        >
          {bolon.length > 0 ? (
            <div>
              <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '10px' }}>
                {getPaginatedItems(bolon, tirePage, showAllTire).map((item, index) => (
                  <div 
                    key={`tire-${index}`} 
                    style={{ 
                      backgroundColor: '#f6ffed', 
                      padding: '12px 16px', 
                      marginBottom: '10px', 
                      borderRadius: '6px',
                      borderLeft: '4px solid #52c41a' 
                    }}
                  >
                    <div style={{ color: '#8c8c8c', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Kilometr:</span>
                        <span style={{ fontWeight: 500 }}>{formatNumber(item.kilometr || 0)} km</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Narxi:</span>
                        <span style={{ color: '#f5222d', fontWeight: 500 }}>{formatCurrency(item.price || 0)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Izoh:</span>
                        <span style={{ fontWeight: 500 }}>{item.description || 'Izoh mavjud emas'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {bolon.length > pageSize && !showAllTire && (
                <div 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px', 
                    marginTop: '10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s' 
                  }}
                  onClick={() => setShowAllTire(true)}
                >
                  <DownOutlined style={{ marginRight: '5px' }} /> 
                  Hammasi ko'rsatish ({bolon.length})
                </div>
              )}
              
              {showAllTire && bolon.length > pageSize && (
                <div 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px', 
                    marginTop: '10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s' 
                  }}
                  onClick={() => setShowAllTire(false)}
                >
                  <UpOutlined style={{ marginRight: '5px' }} /> 
                  Yig'ish
                </div>
              )}
              
              {!showAllTire && bolon.length > pageSize && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    simple 
                    current={tirePage} 
                    pageSize={pageSize} 
                    total={bolon.length} 
                    onChange={setTirePage}
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty description="Shina almashtirish ma'lumotlari mavjud emas" />
          )}
        </Panel>
        
        {/* Technical service records */}
        <Panel 
          key="service" 
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DollarOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                <h3 style={{ margin: 0 }}>Texnik xizmat tarixi</h3>
                <Tag style={{ marginLeft: '8px', backgroundColor: '#f9f0ff', color: '#722ed1', borderRadius: '10px', fontSize: '12px' }}>
                  {texnic.length} dona
                </Tag>
              </div>
            </div>
          }
        >
          {texnic.length > 0 ? (
            <div>
              <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '10px' }}>
                {getPaginatedItems(texnic, servicePage, showAllService).map((item, index) => (
                  <div 
                    key={`service-${index}`} 
                    style={{ 
                      backgroundColor: '#f9f0ff', 
                      padding: '12px 16px', 
                      marginBottom: '10px', 
                      borderRadius: '6px',
                      borderLeft: '4px solid #722ed1' 
                    }}
                  >
                    <div style={{ color: '#8c8c8c', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: '6px' }} /> Sana: {formatDate(item.created_at)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Kilometr:</span>
                        <span style={{ fontWeight: 500 }}>{formatNumber(item.kilometr || 0)} km</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Narxi:</span>
                        <span style={{ color: '#f5222d', fontWeight: 500 }}>{formatCurrency(item.price || 0)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ minWidth: '90px', color: '#8c8c8c' }}>Izoh:</span>
                        <span style={{ fontWeight: 500 }}>{item.description || 'Izoh mavjud emas'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {texnic.length > pageSize && !showAllService && (
                <div 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px', 
                    marginTop: '10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s' 
                  }}
                  onClick={() => setShowAllService(true)}
                >
                  <DownOutlined style={{ marginRight: '5px' }} /> 
                  Hammasi ko'rsatish ({texnic.length})
                </div>
              )}
              
              {showAllService && texnic.length > pageSize && (
                <div 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    padding: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px', 
                    marginTop: '10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s' 
                  }}
                  onClick={() => setShowAllService(false)}
                >
                  <UpOutlined style={{ marginRight: '5px' }} /> 
                  Yig'ish
                </div>
              )}
              
              {!showAllService && texnic.length > pageSize && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    simple 
                    current={servicePage} 
                    pageSize={pageSize} 
                    total={texnic.length} 
                    onChange={setServicePage}
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty description="Texnik xizmat ma'lumotlari mavjud emas" />
          )}
        </Panel>
      </Collapse>
    </div>
  );
});

export default MaintenanceRecords; 