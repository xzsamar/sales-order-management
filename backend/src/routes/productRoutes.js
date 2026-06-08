const express = require("express");

const router = express.Router();


const {
  getProducts,
  searchProducts,
  getProductById,
  getSimilarProducts,
  compareProducts,
  getVariations,
} = require("../controllers/productController");

// Product Management
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/products", getProducts);
router.post("/products", createProducts);

// Product Intelligence
router.get("/compare", compareProducts);

// Product Details
router.get("/:id", getProductById);

// Similar Products / Alternative Brands
router.get("/:id/similar", getSimilarProducts);

// Product Variations
router.get("/:id/variations", getVariations);

module.exports = router;