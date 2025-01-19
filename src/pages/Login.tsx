import { Button, Form, Input, message } from 'antd';
import React from 'react';
import api from '../api/api';

const Login: React.FC = () => {
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await api.post('/users/login', values);
      const { token } = response.data;

      // Save the token in local storage
      localStorage.setItem('authToken', token);
      message.success('Login successful!');
      window.location.href = '/dashboard'; // Redirect after login
    } catch {
      message.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
      <h2>Login</h2>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
