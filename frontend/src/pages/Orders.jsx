import { useEffect, useState } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] =
  useState([]);

const [search, setSearch] =
  useState("");

const [selectedCustomer, setSelectedCustomer] =
  useState("");

  useEffect(() => {
  fetchOrders();
  fetchCustomers();
}, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {
  try {
    const res = await API.get(
      "/customers"
    );

    setCustomers(res.data);
  } catch (error) {
    console.log(error);
  }
};

  const downloadPDF = (id) => {
  window.open(
    `${import.meta.env.VITE_API_URL}/orders/pdf/${id}`,
    "_blank"
  );
};

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/orders/${id}`);

      alert("Order deleted successfully");

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const filteredOrders = orders.filter(
  (order) => {
    const matchSearch =
      order.bookingNumber
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchCustomer =
      !selectedCustomer ||
      order.customer?._id ===
        selectedCustomer;

    return (
      matchSearch && matchCustomer
    );
  }
);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>
        Orders
      </h1>

      <div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search Order Number"
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    style={{
      width: "250px",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    }}
  />

  <select
    value={selectedCustomer}
    onChange={(e) =>
      setSelectedCustomer(
        e.target.value
      )
    }
    style={{
      width: "250px",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">
      All Customers
    </option>

    {customers.map(
      (customer) => (
        <option
          key={customer._id}
          value={customer._id}
        >
          {
            customer.customerName
          }
        </option>
      )
    )}
  </select>

  <button
    onClick={() => {
      setSearch("");
      setSelectedCustomer("");
    }}
  >
    Clear Filters
  </button>
</div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th style={th}>Booking No</th>
              <th style={th}>Customer</th>
              <th style={th}>Sales Person</th>
              <th style={th}>Delivery Date</th>
              <th style={th}>Grand Total</th>
              <th style={th}>PDF</th>
              <th style={th}>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td style={td}>
                  {order.bookingNumber}
                </td>

                <td style={td}>
                  {order.customer?.customerName}
                </td>

                <td style={td}>
                  {order.salesPerson}
                </td>

                <td style={td}>
                  {new Date(
                    order.deliveryDate
                  ).toLocaleDateString()}
                </td>

                <td style={td}>
                  OMR {order.grandTotal}
                </td>

                <td style={td}>
                  <button
                    onClick={() =>
                      downloadPDF(order._id)
                    }
                  >
                    PDF
                  </button>
                </td>

                <td style={td}>
                  <button
                    onClick={() =>
                      deleteOrder(order._id)
                    }
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const th = {
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderTop:
    "1px solid rgba(0,0,0,0.05)",
};

export default Orders;