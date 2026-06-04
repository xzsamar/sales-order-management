import { useEffect, useState } from "react";
import API from "../services/api";
import StatCard from "../components/StatCard";

import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [lowStockProducts, setLowStockProducts] =
    useState([]);

  const [recentOrders, setRecentOrders] =
    useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const customers = await API.get("/customers");
      const products = await API.get("/products");
      const orders = await API.get("/orders");

      const revenue = orders.data.reduce(
        (total, order) =>
          total + (order.grandTotal || 0),
        0
      );

      const lowStock = products.data.filter(
        (product) =>
          product.availableQty < 20
      );

      const latestOrders = orders.data
        .slice()
        .reverse()
        .slice(0, 5);

      setLowStockProducts(lowStock);
      setRecentOrders(latestOrders);

      setStats({
        customers: customers.data.length,
        products: products.data.length,
        orders: orders.data.length,
        revenue,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "700",
          }}
        >
          Oman Pharma Dashboard
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Monitor customers, products,
          orders and revenue in real-time.
        </p>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          title="Customers"
          value={stats.customers}
          icon={
            <FaUsers size={22} color="#2563eb" />
          }
        />

        <StatCard
          title="Products"
          value={stats.products}
          icon={
            <FaBox size={22} color="#16a34a" />
          }
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          icon={
            <FaShoppingCart
              size={22}
              color="#ea580c"
            />
          }
        />

        <StatCard
          title="Revenue"
          value={`OMR ${stats.revenue.toFixed(
            3
          )}`}
          icon={
            <FaMoneyBillWave
              size={22}
              color="#7c3aed"
            />
          }
        />
      </div>

      {/* DASHBOARD GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Recent Orders */}
        <div className="card">
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map(
                  (order) => (
                    <tr key={order._id}>
                      <td>
                        {
                          order.bookingNumber
                        }
                      </td>

                      <td>
                        {order.customer
                          ?.customerName ||
                          "Customer"}
                      </td>

                      <td>
                        OMR{" "}
                        {Number(
                          order.grandTotal
                        ).toFixed(3)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Low Stock */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <FaExclamationTriangle
              color="#dc2626"
            />

            <h2>
              Low Stock Alert
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <p>
              All products sufficiently
              stocked
            </p>
          ) : (
            lowStockProducts.map(
              (product) => (
                <div
                  key={product._id}
                  style={{
                    padding: "10px 0",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <strong>
                    {
                      product.productName
                    }
                  </strong>

                  <p
                    style={{
                      color:
                        "#dc2626",
                    }}
                  >
                    Stock:{" "}
                    {
                      product.availableQty
                    }
                  </p>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* Footer Summary */}
      <div
        className="card"
        style={{
          marginTop: "25px",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
          }}
        >
          Business Overview
        </h2>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
          }}
        >
          This pharmaceutical sales
          management system helps manage
          customers, products, inventory,
          sales orders, PDF generation and
          email notifications for Oman
          healthcare distributors.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;