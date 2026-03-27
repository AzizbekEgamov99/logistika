'use client';
import React, { useState } from 'react';
import {
    Table,
    Card,
    Typography,
    Button,
    Input,
    Select,
    DatePicker,
    Tag,
    Tooltip,
    Row,
    Col,
    Modal,
    Form,
    InputNumber,
    Radio,
    Space,
    Divider,
    Menu,
    Dropdown,
    Spin,
    message
} from 'antd';
import {
    SearchOutlined,
    DownloadOutlined,
    PlusOutlined,
    CarOutlined,
    FileTextOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useCash, useCashHistory, useCashCategories } from '../../../hooks/useCash';
import { useCurrencies } from '../../../hooks/useCurrencies';
import { useClients } from '../../../hooks/useClients';
import { useDrivers } from '../../../hooks/useDrivers';
import { useRays } from '../../../hooks/useRays';
import dayjs from 'dayjs';
import { Cash, CashHistory, CashCreate } from '../../../types/cash.types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const CashTransactions: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
    const [currentTransaction, setCurrentTransaction] = useState<CashHistory | Cash | null>(null);
    const [form] = Form.useForm();

    // Use real data from API hooks
    const { cashEntries, isLoading: isCashLoading, createCash, deleteCash, confirmCash, markAsDelivered } = useCash();
    const { cashHistory, isLoading: isHistoryLoading } = useCashHistory();
    const { cashCategories, isLoading: isCategoriesLoading } = useCashCategories();
    const { currencies, loading: isCurrenciesLoading } = useCurrencies();
    const { data: clientsData, isLoading: isClientsLoading } = useClients();
    const { drivers, loading: isDriversLoading } = useDrivers();
    const { data: raysData, isLoading: isRaysLoading } = useRays();

    const isLoading = isCashLoading || isHistoryLoading || isCategoriesLoading || isCurrenciesLoading ||
        isClientsLoading || isDriversLoading || isRaysLoading;

    // Combine cash entries and history for display
    const allTransactions = [...(cashEntries || []), ...(cashHistory || [])];

    // Add filter form that uses the form instance
    const handleFilterSubmit = (values: any) => {
        setSearchText(values.searchText || '');
        setSelectedType(values.type || 'all');
        setSelectedCategory(values.category || 'all');
        if (values.dateRange) {
            setDateRange([values.dateRange[0], values.dateRange[1]]);
        } else {
            setDateRange(null);
        }
    };

    // Render a filter form at the top of the component
    const renderFilterForm = () => (
        <Card className="filter-card" style={{ marginBottom: 16 }}>
            <Form
                form={form}
                layout="horizontal"
                onFinish={handleFilterSubmit}
                initialValues={{
                    searchText: searchText,
                    type: selectedType,
                    category: selectedCategory
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="searchText">
                            <Input
                                placeholder="Qidirish..."
                                prefix={<SearchOutlined />}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="type">
                            <Select defaultValue="all">
                                <Option value="all">Barcha operatsiyalar</Option>
                                <Option value="income">Faqat kirimlar</Option>
                                <Option value="expense">Faqat chiqimlar</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="category">
                            <Select defaultValue="all">
                                <Option value="all">Barcha toifalar</Option>
                                {cashCategories?.map(category => (
                                    <Option key={category.id} value={category.id.toString()}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Qo'llash
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );

    const handleAddTransaction = () => {
        form.resetFields();
        form.setFieldsValue({
            type: 'income',
            date: dayjs(),
            amount: 0,
            category: cashCategories?.length > 0 ? cashCategories[0].id : undefined,
            paymentMethod: 1, // Default to cash payment
            currency: 'USD',
            is_debt: false,
            is_via_driver: false,
            is_delivered_to_cashier: true
        });
        setIsModalVisible(true);
    };

    const handleViewDetails = (record: Cash | CashHistory) => {
        setCurrentTransaction(record);
        setIsDetailModalVisible(true);
    };

    const handleModalSubmit = () => {
        form.validateFields().then(values => {
            const cashData: CashCreate = {
                client: values.client,
                rays: values.rays,
                product: values.product || 0,
                driver: values.driver || 0,
                amount: values.amount,
                currency: currencies?.find(c => c.currency === values.currency)?.id || 0,
                payment_way: values.paymentMethod,
                comment: values.description,
                is_debt: values.is_debt || false,
                is_via_driver: values.is_via_driver || false,
                is_delivered_to_cashier: values.is_delivered_to_cashier || true,
                total_expected_amount: values.total_expected_amount || values.amount,
                paid_amount: values.paid_amount || values.amount,
                date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                move_type: values.type === 'income' ? 'income' : 'expense'
            };

            createCash(cashData);
            setIsModalVisible(false);
            message.success('Kassa yozuvi qo\'shildi');
        }).catch(err => {
            console.error('Form validation error:', err);
            message.error('Ma\'lumotlar to\'liq emas. Iltimos, barcha maydonlarni to\'ldiring.');
        });
    };

    const handleDeleteTransaction = (id: number) => {
        Modal.confirm({
            title: 'Haqiqatan ham bu yozuvni o\'chirmoqchimisiz?',
            content: 'Bu amal qaytarib bo\'lmaydi.',
            okText: 'Ha, o\'chirish',
            okType: 'danger',
            cancelText: 'Bekor qilish',
            onOk() {
                deleteCash(id);
                message.success('Yozuv muvaffaqiyatli o\'chirildi');
            }
        });
    };

    const handleConfirmTransaction = (id: number) => {
        confirmCash(id);
        message.success('Yozuv muvaffaqiyatli tasdiqlandi');
    };

    const handleDeliverTransaction = (id: number) => {
        markAsDelivered(id);
        message.success('Yozuv kassirga topshirilgan deb belgilandi');
    };

    const filteredTransactions = allTransactions.filter(transaction => {
        // Filter by search text
        const matchesSearch =
            (transaction.comment?.toLowerCase().includes(searchText.toLowerCase()) ||
                transaction.client_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                transaction.driver_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                false);

        // Filter by date range
        const transactionDate = dayjs(transaction.created_at);
        const matchesDateRange = !dateRange || (
            transactionDate.isAfter(dateRange[0], 'day') &&
            transactionDate.isBefore(dateRange[1], 'day')
        );

        // Filter by transaction type
        const matchesType = selectedType === 'all' ||
            (selectedType === 'income' && transaction.status === 'confirmed') ||
            (selectedType === 'expense' && transaction.status === 'completed');

        // Filter by category
        const matchesCategory = selectedCategory === 'all' || transaction.payment_way === parseInt(selectedCategory);

        return matchesSearch && matchesDateRange && matchesType && matchesCategory;
    });

    const formatCurrency = (amount: number, currency: string): string => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: currency || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'pending':
                return <Tag color="processing">Kutilmoqda</Tag>;
            case 'confirmed':
                return <Tag color="success">Tasdiqlangan</Tag>;
            case 'cancelled':
                return <Tag color="error">Bekor qilingan</Tag>;
            case 'completed':
                return <Tag color="default">Yakunlangan</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const actionsMenu = (record: Cash | CashHistory) => (
        <Menu>
            <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
                Batafsil ko`rish
            </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />} disabled={'id' in record && !record.id}>
                Tahrirlash
            </Menu.Item>
            <Menu.Item key="confirm" icon={<FileTextOutlined />} onClick={() => handleConfirmTransaction(record.id)}>
                Tasdiqlash
            </Menu.Item>
            <Menu.Item key="deliver" icon={<CarOutlined />} onClick={() => handleDeliverTransaction(record.id)}>
                Kassirga topshirildi
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteTransaction(record.id)}>
                O`chirish
            </Menu.Item>
        </Menu>
    );

    const columns: ColumnsType<Cash | CashHistory> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Sana',
            dataIndex: 'created_at',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: 'Izoh',
            dataIndex: 'comment',
            key: 'description',
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text || 'No comment'}>
                    <span>{text || 'No comment'}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Summa',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record) => (
                <Text
                    type={record.status === 'confirmed' ? 'success' : 'danger'}
                    strong
                >
                    {formatCurrency(amount, record.currency)} {record.currency}
                </Text>
            ),
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Holat',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
            filters: [
                { text: 'Kutilmoqda', value: 'pending' },
                { text: 'Tasdiqlangan', value: 'confirmed' },
                { text: 'Yakunlangan', value: 'completed' },
                { text: 'Bekor qilingan', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Mijoz',
            key: 'client',
            render: (_, record) => {
                if ('client_name' in record) {
                    return record.client_name || 'N/A';
                } else {
                    // For CashHistory type
                    return 'N/A';
                }
            },
        },
        {
            title: 'Haydovchi',
            key: 'driver',
            render: (_, record) => {
                if ('driver_name' in record) {
                    return record.driver_name || 'N/A';
                } else {
                    // For CashHistory type
                    return 'N/A';
                }
            },
        },
        {
            title: 'To\'lov turi',
            key: 'paymentMethod',
            render: (_, record) => {
                if ('payment_way_name' in record) {
                    return record.payment_way_name || 'Noma\'lum';
                } else {
                    return 'Noma\'lum';
                }
            },
        },
        {
            title: 'Amallar',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Dropdown overlay={actionsMenu(record)} trigger={['click']}>
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <Spin spinning={isLoading}>
            <div className="transaction-list-header">
                <Title level={4}>Kassa operatsiyalari</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTransaction}
                >
                    Yangi operatsiya
                </Button>
            </div>

            {renderFilterForm()}

            <Card className="transaction-card">
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Jami: ${total} yozuv`
                    }}
                    scroll={{ x: 1200 }}
                    summary={pageData => {
                        const totalIncome = pageData
                            .filter(item => item.status === 'confirmed')
                            .reduce((sum, item) => sum + item.amount, 0);

                        const totalExpense = pageData
                            .filter(item => item.status === 'completed')
                            .reduce((sum, item) => sum + item.amount, 0);

                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3}>
                                    <Text strong>Jami:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} colSpan={6}>
                                    <Space size="large">
                                        <Text type="success" strong>
                                            Kirim: {formatCurrency(totalIncome, 'USD')} USD
                                        </Text>
                                        <Text type="danger" strong>
                                            Chiqim: {formatCurrency(totalExpense, 'USD')} USD
                                        </Text>
                                        <Text strong>
                                            Balans: {formatCurrency(totalIncome - totalExpense, 'USD')} USD
                                        </Text>
                                    </Space>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </Card>

            {/* Add New Transaction Modal */}
            <Modal
                title="Yangi operatsiya"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleModalSubmit}
                width={800}
                okText="Saqlash"
                cancelText="Bekor qilish"
                forceRender={true}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Operatsiya turi"
                                rules={[{ required: true, message: 'Operatsiya turini tanlang' }]}
                            >
                                <Radio.Group>
                                    <Radio.Button value="income">Kirim</Radio.Button>
                                    <Radio.Button value="expense">Chiqim</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Sana"
                                rules={[{ required: true, message: 'Sanani tanlang' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="client"
                                label="Mijoz"
                                rules={[{ required: true, message: 'Mijozni tanlang' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Mijozni tanlang"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {clientsData?.data?.map(client => (
                                        <Option key={client.id} value={client.id}>{client.first_name} {client.last_name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="rays"
                                label="Reys"
                            >
                                <Select
                                    showSearch
                                    placeholder="Reysni tanlang"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {raysData?.map(ray => (
                                        <Option key={ray.id} value={ray.id}>Reys #{ray.id}: {ray.from1} - {ray.to_go}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="driver"
                                label="Haydovchi"
                            >
                                <Select
                                    showSearch
                                    placeholder="Haydovchini tanlang"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {drivers?.map(driver => (
                                        <Option key={driver.id} value={driver.id}>{driver.first_name} {driver.last_name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="paymentMethod"
                                label="To'lov turi"
                                rules={[{ required: true, message: 'To\'lov turini tanlang' }]}
                            >
                                <Select placeholder="To'lov turini tanlang">
                                    {cashCategories?.map(category => (
                                        <Option key={category.id} value={category.id}>{category.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="amount"
                                label="Miqdor"
                                rules={[{ required: true, message: 'Miqdorni kiriting' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="Miqdor" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="currency"
                                label="Valyuta"
                                rules={[{ required: true, message: 'Valyutani tanlang' }]}
                            >
                                <Select placeholder="Valyutani tanlang">
                                    {currencies?.map(curr => (
                                        <Option key={curr.currency} value={curr.currency}>{curr.currency}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="total_expected_amount"
                                label="To'liq summa"
                            >
                                <InputNumber style={{ width: '100%' }} min={0} placeholder="To'liq summa" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Izoh"
                    >
                        <Input.TextArea rows={4} placeholder="Operatsiya haqida izoh..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="is_debt"
                                valuePropName="checked"
                            >
                                <Radio.Group>
                                    <Radio value={true}>Qarz</Radio>
                                    <Radio value={false}>Toliq to`lov</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="is_via_driver"
                                valuePropName="checked"
                            >
                                <Radio.Group>
                                    <Radio value={true}>Haydovchi orqali</Radio>
                                    <Radio value={false}>To`g`ridan-to`g`ri</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="is_delivered_to_cashier"
                                valuePropName="checked"
                            >
                                <Radio.Group>
                                    <Radio value={true}>Kassirga topshirildi</Radio>
                                    <Radio value={false}>Topshirilmadi</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Transaction Details Modal */}
            <Modal
                title="Operatsiya tafsilotlari"
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
                        Yopish
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            setIsDetailModalVisible(false);
                            // Implement edit logic here
                        }}
                    >
                        Tahrirlash
                    </Button>,
                ]}
                width={700}
            >
                {currentTransaction && (
                    <div className="transaction-details">
                        <Row gutter={[16, 24]}>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">ID:</div>
                                    <div className="detail-value">{currentTransaction.id}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Sana:</div>
                                    <div className="detail-value">{dayjs(currentTransaction.created_at).format('DD.MM.YYYY HH:mm')}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Summa:</div>
                                    <div className="detail-value">{formatCurrency(currentTransaction.amount, currentTransaction.currency)} {currentTransaction.currency}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Holat:</div>
                                    <div className="detail-value">{getStatusTag(currentTransaction.status)}</div>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="detail-item">
                                    <div className="detail-label">Izoh:</div>
                                    <div className="detail-value">{currentTransaction.comment || 'Izoh yo\'q'}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Mijoz:</div>
                                    <div className="detail-value">{currentTransaction.client_name || 'Noma\'lum'}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Haydovchi:</div>
                                    <div className="detail-value">{currentTransaction.driver_name || 'Noma\'lum'}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">To`lov turi:</div>
                                    <div className="detail-value">{currentTransaction.payment_way_name || 'Noma\'lum'}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Qarz holati:</div>
                                    <div className="detail-value">
                                        {currentTransaction.is_debt ?
                                            <Tag color="orange">Qarz</Tag> :
                                            <Tag color="green">To`langan</Tag>
                                        }
                                    </div>
                                </div>
                            </Col>

                            <Col span={24}>
                                <Divider />
                                <Title level={5}>Qo`shimcha ma`lumotlar</Title>
                            </Col>

                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Jami kutilgan summa:</div>
                                    <div className="detail-value">{formatCurrency(currentTransaction.total_expected_amount, currentTransaction.currency)} {currentTransaction.currency}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">To`langan summa:</div>
                                    <div className="detail-value">{formatCurrency(currentTransaction.paid_amount, currentTransaction.currency)} {currentTransaction.currency}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Qolgan qarz:</div>
                                    <div className="detail-value">{formatCurrency(currentTransaction.remaining_debt, currentTransaction.currency)} {currentTransaction.currency}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Kassir tomonidan tasdiqlangan:</div>
                                    <div className="detail-value">
                                        {currentTransaction.is_confirmed_by_cashier ?
                                            <Tag color="green">Ha</Tag> :
                                            <Tag color="red">Yo`q</Tag>
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Haydovchi orqali:</div>
                                    <div className="detail-value">
                                        {currentTransaction.is_via_driver ?
                                            <Tag color="blue">Ha</Tag> :
                                            <Tag color="default">Yo`q</Tag>
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detail-item">
                                    <div className="detail-label">Kassirga topshirilgan:</div>
                                    <div className="detail-value">
                                        {currentTransaction.is_delivered_to_cashier ?
                                            <Tag color="green">Ha</Tag> :
                                            <Tag color="red">Yo`q</Tag>
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </Spin>
    );
};

export default CashTransactions; 