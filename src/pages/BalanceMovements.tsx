import React, { useEffect, useState } from "react";
import { Popover, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "../api/api";
import dayjs from "dayjs";

interface BalanceMovement {
  id: string;
  account_number: string;
  amount: number;
  transaction_time: string;
  current_balance: number;
  payment_description: string;
}

const BalanceMovements: React.FC = () => {
  const [movements, setMovements] = useState<BalanceMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnsType<BalanceMovement> = [
    {
      title: "STK",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: "Thời gian CK",
      dataIndex: "transaction_time",
      key: "transaction_time",
      render: (dateString) => dayjs(dateString).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Số dư hiện tại",
      dataIndex: "current_balance",
      key: "current_balance",
      render: (balance) => balance.toLocaleString(),
    },
    {
      title: "Nội dung CK",
      dataIndex: "payment_description",
      key: "payment_description",
      render: (desc: string) => (
        <Popover content={desc}>
          <div
            style={{
              maxWidth: "420px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {desc}
          </div>
        </Popover>
      ),
    },
  ];

  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/balance-movements");
        setMovements(data);
      } catch (error) {
        console.error("Error fetching balance movements:", error);
        message.error("Failed to fetch balance movements.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedMovements = movements.slice(startIndex, endIndex);

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedMovements}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: movements.length,
        }}
        style={{ marginTop: 20 }}
        rowKey="id" // Important: Add a unique key
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default BalanceMovements;
