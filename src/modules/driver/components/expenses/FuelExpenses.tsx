import { useState } from "react";
import { Card, Button, Table, Modal, Form, Input, DatePicker, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import { Option } from "antd/es/mentions";

interface DataType {
    id: number;
    date: string;
    expenseType: string;
    amount: number;
}

interface FormValues {
    date: Dayjs;
    expenseType: string;
    amount: number;
}

const initialData: DataType[] = [
    { id: 1, date: "2024-02-22", expenseType: "Benzin", amount: 50000 },
    { id: 2, date: "2024-02-21", expenseType: "Gaz", amount: 30000 },
];

export function FuelExpenses() {
    const [data, setData] = useState<DataType[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<FormValues>();

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleAddExpense = () => {
        form
            .validateFields()
            .then((values) => {
                const newExpense: DataType = {
                    id: data.length + 1,
                    date: values.date.format("YYYY-MM-DD"),
                    expenseType: values.expenseType,
                    amount: values.amount,
                };
                setData([...data, newExpense]);
                handleCloseModal();
            })
            .catch((info) => console.log("Xatolik:", info));
    };

    const columns: ColumnsType<DataType> = [
        { title: "Sana", dataIndex: "date", key: "date" },
        { title: "Chiqim turi", dataIndex: "expenseType", key: "expenseType" },
        { title: "Miqdor ($)", dataIndex: "amount", key: "amount" },
    ];

    return (
        <Card
            title="Yoqilg'i xarajatlari"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
                    Yangi qo`shish
                </Button>
            }
        >
            <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 5 }} />

            <Modal
                title="Yangi chiqim qo'shish"
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={handleAddExpense}
                okText="Qo'shish"
                cancelText="Bekor qilish"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="date"
                        label="Sana"
                        rules={[{ required: true, message: "Sanani kiriting!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="expenseType"
                        label="Chiqim turi"
                        rules={[{ required: true, message: "Chiqim turini kiriting!" }]}
                    >
                        <Select>
                            <Option key="benzin" value="Benzin">Benzin</Option>
                            <Option key="gaz" value="Benzin">Gaz</Option>
                            <Option key="dizel" value="Dizel">Gaz</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Miqdor ($)"
                        rules={[
                            { required: true, message: "Miqdor kiriting!" },
                            { type: "number", transform: (value) => Number(value), message: "Faqat raqam kiriting!" },
                        ]}
                    >
                        <Input type="number" placeholder="Masalan: 50000" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
