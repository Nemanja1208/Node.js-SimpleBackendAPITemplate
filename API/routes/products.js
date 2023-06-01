const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../../database/models/product");
const { verifyToken } = require("../../helpers/authentication/verifyToken");
require("dotenv").config();

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    verifyToken();

    const allProductsFromDatabase = await Product.find();

    res.json(allProductsFromDatabase);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve products",
    });
  }
});

// GET a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    verifyToken();

    const productWithGivenId = await Product.findById(req.params.id);

    if (!productWithGivenId) {
      return res
        .status(404)
        .json({ message: "Product with that ID does not exist" });
    }

    res.json(productWithGivenId);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve the product with given Id" });
  }
});

// PATCH a specific product by ID
router.patch("/:id", async (req, res) => {
  try {
    verifyToken();

    const productWithGivenId = await Product.findById(req.params.id);

    if (!productWithGivenId) {
      return res
        .status(404)
        .json({ message: "Product with that ID does not exist" });
    }

    productWithGivenId.title = req.body.title;
    productWithGivenId.description = req.body.description;
    productWithGivenId.price = req.body.price;
    productWithGivenId.stock = req.body.stock;
    // Update more fields as necessary

    // Save the updated product
    const updatedProduct = await productWithGivenId.save();

    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update the product with given Id" });
  }
});

// DELETE a specific product by ID
router.delete("/:id", async (req, res) => {
  try {
    verifyToken();

    const productWithGivenId = await Product.findById(req.params.id);

    if (!productWithGivenId) {
      return res
        .status(404)
        .json({ message: "Product with that ID does not exist" });
    }

    // Delete the product
    await productWithGivenId.deleteOne();

    res.json({ message: "Product with given Id deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete the product with given Id" });
  }
});

// POST a new product
router.post("/createProduct", async (req, res) => {
  try {
    verifyToken();

    const productCreatedAt = new Date(Date.now());

    const { title, description, price, stock, image, category } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      image,
      category,
      date: productCreatedAt,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create given product",
    });
  }
});

module.exports = router;
