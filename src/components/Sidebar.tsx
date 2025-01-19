import {
  BankOutlined,
  CommentOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type TPath = {
  key: string;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
};

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const defaultPaths: TPath[] = [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: <DashboardOutlined />,
      onClick: () => {
        setSelectedKey("dashboard");
        navigate("/dashboard");
      },
    },
    {
      key: "user-management",
      title: "Users",
      icon: <UserOutlined />,
      onClick: () => {
        setSelectedKey("user-management");
        navigate("/user-management");
      },
    },
    {
      key: "sms",
      title: "SMS",
      icon: <MessageOutlined />,
      onClick: () => {
        setSelectedKey("sms");
        navigate("/sms");
      },
    },
    {
      key: "banks",
      title: "Banks",
      icon: <BankOutlined />,
      onClick: () => {
        setSelectedKey("banks");
        navigate("/banks");
      },
    },
    {
      key: "balance-movements",
      title: "Balances",
      icon: <TransactionOutlined />,
      onClick: () => {
        setSelectedKey("balance-movements");
        navigate("/balance-movements");
      },
    },
    {
      key: "receipts",
      title: "Receipts",
      icon: <ContainerOutlined />,
      onClick: () => {
        setSelectedKey("receipts");
        navigate("/receipts");
      },
    },
    {
      key: "invoices",
      title: "Invoices",
      icon: <MoneyCollectOutlined />,
      onClick: () => {
        setSelectedKey("invoices");
        navigate("/invoices");
      },
    },
    {
      key: "pricing",
      title: "Pricing",
      icon: <CreditCardOutlined />,
      onClick: () => {
        setSelectedKey("pricing");
        navigate("/pricing");
      },
    },
    {
      key: "test-live-chat",
      title: "Test Live",
      icon: <CommentOutlined />,
      onClick: () => {
        setSelectedKey("test-live-chat");
        navigate("/test-live-chat");
      },
    },
    {
      key: "logout",
      title: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      },
    },
  ];
  const pathname =
    window.location.pathname.replace("/", "") || defaultPaths[0].key;
  const [selectedKey, setSelectedKey] = useState(pathname);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{ background: "white" }}
    >
      <div
        style={{
          height: 64,
          textAlign: "center",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <Avatar size={collapsed ? 32 : 64} icon={<UserOutlined />} />
      </div>
      <Menu theme="light" defaultSelectedKeys={[selectedKey]} mode="inline">
        {defaultPaths.map((el) => (
          <Menu.Item key={el.key} icon={el.icon} onClick={el.onClick}>
            {el.title}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
