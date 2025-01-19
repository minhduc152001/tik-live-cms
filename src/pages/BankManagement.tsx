import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Table, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api/api";

interface Bank {
  id: string;
  bank_code: string;
  bank_name: string;
  bank_account_number: string;
}

const BankManagement: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [form] = Form.useForm();

  const columns: ColumnsType<Bank> = [
    {
      title: "Bank Code",
      dataIndex: "bank_code",
      key: "bank_code",
    },
    {
      title: "Bank Name",
      dataIndex: "bank_name",
      key: "bank_name",
    },
    {
      title: "Account Number",
      dataIndex: "bank_account_number",
      key: "bank_account_number",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this bank?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/banks"); // Your banks API endpoint
      setBanks(data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      message.error("Failed to fetch banks.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (bank?: Bank) => {
    setEditingBank(bank || null);
    setIsModalOpen(true);
    form.resetFields();
    if (bank) {
      form.setFieldsValue(bank);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingBank) {
        await api.put(`/banks/${editingBank.id}`, values); // Update existing
        setBanks((prevBanks) =>
          prevBanks.map((bank) =>
            bank.id === editingBank.id
              ? { id: editingBank.id, ...values }
              : bank
          )
        );
        message.success("Bank updated successfully!");
      } else {
        const { data } = await api.post("/banks", values); // Create new
        setBanks((prevBanks) => [...prevBanks, data]);
        message.success("Bank added successfully!");
      }

      setIsModalOpen(false);
      setEditingBank(null);
      form.resetFields();
      fetchBanks();
    } catch (error) {
      console.error("Error saving bank:", error);
      message.error("Failed to save bank.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBank(null);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/banks/${id}`);
      setBanks((prevBanks) => prevBanks.filter((bank) => bank.id !== id));
      message.success("Bank deleted successfully!");
    } catch (error) {
      console.error("Error deleting bank:", error);
      message.error("Failed to delete bank.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedBanks = banks.slice(startIndex, endIndex);

  return (
    <div>
      <Button type="primary" onClick={() => showModal()}>
        Add Bank
      </Button>

      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedBanks}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: banks.length,
        }}
        style={{ marginTop: 20 }}
        rowKey="id"
      />

      <Modal
        title={editingBank ? "Edit Bank" : "Add Bank"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="bank_code"
            label="Bank Code"
            rules={[{ required: true, message: "Please enter bank code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bank_name"
            label="Bank Name"
            rules={[{ required: true, message: "Please enter bank name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bank_account_number"
            label="Account Number"
            rules={[{ required: true, message: "Please enter account number" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BankManagement;
