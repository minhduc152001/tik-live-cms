import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Table,
  Select,
  DatePicker,
  Tag,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import api from "../api/api";
import Password from "antd/es/input/Password";

const { Option } = Select;

// User interface
interface User {
  id: string;
  email: string;
  phone: string;
  tiktok_ids: string[];
  role: "admin" | "user";
  subscription_expired_at: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of users per page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedUsers = users.slice(startIndex, endIndex);

  const [form] = Form.useForm();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle opening the modal
  const showModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        ...user,
        subscription_expired_at: dayjs(user.subscription_expired_at),
      });
    }
  };

  // Handle submitting the form
  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const updatedUser: User = {
        ...values,
        id: editingUser && editingUser.id,
        createdAt: editingUser
          ? editingUser.createdAt
          : new Date().toISOString(),
        subscription_expired_at: dayjs(values.subscription_expired_at).toDate(),
      };

      if (editingUser) {
        const { phone, subscription_expired_at, tiktok_ids } = updatedUser;
        await api.put(`/users/admin/update/${editingUser.id}`, {
          phone,
          subscription_expired_at,
          tiktok_ids,
        });

        setUsers((prev) =>
          prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
        message.success("User updated successfully!");
      } else {
        // Add user
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, ...newUser } = updatedUser;
        const { data } = await api.post("/users", newUser);
        setUsers((prev) => [...prev, data]);
        message.success("User added successfully!");
      }

      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle canceling the modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Handle deleting a user
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      message.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete user. Please try again.");
    }
  };

  // Columns for the table
  const columns: ColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "TikTok IDs",
      dataIndex: "tiktok_ids",
      key: "tiktok_ids",
      render: (tiktok_ids) => tiktok_ids.join(", "),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "black"}>{role}</Tag>
      ),
    },
    {
      title: "Expires At",
      dataIndex: "subscription_expired_at",
      key: "subscription_expired_at",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          {record.role !== "admin" && (
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => showModal()}>
        Add User
      </Button>

      <Table
        loading={loading}
        columns={columns}
        style={{ marginTop: 20 }}
        dataSource={displayedUsers} // Use displayedUsers instead of users
        pagination={{
          current: currentPage,
          pageSize,
          onChange: handlePageChange,
          total: users.length, // Set the total number of users
        }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter an email" }]}
          >
            <Input type="email" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter a phone number" }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Password />
            </Form.Item>
          )}

          <Form.Item name="tiktok_ids" label="TikTok IDs">
            <Select mode="tags" placeholder="Enter TikTok IDs" />
          </Form.Item>

          <Form.Item
            name="subscription_expired_at"
            label="Subscription Expired At"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          {editingUser && (
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select disabled={!!editingUser}>
                <Option value="admin">ADMIN</Option>
                <Option value="user">USER</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
