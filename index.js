const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./API/routes/users");
const productRoutes = require("./API/routes/products");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Connect to MongoDB
const mongoURI = "Replace-with-your-MongoDB-connection-URI"; // example: mongodb://127.0.0.1:27017/eButik
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
