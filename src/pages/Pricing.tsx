import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber, // Use InputNumber for numeric inputs
  Button,
  Modal,
  Table,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api/api";

interface Pricing {
  id: string;
  amount_per_month: number;
  total_tiktok_ids: number;
  total_months: number;
}

const PricingManagement: React.FC = () => {
  const [pricingList, setPricingList] = useState<Pricing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [form] = Form.useForm();

  const columns: ColumnsType<Pricing> = [
    {
      title: "Amount/Month",
      dataIndex: "amount_per_month",
      key: "amount_per_month",
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: "Total TikTok IDs",
      dataIndex: "total_tiktok_ids",
      key: "total_tiktok_ids",
    },
    {
      title: "Total Months",
      dataIndex: "total_months",
      key: "total_months",
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
            title="Are you sure to delete this pricing?"
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
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/pricing");
      setPricingList(data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      message.error("Failed to fetch pricing.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (pricing?: Pricing) => {
    setEditingPricing(pricing || null);
    setIsModalOpen(true);
    form.resetFields();
    if (pricing) {
      form.setFieldsValue(pricing);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingPricing) {
        await api.put(`/pricing/${editingPricing.id}`, values);
        setPricingList((prevPricing) =>
          prevPricing.map((pricing) =>
            pricing.id === editingPricing.id
              ? { id: editingPricing.id, ...values }
              : pricing
          )
        );
        message.success("Pricing updated successfully!");
      } else {
        const { data } = await api.post("/pricing", values);
        setPricingList((prevPricing) => [...prevPricing, data]);
        message.success("Pricing added successfully!");
      }

      setIsModalOpen(false);
      setEditingPricing(null);
      form.resetFields();
      fetchPricing();
    } catch (error) {
      console.error("Error saving pricing:", error);
      message.error("Failed to save pricing.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingPricing(null);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/pricing/${id}`);
      setPricingList((prevPricing) =>
        prevPricing.filter((pricing) => pricing.id !== id)
      );
      message.success("Pricing deleted successfully!");
    } catch (error) {
      console.error("Error deleting pricing:", error);
      message.error("Failed to delete pricing.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedPricing = pricingList.slice(startIndex, endIndex);

  return (
    <div>
      <Button type="primary" onClick={() => showModal()}>
        Add Pricing
      </Button>

      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedPricing}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: pricingList.length,
        }}
        style={{ marginTop: 20 }}
        rowKey="id"
      />

      <Modal
        title={editingPricing ? "Edit Pricing" : "Add Pricing"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount_per_month"
            label="Amount per Month"
            rules={[
              { required: true, message: "Please enter amount per month" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="total_tiktok_ids"
            label="Total TikTok IDs"
            rules={[
              { required: true, message: "Please enter total TikTok IDs" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="total_months"
            label="Total Months"
            rules={[{ required: true, message: "Please enter total months" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PricingManagement;
