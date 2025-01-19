import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import SMSList from "./pages/SmsList";
import BankManagement from "./pages/BankManagement";
import BalanceMovements from "./pages/BalanceMovements";
import ReceiptList from "./pages/ReceiptList";
import Invoices from "./pages/InvoiceList";
import PricingManagement from "./pages/Pricing";
import LiveChat from "./pages/LiveChat";

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("authToken"); // Check if token exists

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Content style={{ margin: "16px" }}>
            <Routes>
              {/* Public Route */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
                }
              />

              {/* Protected Route */}
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/user-management"
                element={
                  isAuthenticated ? (
                    <UserManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/sms"
                element={
                  isAuthenticated ? <SMSList /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/banks"
                element={
                  isAuthenticated ? (
                    <BankManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/balance-movements"
                element={
                  isAuthenticated ? (
                    <BalanceMovements />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/receipts"
                element={
                  isAuthenticated ? <ReceiptList /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/invoices"
                element={
                  isAuthenticated ? <Invoices /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/pricing"
                element={
                  isAuthenticated ? (
                    <PricingManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/test-live-chat"
                element={
                  isAuthenticated ? <LiveChat /> : <Navigate to="/login" />
                }
              />

              {/* Catch-All Route */}
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
