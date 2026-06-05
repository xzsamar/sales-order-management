const Product = require("../models/Product");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  try {
    const search = req.query.q || "";

    const products = await Product.find({
      $or: [
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          productCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          genericName: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SIMILAR PRODUCTS
const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const similarProducts = await Product.find({
  genericName: product.genericName,
  productName: { $ne: product.productName },
});

    res.status(200).json(similarProducts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PRODUCT COMPARISON
const compareProducts = async (req, res) => {
  try {
    const { id1, id2 } = req.query;

    const product1 = await Product.findById(id1);
    const product2 = await Product.findById(id2);

    if (!product1 || !product2) {
      return res.status(404).json({
        message: "Products not found",
      });
    }

    res.status(200).json({
      product1: {
        brand: product1.brand,
        price: product1.unitPrice,
        stock: product1.availableQty,
        discount: product1.discountPercentage,
      },

      product2: {
        brand: product2.brand,
        price: product2.unitPrice,
        stock: product2.availableQty,
        discount: product2.discountPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PRODUCT VARIATIONS
const getVariations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const variations = await Product.find({
  productName: product.productName,
  _id: { $ne: product._id },
});

    res.status(200).json(variations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProductById,
  getSimilarProducts,
  compareProducts,
  getVariations,
};