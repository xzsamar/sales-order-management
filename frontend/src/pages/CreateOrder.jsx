import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const CreateOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState("");
  const [salesPerson, setSalesPerson] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState([]);

  const [alternatives, setAlternatives] =
  useState([]);

  const [showAlternatives, setShowAlternatives] =
  useState(false);

  const [showSuccess, setShowSuccess] =
  useState(false);

  const [orderNumber, setOrderNumber] =
  useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const customerRes = await API.get("/customers");
      const productRes = await API.get("/products");

      setCustomers(customerRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addProduct = () => {
    if (!selectedProduct || !quantity) {
      alert("Select product and quantity");
      return;
    }

    const product = products.find(
      (p) => p._id === selectedProduct
    );

    if (!product) return;

    const qty = Number(quantity);

    if (qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const existingItemIndex = items.findIndex(
      (item) => item.product === selectedProduct
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...items];

      updatedItems[existingItemIndex].quantity += qty;

      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].quantity *
        updatedItems[existingItemIndex].unitPrice;

      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          product: product._id,
          productName: product.productName,
          quantity: qty,
          unitPrice: product.unitPrice,
          total: qty * product.unitPrice,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity("");
  };

  const removeProduct = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const subtotal = items.reduce(
  (sum, item) =>
    sum + item.quantity * item.unitPrice,
  0
);

const totalDiscount = items.reduce(
  (sum, item) => {
    const product = products.find(
      (p) => p._id === item.product
    );

    if (!product) return sum;

    return (
      sum +
      (item.quantity *
        product.unitPrice *
        (product.discountPercentage || 0)) /
        100
    );
  },
  0
);

const totalFOC = items.reduce(
  (sum, item) => {
    const product = products.find(
      (p) => p._id === item.product
    );

    if (
      !product ||
      product.focBuyQty === 0
    )
      return sum;

    return (
      sum +
      Math.floor(
        item.quantity /
          product.focBuyQty
      ) *
        product.focFreeQty
    );
  },
  0
);

const grandTotal =
  subtotal - totalDiscount;

  const submitOrder = async () => {
     alert("BUTTON CLICKED");
    try {
      if (!customer) {
        alert("Please select a customer");
        return;
      }

      if (!salesPerson) {
        alert("Please enter a sales person");
        return;
      }

      if (items.length === 0) {
        alert("Please add products");
        return;
      }

      // Stock validation
     

      const payload = {
        customer,
        salesPerson,
        deliveryDate: new Date(),
        remarks: "Created from frontend",
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

    const res = await API.post(
  "/orders",
  payload
);

setOrderNumber(
  res.data.bookingNumber || "N/A"
);

setShowSuccess(true);

toast.success(
  `Order ${res.data.bookingNumber} created successfully!`
);

setCustomer("");
setSalesPerson("");
setSelectedProduct("");
setQuantity("");
setItems([]);

loadData();
    } catch (error) {
  if (
    error.response?.data?.alternatives
  ) {
    setAlternatives(
      error.response.data.alternatives
    );

    setShowAlternatives(true);
  } else {
    console.log("FULL ERROR:", error);
    console.log(
      "RESPONSE:",
      error.response
    );
    console.log(
      "DATA:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Order creation failed"
    );
  }
}
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>
        Create Sales Order
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Left Section */}
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>
            Order Details
          </h2>

          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            <select
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
            >
              <option value="">
                Select Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer._id}
                  value={customer._id}
                >
                  {customer.customerName}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Sales Person"
              value={salesPerson}
              onChange={(e) =>
                setSalesPerson(e.target.value)
              }
            />
          </div>

          <hr style={{ margin: "25px 0" }} />

          <h3>Add Product</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr auto",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <select
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.productName} (Stock:
                  {product.availableQty})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
            />

            <button
              onClick={addProduct}
              style={{
                background: "#2563eb",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
              }}
            >
              Add
            </button>
          </div>

          <div style={{ marginTop: "25px" }}>
            {items.length === 0 ? (
              <p>No products added yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>FOC</th>
                            <th>Total</th>
                            <th></th>
                                            </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>OMR {item.unitPrice}</td>

<td>
  {products.find(
    (p) => p._id === item.product
  )?.discountPercentage || 0}
  %
</td>

<td>
  {(() => {
    const product =
      products.find(
        (p) =>
          p._id === item.product
      );

    if (
      !product ||
      product.focBuyQty === 0
    )
      return 0;

    return (
      Math.floor(
        item.quantity /
          product.focBuyQty
      ) *
      product.focFreeQty
    );
  })()}
</td>

<td>
  OMR {item.total}
</td>

                      <td>
                        <button
                          onClick={() =>
                            removeProduct(
                              index
                            )
                          }
                          style={{
                            background:
                              "#dc2626",
                            color: "white",
                            padding:
                              "6px 12px",
                            borderRadius:
                              "8px",
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="card">
          <h2>Order Summary</h2>

          <div style={{ marginTop: "20px" }}>
            <p>
  Products:
  <strong>
    {" "}
    {items.length}
  </strong>
</p>

<hr style={{ margin: "15px 0" }} />

<p>
  Subtotal:
  <strong>
    OMR {subtotal.toFixed(2)}
  </strong>
</p>

<p>
  Discount:
  <strong>
    OMR {totalDiscount.toFixed(2)}
  </strong>
</p>

<p>
  FOC Quantity:
  <strong>
    {" "}
    {totalFOC}
  </strong>
</p>

<hr style={{ margin: "15px 0" }} />

<p>Grand Total:</p>

<h1
  style={{
    color: "#16a34a",
    marginTop: "10px",
  }}
>
  OMR {grandTotal.toFixed(2)}
</h1>
          </div>

          <button
            onClick={submitOrder}
            style={{
              width: "100%",
              marginTop: "25px",
              background: "#16a34a",
              color: "white",
              padding: "14px",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          >
            Create Order
          </button>
        </div>
      </div>
      {
  showAlternatives && (
    <div
      className="modal"
      onClick={() =>
        setShowAlternatives(false)
      }
    >
      <div
        className="card"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <h2>
          Alternative Products
        </h2>

        <p
          style={{
            marginBottom: "20px",
            color: "#dc2626",
          }}
        >
          Selected product is out of
          stock.
        </p>

        {alternatives.map(
          (product) => (
            <div
              key={product._id}
              style={{
                padding: "10px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <h4>
                {
                  product.productName
                }
              </h4>

              <p>
                Brand:
                {" "}
                {product.brand}
              </p>

              <p>
                Stock:
                {" "}
                {
                  product.availableQty
                }
              </p>

              <p>
                Price:
                OMR
                {
                  product.unitPrice
                }
              </p>

              <button
                onClick={() => {
                  setSelectedProduct(
                    product._id
                  );

                  setShowAlternatives(
                    false
                  );
                }}
                style={{
                  background:
                    "#16a34a",
                  color: "white",
                  padding:
                    "8px 12px",
                  borderRadius:
                    "8px",
                  marginTop:
                    "10px",
                }}
              >
                Select This Product
              </button>
            </div>
          )
        )}

        <button
          onClick={() =>
            setShowAlternatives(false)
          }
          style={{
            marginTop: "20px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}   {showSuccess && (
  <div
    className="modal"
    onClick={() =>
      setShowSuccess(false)
    }
  >
    <div
      className="success-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <div className="success-icon">
        ✅
      </div>

      <h2 className="success-title">
        Order Created Successfully
      </h2>

      <p>
        Booking Number
      </p>

      <div className="success-order">
        {orderNumber}
      </div>

      <button
        className="success-btn"
        onClick={() =>
          setShowSuccess(false)
        }
      >
        Continue
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default CreateOrder;