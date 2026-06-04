import { useEffect, useState } from "react";
import API from "../services/api";
import { createPortal } from "react-dom";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [similarProducts, setSimilarProducts] =
    useState([]);

  const [variations, setVariations] =
    useState([]);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showAlternatives, setShowAlternatives] =
    useState(false);

  const [showVariations, setShowVariations] =
    useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const viewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const viewAlternatives = async (id) => {
    try {
      const res = await API.get(
        `/products/${id}/similar`
      );

      setSimilarProducts(res.data);
      setShowAlternatives(true);
    } catch (error) {
      console.log(error);
    }
  };

  const viewVariations = async (id) => {
    try {
      const res = await API.get(
        `/products/${id}/variations`
      );

      setVariations(res.data);
      setShowVariations(true);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.productCode
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.brand
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.genericName
        ?.toLowerCase()
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
          marginBottom: "25px",
        }}
      >
        <div>
          <h1>Products</h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Product Management &
            Intelligence
          </p>
        </div>

        <input
          type="text"
          placeholder="Search product..."
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
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="card"
          >
            <h3>{product.productName}</h3>

            <p>
              <strong>Code:</strong>{" "}
              {product.productCode}
            </p>

            <p>
              <strong>Brand:</strong>{" "}
              {product.brand}
            </p>

            <p>
              <strong>Generic:</strong>{" "}
              {product.genericName}
            </p>

            <p>
              <strong>Price:</strong> OMR
              {product.unitPrice}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              {product.availableQty}
            </p>

            <p>
              <strong>Discount:</strong>{" "}
              {
                product.discountPercentage
              }
              %
            </p>

            <p>
              <strong>FOC:</strong>{" "}
              Buy {product.focBuyQty}
              Get {product.focFreeQty}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  viewDetails(product)
                }
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                Details
              </button>

              <button
                onClick={() =>
                  viewAlternatives(
                    product._id
                  )
                }
                style={{
                  background: "#16a34a",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                Alternatives
              </button>

              <button
                onClick={() =>
                  viewVariations(
                    product._id
                  )
                }
                style={{
                  background: "#7c3aed",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                Variations
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS */}

      {showDetails && selectedProduct && (
  <div
    className="modal"
    onClick={() => setShowDetails(false)}
  >
    <div
      className="card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Product Details</h2>

      <p>
        <strong>Product:</strong>{" "}
        {selectedProduct.productName}
      </p>

      <p>
        <strong>Brand:</strong>{" "}
        {selectedProduct.brand}
      </p>

      <p>
        <strong>Generic:</strong>{" "}
        {selectedProduct.genericName}
      </p>

      <p>
        <strong>Price:</strong> OMR
        {selectedProduct.unitPrice}
      </p>

      <p>
        <strong>Stock:</strong>{" "}
        {selectedProduct.availableQty}
      </p>

      <button
        onClick={() => setShowDetails(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

      {/* ALTERNATIVES */}

     {showAlternatives && (
  <div
    className="modal"
    onClick={() =>
      setShowAlternatives(false)
    }
  >
    <div
      className="card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Alternative Brands</h2>

      {similarProducts.length === 0 ? (
        <p>No alternatives found</p>
      ) : (
        similarProducts.map((product) => (
          <div key={product._id}>
            <p>
              <strong>Product:</strong>{" "}
              {product.productName}
            </p>

            <p>
              <strong>Brand:</strong>{" "}
              {product.brand}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              {product.availableQty}
            </p>

            <hr />
          </div>
        ))
      )}

      <button
        onClick={() =>
          setShowAlternatives(false)
        }
      >
        Close
      </button>
    </div>
  </div>
)}
{showVariations && (
  <div
    className="modal"
    onClick={() =>
      setShowVariations(false)
    }
  >
    <div
      className="card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Product Variations</h2>

      {variations.map((product) => (
        <div key={product._id}>
          <p>
            <strong>Product:</strong>{" "}
            {product.productName}
          </p>

          <p>
            <strong>Brand:</strong>{" "}
            {product.brand}
          </p>

          <hr />
        </div>
      ))}

      <button
        onClick={() =>
          setShowVariations(false)
        }
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Products;