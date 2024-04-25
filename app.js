const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual MongoDB connection string
const mongoURI = "mongodb://localhost:27017/hirequotient";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// Error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(err.status || 500).json({
    Success: false,
    Data: null,
    Error: err.message || "Internal Server Error",
  });
};

// GET /api/v1/users/:id
app.get("/api/v1/users/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        Success: false,
        Data: null,
        Error: "User not found",
      });
    }

    res.json({
      Success: true,
      Data: user,
      Error: null,
    });
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
});

// Apply error handling middleware
app.use(handleErrors);

app.listen(port, () => console.log(`Server listening on port ${port}`));
