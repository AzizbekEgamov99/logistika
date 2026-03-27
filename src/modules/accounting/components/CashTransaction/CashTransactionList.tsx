import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  message,
  Modal,
  Tooltip,
  Tag,
  Tabs,
  Select,
  Input,
  Row,
  Col,
  DatePicker,
  Divider,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  HistoryOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { cashApi } from '../../api/cash/cashApi';
import { Cash, CashStatus, CashFilter, CashCreate, CashHistory, RaysClientsMap } from '../../types/cash.types';
import CashTransactionModal from './CashTransactionModal';
import dayjs from 'dayjs';
import { formatMoney } from '@/utils/format';
import debounce from 'lodash/debounce';

const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
interface ExtendedCashFilter extends CashFilter {
  search?: string;
}

// Valyuta ID va nomlarini ko'rsatuvchi obyekt
const currencyMap: Record<string | number, string> = {
  USD: "USD",
  UZS: "UZS",
  EUR: "EUR",
  RUB: "RUB",
  1: "RUB",
  2: "USD",
  3: "EUR",
  4: "UZS"
};

const CashTransactionList: React.FC = () => {
  // Add render count to track component re-renders
  console.log('CashTransactionList rendering');

  const [transactions, setTransactions] = useState<Cash[]>([]);
  const [raysClientsMap, setRaysClientsMap] = useState<RaysClientsMap[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Cash | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmingTransactionId, setConfirmingTransactionId] = useState<number | null>(null);
  const [paymentTypes, setPaymentTypes] = useState<{ id: number, name: string }[]>([]);
  const [filters, setFilters] = useState<ExtendedCashFilter>({
    search: '',
    date_from: undefined,
    date_to: undefined,
    status: undefined,
    rays: undefined,
    is_debt: undefined,
    is_via_driver: undefined,
    is_delivered_to_cashier: undefined,
    is_confirmed_by_cashier: undefined
  });
  const [activeTab, setActiveTab] = useState('1');
  const [cashHistory, setCashHistory] = useState<CashHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Add state for history filters
  const [historyFilters, setHistoryFilters] = useState<{
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
    filteredHistory: CashHistory[];
    search: string;
    showHistoryFilters: boolean;
  }>({
    dateRange: null,
    filteredHistory: [],
    search: '',
    showHistoryFilters: false
  });

  // Add a flag to track if initial data has been loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Main useEffect for initial data loading
  useEffect(() => {
    console.log('Main useEffect running');

    // Only load data once
    if (!initialDataLoaded && !loading) {
      console.log('Loading initial data...');

      // Loading data sequentially to avoid race conditions
      const loadData = async () => {
        try {
          await fetchData();
          await fetchRaysClientsMap();
          await fetchPaymentTypes();
          setInitialDataLoaded(true);
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      };

      loadData();
    }
  }, [initialDataLoaded, loading]); // Re-run only when initialDataLoaded or loading changes

  // Create debounced functions using useCallback to prevent recreation on each render
  const debouncedFetchData = React.useCallback(
    debounce(async () => {
      try {
        console.log('Debounced fetchData running');
        setLoading(true);
        const apiFilters: CashFilter = {
          status: filters.status,
          client: filters.client,
          driver: filters.driver,
          rays: filters.rays,
          payment_way: filters.payment_way,
          is_debt: filters.is_debt,
          is_via_driver: filters.is_via_driver,
          is_confirmed_by_cashier: filters.is_confirmed_by_cashier,
          is_delivered_to_cashier: filters.is_delivered_to_cashier,
          date_from: filters.date_from,
          date_to: filters.date_to
        };

        const response = await cashApi.getCashList(apiFilters);

        // Apply client-side filtering for search field
        let filteredData = response;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = response.filter(item =>
            item.client_name?.toLowerCase().includes(searchLower) ||
            item.driver_name?.toLowerCase().includes(searchLower) ||
            item.rays.toString().includes(searchLower) ||
            item.payment_way_name?.toLowerCase().includes(searchLower)
          );
        }

        // Sort transactions by created_at in descending order (newest first)
        filteredData.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setTransactions(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    }, 300),
    [filters]
  );

  // Replace fetchData function with a simpler version that calls the debounced function
  const fetchData = React.useCallback(() => {
    console.log('fetchData called, using debounced version');
    debouncedFetchData();
  }, [debouncedFetchData]);

  // Optimize the fetchRaysClientsMap function
  const debouncedFetchRaysClientsMap = React.useCallback(async () => {
    try {
      console.log('Debounced fetchRaysClientsMap running');
      const response = await cashApi.getRaysClientsMap();
      setRaysClientsMap(response);
    } catch (error) {
      console.error('Error fetching rays-clients map:', error);
      message.error('Reys-mijozlar ma\'lumotlarini yuklashda xatolik yuz berdi');
    }
  }, []);

  // Replace fetchRaysClientsMap function with a simpler version that calls the debounced function
  const fetchRaysClientsMap = () => {
    console.log('fetchRaysClientsMap called, using debounced version');
    debouncedFetchRaysClientsMap();
  };

  // Optimize the fetchPaymentTypes function
  const debouncedFetchPaymentTypes = React.useCallback(async () => {
    try {
      console.log('Debounced fetchPaymentTypes running');
      const response = await cashApi.getPaymentTypes();
      setPaymentTypes(response);
    } catch (error) {
      console.error('Error fetching payment types:', error);
      message.error('To\'lov turi ma\'lumotlarini yuklashda xatolik yuz berdi');
    }
  }, []);

  // Replace fetchPaymentTypes function with a simpler version that calls the debounced function
  const fetchPaymentTypes = () => {
    console.log('fetchPaymentTypes called, using debounced version');
    debouncedFetchPaymentTypes();
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'O\'chirishni tasdiqlaysizmi?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bu to\'lovni o\'chirmoqchimisiz?',
      okText: 'Ha',
      okType: 'danger',
      cancelText: 'Yo\'q',
      onOk: async () => {
        try {
          await cashApi.deleteCash(id);
          message.success('To\'lov muvaffaqiyatli o\'chirildi');
          fetchData();
        } catch {
          message.error('O\'chirishda xatolik yuz berdi');
        }
      }
    });
  };

  const handleConfirmTransaction = (id: number) => {
    setConfirmingTransactionId(id);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalOk = async () => {
    if (confirmingTransactionId !== null) {
      await directConfirmTransaction(confirmingTransactionId);
      setConfirmModalVisible(false);
      setConfirmingTransactionId(null);
    }
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
    setConfirmingTransactionId(null);
  };

  // Direct confirmation using the /casa/{id}/confirm/ endpoint
  const directConfirmTransaction = async (id: number) => {
    try {
      setLoading(true);
      await cashApi.confirmCashTransaction(id);
      message.success('To\'lov muvaffaqiyatli tasdiqlandi');
      fetchData();
    } catch (error) {
      console.error('Error confirming transaction:', error);
      message.error('Tasdiqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: 'Reys',
      dataIndex: 'rays',
      key: 'rays',
      render: (rays: number) => `#${rays}`
    },
    {
      title: 'Mijoz',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Mijoz kompaniyasi',
      dataIndex: 'company_name',
      key: 'company_name',
      render: (company: string) => (
        <span style={{ fontWeight: 500 }}>{company}</span>
      )
    },
    {
      title: 'kurs narxi',
      dataIndex: 'custom_rate_to_uzs',
      key: 'custom_rate_to_uzs',
      render: (custom_rate_to_uzs: number) => (
        <span>{custom_rate_to_uzs}</span>
      )
    },

    {
      title: 'Haydovchi',
      dataIndex: 'driver_name',
      key: 'driver_name'
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Cash) => (
        <span>
          {formatMoney(amount)} {record.currency_name}
        </span>
      )
    },
    {
      title: 'To\'lov turi',
      dataIndex: 'payment_way_name',
      key: 'payment_way_name',
      render: (payment_way_name: string) => (
        <Tag color="blue">{payment_way_name || 'Aniqlanmagan'}</Tag>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: Cash) => {
        const tags = [];

        if (record.is_debt) {
          tags.push(<Tag key="debt" color="warning">Qarz</Tag>);
        }

        if (record.is_via_driver) {
          tags.push(<Tag key="via-driver" color="blue">Haydovchi orqali</Tag>);
        }

        if (!record.is_delivered_to_cashier) {
          tags.push(<Tag key="not-delivered" color="processing">Topshirilmagan</Tag>);
        }

        if (record.is_confirmed_by_cashier) {
          tags.push(<Tag key="confirmed" color="success">Tasdiqlangan</Tag>);
        } else {
          tags.push(<Tag key="not-confirmed" color="error">Tasdiqlanmagan</Tag>);
        }

        return <>{tags}</>;
      }
    },
    {
      title: 'comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => (
        <span>{comment}</span>
      )
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: unknown, record: Cash) => (
        <Space>
          {!record.is_confirmed_by_cashier && (
            <Tooltip title="Tasdiqlash">
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirmTransaction(record.id)}
              >
                Tasdiqlash
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Tahrirlash">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingTransaction(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="O'chirish">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setFilters(prev => ({
      ...prev,
      date_from: dates?.[0]?.format('YYYY-MM-DD'),
      date_to: dates?.[1]?.format('YYYY-MM-DD')
    }));
  };

  const handleStatusChange = (value: string) => {
    if (value === 'debt') {
      setFilters(prev => ({ ...prev, is_debt: true, status: undefined }));
    } else if (value === 'via_driver') {
      setFilters(prev => ({ ...prev, is_via_driver: true, status: undefined }));
    } else if (value === 'not_delivered') {
      setFilters(prev => ({ ...prev, is_delivered_to_cashier: false, status: undefined }));
    } else if (value === 'confirmed') {
      setFilters(prev => ({ ...prev, is_confirmed_by_cashier: true, status: undefined }));
    } else if (value === 'not_confirmed') {
      setFilters(prev => ({ ...prev, is_confirmed_by_cashier: false, status: undefined }));
    } else {
      setFilters(prev => ({
        ...prev,
        status: value as CashStatus,
        is_debt: undefined,
        is_via_driver: undefined,
        is_delivered_to_cashier: undefined,
        is_confirmed_by_cashier: undefined
      }));
    }
  };

  const handleModalSuccess = () => {
    fetchData();
  };

  const handleFilterChange = (key: keyof ExtendedCashFilter, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchData();
    setFiltersVisible(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      date_from: undefined,
      date_to: undefined,
      status: undefined,
      rays: undefined,
      is_debt: undefined,
      is_via_driver: undefined,
      is_delivered_to_cashier: undefined,
      is_confirmed_by_cashier: undefined
    });
    fetchData();
    setFiltersVisible(false);
  };

  // Convert Cash to CashCreate for the edit modal
  const convertToCashCreate = (cash: Cash | null): CashCreate | undefined => {
    if (!cash) return undefined;

    return {
      client: cash.client,
      rays: cash.rays,
      product: cash.product,
      driver: cash.driver,
      amount: cash.amount,
      currency: cash.currency,
      payment_way: cash.payment_way,
      comment: cash.comment,
      is_debt: cash.is_debt,
      is_via_driver: cash.is_via_driver,
      is_delivered_to_cashier: cash.is_delivered_to_cashier,
      total_expected_amount: cash.total_expected_amount,
      paid_amount: cash.paid_amount,
      date: dayjs(cash.created_at).format('YYYY-MM-DD'),
      move_type: 'cash' // Default value
    };
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === '2') {
      fetchCashHistory();
    }
  };

  // Ensure history is loaded when tab is switched
  useEffect(() => {
    console.log('Tab change useEffect with activeTab:', activeTab);

    if (activeTab === '2') {
      // Add loading state tracking
      const isHistoryLoaded = historyFilters.filteredHistory.length > 0;

      if (!isHistoryLoaded && !historyLoading) {
        console.log('Loading cash history data...');
        fetchCashHistory();
      }
    }
  }, [activeTab, historyFilters.filteredHistory.length, historyLoading]);

  // Optimize the fetchCashHistory function
  const debouncedFetchCashHistory = React.useCallback(async () => {
    try {
      console.log('Debounced fetchCashHistory running');
      setHistoryLoading(true);
      const response = await cashApi.getCashHistory();
      console.log('History data loaded:', response);
      console.log('First payment type example:', response[0]?.payment_name);
      console.log('Payment types from state:', paymentTypes);

      // Sort history data by created_at in descending order
      const sortedHistory = response.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setCashHistory(sortedHistory);
      setHistoryFilters(prev => ({
        ...prev,
        filteredHistory: sortedHistory,
        dateRange: null,
        search: ''
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      message.error('To\'lovlar tarixini yuklashda xatolik yuz berdi');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Replace fetchCashHistory function with a simpler version that calls the debounced function
  const fetchCashHistory = () => {
    // Only fetch if we don't already have data and aren't currently loading
    if (cashHistory.length === 0 && !historyLoading) {
      console.log('fetchCashHistory called, using debounced version');
      debouncedFetchCashHistory();
    } else {
      console.log('fetchCashHistory skipped, already have data or loading in progress');
    }
  };

  // Columns for the Cash History table
  const historyColumns = [
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: 'Reys tarixi',
      dataIndex: 'rays',
      key: 'rays',
      render: (rays: number) => rays ? `#${rays}` : '-'
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: CashHistory) => (
        <span>
          {formatMoney(amount)} {record.currency_name}
        </span>
      )
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Mijoz kompaniyasi',
      dataIndex: 'client_company',
      key: 'client_company',
      render: (company: string) => (
        <span style={{ fontWeight: 500 }}>{company}</span>
      )
    },
    {
      title: 'Kurs narxi',
      dataIndex: 'custom_rate_to_uzs',
      key: 'custom_rate_to_uzs',
      render: (custom_rate_to_uzs: number | string | null) => {
        const value = Number(custom_rate_to_uzs);
        return (
          <span>
            {value ? value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
          </span>
        );
      }
    },
    {
      title: 'To\'lov turi',
      dataIndex: 'payment_name',
      key: 'payment_name',
      render: (payment_name: string) => (
        <Tag color="blue">{payment_name || 'Aniqlanmagan'}</Tag>
      )
    },
    {
      title: 'Dollar qiymati',
      dataIndex: 'amount_in_usd',
      key: 'amount_in_usd',
      render: (amount: string) => (
        <span>
          {formatMoney(Number(amount))} USD
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: CashHistory) => {
        const tags = [];

        if (record.is_debt) {
          tags.push(<Tag key="debt" color="warning">Qarz</Tag>);
        }

        if (record.is_via_driver) {
          tags.push(<Tag key="via-driver" color="blue">Haydovchi orqali</Tag>);
        }

        if (!record.is_delivered_to_cashier) {
          tags.push(<Tag key="not-delivered" color="processing">Topshirilmagan</Tag>);
        }

        const statusMap: Record<string, { color: string, text: string }> = {
          confirmed: { color: 'success', text: 'Tasdiqlangan' },
          pending: { color: 'warning', text: 'Kutilmoqda' },
          completed: { color: 'success', text: 'Bajarilgan' },
          canceled: { color: 'error', text: 'Bekor qilingan' },
        };

        const statusInfo = statusMap[status] || { color: 'default', text: status };
        tags.push(<Tag key="status" color={statusInfo.color}>{statusInfo.text}</Tag>);

        return <>{tags}</>;
      }
    },
    {
      title: 'Izoh',
      dataIndex: 'comment',
      key: 'comment'
    }
  ];

  const getPaymentTypeName = (payment_way: number): string => {
    if (!paymentTypes || paymentTypes.length === 0) {
      return `To'lov #${payment_way}`;
    }
    const paymentType = paymentTypes.find(type => type.id === payment_way);
    return paymentType ? paymentType.name : `To'lov #${payment_way}`;
  };

  // Add missing history filter handlers
  const handleHistorySearch = (value: string) => {
    setHistoryFilters(prev => ({
      ...prev,
      search: value,
      filteredHistory: cashHistory.filter(item =>
        item.client_name?.toLowerCase().includes(value.toLowerCase()) ||
        item.driver_name?.toLowerCase().includes(value.toLowerCase()) ||
        item.rays_history?.toString().includes(value) ||
        item.payment_name?.toLowerCase().includes(value.toLowerCase())
      )
    }));
  };

  const handleHistoryDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setHistoryFilters(prev => ({
      ...prev,
      dateRange: dates,
      filteredHistory: dates
        ? cashHistory.filter(item => {
          const itemDate = dayjs(item.created_at);
          return itemDate.isAfter(dates[0]) && itemDate.isBefore(dates[1]);
        })
        : cashHistory
    }));
  };

  // Update the Tabs implementation to use items prop
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <PlusOutlined /> Kassa to&apos;lovlari
        </span>
      ),
      children: (
        <Card>
          <Space style={{ marginBottom: 16 }} direction="vertical" size="middle" className="w-full">
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTransaction(null);
                  setModalVisible(true);
                }}
              >
                Yangi to`lov
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                Filtrlar
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
              >
                Yangilash
              </Button>
            </Space>

            {filtersVisible && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Input
                      placeholder="Qidirish..."
                      prefix={<SearchOutlined />}
                      value={filters.search}
                      onChange={e => handleSearch(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <RangePicker
                      onChange={handleDateRangeChange}
                      style={{ width: '100%' }}
                      value={filters.date_from && filters.date_to ?
                        [dayjs(filters.date_from), dayjs(filters.date_to)] : null
                      }
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Select
                      placeholder="Status"
                      style={{ width: '100%' }}
                      onChange={handleStatusChange}
                      allowClear
                      value={
                        filters.is_debt ? 'debt' :
                          filters.is_via_driver ? 'via_driver' :
                            filters.is_delivered_to_cashier === false ? 'not_delivered' :
                              filters.is_confirmed_by_cashier === true ? 'confirmed' :
                                filters.is_confirmed_by_cashier === false ? 'not_confirmed' :
                                  filters.status
                      }
                    >
                      <Option value="pending">Kutilmoqda</Option>
                      <Option value="completed">Bajarilgan</Option>
                      <Option value="debt">Qarz</Option>
                      <Option value="via_driver">Haydovchi orqali</Option>
                      <Option value="not_delivered">Topshirilmagan</Option>
                      <Option value="confirmed">Tasdiqlangan</Option>
                      <Option value="not_confirmed">Tasdiqlanmagan</Option>
                    </Select>
                  </Col>
                </Row>

                <Divider style={{ margin: '12px 0' }} />

                <Space>
                  <Checkbox
                    checked={filters.is_debt === true}
                    onChange={e => handleFilterChange('is_debt', e.target.checked ? true : undefined)}
                  >
                    Faqat qarzlarni ko`rsatish
                  </Checkbox>

                  <Checkbox
                    checked={filters.is_via_driver === true}
                    onChange={e => handleFilterChange('is_via_driver', e.target.checked ? true : undefined)}
                  >
                    Haydovchi orqali to`lovlar
                  </Checkbox>
                </Space>

                <Row style={{ marginTop: 16 }}>
                  <Space>
                    <Button type="primary" onClick={applyFilters}>
                      Filtrlash
                    </Button>
                    <Button onClick={resetFilters}>
                      Tozalash
                    </Button>
                  </Space>
                </Row>
              </Card>
            )}
          </Space>

          <Table
            columns={columns}
            dataSource={transactions}
            loading={loading}
            rowKey={record => record.id.toString()}
            pagination={{
              total: transactions.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami: ${total}`
            }}
          />
        </Card>
      )
    },
    {
      key: '2',
      label: (
        <span>
          <HistoryOutlined /> To&apos;lovlar tarixi
        </span>
      ),
      children: (
        <Card>
          <Space style={{ marginBottom: 16 }} direction="vertical" size="middle" className="w-full">
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchCashHistory}
              >
                Yangilash
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setHistoryFilters(prev => ({ ...prev, showHistoryFilters: !prev.showHistoryFilters }))}
              >
                Filtrlar
              </Button>
              <Button
                type="default"
                onClick={() => {
                  console.log('Current history state:', cashHistory);
                  message.info(`Tarix ma&apos;lumotlari soni: ${historyFilters.filteredHistory.length} / ${cashHistory.length}`);
                }}
              >
                Ma&apos;lumotlarni tekshirish
              </Button>
            </Space>

            {historyFilters.showHistoryFilters && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Input
                      placeholder="Qidirish..."
                      prefix={<SearchOutlined />}
                      value={historyFilters.search}
                      onChange={e => handleHistorySearch(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Space>
                      <CalendarOutlined />
                      <RangePicker
                        onChange={handleHistoryDateRangeChange}
                        value={historyFilters.dateRange}
                        format="DD.MM.YYYY"
                        placeholder={['Boshlanish', 'Tugatish']}
                        allowClear
                      />
                    </Space>
                  </Col>
                </Row>

                <Row style={{ marginTop: 16 }}>
                  <Space>
                    <Button onClick={() => {
                      setHistoryFilters(prev => ({
                        ...prev,
                        dateRange: null,
                        search: '',
                        filteredHistory: cashHistory
                      }));
                    }}>
                      Tozalash
                    </Button>
                  </Space>
                </Row>
              </Card>
            )}
          </Space>

          {historyFilters.filteredHistory.length > 0 ? (
            <Table
              columns={historyColumns}
              dataSource={historyFilters.filteredHistory}
              loading={historyLoading}
              rowKey={record => record.id.toString()}
              pagination={{
                total: historyFilters.filteredHistory.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Jami: ${total}`
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              {historyLoading ? (
                <p>Ma&apos;lumotlar yuklanmoqda...</p>
              ) : (
                <p>Ma&apos;lumotlar topilmadi</p>
              )}
            </div>
          )}
        </Card>
      )
    }
  ];

  return (
    <div className="cash-transaction-container">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        size="large"
        className="cash-tabs"
        style={{ marginBottom: 16 }}
        items={tabItems}
      />

      <CashTransactionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTransaction(null);
        }}
        onSuccess={handleModalSuccess}
        editingTransaction={convertToCashCreate(editingTransaction)}
        raysClientsMap={raysClientsMap}
      />

      {/* Confirmation Modal */}
      <Modal
        title="To'lovni tasdiqlash"
        open={confirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
        okText="Tasdiqlash"
        cancelText="Bekor qilish"
        confirmLoading={loading}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24, marginRight: 16 }} />
          <p style={{ margin: 0, fontSize: 16 }}>
            Ushbu to`lovni tasdiqlamoqchimisiz?
          </p>
        </div>
        <p>
          Tasdiqlash bajarilganidan so`ng, bu amal qaytib olinmaydi.
        </p>
      </Modal>
    </div>
  );
};

export default CashTransactionList; 