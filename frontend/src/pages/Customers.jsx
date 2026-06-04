import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import API from "../services/api";


const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [purchaseHistory, setPurchaseHistory] =
    useState([]);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showHistory, setShowHistory] =
    useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");

      setCustomers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const viewCustomerDetails = (
    customer
  ) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const viewPurchaseHistory = async (
    customerId
  ) => {
    try {
      const res = await API.get(
        `/customers/${customerId}/history`
      );

      setPurchaseHistory(res.data);
      setShowHistory(true);
    } catch (error) {
      console.log(error);
      alert(
        "Purchase history not available"
      );
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.customerCode
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>Customers</h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Manage customer records
          </p>
        </div>

        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "300px",
          }}
        />
      </div>

      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
        }}
      >
        <table>
          <thead>
            <tr>
              <th style={th}>Code</th>
              <th style={th}>
                Customer Name
              </th>
              <th style={th}>
                Contact Person
              </th>
              <th style={th}>
                Credit Limit
              </th>
              <th style={th}>
                Outstanding
              </th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length ===
            0 ? (
              <tr>
                <td colSpan="7">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map(
                (customer) => (
                  <tr
                    key={customer._id}
                  >
                    <td style={td}>
                      {
                        customer.customerCode
                      }
                    </td>

                    <td style={td}>
                      {
                        customer.customerName
                      }
                    </td>

                    <td style={td}>
                      {
                        customer.contactPerson
                      }
                    </td>

                    <td style={td}>
                      OMR{" "}
                      {
                        customer.creditLimit
                      }
                    </td>

                    <td style={td}>
                      OMR{" "}
                      {
                        customer.outstandingAmount
                      }
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          background:
                            customer.status ===
                            "Active"
                              ? "#dcfce7"
                              : "#fee2e2",

                          color:
                            customer.status ===
                            "Active"
                              ? "#15803d"
                              : "#dc2626",

                          padding:
                            "6px 12px",

                          borderRadius:
                            "20px",
                        }}
                      >
                        {
                          customer.status
                        }
                      </span>
                    </td>

                    <td style={td}>
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() =>
                            viewCustomerDetails(
                              customer
                            )
                          }
                          style={{
                            background:
                              "#2563eb",
                            color:
                              "white",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "8px",
                          }}
                        >
                          Details
                        </button>

                        <button
                          onClick={() =>
                            viewPurchaseHistory(
                              customer._id
                            )
                          }
                          style={{
                            background:
                              "#16a34a",
                            color:
                              "white",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "8px",
                          }}
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}

      {showDetails && selectedCustomer && (
  <div
    className="modal"
    onClick={() => setShowDetails(false)}
  >
    <div
      className="card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Customer Details
      </h2>

      <p>
        <strong>Customer Code:</strong>{" "}
        {selectedCustomer.customerCode}
      </p>

      <p>
        <strong>Customer Name:</strong>{" "}
        {selectedCustomer.customerName}
      </p>

      <p>
        <strong>Contact Person:</strong>{" "}
        {selectedCustomer.contactPerson}
      </p>

      <p>
        <strong>Mobile:</strong>{" "}
        {selectedCustomer.mobileNumber}
      </p>

      <p>
        <strong>Credit Limit:</strong> OMR
        {selectedCustomer.creditLimit}
      </p>

      <p>
        <strong>Outstanding:</strong> OMR
        {selectedCustomer.outstandingAmount}
      </p>

      <button
        onClick={() => setShowDetails(false)}
        style={{
          marginTop: "20px",
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
      {/* HISTORY MODAL */}

      {showHistory && (
  <div
    className="modal"
    onClick={() => setShowHistory(false)}
  >
    <div
      className="card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Purchase History
      </h2>

      {purchaseHistory.length === 0 ? (
        <p>No purchase history found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Booking No</th>
              <th>Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {purchaseHistory.map((order) => (
              <tr key={order._id}>
                <td>{order.bookingNumber}</td>
                <td>OMR {order.grandTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => setShowHistory(false)}
        style={{
          marginTop: "20px",
          background: "#16a34a",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
    
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

export default Customers;