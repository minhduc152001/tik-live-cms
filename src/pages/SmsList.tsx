import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import api from "../api/api";

interface SMS {
  id: string;
  sender: string;
  msg: string;
}

const SMSList: React.FC = () => {
  const [smsList, setSMSList] = useState<SMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnsType<SMS> = [
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Message",
      dataIndex: "msg",
      key: "msg",
    },
  ];

  useEffect(() => {
    const fetchSMS = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/sms");
        setSMSList(data);
      } catch (error) {
        console.error("Error fetching SMS:", error);
        message.error("Failed to fetch SMS messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchSMS();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedSMS = smsList.slice(startIndex, endIndex);

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={displayedSMS}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: smsList.length,
        }}
        style={{ marginTop: 20 }}
        rowKey="id"
      />
    </div>
  );
};

export default SMSList;
