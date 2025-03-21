import { Card, Layout, Space } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import dayjs from "dayjs";

type User = {
  id: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  subscription_expired_at: Date;
  tiktok_ids: string[];
  created_at: Date;
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/users/me");
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Main Layout */}
      <Layout>
        <Header
          style={{ padding: "0 16px", background: "#fff", textAlign: "center" }}
        >
          <Title level={3} style={{ margin: 16 }}>
            Welcome to Your Dashboard
          </Title>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {!userData ? (
              <Card loading />
            ) : (
              <Card>
                <Title level={4} style={{ margin: 16 }}>
                  Admin Information
                </Title>
                <Space direction="vertical">
                  <div>
                    <b>Email:</b> {userData?.email || "N/A"}
                  </div>
                  <div>
                    <b>Phone:</b> {userData?.phone || "N/A"}
                  </div>
                  <div>
                    <b>Role:</b> {userData?.role || "N/A"}
                  </div>
                  <div>
                    <b>Subscription Expired At:</b>{" "}
                    {userData?.subscription_expired_at
                      ? dayjs(userData?.subscription_expired_at).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      : "N/A"}
                  </div>
                  <div>
                    <b>Account Created At:</b>{" "}
                    {userData?.created_at
                      ? dayjs(userData?.created_at).format("DD/MM/YYYY HH:mm")
                      : "N/A"}
                  </div>
                </Space>
              </Card>
            )}
          </Space>
        </Content>
        <Footer style={{ textAlign: "center" }}>OpenTik ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
