import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Typography,
  Image,
  Modal,
} from "antd";
import api from "../api/api";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// Define the QR response type based on your backend
interface QRResponse {
  bank_name: string;
  payment_description: string;
  url: string;
}

const TestQR: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Use Antd Form instance for better control
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  // Initial form data aligned with QRRequest
  const initialValues = {
    bank_code: "",
    account_number: "",
    total_tiktok_ids: 0,
    total_month_cost: 0,
    total_months: 0,
  };

  const handleCreateQR = async (values: typeof initialValues) => {
    try {
      const response = await api.post<QRResponse>("/qr", values);
      setQrData(response.data);
      message.success("Tạo mã QR thành công!");
    } catch (error) {
      console.error("Error creating QR:", error);
      message.error("Có lỗi xảy ra.");
    }
  };

  useEffect(() => {
    const handleCheckTransaction = async () => {
      if (!qrData?.payment_description || transactionSuccess) return;

      try {
        const response = await api.get<{ transferred: boolean }>(
          `/webhook/?payment_description=${qrData.payment_description}`
        );
        if (response.data.transferred) {
          setTransactionSuccess(true);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error checking transaction:", error);
        message.error("Giao dịch chưa thành công.");
      }
    };

    if (qrData) {
      const interval = setInterval(handleCheckTransaction, 2000);
      return () => clearInterval(interval);
    }
  }, [qrData, transactionSuccess]);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Tạo QR chuyển khoản</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleCreateQR}
      >
        <Form.Item
          label="Mã ngân hàng (chỉ chấp nhận ACB và VCB)"
          name="bank_code"
          rules={[{ required: true, message: "Thiếu Mã ngân hàng" }]}
        >
          <Input placeholder="VD: VCB" />
        </Form.Item>
        <Form.Item
          label="Số tài khoản (VD: 2390200022)"
          name="account_number"
          rules={[{ required: true, message: "Thiếu STK" }]}
        >
          <Input placeholder="Nhập STK" />
        </Form.Item>
        <Form.Item
          label="Tổng số TikTok IDs muốn thêm"
          name="total_tiktok_ids"
          rules={[{ required: true, message: "Thiếu số TikTok IDs" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Tổng chi phí tháng (VNĐ) (điền 0 nếu ko có)"
          name="total_month_cost"
          rules={[{ required: true, message: "Tổng chi phí tháng (VNĐ)" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Số lượng tháng (điền 0 nếu ko có)"
          name="total_months"
          rules={[{ required: true, message: "Tổng số lượng tháng" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo mã QR
          </Button>
        </Form.Item>
      </Form>

      <div style={{ fontStyle: "italic", fontWeight: "bold" }}>
        API nhận webhook tại: https://webhook.84pos.vn/api/v1/webhook/
      </div>

      {qrData && (
        <div style={{ marginTop: "20px" }}>
          <Title level={4}>{qrData.bank_name}</Title>
          <Paragraph>
            Nội dung chuyển khoản: <b>{qrData.payment_description}</b>
          </Paragraph>
          <Image src={qrData.url} alt="QR Code" style={{ maxWidth: "200px" }} />
          {transactionSuccess ? (
            <Title level={3} style={{ color: "green" }}>
              Chuyển khoản thành công!
            </Title>
          ) : (
            <p style={{ fontWeight: "bold" }}>
              Sẽ tự động thông báo khi giao dịch thành công! Đang kiểm tra...
            </p>
          )}
        </div>
      )}

      {transactionSuccess && (
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={false}
        >
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <CheckCircleOutlined style={{ fontSize: "36px", color: "green" }} />
            <Title level={3} style={{ color: "green" }}>
              Chuyển khoản thành công!
            </Title>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TestQR;
