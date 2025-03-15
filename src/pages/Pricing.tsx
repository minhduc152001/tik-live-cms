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
  total_month_cost: number;
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

  const [price, setPrice] = useState<number>();
  const [newPrice, setNewPrice] = useState<number | null>();
  const [errorPrice, setErrorPrice] = useState("");

  // Fetch the current price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await api.get("/pricing-tiktok");
        setPrice(response.data.price_tiktok_id);
      } catch (err) {
        setErrorPrice("Lỗi khi lấy giá mỗi TikTok ID");
        console.error(err);
      }
    };
    fetchPrice();
  }, []);

  // Handle price update
  const handleUpdatePrice = async () => {
    if (!newPrice) return;
    try {
      await api.put("/pricing-tiktok", {
        new_price: newPrice,
      });
      setPrice(newPrice);
      setNewPrice(null);
      message.success("Cập nhật giá thành công!");
      setErrorPrice("");
    } catch (err) {
      setErrorPrice("Lỗi cập nhật, hãy chắc chắn nhập giá hợp lệ.");
      console.error(err);
    }
  };

  const columns: ColumnsType<Pricing> = [
    {
      title: "Tổng tiền",
      dataIndex: "total_month_cost",
      key: "total_month_cost",
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: "Số tháng",
      dataIndex: "total_months",
      key: "total_months",
    },
    {
      title: "Khác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xoá
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
      message.error("Lỗi lấy dữ liệu.");
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
        message.success("Cập nhật thành công!");
      } else {
        const { data } = await api.post("/pricing", values);
        setPricingList((prevPricing) => [...prevPricing, data]);
        message.success("Thêm mới thành công!");
      }

      setIsModalOpen(false);
      setEditingPricing(null);
      form.resetFields();
      fetchPricing();
    } catch (error) {
      console.error("Error saving pricing:", error);
      message.error("Lỗi xảy ra khi thêm gói mới.");
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
      message.success("Xoá thành công!");
    } catch (error) {
      console.error("Error deleting pricing:", error);
      message.error("Lỗi xảy ra khi xoá gói mới.");
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
      <div className="p-4 max-w-md mx-auto">
        {errorPrice && <p className="text-red-500 mb-2">{errorPrice}</p>}
        {price !== null ? (
          <p className="mb-4">
            Giá TikTok ID hiện tại: {price?.toLocaleString()}đ
          </p>
        ) : (
          <p>Đang tải...</p>
        )}
        <form
          style={{
            display: "flex",
            padding: "0 20px 40px 40px",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <InputNumber
            value={newPrice}
            onChange={setNewPrice}
            placeholder="Nhập giá mỗi TikTok ID mới"
            step="1"
            style={{
              width: "240px",
              borderRadius: "4px",
              borderWidth: "1px",
            }}
            required
          />
          <Button
            onClick={handleUpdatePrice}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Cập nhật
          </Button>
        </form>
      </div>

      <Button type="primary" onClick={() => showModal()}>
        Thêm gói mua
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
        title={editingPricing ? "Sửa gói mua" : "Thêm gói mua"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="total_month_cost"
            label="Tổng tiền"
            rules={[{ required: true, message: "Hãy nhập tổng tiền" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="total_months"
            label="Số tháng"
            rules={[{ required: true, message: "Hãy nhập số tháng sử dụng" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PricingManagement;
