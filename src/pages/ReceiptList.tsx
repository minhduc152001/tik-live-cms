import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api/api";
import dayjs from "dayjs";

interface Receipt {
  id: string;
  bank_code: string;
  account_number: string;
  total_month_cost: number;
  total_months: number;
  total_tiktok_ids: number;
  bank_name: string;
  user_email: string;
  payment_description: string;
  total_amount: number;
  created_at: string;
}

const ReceiptList: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnsType<Receipt> = [
    {
      title: "Mã NH",
      dataIndex: "bank_code",
      key: "bank_code",
    },
    {
      title: "Tên NH",
      dataIndex: "bank_name",
      key: "bank_name",
    },
    {
      title: "STK",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Khách hàng",
      dataIndex: "user_email",
      key: "user_email",
    },
    {
      title: "Tổng giá tháng",
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
      title: "Số lượng ID",
      dataIndex: "total_tiktok_ids",
      key: "total_tiktok_ids",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: "Nội dung",
      dataIndex: "payment_description",
      key: "payment_description",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      render: (dateString) => dayjs(dateString).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/qr");
        setReceipts(data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        message.error("Failed to fetch receipts.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedReceipts = receipts.slice(startIndex, endIndex);

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedReceipts}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: receipts.length,
        }}
        style={{ marginTop: 20 }}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ReceiptList;
