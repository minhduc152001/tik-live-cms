import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api/api"; // Your API utility
import dayjs from "dayjs";

interface Invoice {
  id: string;
  invoice_id: string;
  customer: string;
  vendor: string;
  amount_per_month: number;
  subscription_months: number;
  total_amount: number;
  VAT: string;
  created_at: string; // Keep as string, format in render
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice ID",
      dataIndex: "invoice_id",
      key: "invoice_id",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Amount per month",
      dataIndex: "amount_per_month",
      key: "amount_per_month",
      render: (amount) => amount.toLocaleString(), // Format with commas
    },
    {
      title: "Total Months",
      dataIndex: "subscription_months",
      key: "subscription_months",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => amount.toLocaleString(), // Format with commas
    },
    {
      title: "VAT",
      dataIndex: "VAT",
      key: "VAT",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (dateString) => dayjs(dateString).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/invoices");
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        message.error("Failed to fetch invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedInvoices = invoices.slice(startIndex, endIndex);

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedInvoices}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: invoices.length,
        }}
        style={{ marginTop: 20 }}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Invoices;
